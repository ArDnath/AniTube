"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, Home, RefreshCcw } from "lucide-react";

export default function AnimeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Anime page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white border-4 border-black rounded-lg shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-red-400 border-4 border-black rounded-full flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <AlertCircle className="w-12 h-12 text-white" strokeWidth={3} />
          </div>
        </div>

        <h1 className="text-4xl font-black text-center mb-4 drop-shadow-[3px_3px_0px_rgba(0,0,0,0.2)]">
          Oops! Something went wrong
        </h1>

        <p className="text-center text-gray-700 mb-2 font-bold">
          We couldn't load this anime page.
        </p>

        <p className="text-center text-sm text-gray-600 mb-8">
          {error.message || "An unexpected error occurred"}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-pink-500 hover:bg-pink-600 border-3 border-black rounded-lg font-bold text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <RefreshCcw className="w-5 h-5" />
            Try Again
          </button>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-300 hover:bg-blue-400 border-3 border-black rounded-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t-2 border-black">
          <p className="text-xs text-center text-gray-500">
            If this problem persists, please contact support.
            {error.digest && (
              <span className="block mt-1">
                Error ID: <code className="font-mono">{error.digest}</code>
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
