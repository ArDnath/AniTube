"use client";

import Image from "next/image";
import Link from "next/link";
import type { SearchResult } from "@anitube/api";

interface AnimeCardProps {
  anime: SearchResult;
  index?: number;
}

export function AnimeCard({ anime, index = 0 }: AnimeCardProps) {
  const title =
    anime.title.english || anime.title.romaji || anime.title.native || "Unknown";

  // Rotate different cards for brutalist effect
  const rotations = ["-rotate-1", "rotate-1", "-rotate-2", "rotate-0"];
  const colors = [
    "bg-pastel-pink",
    "bg-pastel-purple",
    "bg-pastel-blue",
    "bg-pastel-mint",
    "bg-pastel-yellow",
    "bg-pastel-peach",
  ];

  const rotation = rotations[index % rotations.length];
  const bgColor = colors[index % colors.length];

  return (
    <Link
      href={`/anime/${anime.id}`}
      className={`group block transform ${rotation} hover:rotate-0 transition-all duration-300 hover:scale-105 animate-slide-in`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className={`${bgColor} border-4 border-black shadow-brutal hover:shadow-brutal-lg overflow-hidden`}>
        {/* Image Container */}
        <div className="relative aspect-[2/3] overflow-hidden border-b-4 border-black bg-gray-900">
          <Image
            src={anime.coverImage}
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
          {/* Score Badge */}
          {anime.averageScore && (
            <div className="absolute top-2 right-2 bg-black text-pastel-yellow border-2 border-pastel-yellow px-3 py-1 font-black text-sm">
              ★ {anime.averageScore}%
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="p-4 space-y-2">
          <h3 className="font-black text-black text-lg line-clamp-2 uppercase tracking-tight">
            {title}
          </h3>
          <div className="flex flex-wrap gap-2 text-xs">
            {anime.type && (
              <span className="bg-black text-white px-2 py-1 font-bold">
                {anime.type}
              </span>
            )}
            {anime.episodes && (
              <span className="bg-black text-white px-2 py-1 font-bold">
                {anime.episodes} EP
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function AnimeCardSkeleton({ index = 0 }: { index?: number }) {
  const rotations = ["-rotate-1", "rotate-1", "-rotate-2", "rotate-0"];
  const rotation = rotations[index % rotations.length];

  return (
    <div className={`transform ${rotation} animate-pulse`}>
      <div className="bg-gray-700 border-4 border-gray-600 overflow-hidden">
        <div className="relative aspect-[2/3] bg-gray-800" />
        <div className="p-4 space-y-2">
          <div className="bg-gray-600 h-6 w-3/4" />
          <div className="flex gap-2">
            <div className="bg-gray-600 h-4 w-12" />
            <div className="bg-gray-600 h-4 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}
