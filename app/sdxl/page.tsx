"use client";
import { useState } from "react";

export default function SDXLPage(): JSX.Element {
  const [prompt, setPrompt] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const generateImage = async (): Promise<void> => {
    setLoading(true);
    setImageUrl(null);
    setError("");

    try {
      const response = await fetch("/api/sdxl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      console.log("API Response:", data); // Debugging

      if (data.imageUrl) {
        // Check if response is Base64 and prepend correct prefix
        if (data.imageUrl.startsWith("/9j/") || data.imageUrl.length > 100) {
          setImageUrl(`data:image/png;base64,${data.imageUrl}`);
        } else {
          setImageUrl(data.imageUrl); // Use URL if available
        }
      } else {
        setError("Failed to generate image.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Something went wrong. Check the console.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
      <h1 className="text-3xl font-bold mb-6">SDXL Image Generator</h1>

      <textarea
        className="border rounded p-2 w-96 h-24 text-black"
        placeholder="Enter your prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={generateImage}
        disabled={loading || !prompt}
      >
        {loading ? "Generating..." : "Generate Image"}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {imageUrl && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Generated Image:</h2>
          <img src={imageUrl} alt="Generated AI Art" className="mt-2 w-full max-w-md rounded-lg shadow-md border border-gray-700" />
        </div>
      )}
    </div>
  );
}
