import Link from 'next/link';
import { Home, Search, TrendingUp } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 px-4">
      <div className="text-center space-y-8 max-w-lg">
        <div className="bg-pastel-pink-300 border-4 border-black shadow-brutal-lg p-8 -rotate-2 inline-block">
          <span className="text-9xl font-black">404</span>
        </div>
        <div className="bg-pastel-yellow-300 border-4 border-black shadow-brutal p-6 rotate-1">
          <h1 className="text-3xl font-black uppercase">Anime Not Found!</h1>
          <p className="font-bold mt-2 text-gray-700">
            Looks like this anime wandered into another dimension.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 bg-pastel-purple-300 border-4 border-black px-6 py-3 font-black uppercase shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm transition-all"
          >
            <Home className="w-5 h-5" /> Home
          </Link>
          <Link
            href="/search"
            className="flex items-center gap-2 bg-pastel-blue-300 border-4 border-black px-6 py-3 font-black uppercase shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm transition-all"
          >
            <Search className="w-5 h-5" /> Search
          </Link>
          <Link
            href="/genre/action"
            className="flex items-center gap-2 bg-pastel-mint-300 border-4 border-black px-6 py-3 font-black uppercase shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm transition-all"
          >
            <TrendingUp className="w-5 h-5" /> Browse
          </Link>
        </div>
      </div>
    </div>
  );
}
