"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Search,
  X,
  SlidersHorizontal,
  ChevronDown,
  Clock,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Frown,
  Sparkles,
  TvMinimalPlay,
} from "lucide-react";
import { animeApi } from "@anitube/api";
import type { SearchResult } from "@anitube/api";
import { AnimeCard, AnimeCardSkeleton } from "@/components/home/AnimeCard";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thriller",
] as const;

const FORMATS = ["Any", "TV", "Movie", "OVA", "ONA", "Special"] as const;
const STATUSES = ["Any", "Airing", "Finished", "Upcoming"] as const;
const SORTS = ["Popularity", "Score", "Title", "Trending"] as const;

const PER_PAGE = 24;
const RECENT_SEARCHES_KEY = "anitube-recent-searches";
const MAX_RECENT = 8;

const FORMAT_MAP: Record<string, string> = {
  TV: "TV",
  Movie: "MOVIE",
  OVA: "OVA",
  ONA: "ONA",
  Special: "SPECIAL",
};

const STATUS_MAP: Record<string, string> = {
  Airing: "RELEASING",
  Finished: "FINISHED",
  Upcoming: "NOT_YET_RELEASED",
};

const GENRE_COLORS = [
  "bg-pastel-pink-300",
  "bg-pastel-purple-300",
  "bg-pastel-blue-300",
  "bg-pastel-mint-300",
  "bg-pastel-yellow-300",
  "bg-pastel-peach-300",
  "bg-pastel-lavender-300",
  "bg-pastel-coral-300",
];

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface Filters {
  genres: string[];
  format: (typeof FORMATS)[number];
  status: (typeof STATUSES)[number];
  sort: (typeof SORTS)[number];
}

