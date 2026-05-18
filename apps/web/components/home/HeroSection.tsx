"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Info } from "lucide-react";
import type { SearchResult } from "@anitube/api";

interface HeroSectionProps {
  anime: SearchResult | null;
}

export function HeroSection({ anime }: HeroSectionProps) {
  if (!anime) {
    return <HeroSkeleton />;
  }

  const title =
    anime.title.english || anime.title.romaji || anime.title.native || "Unknown";
  const coverImage = anime.coverImage;

  return (
    <section className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={coverImage}
          alt={title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-16">
        <div className="max-w-2xl space-y-6 animate-slide-up">
          {/* Brutalist Card with Title */}
          <div className="bg-pastel-pink border-4 border-black shadow-brutal-lg p-6 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-black">
              {title}
            </h1>
          </div>

          {/* Info Pills */}
          <div className="flex flex-wrap gap-3">
            {anime.averageScore && (
              <div className="bg-pastel-yellow border-3 border-black px-4 py-2 font-bold text-black">
                ★ {anime.averageScore}%
              </div>
            )}
            {anime.type && (
              <div className="bg-pastel-blue border-3 border-black px-4 py-2 font-bold text-black">
                {anime.type}
              </div>
            )}
            {anime.episodes && (
              <div className="bg-pastel-mint border-3 border-black px-4 py-2 font-bold text-black">
                {anime.episodes} Episodes
              </div>
            )}
            {anime.year && (
              <div className="bg-pastel-lavender border-3 border-black px-4 py-2 font-bold text-black">
                {anime.year}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link
              href={`/anime/${anime.id}`}
              className="group flex items-center gap-2 bg-pastel-purple border-4 border-black px-8 py-4 font-black text-black uppercase shadow-brutal hover:shadow-brutal-lg hover:translate-x-1 hover:translate-y-1 transition-all duration-200"
            >
              <Play className="w-6 h-6 fill-current" />
              Watch Now
            </Link>
            <Link
              href={`/anime/${anime.id}`}
              className="group flex items-center gap-2 bg-white border-4 border-black px-8 py-4 font-black text-black uppercase shadow-brutal hover:shadow-brutal-lg hover:translate-x-1 hover:translate-y-1 transition-all duration-200"
            >
              <Info className="w-6 h-6" />
              Details
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroSkeleton() {
  return (
    <section className="relative h-[70vh] min-h-[500px] w-full overflow-hidden bg-dark-bg animate-pulse">
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-16">
        <div className="max-w-2xl space-y-6 w-full">
          <div className="bg-gray-700 border-4 border-gray-600 h-24 w-3/4" />
          <div className="flex gap-3">
            <div className="bg-gray-700 border-3 border-gray-600 h-10 w-24" />
            <div className="bg-gray-700 border-3 border-gray-600 h-10 w-20" />
            <div className="bg-gray-700 border-3 border-gray-600 h-10 w-32" />
          </div>
          <div className="flex gap-4">
            <div className="bg-gray-700 border-4 border-gray-600 h-14 w-40" />
            <div className="bg-gray-700 border-4 border-gray-600 h-14 w-32" />
          </div>
        </div>
      </div>
    </section>
  );
}
