/**
 * Utility functions to map between different API formats
 */

import type {
  JikanAnime,
  JikanEpisode,
  AniListMedia,
  AnimeInfo,
  EpisodeInfo,
  SearchResult,
} from "../types/index.js";

/**
 * Map AniList media to unified AnimeInfo format
 */
export function mapAniListToAnimeInfo(media: AniListMedia): AnimeInfo {
  return {
    id: media.id,
    malId: media.idMal,
    title: {
      english: media.title.english,
      romaji: media.title.romaji,
      native: media.title.native,
    },
    description: media.description,
    coverImage: media.coverImage.extraLarge || media.coverImage.large,
    bannerImage: media.bannerImage,
    genres: media.genres,
    episodes: media.episodes,
    status: media.status || "UNKNOWN",
    season: media.season,
    seasonYear: media.seasonYear,
    averageScore: media.averageScore,
    popularity: media.popularity,
    type: media.type,
    format: media.format,
    startDate: formatDate(media.startDate),
    endDate: formatDate(media.endDate),
    studios:
      media.studios?.edges
        .filter((edge) => edge.isMain)
        .map((edge) => edge.node.name) || [],
    trailer: media.trailer
      ? {
          id: media.trailer.id,
          site: media.trailer.site,
          url:
            media.trailer.site === "youtube" && media.trailer.id
              ? `https://www.youtube.com/watch?v=${media.trailer.id}`
              : null,
        }
      : null,
  };
}

/**
 * Map Jikan anime to unified AnimeInfo format
 */
export function mapJikanToAnimeInfo(anime: JikanAnime): AnimeInfo {
  return {
    id: anime.mal_id,
    malId: anime.mal_id,
    title: {
      english: anime.title_english,
      romaji: anime.title,
      native: anime.title_japanese,
    },
    description: anime.synopsis,
    coverImage:
      anime.images.webp.large_image_url || anime.images.jpg.large_image_url,
    bannerImage: null,
    genres: anime.genres.map((g) => g.name),
    episodes: anime.episodes,
    status: anime.status,
    season: anime.season?.toUpperCase() || null,
    seasonYear: anime.year,
    averageScore: anime.score ? anime.score * 10 : null, // Convert to 0-100 scale
    popularity: anime.members || 0,
    type: anime.type,
    format: anime.type,
    startDate: anime.aired.from,
    endDate: anime.aired.to,
    studios: anime.studios.map((s) => s.name),
    trailer: anime.trailer.youtube_id
      ? {
          id: anime.trailer.youtube_id,
          site: "youtube",
          url: anime.trailer.url,
        }
      : null,
  };
}

/**
 * Map AniList media to SearchResult format
 */
export function mapAniListToSearchResult(media: AniListMedia): SearchResult {
  return {
    id: media.id,
    malId: media.idMal,
    title: {
      english: media.title.english,
      romaji: media.title.romaji,
      native: media.title.native,
    },
    coverImage: media.coverImage.large || media.coverImage.medium,
    type: media.type,
    episodes: media.episodes,
    status: media.status || "UNKNOWN",
    averageScore: media.averageScore,
    popularity: media.popularity,
    season: media.season,
    year: media.seasonYear,
  };
}

/**
 * Map Jikan anime to SearchResult format
 */
export function mapJikanToSearchResult(anime: JikanAnime): SearchResult {
  return {
    id: anime.mal_id,
    malId: anime.mal_id,
    title: {
      english: anime.title_english,
      romaji: anime.title,
      native: anime.title_japanese,
    },
    coverImage: anime.images.webp.image_url || anime.images.jpg.image_url,
    type: anime.type,
    episodes: anime.episodes,
    status: anime.status,
    averageScore: anime.score ? anime.score * 10 : null,
    popularity: anime.members || 0,
    season: anime.season?.toUpperCase() || null,
    year: anime.year,
  };
}

/**
 * Map Jikan episode to EpisodeInfo format
 */
export function mapJikanToEpisodeInfo(episode: JikanEpisode): EpisodeInfo {
  return {
    number: episode.mal_id,
    title: episode.title,
    aired: episode.aired,
    duration: episode.duration,
    filler: episode.filler,
    recap: episode.recap,
    synopsis: episode.synopsis,
  };
}

/**
 * Format date from AniList format
 */
function formatDate(date?: {
  year: number | null;
  month: number | null;
  day: number | null;
}): string | null {
  if (!date || !date.year) return null;

  const year = date.year;
  const month = date.month ? String(date.month).padStart(2, "0") : "01";
  const day = date.day ? String(date.day).padStart(2, "0") : "01";

  return `${year}-${month}-${day}`;
}

/**
 * Get the best title from an anime
 */
export function getBestTitle(title: {
  english: string | null;
  romaji: string | null;
  native: string | null;
}): string {
  return title.english || title.romaji || title.native || "Unknown";
}
