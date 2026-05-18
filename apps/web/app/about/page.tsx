import { Metadata } from 'next';
import Link from 'next/link';
import {
  Github,
  ExternalLink,
  Heart,
  Database,
  Zap,
  Code2,
  Sparkles,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About | AniTube',
  description:
    'Learn about AniTube — a modern anime streaming platform built with Next.js 16, React 19, and a beautiful neu-brutalism design.',
  openGraph: {
    title: 'About AniTube',
    description:
      'Modern anime streaming platform with neu-brutalism design',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-950 dark:via-purple-950 dark:to-gray-950 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* ══════════════════════════════════════════════════════════════════
            HERO SECTION
        ══════════════════════════════════════════════════════════════════ */}
        <div className="mb-12 flex justify-center">
          <div className="bg-gradient-to-br from-pastel-yellow-300 via-pastel-pink-300 to-pastel-purple-300 border-6 border-black dark:border-yellow-400 rounded-2xl shadow-brutal-xl p-12 rotate-2 hover:rotate-0 transition-transform duration-300 transform-gpu">
            <h1 className="text-7xl md:text-8xl font-black uppercase text-black dark:text-white leading-none tracking-tighter">
              Ani<span className="text-pastel-purple-600">Tube</span>
            </h1>
            <p className="mt-3 text-xl font-black uppercase text-black/70 dark:text-white/80 tracking-wide">
              Modern Anime Streaming
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            ABOUT SECTION
        ══════════════════════════════════════════════════════════════════ */}
        <section className="mb-12">
          <div className="bg-pastel-purple-200 dark:bg-pastel-purple-900 border-5 border-black dark:border-yellow-400 rounded-xl shadow-brutal-lg p-8 md:p-10">
            <div className="flex items-center gap-3 mb-5">
              <Sparkles className="w-8 h-8 text-pastel-purple-600 dark:text-pastel-purple-400" />
              <h2 className="text-3xl font-black uppercase">What is AniTube?</h2>
            </div>
            <p className="text-lg font-bold text-gray-800 dark:text-gray-200 leading-relaxed mb-4">
              AniTube is a modern anime streaming platform that brings together
              the best of anime discovery and viewing in one beautiful,
              brutalist-inspired design. Browse thousands of anime titles,
              track your watch history, and enjoy a seamless viewing
              experience.
            </p>
            <p className="text-base font-bold text-gray-700 dark:text-gray-300 leading-relaxed">
              Built with performance and user experience in mind, AniTube
              combines real-time data from multiple anime databases to give you
              the most comprehensive anime information available.
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            DATA SOURCES
        ══════════════════════════════════════════════════════════════════ */}
        <section className="mb-12">
          <h2 className="text-3xl font-black uppercase mb-6 flex items-center gap-2">
            <Database className="w-7 h-7" />
            Data Sources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* AniList */}
            <div className="bg-white dark:bg-gray-900 border-4 border-black dark:border-yellow-400 rounded-xl shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm transition-all p-6">
              <div className="w-12 h-12 bg-pastel-blue-400 border-3 border-black dark:border-yellow-400 rounded-lg flex items-center justify-center mb-4 shadow-brutal-sm">
                <span className="text-2xl font-black text-white">AL</span>
              </div>
              <h3 className="text-xl font-black uppercase mb-2">AniList</h3>
              <p className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-4">
                Comprehensive anime metadata, genres, ratings, and more
              </p>
              <a
                href="https://anilist.co"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-black text-pastel-blue-600 dark:text-pastel-blue-400 hover:underline"
              >
                Visit AniList
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Jikan / MyAnimeList */}
            <div className="bg-white dark:bg-gray-900 border-4 border-black dark:border-yellow-400 rounded-xl shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm transition-all p-6">
              <div className="w-12 h-12 bg-pastel-pink-400 border-3 border-black dark:border-yellow-400 rounded-lg flex items-center justify-center mb-4 shadow-brutal-sm">
                <span className="text-2xl font-black text-white">JK</span>
              </div>
              <h3 className="text-xl font-black uppercase mb-2">
                Jikan API
              </h3>
              <p className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-4">
                Episode data, recommendations, and MAL integration
              </p>
              <a
                href="https://jikan.moe"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-black text-pastel-pink-600 dark:text-pastel-pink-400 hover:underline"
              >
                Visit Jikan
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* MyAnimeList */}
            <div className="bg-white dark:bg-gray-900 border-4 border-black dark:border-yellow-400 rounded-xl shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm transition-all p-6">
              <div className="w-12 h-12 bg-pastel-yellow-400 border-3 border-black dark:border-yellow-400 rounded-lg flex items-center justify-center mb-4 shadow-brutal-sm">
                <span className="text-2xl font-black text-black">
                  MAL
                </span>
              </div>
              <h3 className="text-xl font-black uppercase mb-2">MyAnimeList</h3>
              <p className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-4">
                World's largest anime and manga database
              </p>
              <a
                href="https://myanimelist.net"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-black text-pastel-yellow-700 dark:text-pastel-yellow-400 hover:underline"
              >
                Visit MAL
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            TECH STACK
        ══════════════════════════════════════════════════════════════════ */}
        <section className="mb-12">
          <h2 className="text-3xl font-black uppercase mb-6 flex items-center gap-2">
            <Code2 className="w-7 h-7" />
            Tech Stack
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Next.js 16', color: 'bg-black text-white', icon: '▲' },
              {
                name: 'React 19',
                color: 'bg-pastel-blue-400 text-black',
                icon: '⚛',
              },
              {
                name: 'TypeScript',
                color: 'bg-pastel-blue-600 text-white',
                icon: 'TS',
              },
              {
                name: 'Tailwind CSS',
                color: 'bg-pastel-cyan-400 text-black',
                icon: '🎨',
              },
              {
                name: 'Zustand',
                color: 'bg-pastel-purple-400 text-white',
                icon: '🐻',
              },
              {
                name: 'TanStack Query',
                color: 'bg-pastel-coral-400 text-black',
                icon: '🔄',
              },
              {
                name: 'AniTube API',
                color: 'bg-pastel-mint-400 text-black',
                icon: '📡',
              },
              {
                name: 'Lucide Icons',
                color: 'bg-pastel-lavender-400 text-white',
                icon: '✨',
              },
            ].map((tech) => (
              <div
                key={tech.name}
                className={`${tech.color} border-3 border-black dark:border-yellow-400 rounded-lg shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm transition-all p-4 text-center`}
              >
                <div className="text-3xl mb-1">{tech.icon}</div>
                <p className="font-black text-xs uppercase leading-tight">
                  {tech.name}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            LICENSE
        ══════════════════════════════════════════════════════════════════ */}
        <section className="mb-12">
          <div className="bg-pastel-mint-200 dark:bg-pastel-mint-900 border-5 border-black dark:border-yellow-400 rounded-xl shadow-brutal p-8">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-7 h-7 text-pastel-mint-700 dark:text-pastel-mint-400" />
              <h2 className="text-2xl font-black uppercase">Open Source</h2>
            </div>
            <p className="text-base font-bold text-gray-800 dark:text-gray-200 leading-relaxed">
              AniTube is licensed under the{' '}
              <span className="px-2 py-0.5 bg-black text-white dark:bg-yellow-400 dark:text-black font-black rounded">
                AGPL-3.0
              </span>{' '}
              license. This means you can freely use, modify, and distribute
              the source code — as long as you share your changes under the
              same license.
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            LINKS & AUTHOR
        ══════════════════════════════════════════════════════════════════ */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            {/* GitHub */}
            <Link
              href="https://github.com/ArDnath/anitube"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-8 py-5 bg-black dark:bg-gray-900 text-white border-4 border-black dark:border-yellow-400 rounded-xl shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm transition-all font-black text-lg uppercase"
            >
              <Github className="w-6 h-6" />
              View on GitHub
            </Link>

            {/* Report Issue */}
            <Link
              href="https://github.com/ArDnath/anitube/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-8 py-5 bg-pastel-coral-300 dark:bg-pastel-coral-600 text-black dark:text-white border-4 border-black dark:border-yellow-400 rounded-xl shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm transition-all font-black text-lg uppercase"
            >
              <ExternalLink className="w-6 h-6" />
              Report Issue
            </Link>
          </div>

          {/* Author Credit */}
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pastel-pink-300 via-pastel-purple-300 to-pastel-blue-300 border-4 border-black dark:border-yellow-400 rounded-full shadow-brutal-lg">
              <span className="text-lg font-black text-black dark:text-white">
                Built with
              </span>
              <Heart className="w-5 h-5 text-red-500 fill-red-500 animate-pulse" />
              <span className="text-lg font-black text-black dark:text-white">
                by Ariyaman Debnath
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
