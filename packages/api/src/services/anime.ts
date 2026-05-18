/**
 * Main Anime Service
 * Combines AniList and Jikan APIs
 */

import { AniListClient } from "../clients/anilist.js";
import { JikanClient } from "../clients/jikan.js";
import {
  mapAniListToAnimeInfo,
  mapAniListToSearchResult,
  mapJikanToAnimeInfo,
  mapJikanToEpisodeInfo,
} from "../utils/mappers.js";
import type {
  AnimeInfo,
  EpisodeInfo,
  SearchResult,
  PaginatedResponse,
  APIConfig,
} from "../types/index.js";

export class AnimeService {
  private aniListClient: AniListClient;
  private jikanClient: JikanClient;

  constructor(config?: APIConfig) {
    this.aniListClient = new AniListClient(config?.aniListEndpoint);
    this.jikanClient = new JikanClient(config?.jikanEndpoint);
  }

  /**
   * Get anime by AniList ID
   */
  async getAnimeById(
    id: number,
    provider: "anilist" | "mal" = "anilist",
  ): Promise<AnimeInfo> {
    if (provider === "anilist") {
      const media = await this.aniListClient.getAnimeById(id);
      return mapAniListToAnimeInfo(media);
    } else {
      const anime = await this.jikanClient.getAnimeById(id);
      return mapJikanToAnimeInfo(anime);
    }
  }

  /**
   * Search anime across both APIs (primarily uses AniList)
   */
  async searchAnime(
    query: string,
    options?: {
      page?: number;
      perPage?: number;
      genres?: string[];
      season?: "WINTER" | "SPRING" | "SUMMER" | "FALL";
      seasonYear?: number;
      format?: string;
      status?: string;
    },
  ): Promise<PaginatedResponse<SearchResult>> {
    const result = await this.aniListClient.searchAnime(query, options);

    return {
      data: result.media.map(mapAniListToSearchResult),
      pagination: {
        currentPage: result.pageInfo.currentPage,
        hasNextPage: result.pageInfo.hasNextPage,
        total: result.pageInfo.total,
      },
    };
  }

  /**
   * Get trending anime
   */
  async getTrending(
    page = 1,
    perPage = 20,
  ): Promise<PaginatedResponse<SearchResult>> {
    const result = await this.aniListClient.getTrending(page, perPage);

    return {
      data: result.media.map(mapAniListToSearchResult),
      pagination: {
        currentPage: result.pageInfo.currentPage,
        hasNextPage: result.pageInfo.hasNextPage,
        total: result.pageInfo.total,
      },
    };
  }

  /**
   * Get popular anime
   */
  async getPopular(
    page = 1,
    perPage = 20,
  ): Promise<PaginatedResponse<SearchResult>> {
    const result = await this.aniListClient.getPopular(page, perPage);

    return {
      data: result.media.map(mapAniListToSearchResult),
      pagination: {
        currentPage: result.pageInfo.currentPage,
        hasNextPage: result.pageInfo.hasNextPage,
        total: result.pageInfo.total,
      },
    };
  }

  /**
   * Get top anime from MAL
   */
  async getTopAnime(options?: {
    page?: number;
    limit?: number;
    type?: "tv" | "movie" | "ova" | "special" | "ona" | "music";
    filter?: "airing" | "upcoming" | "bypopularity" | "favorite";
  }): Promise<PaginatedResponse<SearchResult>> {
    const result = await this.jikanClient.getTopAnime(options);

    return {
      data: result.data.map((anime) => ({
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
      })),
      pagination: {
        currentPage: result.pagination?.current_page || 1,
        hasNextPage: result.pagination?.has_next_page || false,
        total: result.pagination?.items.total || 0,
      },
    };
  }

  /**
   * Get seasonal anime
   */
  async getSeasonalAnime(
    season: "WINTER" | "SPRING" | "SUMMER" | "FALL",
    year: number,
    page = 1,
    perPage = 20,
  ): Promise<PaginatedResponse<SearchResult>> {
    const result = await this.aniListClient.getSeasonalAnime(
      season,
      year,
      page,
      perPage,
    );

    return {
      data: result.media.map(mapAniListToSearchResult),
      pagination: {
        currentPage: result.pageInfo.currentPage,
        hasNextPage: result.pageInfo.hasNextPage,
        total: result.pageInfo.total,
      },
    };
  }

  /**
   * Get current season anime
   */
  async getCurrentSeason(
    page = 1,
    perPage = 20,
  ): Promise<PaginatedResponse<SearchResult>> {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    let season: "WINTER" | "SPRING" | "SUMMER" | "FALL";
    if (month >= 1 && month <= 3) {
      season = "WINTER";
    } else if (month >= 4 && month <= 6) {
      season = "SPRING";
    } else if (month >= 7 && month <= 9) {
      season = "SUMMER";
    } else {
      season = "FALL";
    }

    return this.getSeasonalAnime(season, year, page, perPage);
  }

  /**
   * Get anime by genre
   */
  async getAnimeByGenre(
    genre: string,
    page = 1,
    perPage = 20,
  ): Promise<PaginatedResponse<SearchResult>> {
    const result = await this.aniListClient.getAnimeByGenre(
      genre,
      page,
      perPage,
    );

    return {
      data: result.media.map(mapAniListToSearchResult),
      pagination: {
        currentPage: result.pageInfo.currentPage,
        hasNextPage: result.pageInfo.hasNextPage,
        total: result.pageInfo.total,
      },
    };
  }

  /**
   * Get episodes for an anime (from MAL via Jikan)
   */
  async getEpisodes(
    malId: number,
    page = 1,
  ): Promise<PaginatedResponse<EpisodeInfo>> {
    const result = await this.jikanClient.getAnimeEpisodes(malId, page);

    return {
      data: result.data.map(mapJikanToEpisodeInfo),
      pagination: {
        currentPage: result.pagination?.current_page || 1,
        hasNextPage: result.pagination?.has_next_page || false,
        total: result.pagination?.items.total || 0,
      },
    };
  }

  /**
   * Get a specific episode
   */
  async getEpisode(malId: number, episodeNumber: number): Promise<EpisodeInfo> {
    const episode = await this.jikanClient.getAnimeEpisode(
      malId,
      episodeNumber,
    );
    return mapJikanToEpisodeInfo(episode);
  }

  /**
   * Get anime recommendations
   */
  async getRecommendations(malId: number): Promise<SearchResult[]> {
    const result = await this.jikanClient.getAnimeRecommendations(malId);

    return result.data.map((rec) => ({
      id: rec.entry.mal_id,
      malId: rec.entry.mal_id,
      title: {
        english: null,
        romaji: rec.entry.title,
        native: null,
      },
      coverImage:
        rec.entry.images.webp.image_url || rec.entry.images.jpg.image_url,
      type: null,
      episodes: null,
      status: "UNKNOWN",
      averageScore: null,
      popularity: rec.votes,
      season: null,
      year: null,
    }));
  }
}
