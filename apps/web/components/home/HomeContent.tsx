"use client";

import { useQuery } from "@tanstack/react-query";
import { animeApi } from "@anitube/api";
import { HeroSection } from "./HeroSection";
import { AnimeSection } from "./AnimeSection";

export function HomeContent() {
  // Fetch trending anime
  const {
    data: trendingData,
    isLoading: isTrendingLoading,
  } = useQuery({
    queryKey: ["trending"],
    queryFn: () => animeApi.getTrending(1, 12),
  });

  // Fetch popular anime
  const {
    data: popularData,
    isLoading: isPopularLoading,
  } = useQuery({
    queryKey: ["popular"],
    queryFn: () => animeApi.getPopular(1, 12),
  });

  // Fetch current season anime
  const {
    data: seasonData,
    isLoading: isSeasonLoading,
  } = useQuery({
    queryKey: ["currentSeason"],
    queryFn: () => animeApi.getCurrentSeason(1, 12),
  });

  // Fetch top anime
  const {
    data: topData,
    isLoading: isTopLoading,
  } = useQuery({
    queryKey: ["topAnime"],
    queryFn: () => animeApi.getTopAnime({ page: 1, limit: 12 }),
  });

  // Use first trending anime as hero
  const heroAnime = trendingData?.data[0] || null;
  const trendingAnime = trendingData?.data.slice(1, 12) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <HeroSection anime={heroAnime} />

      {/* Trending Section */}
      <AnimeSection
        title="🔥 Trending Now"
        anime={trendingAnime}
        viewAllHref="/trending"
        isLoading={isTrendingLoading}
      />

      {/* Popular Section */}
      <AnimeSection
        title="⭐ Popular This Season"
        anime={seasonData?.data || []}
        viewAllHref="/season"
        isLoading={isSeasonLoading}
      />

      {/* Top Rated Section */}
      <AnimeSection
        title="🏆 Top Rated"
        anime={topData?.data || []}
        viewAllHref="/top"
        isLoading={isTopLoading}
      />

      {/* All Time Popular */}
      <AnimeSection
        title="💎 All Time Popular"
        anime={popularData?.data || []}
        viewAllHref="/popular"
        isLoading={isPopularLoading}
      />
    </div>
  );
}
