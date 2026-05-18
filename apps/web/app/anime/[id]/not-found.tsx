import Link from "next/link";
import { Search, Home, ArrowLeft } from "lucide-react";

export default function AnimeNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white border-4 border-black rounded-lg shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8">
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 border-4 border-black rounded-lg flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform -rotate-6">
            <span className="text-6xl font-black text-white drop-shadow-lg transform rotate-6">
              404
            </span>
          </div>
        </div>

        <h1 className="text-4xl font-black text-center mb-4 drop-shadow-[3px_3px_0px_rgba(0,0,0,0.2)]">
          Anime Not Found
        </h1>

        <p className="text-center text-gray-700 mb-2 font-bold">
          This anime doesn't exist in our database.
        </p>

        <p className="text-center text-sm text-gray-600 mb-8">
          The anime you're looking for might have been removed, or the ID is incorrect.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/search"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-pink-500 hover:bg-pink-600 border-3 border-black rounded-lg font-bold text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <Search className="w-5 h-5" />
            Search Anime
          </Link>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-300 hover:bg-blue-400 border-3 border-black rounded-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
        </div>

        <div className="mt-8">
          <Link
            href="javascript:history.back()"
            className="flex items-center justify-center gap-2 text-gray-600 hover:text-black font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Link>
        </div>
      </div>
    </div>
  );
}
