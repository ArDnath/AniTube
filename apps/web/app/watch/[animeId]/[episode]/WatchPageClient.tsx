'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  List,
} from 'lucide-react';
import { VideoPlayer } from '@/components/player/VideoPlayer';
import { usePlayerStore } from '@/lib/store/player-store';
import type { AnimeInfo, EpisodeInfo } from '@anitube/api';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface WatchPageClientProps {
  anime: AnimeInfo;
  episodes: EpisodeInfo[] | null;
  animeId: number;
  episode: number;
}

interface EpisodeListProps {
  episodes: EpisodeInfo[];
  currentEpisode: number;
  onSelect: (ep: number) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Episode List (used in both sidebar & accordion)
// ─────────────────────────────────────────────────────────────────────────────
function EpisodeList({ episodes, currentEpisode, onSelect }: EpisodeListProps) {
  const currentRef = useRef<HTMLButtonElement>(null);

  // Scroll the current episode into view on mount / when episode changes
  useEffect(() => {
    if (currentRef.current) {
      currentRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [currentEpisode]);

  return (
    <div className="p-2 space-y-1">
      {episodes.map((ep) => {
        const isCurrent = ep.number === currentEpisode;
        return (
          <button
            key={ep.number}
            ref={isCurrent ? currentRef : undefined}
            onClick={() => onSelect(ep.number)}
            className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg border-2 border-black font-bold transition-all hover:translate-x-0.5 hover:shadow-brutal-sm ${
              isCurrent
                ? 'bg-pastel-purple-300 dark:bg-pastel-purple-600 shadow-brutal-sm'
                : 'bg-white dark:bg-gray-800 hover:bg-pastel-purple-100 dark:hover:bg-gray-700'
            }`}
          >
            {/* Episode number badge */}
            <span
              className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-sm font-black border-2 border-black ${
                isCurrent
                  ? 'bg-pastel-purple-500 text-white'
                  : 'bg-black text-white dark:bg-pastel-yellow-400 dark:text-black'
              }`}
            >
              {ep.number}
            </span>

            {/* Title + badges */}
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm leading-tight">
                {ep.title || `Episode ${ep.number}`}
              </p>
              {(ep.filler || ep.recap) && (
                <div className="flex gap-1 mt-0.5">
                  {ep.filler && (
                    <span className="px-1.5 py-0.5 bg-pastel-yellow-300 border border-black text-[10px] font-black rounded uppercase">
                      Filler
                    </span>
                  )}
                  {ep.recap && (
                    <span className="px-1.5 py-0.5 bg-pastel-peach-300 border border-black text-[10px] font-black rounded uppercase">
                      Recap
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Playing indicator */}
            {isCurrent && (
              <span className="flex-shrink-0 w-2 h-2 rounded-full bg-pastel-purple-600 animate-pulse" />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Client Component
// ─────────────────────────────────────────────────────────────────────────────
export function WatchPageClient({
  anime,
  episodes,
  animeId,
  episode,
}: WatchPageClientProps) {
  const router = useRouter();
  const [mobileEpOpen, setMobileEpOpen] = useState(false);

  // Read autoNext from player store (persisted)
  const { autoNext } = usePlayerStore();

  const title = anime.title.english || anime.title.romaji || 'Unknown Anime';
  const totalEpisodes = anime.episodes ?? 0;

  // Current episode metadata from Jikan (if available)
  const currentEpisodeInfo = episodes?.find((ep) => ep.number === episode) ?? null;

  // Build the episode list to display.
  // Priority: Jikan data > generated placeholders based on total count > null
  const displayEpisodes: EpisodeInfo[] | null = episodes
    ? episodes
    : totalEpisodes > 0
      ? Array.from({ length: Math.min(totalEpisodes, 50) }, (_, i) => ({
          number: i + 1,
          title: null,
          aired: null,
          duration: null,
          filler: false,
          recap: false,
          synopsis: null,
        }))
      : null;

  const totalCount = displayEpisodes?.length ?? totalEpisodes;
  const prevEp = episode > 1 ? episode - 1 : null;
  const nextEp = episode < totalCount ? episode + 1 : null;

  const navigateTo = (ep: number) => router.push(`/watch/${animeId}/${ep}`);

  const handleEpisodeEnd = () => {
    if (autoNext && nextEp) {
      navigateTo(nextEp);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-950 dark:via-purple-950 dark:to-gray-950 pb-12">
      <div className="container mx-auto px-4 py-6 max-w-screen-2xl">
        {/* ── Back link ── */}
        <div className="mb-4">
          <Link
            href={`/anime/${animeId}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border-3 border-black dark:border-yellow-400 rounded-lg font-bold text-sm shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Details
          </Link>
        </div>

        {/* ── Main layout: player (70%) + sidebar (30%) ── */}
        <div className="flex flex-col lg:flex-row gap-5">
          {/* ══════ Left / Main area ══════ */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Video player — keyed so it remounts on episode change */}
            <VideoPlayer
              key={episode}
              animeId={animeId}
              animeTitle={title}
              episodeNumber={episode}
              episodeTitle={currentEpisodeInfo?.title}
              posterUrl={anime.coverImage}
              onEnded={handleEpisodeEnd}
            />

            {/* Title + episode info */}
            <div className="bg-white dark:bg-gray-900 border-4 border-black dark:border-yellow-400 rounded-xl shadow-brutal p-5">
              <h1 className="font-black text-2xl uppercase leading-tight">
                {title}
              </h1>
              <p className="font-bold text-pastel-purple-600 dark:text-pastel-purple-400 text-lg mt-1">
                Episode {episode}
                {currentEpisodeInfo?.title && ` — ${currentEpisodeInfo.title}`}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-3">
                {currentEpisodeInfo?.filler && (
                  <span className="px-3 py-1 bg-pastel-yellow-300 border-2 border-black rounded-lg font-black text-sm uppercase shadow-brutal-sm">
                    Filler Episode
                  </span>
                )}
                {currentEpisodeInfo?.recap && (
                  <span className="px-3 py-1 bg-pastel-peach-300 border-2 border-black rounded-lg font-black text-sm uppercase shadow-brutal-sm">
                    Recap
                  </span>
                )}
                {autoNext && (
                  <span className="px-3 py-1 bg-pastel-mint-300 border-2 border-black rounded-lg font-black text-sm uppercase shadow-brutal-sm">
                    Auto-Next On
                  </span>
                )}
              </div>
            </div>

            {/* ── Prev / Next navigation ── */}
            <div className="flex items-center gap-3 flex-wrap">
              {prevEp ? (
                <button
                  onClick={() => navigateTo(prevEp)}
                  className="flex items-center gap-2 px-5 py-3 bg-pastel-blue-300 border-3 border-black rounded-full font-black shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm transition-all uppercase text-sm"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Ep {prevEp}
                </button>
              ) : (
                <div className="flex items-center gap-2 px-5 py-3 bg-gray-100 dark:bg-gray-800 border-3 border-black/30 dark:border-gray-600 rounded-full font-black text-gray-400 text-sm uppercase cursor-not-allowed">
                  <ChevronLeft className="w-5 h-5" />
                  First Ep
                </div>
              )}

              {nextEp ? (
                <button
                  onClick={() => navigateTo(nextEp)}
                  className="flex items-center gap-2 px-5 py-3 bg-pastel-pink-300 border-3 border-black rounded-full font-black shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm transition-all uppercase text-sm"
                >
                  Ep {nextEp}
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <div className="flex items-center gap-2 px-5 py-3 bg-gray-100 dark:bg-gray-800 border-3 border-black/30 dark:border-gray-600 rounded-full font-black text-gray-400 text-sm uppercase cursor-not-allowed">
                  Last Ep
                  <ChevronRight className="w-5 h-5" />
                </div>
              )}
            </div>

            {/* ── Mobile: Episode accordion ── */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileEpOpen((o) => !o)}
                className="w-full flex items-center justify-between px-5 py-4 bg-pastel-purple-300 dark:bg-pastel-purple-600 border-4 border-black dark:border-yellow-400 rounded-xl font-black uppercase shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm transition-all"
              >
                <span className="flex items-center gap-2">
                  <List className="w-5 h-5" />
                  Episodes
                  {displayEpisodes && (
                    <span className="font-bold text-sm">
                      ({displayEpisodes.length})
                    </span>
                  )}
                </span>
                {mobileEpOpen ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>

              {mobileEpOpen && (
                <div className="mt-2 bg-white dark:bg-gray-900 border-4 border-black dark:border-yellow-400 rounded-xl shadow-brutal max-h-96 overflow-y-auto">
                  {displayEpisodes ? (
                    <EpisodeList
                      episodes={displayEpisodes}
                      currentEpisode={episode}
                      onSelect={(ep) => {
                        setMobileEpOpen(false);
                        navigateTo(ep);
                      }}
                    />
                  ) : (
                    <p className="p-6 text-center font-bold text-gray-500">
                      Episode list unavailable
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ══════ Right sidebar (30%) — desktop only ══════ */}
          <aside className="hidden lg:flex lg:flex-col w-80 xl:w-96 flex-shrink-0">
            <div className="bg-white dark:bg-gray-900 border-4 border-black dark:border-yellow-400 rounded-xl shadow-brutal sticky top-24 flex flex-col max-h-[calc(100vh-8rem)]">
              {/* Header */}
              <div className="p-4 border-b-4 border-black dark:border-yellow-400 bg-pastel-purple-300 dark:bg-pastel-purple-700 rounded-t-xl flex-shrink-0">
                <h2 className="font-black text-lg uppercase flex items-center gap-2">
                  <List className="w-5 h-5" />
                  Episodes
                  {displayEpisodes && (
                    <span className="font-bold text-sm">
                      ({displayEpisodes.length})
                    </span>
                  )}
                </h2>
              </div>

              {/* Scrollable list */}
              <div className="overflow-y-auto flex-1">
                {displayEpisodes ? (
                  <EpisodeList
                    episodes={displayEpisodes}
                    currentEpisode={episode}
                    onSelect={navigateTo}
                  />
                ) : (
                  <p className="p-6 text-center font-bold text-gray-500">
                    Episode list unavailable
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
