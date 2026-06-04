"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-2xl font-serif italic mb-3 text-[var(--ink-dark)]">Oops, something went wrong</h2>
      <p className="text-[var(--ink-mid)] mb-8 max-w-md">
        We encountered an unexpected error while loading this page.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-2 bg-[var(--thread-gold)] text-black rounded hover:bg-[#B3933C] transition-colors font-sans text-sm"
        >
          Try again
        </button>
        <Link href="/">
          <button className="px-6 py-2 border border-[var(--stitch-strong)] text-[var(--ink-dark)] rounded hover:bg-[var(--bg-surface)] transition-colors font-sans text-sm">
            Go Home
          </button>
        </Link>
      </div>
    </div>
  );
}
