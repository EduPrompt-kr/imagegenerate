"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
      <h1 className="text-4xl font-bold mb-6">AI Image Generation</h1>

      <p className="text-lg mb-6">Choose an image generation model:</p>

      <div className="flex space-x-4">
        <Link href="/flux">
          <button className="px-6 py-3 bg-green-500 text-lg rounded-md text-white hover:bg-green-700 transition">
            Go to Flux Generator
          </button>
        </Link>

        <Link href="/sdxl">
          <button className="px-6 py-3 bg-blue-500 text-lg rounded-md text-white hover:bg-blue-700 transition">
            Go to SDXL Generator
          </button>
        </Link>
      </div>
    </div>
  );
}
