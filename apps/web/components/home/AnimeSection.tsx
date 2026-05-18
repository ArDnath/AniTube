"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { SearchResult } from "@anitube/api";
import { AnimeCard, AnimeCardSkeleton } from "./AnimeCard";

interface AnimeSectionProps {
  title: string;
  anime: SearchResult[];
  viewAllHref?: string;
  isLoading?: boolean;
}

export function AnimeSection({
  title,
  anime,
  viewAllHref,
  isLoading = false,
}: AnimeSectionProps) {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="bg-pastel-purple border-4 border-black shadow-brutal px-6 py-3 transform -rotate-1">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-black">
              {title}
            </h2>
          </div>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="group flex items-center gap-2 bg-white border-3 border-black px-4 py-2 font-bold text-black uppercase shadow-brutal-sm hover:shadow-brutal hover:translate-x-1 hover:translate-y-1 transition-all duration-200"
            >
              View All
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        {/* Anime Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <AnimeCardSkeleton key={i} index={i} />
            ))}
          </div>
        ) : anime.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {anime.map((item, index) => (
              <AnimeCard key={item.id} anime={item} index={index} />
            ))}
          </div>
        ) : (
          <div className="bg-pastel-coral border-4 border-black shadow-brutal p-8 text-center">
            <p className="text-black font-bold text-lg">
              No anime found in this section
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
