import Link from 'next/link';
import { Github, MessageCircle, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-pastel-purple-100 border-t-4 border-black mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="bg-pastel-yellow-300 border-3 border-black rounded-lg px-3 py-2 inline-block rotate-2 shadow-brutal">
              <span className="font-black text-xl uppercase">AniTube</span>
            </div>
            <p className="font-bold text-sm">
              Stream anime with a beautiful brutalist interface powered by AniList & Jikan APIs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-black uppercase mb-4 text-lg">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="font-bold hover:text-pastel-purple-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  className="font-bold hover:text-pastel-purple-600 transition-colors"
                >
                  Browse
                </Link>
              </li>
              <li>
                <Link
                  href="/genre/action"
                  className="font-bold hover:text-pastel-purple-600 transition-colors"
                >
                  Genres
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-black uppercase mb-4 text-lg">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://anilist.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold hover:text-pastel-purple-600 transition-colors"
                >
                  AniList
                </a>
              </li>
              <li>
                <a
                  href="https://jikan.moe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold hover:text-pastel-purple-600 transition-colors"
                >
                  Jikan API
                </a>
              </li>
              <li>
                <a
                  href="https://myanimelist.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold hover:text-pastel-purple-600 transition-colors"
                >
                  MyAnimeList
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-black uppercase mb-4 text-lg">Community</h3>
            <div className="flex gap-3">
              <a
                href="https://github.com/ArDnath/anitube"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-pastel-pink-300 border-3 border-black rounded-lg flex items-center justify-center hover:scale-110 transition-transform shadow-brutal"
                aria-label="GitHub"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-pastel-blue-300 border-3 border-black rounded-lg flex items-center justify-center hover:scale-110 transition-transform shadow-brutal"
                aria-label="Discord"
              >
                <MessageCircle className="w-6 h-6" />
              </a>
            </div>
            <a
              href="https://github.com/ArDnath/anitube/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block px-4 py-2 bg-pastel-yellow-300 border-3 border-black rounded-lg font-bold hover:scale-105 transition-transform shadow-brutal uppercase text-sm"
            >
              Report Issue
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t-3 border-black">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-bold text-sm">
              © {new Date().getFullYear()} AniTube. Built with{' '}
              <Heart className="inline w-4 h-4 text-red-500 fill-red-500" /> by Ariyaman Debnath
            </p>
            <p className="font-bold text-xs text-gray-600">
              Data provided by AniList, Jikan & MyAnimeList. Licensed under AGPL-3.0
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
