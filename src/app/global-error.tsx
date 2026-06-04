"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F0A06] text-[#FFF5E6] p-6">
          <h2 className="text-3xl font-serif italic mb-4">Something went wrong!</h2>
          <p className="text-white/60 mb-8 max-w-md text-center">
            A critical error occurred. Please try reloading the page.
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-[#C9A84C] text-black rounded-md hover:bg-[#B3933C] transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