const DEFAULT_FILTERS: Filters = {
  genres: [],
  format: "Any",
  status: "Any",
  sort: "Popularity",
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveRecentSearch(query: string): string[] {
  if (!query.trim()) return getRecentSearches();
  const existing = getRecentSearches().filter(
    (s) => s.toLowerCase() !== query.toLowerCase(),
  );
  const updated = [query.trim(), ...existing].slice(0, MAX_RECENT);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  return updated;
}

function removeRecentSearch(query: string): string[] {
  const updated = getRecentSearches().filter((s) => s !== query);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  return updated;
}

function clearAllRecentSearches(): void {
  localStorage.removeItem(RECENT_SEARCHES_KEY);
}

function sortResults(results: SearchResult[], sort: string): SearchResult[] {
  const copy = [...results];
  switch (sort) {
    case "Score":
      return copy.sort((a, b) => (b.averageScore ?? 0) - (a.averageScore ?? 0));
    case "Title":
      return copy.sort((a, b) => {
        const ta = a.title.english ?? a.title.romaji ?? "";
        const tb = b.title.english ?? b.title.romaji ?? "";
        return ta.localeCompare(tb);
      });
    case "Trending":
    case "Popularity":
    default:
      return copy.sort((a, b) => b.popularity - a.popularity);
  }
}

function getPageNumbers(current: number, total: number, max = 5): number[] {
  if (total <= max) return Array.from({ length: total }, (_, i) => i + 1);
  let start = Math.max(1, current - Math.floor(max / 2));
  const end = Math.min(total, start + max - 1);
  start = Math.max(1, end - max + 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function hasActiveFilters(filters: Filters): boolean {
  return (
    filters.genres.length > 0 ||
    filters.format !== "Any" ||
    filters.status !== "Any"
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────
function GenreChip({
  genre,
  selected,
  colorClass,
  onToggle,
}: {
  genre: string;
  selected: boolean;
  colorClass: string;
  onToggle: (g: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(genre)}
      className={`
        px-3 py-1.5 border-3 border-black font-bold text-sm uppercase tracking-wide
        transition-all duration-150 hover:translate-x-0.5 hover:translate-y-0.5
        hover:shadow-brutal-sm active:translate-x-1 active:translate-y-1 active:shadow-none
        ${
          selected
            ? "bg-black text-white shadow-brutal-sm"
            : `${colorClass} text-black shadow-brutal-sm hover:shadow-none`
        }
      `}
    >
      {genre}
    </button>
  );
}

function FilterRadioGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  activeColor,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  activeColor: string;
}) {
  return (
    <div className="space-y-2">
      <p className="font-black text-sm uppercase tracking-widest text-black/70">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`
              px-4 py-2 border-3 border-black font-bold text-sm uppercase
              transition-all duration-150 hover:translate-x-0.5 hover:translate-y-0.5
              active:translate-x-1 active:translate-y-1
              ${
                value === opt
                  ? `${activeColor} text-white shadow-brutal-sm`
                  : "bg-white text-black shadow-brutal-sm hover:shadow-none"
              }
            `}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function PageButton({
  page,
  current,
  onClick,
}: {
  page: number;
  current: number;
  onClick: (p: number) => void;
}) {
  const isActive = page === current;
  return (
    <button
      onClick={() => onClick(page)}
      className={`
        w-10 h-10 border-3 border-black font-black text-sm
        transition-all duration-150
        ${
          isActive
            ? "bg-black text-white shadow-brutal-sm cursor-default"
            : "bg-white text-black shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
        }
      `}
      aria-current={isActive ? "page" : undefined}
      disabled={isActive}
    >
      {page}
    </button>
  );
}

function EmptyState({
  query,
  onGenreClick,
}: {
  query: string;
  onGenreClick: (g: string) => void;
}) {
  const suggestions = [
    "Naruto",
    "One Piece",
    "Attack on Titan",
    "Demon Slayer",
  ];
  const genreSuggestions = ["Action", "Romance", "Fantasy", "Comedy"];
  return (
    <div className="flex flex-col items-center py-20 px-4 text-center space-y-8 animate-fade-in">
      <div className="relative">
        <div className="text-8xl select-none">😔</div>
        <div className="absolute -top-2 -right-4 text-4xl animate-bounce select-none">
          ?
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-black leading-none">
          NO RESULTS
        </h2>
        <div className="bg-black text-white px-6 py-3 inline-block font-black text-xl uppercase tracking-wider">
          for &ldquo;{query}&rdquo;
        </div>
      </div>

      <p className="text-lg font-bold text-neutral-600 max-w-md">
        We couldn&apos;t find any anime matching your search. Try adjusting your
        filters or search for something else.
      </p>

      <div className="space-y-4 w-full max-w-lg">
        <p className="font-black uppercase tracking-widest text-sm text-black/60">
          Try searching for:
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => onGenreClick(s)}
              className="bg-pastel-yellow-300 border-3 border-black px-4 py-2 font-bold shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              {s}
            </button>
          ))}
        </div>
        <p className="font-black uppercase tracking-widest text-sm text-black/60 mt-4">
          Or browse by genre:
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          {genreSuggestions.map((g, i) => (
            <button
              key={g}
              onClick={() => onGenreClick(g)}
              className={`${GENRE_COLORS[i % GENRE_COLORS.length]} border-3 border-black px-4 py-2 font-bold shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function InitialState({
  onSuggestionClick,
}: {
  onSuggestionClick: (q: string) => void;
}) {
  const suggestions = [
    { label: "🔥 Trending", query: "trending" },
    { label: "⚔️ Action", query: "action" },
    { label: "💕 Romance", query: "romance" },
    { label: "🧙 Fantasy", query: "fantasy" },
    { label: "😂 Comedy", query: "comedy" },
    { label: "🔍 Mystery", query: "mystery" },
  ];

  return (
    <div className="flex flex-col items-center py-20 px-4 text-center space-y-10 animate-fade-in">
      <div className="space-y-2">
        <div className="text-8xl select-none mb-4">
          <TvMinimalPlay
            className="inline-block w-24 h-24 text-black"
            strokeWidth={2.5}
          />
        </div>
        <div className="bg-black text-white inline-block px-2 py-1 font-black text-sm uppercase tracking-widest mb-4">
          AniTube Search
        </div>
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black leading-none max-w-2xl">
          SEARCH FOR YOUR FAVOURITE ANIME!
        </h2>
      </div>

      <p className="text-lg font-bold text-neutral-600 max-w-md">
        Type in the search bar above to discover thousands of amazing anime
        titles.
      </p>

      <div className="space-y-4">
        <div className="flex items-center gap-2 justify-center">
          <Sparkles className="w-4 h-4" />
          <p className="font-black uppercase tracking-widest text-sm">
            Popular right now
          </p>
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex flex-wrap gap-3 justify-center max-w-xl">
          {suggestions.map(({ label, query }) => (
            <button
              key={query}
              onClick={() => onSuggestionClick(query)}
              className="bg-pastel-purple-300 border-3 border-black px-5 py-2.5 font-black text-sm uppercase shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export default function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL state
  const urlQuery = searchParams.get("q") ?? "";
  const urlPage = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));

  // Local UI state
  const [inputValue, setInputValue] = useState(urlQuery);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showRecent, setShowRecent] = useState(false);

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Init recent searches ──────────────────────────────────────────────────
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  // ── Sync inputValue → URL (debounced 300ms) ───────────────────────────────
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (inputValue.trim()) params.set("q", inputValue.trim());
      // reset page on new search
      const newUrl = `/search${params.toString() ? `?${params.toString()}` : ""}`;
      router.replace(newUrl, { scroll: false });
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputValue, router]);

  // ── Close recent dropdown on outside click ────────────────────────────────
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowRecent(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // ── Fetch results ─────────────────────────────────────────────────────────
  const isSearchActive =
    urlQuery.trim().length > 0 || hasActiveFilters(filters);

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: [
      "search",
      urlQuery,
      urlPage,
      filters.genres,
      filters.format,
      filters.status,
      filters.sort,
    ],
    queryFn: async () => {
      const result = await animeApi.searchAnime(urlQuery, {
        page: urlPage,
        perPage: PER_PAGE,
        genres: filters.genres.length > 0 ? filters.genres : undefined,
        format:
          filters.format !== "Any" ? FORMAT_MAP[filters.format] : undefined,
        status:
          filters.status !== "Any" ? STATUS_MAP[filters.status] : undefined,
      });
      return {
        ...result,
        data: sortResults(result.data, filters.sort),
      };
    },
    enabled: isSearchActive,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
  });

  // ── Error toast ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (error) {
      toast.error("Search failed. Please try again.", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }, [error]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSearch = useCallback(
    (query: string) => {
      const trimmed = query.trim();
      if (!trimmed) return;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      setInputValue(trimmed);
      setShowRecent(false);
      const updated = saveRecentSearch(trimmed);
      setRecentSearches(updated);
      router.push(`/search?q=${encodeURIComponent(trimmed)}`, {
        scroll: false,
      });
    },
    [router],
  );

  const handleClear = useCallback(() => {
    setInputValue("");
    router.replace("/search", { scroll: false });
    inputRef.current?.focus();
  }, [router]);

  const handleGenreToggle = useCallback(
    (genre: string) => {
      setFilters((prev) => ({
        ...prev,
        genres: prev.genres.includes(genre)
          ? prev.genres.filter((g) => g !== genre)
          : [...prev.genres, genre],
      }));
      // Reset page
      router.replace(
        "/search" + (urlQuery ? `?q=${encodeURIComponent(urlQuery)}` : ""),
        {
          scroll: false,
        },
      );
    },
    [router, urlQuery],
  );

  const handleFilterChange = useCallback(
    <K extends keyof Filters>(key: K, value: Filters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      router.replace(
        "/search" + (urlQuery ? `?q=${encodeURIComponent(urlQuery)}` : ""),
        {
          scroll: false,
        },
      );
    },
    [router, urlQuery],
  );

  const handleResetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams();
      if (urlQuery) params.set("q", urlQuery);
      if (page > 1) params.set("page", String(page));
      router.push(`/search?${params.toString()}`, { scroll: false });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [router, urlQuery],
  );

  const handleRemoveRecent = useCallback(
    (query: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const updated = removeRecentSearch(query);
      setRecentSearches(updated);
    },
    [],
  );

  const handleClearAllRecent = useCallback(() => {
    clearAllRecentSearches();
    setRecentSearches([]);
  }, []);

  const handleSuggestionSearch = useCallback(
    (query: string) => {
      setInputValue(query);
      handleSearch(query);
    },
    [handleSearch],
  );

  // ── Derived values ────────────────────────────────────────────────────────
  const totalPages = useMemo(() => {
    if (!data) return 1;
    return Math.ceil(data.pagination.total / PER_PAGE);
  }, [data]);

  const pageNumbers = useMemo(
    () => getPageNumbers(urlPage, totalPages),
    [urlPage, totalPages],
  );

  const activeFilterCount = useMemo(
    () =>
      filters.genres.length +
      (filters.format !== "Any" ? 1 : 0) +
      (filters.status !== "Any" ? 1 : 0),
    [filters],
  );

  const showResults = isSearchActive;
  const showEmpty =
    !isLoading && !isFetching && showResults && data && data.data.length === 0;
  const showInitial = !isSearchActive;

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-yellow-50 via-white to-pastel-pink-50">
      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="bg-black text-white py-10 px-4 border-b-4 border-black">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-pastel-yellow-300 text-black px-3 py-1 border-3 border-white font-black text-xs uppercase tracking-widest mb-3">
              <Search className="w-3 h-3" />
              AniTube
            </div>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none text-white">
              SEARCH
            </h1>
          </div>
          {urlQuery && data && (
            <div className="sm:ml-auto bg-pastel-yellow-300 border-3 border-white px-5 py-3 shadow-brutal font-black text-black text-sm uppercase tracking-wider">
              {data.pagination.total.toLocaleString()} results
              <br />
              <span className="font-bold normal-case tracking-normal text-black/70">
                for &ldquo;{urlQuery}&rdquo;
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* ── Search Input ───────────────────────────────────────────────── */}
        <div ref={containerRef} className="relative">
          <div
            className={`
              flex items-center bg-white border-4 border-black
              ${
                showRecent && recentSearches.length > 0 && !inputValue
                  ? "shadow-none"
                  : "shadow-brutal-lg"
              }
              transition-all duration-200
            `}
          >
            <Search
              className="ml-5 w-6 h-6 text-black shrink-0"
              strokeWidth={3}
            />
            <input
              ref={inputRef}
              autoFocus
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setShowRecent(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch(inputValue);
                if (e.key === "Escape") {
                  setShowRecent(false);
                  inputRef.current?.blur();
                }
              }}
              placeholder="Search anime..."
              className="flex-1 px-4 py-5 text-xl font-black outline-none bg-transparent placeholder:text-neutral-400 placeholder:font-bold"
              aria-label="Search anime"
            />
            {inputValue && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear search"
                className="mr-3 p-2 bg-black text-white border-2 border-black hover:bg-neutral-800 transition-colors"
              >
                <X className="w-4 h-4" strokeWidth={3} />
              </button>
            )}
            <button
              type="button"
              onClick={() => handleSearch(inputValue)}
              className="h-full px-6 py-5 bg-black text-white font-black uppercase text-sm tracking-widest border-l-4 border-black hover:bg-neutral-800 transition-colors shrink-0"
            >
              GO
            </button>
          </div>

          {/* Recent Searches Dropdown */}
          {showRecent && recentSearches.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-50 bg-white border-4 border-t-0 border-black shadow-brutal-lg">
              <div className="flex items-center justify-between px-4 py-2 border-b-3 border-black bg-pastel-yellow-100">
                <span className="font-black text-xs uppercase tracking-widest flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Recent Searches
                </span>
                <button
                  onClick={handleClearAllRecent}
                  className="flex items-center gap-1 text-xs font-bold text-neutral-500 hover:text-black transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear all
                </button>
              </div>
              <ul>
                {recentSearches.map((search) => (
                  <li key={search}>
                    <div
                      className="flex items-center justify-between px-4 py-3 hover:bg-pastel-yellow-50 cursor-pointer group border-b border-neutral-100 last:border-0 transition-colors"
                      onClick={() => handleSuggestionSearch(search)}
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-neutral-400 shrink-0" />
                        <span className="font-bold text-sm">{search}</span>
                      </div>
                      <button
                        onClick={(e) => handleRemoveRecent(search, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-black hover:text-white transition-all"
                        aria-label={`Remove "${search}" from recent`}
                      >
                        <X className="w-3 h-3" strokeWidth={3} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ── Advanced Filters ─────────────────────────────────────────────── */}
        <div className="space-y-0">
          {/* Filter Toggle Button */}
          <button
            type="button"
            onClick={() => setFiltersOpen((o) => !o)}
            className={`
              flex items-center gap-3 px-6 py-3.5 border-4 border-black font-black uppercase text-sm tracking-widest
              transition-all duration-150 hover:translate-x-0.5 hover:translate-y-0.5
              ${
                filtersOpen
                  ? "bg-black text-white shadow-brutal-sm"
                  : "bg-pastel-purple-300 text-black shadow-brutal hover:shadow-brutal-sm"
              }
            `}
            aria-expanded={filtersOpen}
          >
            <SlidersHorizontal className="w-4 h-4" strokeWidth={2.5} />
            Filters
            {activeFilterCount > 0 && (
              <span
                className={`
                inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-black border-2
                ${filtersOpen ? "bg-white text-black border-white" : "bg-black text-white border-black"}
              `}
              >
                {activeFilterCount}
              </span>
            )}
            <ChevronDown
              className={`w-4 h-4 ml-auto transition-transform duration-300 ${filtersOpen ? "rotate-180" : ""}`}
              strokeWidth={3}
            />
          </button>

          {/* Filter Panel */}
          <div
            className={`
              overflow-hidden transition-all duration-300 ease-in-out
              ${filtersOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}
            `}
          >
            <div className="bg-pastel-purple-100 border-4 border-t-0 border-black shadow-brutal p-6 space-y-6">
              {/* Genres */}
              <div className="space-y-3">
                <p className="font-black text-sm uppercase tracking-widest text-black/70">
                  Genres
                </p>
                <div className="flex flex-wrap gap-2">
                  {GENRES.map((genre, i) => (
                    <GenreChip
                      key={genre}
                      genre={genre}
                      selected={filters.genres.includes(genre)}
                      colorClass={
                        GENRE_COLORS[i % GENRE_COLORS.length] ??
                        "bg-pastel-blue-300"
                      }
                      onToggle={handleGenreToggle}
                    />
                  ))}
                </div>
              </div>

              {/* Format, Status, Sort in a responsive grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FilterRadioGroup
                  label="Format"
                  options={FORMATS}
                  value={filters.format}
                  onChange={(v) => handleFilterChange("format", v)}
                  activeColor="bg-pastel-blue-500"
                />
                <FilterRadioGroup
                  label="Status"
                  options={STATUSES}
                  value={filters.status}
                  onChange={(v) => handleFilterChange("status", v)}
                  activeColor="bg-pastel-mint-500"
                />
                <FilterRadioGroup
                  label="Sort By"
                  options={SORTS}
                  value={filters.sort}
                  onChange={(v) => handleFilterChange("sort", v)}
                  activeColor="bg-pastel-pink-500"
                />
              </div>

              {/* Reset button */}
              {(hasActiveFilters(filters) || filters.sort !== "Popularity") && (
                <div className="pt-2 border-t-3 border-black/20 flex justify-end">
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="flex items-center gap-2 px-4 py-2 bg-white border-3 border-black font-bold text-sm uppercase shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                  >
                    <X className="w-3 h-3" strokeWidth={3} />
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Results Count Strip ─────────────────────────────────────────── */}
        {urlQuery && !isLoading && data && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-pastel-yellow-300 border-3 border-black px-4 py-2 shadow-brutal-sm font-black text-sm uppercase tracking-wider">
              {data.pagination.total.toLocaleString()} results for &ldquo;
              {urlQuery}&rdquo;
            </div>
            {isFetching && (
              <div className="bg-pastel-blue-300 border-3 border-black px-4 py-2 shadow-brutal-sm font-bold text-sm animate-pulse">
                Updating...
              </div>
            )}
          </div>
        )}

        {/* ── Main Content Area ─────────────────────────────────────────────── */}

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {Array.from({ length: PER_PAGE }).map((_, i) => (
              <AnimeCardSkeleton key={i} index={i} />
            ))}
          </div>
        )}

        {/* Results Grid */}
        {!isLoading && showResults && data && data.data.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {data.data.map((anime, i) => (
              <AnimeCard key={anime.id} anime={anime} index={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {showEmpty && (
          <EmptyState query={urlQuery} onGenreClick={handleSuggestionSearch} />
        )}

        {/* Initial State */}
        {showInitial && (
          <InitialState onSuggestionClick={handleSuggestionSearch} />
        )}

        {/* ── Pagination ────────────────────────────────────────────────────── */}
        {!isLoading &&
          showResults &&
          data &&
          data.data.length > 0 &&
          totalPages > 1 && (
            <nav
              aria-label="Search results pagination"
              className="flex items-center justify-center gap-2 flex-wrap pt-8 pb-4"
            >
              {/* Previous */}
              <button
                onClick={() => handlePageChange(urlPage - 1)}
                disabled={urlPage <= 1}
                className={`
                flex items-center gap-1 px-4 py-2 border-3 border-black font-bold text-sm uppercase
                transition-all duration-150
                ${
                  urlPage <= 1
                    ? "opacity-40 cursor-not-allowed bg-neutral-100"
                    : "bg-white shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                }
              `}
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
                Prev
              </button>

              {/* First page + ellipsis */}
              {(pageNumbers[0] ?? 1) > 1 && (
                <>
                  <PageButton
                    page={1}
                    current={urlPage}
                    onClick={handlePageChange}
                  />
                  {(pageNumbers[0] ?? 1) > 2 && (
                    <span className="w-10 h-10 flex items-center justify-center font-black text-black/40">
                      …
                    </span>
                  )}
                </>
              )}

              {/* Page numbers */}
              {pageNumbers.map((n) => (
                <PageButton
                  key={n}
                  page={n}
                  current={urlPage}
                  onClick={handlePageChange}
                />
              ))}

              {/* Last page + ellipsis */}
              {(pageNumbers[pageNumbers.length - 1] ?? totalPages) <
                totalPages && (
                <>
                  {(pageNumbers[pageNumbers.length - 1] ?? totalPages) <
                    totalPages - 1 && (
                    <span className="w-10 h-10 flex items-center justify-center font-black text-black/40">
                      …
                    </span>
                  )}
                  <PageButton
                    page={totalPages}
                    current={urlPage}
                    onClick={handlePageChange}
                  />
                </>
              )}

              {/* Next */}
              <button
                onClick={() => handlePageChange(urlPage + 1)}
                disabled={!data.pagination.hasNextPage}
                className={`
                flex items-center gap-1 px-4 py-2 border-3 border-black font-bold text-sm uppercase
                transition-all duration-150
                ${
                  !data.pagination.hasNextPage
                    ? "opacity-40 cursor-not-allowed bg-neutral-100"
                    : "bg-white shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                }
              `}
                aria-label="Next page"
              >
                Next
                <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </nav>
          )}

        {/* Page info */}
        {!isLoading &&
          showResults &&
          data &&
          data.data.length > 0 &&
          totalPages > 1 && (
            <p className="text-center text-sm font-bold text-neutral-500 pb-8">
              Page {urlPage} of {totalPages.toLocaleString()}
              {data.pagination.total > 0 &&
                ` · ${data.pagination.total.toLocaleString()} total results`}
            </p>
          )}

        {/* Error state (when query is active but error occurred) */}
        {error && (
          <div className="flex flex-col items-center py-16 px-4 text-center space-y-6">
            <Frown className="w-16 h-16 text-black" strokeWidth={1.5} />
            <div>
              <h2 className="text-4xl font-black uppercase">Search failed</h2>
              <p className="text-neutral-600 font-bold mt-2">
                Something went wrong. Please try again.
              </p>
            </div>
            <button
              onClick={() => router.refresh()}
              className="bg-pastel-pink-300 border-4 border-black px-8 py-3 font-black uppercase shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm transition-all"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
