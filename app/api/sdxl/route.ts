import { NextResponse } from "next/server";
import axios from "axios";
import { InputComfy } from "@/app/configs/inputComfy"; // Adjust path if needed

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ message: "Prompt is required" }, { status: 400 });
    }

    const RUNPOD_API_URL = "https://api.runpod.ai/v2/yy1rao0wwxtzxx/runsync";
    const API_KEY = "your_apikey";  // Replace with your actual RunPod API Key

    // Get the graph structure
    const comfy = new InputComfy();
    const workflow = JSON.parse(comfy.prompt_text);

    workflow["6"].inputs.text = prompt;

    console.log(" Sending Workflow to RunPod:\n", JSON.stringify(workflow, null, 2));

    // ✅ Correct structure for RunPod Serverless: { input: { prompt: {...} } }
    const response = await axios.post(
      RUNPOD_API_URL,
      {
        input: {
          prompt: workflow
        }
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log(" RunPod Response:", response.data);

    const output = response.data?.output;
    const imageUrl =
      output?.message || output?.image_url || output?.images?.[0] || null;

    if (!imageUrl) {
      throw new Error("Image URL not found in RunPod response.");
    }

    return NextResponse.json({ imageUrl });

  } catch (error: any) {
    console.error(" RunPod Error:", JSON.stringify(error?.response?.data || error, null, 2));
    return NextResponse.json(
      {
        message: "Failed to generate image",
        error: error.response?.data || error.message
      },
      { status: 500 }
    );
  }
}
