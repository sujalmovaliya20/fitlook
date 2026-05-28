import { NextResponse } from "next/server";
import Replicate from "replicate";
import { createClient } from "@/utils/supabase/server";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const GARMENT_CATEGORY_MAP: Record<string, string> = {
  "Full Sleeve Shirt": "upper_body",
  "Half Sleeve Shirt": "upper_body",
  "Kurta": "upper_body",
  "Pant (Formal)": "lower_body",
  "Pant (Casual)": "lower_body",
  "Salwar Suit": "dresses",
  "Saree Blouse": "upper_body",
};

async function urlToBase64(url: string) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const mimeType = response.headers.get("content-type") || "image/jpeg";
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { fabricUrl, customerUrl, garmentType } = body;

    if (!fabricUrl || !customerUrl || !garmentType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const category = GARMENT_CATEGORY_MAP[garmentType] || "upper_body";

    // 1. Download and convert to Base64
    const base64Fabric = await urlToBase64(fabricUrl);
    const base64Customer = await urlToBase64(customerUrl);

    // 2. Call Replicate
    const output = await replicate.run(
      "viktorfa/ootdiffusion:latest", 
      {
        input: {
          person_image: base64Customer, 
          cloth_image: base64Fabric, 
          garment_type: category,
        }
      }
    ) as unknown;

    // Usually output is an array of strings (URLs)
    const resultUrl = Array.isArray(output) ? output[0] : output;

    // 3. Save to Supabase `trials` table
    const { data: trialData, error: dbError } = await supabase
      .from("trials")
      .insert({
        shop_id: user.id,
        fabric_url: fabricUrl,
        customer_url: customerUrl,
        garment_type: garmentType,
        result_url: resultUrl,
        status: "Generated",
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error saving trial:", dbError);
      // We still return success but maybe log the error.
    }

    return NextResponse.json({
      success: true,
      message: "AI Trial Generated successfully",
      data: {
        resultUrl,
        trialId: trialData?.id,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("API error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
