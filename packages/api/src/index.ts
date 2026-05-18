/**
 * AniTube API
 * Modern anime API wrapper using Jikan (MyAnimeList) and AniList
 */

// Export main service
export { AnimeService } from "./services/anime.js";

// Export clients
export { AniListClient } from "./clients/anilist.js";
export { JikanClient } from "./clients/jikan.js";

// Export types
export type {
  // Jikan types
  JikanAnime,
  JikanEpisode,
  JikanPagination,
  JikanResponse,
  // AniList types
  AniListMedia,
  // Unified types
  AnimeInfo,
  EpisodeInfo,
  SearchResult,
  PaginatedResponse,
  APIConfig,
  // Error types
  APIError,
} from "./types/index.js";

// Export utility functions
export {
  mapAniListToAnimeInfo,
  mapAniListToSearchResult,
  mapJikanToAnimeInfo,
  mapJikanToEpisodeInfo,
  getBestTitle,
} from "./utils/mappers.js";

// Create and export a default instance
import { AnimeService } from "./services/anime.js";
export const animeApi = new AnimeService();
