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

    // 2. Fetch images as Blobs
    const humanImgResponse = await fetch(customerImageUrl);
    if (!humanImgResponse.ok) throw new Error("Failed to download human image");
    const humanBlob = await humanImgResponse.blob();

    const garmImgResponse = await fetch(fabricImageUrl);
    if (!garmImgResponse.ok) throw new Error("Failed to download garment image");
    const garmBlob = await garmImgResponse.blob();
    const garmArrayBuffer = await garmBlob.arrayBuffer();
    const fabricBase64 = Buffer.from(garmArrayBuffer).toString("base64");

    // 3. STEP 1: Fabric -> Garment using Hugging Face (CosXL Edit via Gradio)
    // Connecting to Hugging Face CosXL for Step 1
    const { Client } = await import("@gradio/client");
    const hfToken = process.env.HUGGINGFACE_API_TOKEN;

    const cosxlClient = await Client.connect("multimodalart/cosxl", {
      token: hfToken as any
    });

    const formattedGarmentType = garmentType.replace(/-/g, ' ');
    // Strongly enforce color and pattern retention in CosXL so it doesn't default to skyblue
    const prompt = `Transform this fabric into a flat-lay ${formattedGarmentType}. CRITICAL: You must preserve the EXACT same color, pattern, and texture as the original fabric image. Do not change the original color.`;
    const negativePrompt = "different color, skyblue, blue, gray, person, wearing, background, 3d, illustration, low quality, distorted, bad proportions, watermark";

    const fabricBlob = new Blob([Buffer.from(fabricBase64, "base64")], { type: "image/png" });

    // Generating garment image
    const step1Result = await cosxlClient.predict("/run_edit", [
      fabricBlob, // Image to edit
      prompt, // Prompt
      negativePrompt, // Negative Prompt
      7, // Guidance Scale
      20, // Steps
    ]);

    const step1Data = step1Result.data as any[];
    const generatedGarmentUrl = step1Data && step1Data[0] ? step1Data[0].url : null;

    if (!generatedGarmentUrl) {
      throw new Error("No output URL returned from CosXL Edit");
    }

    const step1ImgResponse = await fetch(generatedGarmentUrl);
    if (!step1ImgResponse.ok) throw new Error("Failed to download generated garment from CosXL");
    const generatedGarmentArrayBuffer = await step1ImgResponse.arrayBuffer();
    const generatedGarmentBlob = new Blob([generatedGarmentArrayBuffer], { type: "image/png" });

    // 4. STEP 2: Hugging Face IDM-VTON
    const idmClient = await Client.connect("yisol/IDM-VTON", {
      token: process.env.HUGGINGFACE_API_TOKEN as any
    });

    const result = await idmClient.predict("/tryon", [
      { background: humanBlob, layers: [], composite: null }, // Human image for auto-masking
      generatedGarmentBlob, // Use the generated garment instead of the raw fabric!
      `A highly detailed ${formattedGarmentType}, preserving the exact color, texture, and pattern of the fabric. Photorealistic.`, 
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
      await supabase.from("trials").update({ status: "failed" }).eq("id", trialId);
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
