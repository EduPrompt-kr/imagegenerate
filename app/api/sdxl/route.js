import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  try {
    const { prompt } = await req.json(); // Get the prompt from the request
    const RUNPOD_API_URL = "https://api.runpod.ai/v2/rsrwom3qhfrr50/runsync";
    const API_KEY = "yourapi_key"; // Replace with your actual RunPod API Key

    const response = await axios.post(
      RUNPOD_API_URL,
      {
        input: {
          workflow: {
            "3": {
              inputs: {
                seed: 1000000009,
                steps: 50,
                cfg: 8,
                sampler_name: "euler",
                scheduler: "normal",
                denoise: 1,
                model: ["4", 0],
                positive: ["6", 0],
                negative: ["7", 0],
                latent_image: ["5", 0],
              },
              class_type: "KSampler",
            },
            "4": { inputs: { ckpt_name: "sd_xl_base_1.0.safetensors" }, class_type: "CheckpointLoaderSimple" },
            "5": { inputs: { width: 512, height: 512, batch_size: 1 }, class_type: "EmptyLatentImage" },
            "6": { inputs: { text: prompt, clip: ["4", 1] }, class_type: "CLIPTextEncode" },
            "7": { inputs: { text: "text, watermark", clip: ["4", 1] }, class_type: "CLIPTextEncode" },
            "8": { inputs: { samples: ["3", 0], vae: ["4", 2] }, class_type: "VAEDecode" },
            "9": { inputs: { filename_prefix: "ComfyUI", images: ["8", 0] }, class_type: "SaveImage" },
          },
        },
      },
      { headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" } }
    );

    return NextResponse.json({ imageUrl: response.data.output.message });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to generate image", error: error.response?.data || error.message },
      { status: 500 }
    );
  }
}
