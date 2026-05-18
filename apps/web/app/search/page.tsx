import type { Metadata } from "next";
import { Suspense } from "react";
import SearchContent from "./SearchContent";
import SearchLoading from "./loading";

// ─────────────────────────────────────────────────────────────────────────────
// Metadata — dynamic based on ?q= search param (Next.js 15 async searchParams)
// ─────────────────────────────────────────────────────────────────────────────
interface Props {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q?.trim();

  const title = query
    ? `Search: "${query}" | AniTube`
    : "Search Anime | AniTube";

  const description = query
    ? `Search results for "${query}" on AniTube — find anime by genre, format, and more.`
    : "Search thousands of anime titles on AniTube. Filter by genre, format, status and discover your next favourite series.";

  return {
    title,
    description,
    keywords: [
      "anime search",
      "find anime",
      "anime database",
      ...(query ? [query, `${query} anime`, `watch ${query}`] : []),
      "watch anime online",
      "anime streaming",
    ],
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "AniTube",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    robots: {
      index: !query,   // Don't index paginated/search-query pages
      follow: true,
    },
    alternates: {
      canonical: query ? `/search?q=${encodeURIComponent(query)}` : "/search",
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Page — server component wrapper; Suspense is required for useSearchParams()
// ─────────────────────────────────────────────────────────────────────────────
export default async function SearchPage({ searchParams }: Props) {
  // Await params so they're available for the Suspense key (helps streaming SSR)
  const { q } = await searchParams;

  return (
    // The key forces a fresh client-tree when the query changes server-side
    // (e.g. direct navigation), giving the input the right initial value.
    <Suspense key={q ?? "__empty__"} fallback={<SearchLoading />}>
      <SearchContent />
    </Suspense>
  );
}
