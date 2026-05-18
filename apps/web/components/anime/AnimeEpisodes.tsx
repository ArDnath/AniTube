"use client";

import { useState } from "react";
import { Play, Clock } from "lucide-react";
import type { EpisodeInfo } from "@anitube/api";

interface AnimeEpisodesProps {
  episodes: EpisodeInfo[];
  animeTitle: string;
}

export function AnimeEpisodes({ episodes, animeTitle }: AnimeEpisodesProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const episodesPerPage = 12;

  const totalPages = Math.ceil(episodes.length / episodesPerPage);
  const startIndex = (currentPage - 1) * episodesPerPage;
  const endIndex = startIndex + episodesPerPage;
  const currentEpisodes = episodes.slice(startIndex, endIndex);

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white border-4 border-black rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
      <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
        <span className="w-2 h-8 bg-blue-500 rounded" />
        Episodes ({episodes.length})
      </h2>

      <div className="space-y-2">
        {currentEpisodes.map((episode) => (
          <div
            key={episode.number}
            className="group border-3 border-black rounded-lg p-4 hover:bg-blue-50 transition-all hover:translate-x-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer bg-gradient-to-r from-white to-gray-50"
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 border-2 border-black rounded-lg flex items-center justify-center font-black text-white text-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                {episode.number}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg truncate">
                    {episode.title || `Episode ${episode.number}`}
                  </h3>
                  {episode.filler && (
                    <span className="px-2 py-0.5 bg-yellow-300 border border-black text-xs font-bold rounded">
                      FILLER
                    </span>
                  )}
                  {episode.recap && (
                    <span className="px-2 py-0.5 bg-orange-300 border border-black text-xs font-bold rounded">
                      RECAP
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {episode.duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatDuration(episode.duration)}
                    </span>
                  )}
                  {formatDate(episode.aired) && (
                    <span>{formatDate(episode.aired)}</span>
                  )}
                </div>
              </div>

              <button className="flex-shrink-0 p-3 bg-pink-500 hover:bg-pink-600 border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all group-hover:scale-110 active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Play className="w-5 h-5 text-white fill-current" />
              </button>
            </div>

            {episode.synopsis && (
              <p className="mt-3 text-sm text-gray-600 line-clamp-2 pl-20">
                {episode.synopsis}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white border-2 border-black rounded-lg font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          >
            Previous
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 border-2 border-black rounded-lg font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${
                  currentPage === page
                    ? "bg-pink-500 text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white border-2 border-black rounded-lg font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
