"use client";
import { useState, useEffect } from "react";

export default function FluxPage(): JSX.Element {
  const [prompt, setPrompt] = useState<string>("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [imageCount, setImageCount] = useState<number>(1);
  const [imageSize, setImageSize] = useState<string>("1024x1024");
  const [style, setStyle] = useState<string>("");

  useEffect(() => {
    const savedPrompt = localStorage.getItem("fluxPrompt");
    if (savedPrompt) setPrompt(savedPrompt);
  }, []);

  const styles = {
    "Cartoon & Cute": ", in a colorful cartoon style, bright colors, soft outlines, child-friendly, playful atmosphere",
    "Soft Plush Toy": ", designed as a soft plush toy, fluffy textures, pastel colors, cute round shapes, adorable and huggable",
    "Vibrant Fantasy": ", magical and dreamy, glowing sparkles, bright fantasy world, enchanted vibes, warm colors, whimsical details",
    "Chibi Art": ", in a chibi art style, big heads and small bodies, super cute expressions, bright and vibrant colors",
    "Candy & Sweet": ", surrounded by candy and sweets, colorful and shiny, happy and playful, soft pastel tones, fun and delicious",
    "Space Adventure": ", in a fun space adventure, cute astronaut suit, glowing stars, colorful planets, friendly aliens, joyful expressions",
    "Playful Animal": ", in a fun animated style, bright and expressive eyes, cheerful emotions, soft rounded shapes, cute and lovable",
    "Fairy Tale Storybook": ", illustrated in a fairy tale storybook style, soft watercolor textures, warm and cozy, dreamlike atmosphere",
    "Superhero Comic": ", in a fun superhero comic style, dynamic action poses, bold colors, exaggerated expressions, fun and energetic",
    "Funny & Silly": ", in a wacky and humorous style, exaggerated expressions, silly movements, unexpected and funny details, lighthearted fun",
  };
  
  const generateImages = async (): Promise<void> => {
    setLoading(true);
    setImageUrls([]);
    setError("");
  
    localStorage.setItem("fluxPrompt", prompt);
  
    try {
      // Ensure that the selected style is properly appended
      const finalPrompt = prompt + (style && styles[style] ? styles[style] : "");
  
      console.log("Final Prompt Sent to API:", finalPrompt); // Debugging
  
      const response = await fetch("/api/flux", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: finalPrompt, imageCount, imageSize }),
      });
  
      const data = await response.json();
      console.log("API Response:", data);
  
      if (data.imageUrls) {
        setImageUrls(
          data.imageUrls.map((url: string) =>
            url.startsWith("/9j/") || url.length > 100 ? `data:image/png;base64,${url}` : url
          )
        );
      } else {
        setError("Failed to generate images.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Something went wrong. Check the console.");
    }
    setLoading(false);
  };
  

  return (
    <div className="min-h-screen flex flex-col items-start justify-center bg-gray-900 text-white px-8">
      <h1 className="text-3xl font-bold mb-6">Flux Image Generator</h1>

      <div className="flex w-full gap-8">
        <div className="flex flex-col w-1/3">
          <textarea
            className="border rounded p-3 w-full h-32 text-black"
            placeholder="Enter your prompt..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <div className="mt-4 flex flex-col space-y-4">

            <select className="p-2 text-black" value={imageSize} onChange={(e) => setImageSize(e.target.value)}>
              {["512x512", "1024x1024", "1792x1024", "1024x1792"].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>

            <select className="p-2 text-black" value={style} onChange={(e) => setStyle(e.target.value)}>
              <option value="">No Style (Default)</option>
              {Object.keys(styles).map((styleKey) => (
                <option key={styleKey} value={styleKey}>
                  {styleKey}
                </option>
              ))}
            </select>
          </div>

          <button
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
            onClick={generateImages}
            disabled={loading || !prompt}
          >
            {loading ? "Generating..." : "Generate Images"}
          </button>

          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>

        <div className="flex-1 flex justify-center items-center">
          {imageUrls.length > 0 && (
            <div className={`grid gap-4 ${imageUrls.length === 1 ? "grid-cols-1" : imageUrls.length === 2 ? "grid-cols-2" : "grid-cols-2 md:grid-cols-2 lg:grid-cols-2"}`}>
              {imageUrls.map((url, index) => (
                <img key={index} src={url} alt={`Generated ${index}`} className="rounded-lg shadow-lg w-full" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
