import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  try {
    const { prompt, imageSize } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
    }

    const [width, height] = imageSize.split("x").map(Number); // Convert size to numbers

    const RUNPOD_API_URL = "https://api.runpod.ai/v2/sla9dllpuzslfi/runsync";
    const API_KEY = "yourapi_key";  // Replace with your actual RunPod API Key

    const response = await axios.post(
      RUNPOD_API_URL,
      {
        input: {
          workflow: {
            "5": { // Generate empty latent image
              inputs: {
                width: width,
                height: height,
                batch_size: 1
              },
              class_type: "EmptyLatentImage"
            },
            "6": { // Encode the text prompt
              inputs: {
                text: prompt,
                clip: ["11", 0]
              },
              class_type: "CLIPTextEncode"
            },
            "8": { // Decode the generated image
              inputs: {
                samples: ["13", 0],
                vae: ["10", 0]
              },
              class_type: "VAEDecode"
            },
            "9": { // Save the generated image
              inputs: {
                filename_prefix: "ComfyUI",
                images: ["8", 0]
              },
              class_type: "SaveImage"
            },
            "10": { // Load VAE model
              inputs: {
                vae_name: "ae.safetensors"
              },
              class_type: "VAELoader"
            },
            "11": { // Load dual CLIP models
              inputs: {
                clip_name1: "t5xxl_fp8_e4m3fn.safetensors",
                clip_name2: "clip_l.safetensors",
                type: "flux"
              },
              class_type: "DualCLIPLoader"
            },
            "12": { // Load diffusion model
              inputs: {
                unet_name: "flux1-dev.safetensors",
                weight_dtype: "fp8_e4m3fn"
              },
              class_type: "UNETLoader"
            },
            "13": { // Sampling process
              inputs: {
                noise: ["25", 0],
                guider: ["22", 0],
                sampler: ["16", 0],
                sigmas: ["17", 0],
                latent_image: ["5", 0]
              },
              class_type: "SamplerCustomAdvanced"
            },
            "16": { // Select sampler
              inputs: {
                sampler_name: "euler"
              },
              class_type: "KSamplerSelect"
            },
            "17": { // Scheduler setup
              inputs: {
                scheduler: "sgm_uniform",
                steps: 20,
                denoise: 1,
                model: ["12", 0]
              },
              class_type: "BasicScheduler"
            },
            "22": { // Guidance for model
              inputs: {
                model: ["12", 0],
                conditioning: ["6", 0]
              },
              class_type: "BasicGuider"
            },
            "25": { // Generate random noise
              inputs: {
                noise_seed: Math.floor(Math.random() * 10000000000) // Random seed
              },
              class_type: "RandomNoise"
            }
          }
        }
      },
      { headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" } }
    );


    const outputImages = response.data.output.message;
    const imageUrls = Array.isArray(outputImages) ? outputImages : [outputImages];

return NextResponse.json({ imageUrls });


    return NextResponse.json({ imageUrls });
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    return NextResponse.json(
      { message: "Failed to generate image", error: error.response?.data || error.message },
      { status: 500 }
    );
  }
}