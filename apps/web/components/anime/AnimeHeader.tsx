"use client";

import Image from "next/image";
import { Play, Plus } from "lucide-react";
import type { AnimeInfo } from "@anitube/api";

interface AnimeHeaderProps {
  anime: AnimeInfo;
}

export function AnimeHeader({ anime }: AnimeHeaderProps) {
  const title = anime.title.english || anime.title.romaji || "Unknown Title";
  const altTitle = anime.title.romaji !== title ? anime.title.romaji : anime.title.native;

  const formatStatus = (status: string) => {
    return status.replace(/_/g, " ");
  };

  const formatSeason = () => {
    if (!anime.season || !anime.seasonYear) return null;
    return `${anime.season.charAt(0) + anime.season.slice(1).toLowerCase()} ${anime.seasonYear}`;
  };

  return (
    <div className="relative">
      {/* Banner Background */}
      <div className="h-[500px] relative">
        {anime.bannerImage ? (
          <Image
            src={anime.bannerImage}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content Overlay */}
      <div className="container mx-auto px-4 relative">
        <div className="absolute -top-72 left-4 flex gap-8 items-end">
          {/* Cover Poster */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200" />
            <div className="relative w-[230px] h-[340px] border-4 border-black rounded-lg overflow-hidden bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <Image
                src={anime.coverImage}
                alt={title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Title and Metadata */}
          <div className="pb-8 max-w-3xl">
            <h1 className="text-5xl font-black mb-2 text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:drop-shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all">
              {title}
            </h1>
            {altTitle && (
              <p className="text-xl text-gray-200 mb-4 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
                {altTitle}
              </p>
            )}

            {/* Metadata Pills */}
            <div className="flex flex-wrap gap-3 mb-6">
              {anime.averageScore && (
                <div className="px-4 py-2 bg-yellow-400 border-3 border-black rounded-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
                  ⭐ {anime.averageScore}%
                </div>
              )}
              {anime.format && (
                <div className="px-4 py-2 bg-blue-300 border-3 border-black rounded-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  {anime.format}
                </div>
              )}
              {anime.status && (
                <div className="px-4 py-2 bg-green-300 border-3 border-black rounded-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  {formatStatus(anime.status)}
                </div>
              )}
              {anime.episodes && (
                <div className="px-4 py-2 bg-pink-300 border-3 border-black rounded-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  {anime.episodes} Episodes
                </div>
              )}
              {formatSeason() && (
                <div className="px-4 py-2 bg-purple-300 border-3 border-black rounded-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  {formatSeason()}
                </div>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {anime.genres.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 bg-white border-2 border-black text-sm font-bold rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-pink-500 hover:bg-pink-600 border-3 border-black rounded-lg font-bold text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Play className="w-5 h-5 fill-current" />
                Watch Now
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 border-3 border-black rounded-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Plus className="w-5 h-5" />
                Add to List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
