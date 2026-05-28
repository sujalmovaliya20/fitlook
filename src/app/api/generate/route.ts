import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const maxDuration = 120; // 2 minutes max duration for Vercel

export async function POST(req: Request) {
  const supabase = await createClient();
  let trialId = null;
  
  try {
    const body = await req.json();
    trialId = body.trialId;
    const { fabricImageUrl, customerImageUrl, garmentType } = body;

    if (!trialId || !fabricImageUrl || !customerImageUrl || !garmentType) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // 1. Update status to 'processing'
    await supabase
      .from("trials")
      .update({ status: "processing" })
      .eq("id", trialId);

    // 2. Fetch images as Blobs for Gradio
    const humanImgResponse = await fetch(customerImageUrl);
    if (!humanImgResponse.ok) throw new Error("Failed to download human image");
    const humanBlob = await humanImgResponse.blob();

    const garmImgResponse = await fetch(fabricImageUrl);
    if (!garmImgResponse.ok) throw new Error("Failed to download garment image");
    const garmBlob = await garmImgResponse.blob();

    // 3. Connect to Hugging Face Free Space
    const { Client } = await import("@gradio/client");
    const client = await Client.connect("yisol/IDM-VTON", {
      token: process.env.HUGGINGFACE_API_TOKEN as any // Using the HF token they pasted here
    });

    // 4. Call the free Gradio API
    const result = await client.predict("/tryon", [
      { background: humanBlob, layers: [], composite: null }, // Human image for auto-masking
      garmBlob, // Garment image
      `${garmentType} made from this fabric`, // Garment description
      true, // is_checked (use auto masking)
      true, // is_checked_crop (auto crop)
      30, // denoise_steps
      42, // seed
    ]);

    const resultData = result.data as any[];
    const resultUrl = resultData && resultData[0] ? resultData[0].url : null;
    
    if (!resultUrl) {
      throw new Error("No output URL returned from Hugging Face API");
    }

    // 5. Download result image from Gradio
    const imgResponse = await fetch(resultUrl);
    if (!imgResponse.ok) throw new Error("Failed to download generated image");
    const arrayBuffer = await imgResponse.arrayBuffer();

    // 6. Upload to Supabase Storage
    const fileName = `${trialId}_${Date.now()}.webp`;
    const { error: uploadError } = await supabase.storage
      .from("result-images")
      .upload(fileName, arrayBuffer, { contentType: "image/webp" });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage.from("result-images").getPublicUrl(fileName);
    const finalResultUrl = publicUrlData.publicUrl;

    // 7. Update trial in DB
    await supabase
      .from("trials")
      .update({ 
        status: "generated", 
        result_image_url: finalResultUrl 
      })
      .eq("id", trialId);

    return NextResponse.json({ success: true, resultUrl: finalResultUrl, trialId });

  } catch (error: any) {
    console.error("Generate error:", error);
    if (trialId) {
      // Safely mark the trial as failed so the frontend stops polling!
      await supabase.from("trials").update({ status: "failed" }).eq("id", trialId);
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
