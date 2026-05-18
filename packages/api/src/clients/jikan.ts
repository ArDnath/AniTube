/**
 * Jikan API Client
 * Documentation: https://docs.api.jikan.moe/
 */

import type {
  JikanAnime,
  JikanEpisode,
  JikanResponse,
  APIError,
} from "../types/index.js";

export class JikanClient {
  private baseUrl: string;
  private requestQueue: Promise<unknown>[] = [];
  private readonly rateLimit = 3; // 3 requests per second for Jikan v4
  private readonly rateLimitWindow = 1000; // 1 second

  constructor(baseUrl = "https://api.jikan.moe/v4") {
    this.baseUrl = baseUrl;
  }

  /**
   * Rate limiting wrapper for fetch requests
   */
  private async throttledFetch<T>(url: string): Promise<T> {
    // Remove completed promises from queue
    this.requestQueue = this.requestQueue.filter((p) => {
      // Check if promise is still pending
      return p !== Promise.resolve();
    });

    // If we've hit rate limit, wait
    if (this.requestQueue.length >= this.rateLimit) {
      await Promise.race(this.requestQueue);
    }

    const request = (async () => {
      try {
        const response = await fetch(url, {
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          const error: APIError = new Error(
            `Jikan API error: ${response.status} ${response.statusText}`,
          ) as APIError;
          error.statusCode = response.status;
          error.provider = "jikan";
          throw error;
        }

        return (await response.json()) as T;
      } finally {
        // Wait for rate limit window
        await new Promise((resolve) =>
          setTimeout(resolve, this.rateLimitWindow),
        );
      }
    })();

    this.requestQueue.push(request);
    return request;
  }

  /**
   * Get anime by MAL ID
   */
  async getAnimeById(malId: number): Promise<JikanAnime> {
    const url = `${this.baseUrl}/anime/${malId}/full`;
    const response = await this.throttledFetch<JikanResponse<JikanAnime>>(url);
    return response.data;
  }

  /**
   * Search anime
   */
  async searchAnime(
    query: string,
    options?: {
      page?: number;
      limit?: number;
      type?: "tv" | "movie" | "ova" | "special" | "ona" | "music";
      status?: "airing" | "complete" | "upcoming";
      rating?: "g" | "pg" | "pg13" | "r17" | "r" | "rx";
      order_by?:
        | "mal_id"
        | "title"
        | "start_date"
        | "end_date"
        | "episodes"
        | "score"
        | "scored_by"
        | "rank"
        | "popularity"
        | "members"
        | "favorites";
      sort?: "asc" | "desc";
    },
  ): Promise<JikanResponse<JikanAnime[]>> {
    const params = new URLSearchParams({
      q: query,
      page: options?.page?.toString() || "1",
      limit: options?.limit?.toString() || "25",
      ...(options?.type && { type: options.type }),
      ...(options?.status && { status: options.status }),
      ...(options?.rating && { rating: options.rating }),
      ...(options?.order_by && { order_by: options.order_by }),
      ...(options?.sort && { sort: options.sort }),
    });

    const url = `${this.baseUrl}/anime?${params.toString()}`;
    return this.throttledFetch<JikanResponse<JikanAnime[]>>(url);
  }

  /**
   * Get episodes for an anime
   */
  async getAnimeEpisodes(
    malId: number,
    page = 1,
  ): Promise<JikanResponse<JikanEpisode[]>> {
    const url = `${this.baseUrl}/anime/${malId}/episodes?page=${page}`;
    return this.throttledFetch<JikanResponse<JikanEpisode[]>>(url);
  }

  /**
   * Get a specific episode
   */
  async getAnimeEpisode(
    malId: number,
    episodeNumber: number,
  ): Promise<JikanEpisode> {
    const url = `${this.baseUrl}/anime/${malId}/episodes/${episodeNumber}`;
    const response =
      await this.throttledFetch<JikanResponse<JikanEpisode>>(url);
    return response.data;
  }

  /**
   * Get top anime
   */
  async getTopAnime(options?: {
    page?: number;
    limit?: number;
    type?: "tv" | "movie" | "ova" | "special" | "ona" | "music";
    filter?: "airing" | "upcoming" | "bypopularity" | "favorite";
  }): Promise<JikanResponse<JikanAnime[]>> {
    const params = new URLSearchParams({
      page: options?.page?.toString() || "1",
      limit: options?.limit?.toString() || "25",
      ...(options?.type && { type: options.type }),
      ...(options?.filter && { filter: options.filter }),
    });

    const url = `${this.baseUrl}/top/anime?${params.toString()}`;
    return this.throttledFetch<JikanResponse<JikanAnime[]>>(url);
  }

  /**
   * Get seasonal anime
   */
  async getSeasonalAnime(
    year: number,
    season: "winter" | "spring" | "summer" | "fall",
    page = 1,
  ): Promise<JikanResponse<JikanAnime[]>> {
    const url = `${this.baseUrl}/seasons/${year}/${season}?page=${page}`;
    return this.throttledFetch<JikanResponse<JikanAnime[]>>(url);
  }

  /**
   * Get current season anime
   */
  async getCurrentSeason(page = 1): Promise<JikanResponse<JikanAnime[]>> {
    const url = `${this.baseUrl}/seasons/now?page=${page}`;
    return this.throttledFetch<JikanResponse<JikanAnime[]>>(url);
  }

  /**
   * Get upcoming season anime
   */
  async getUpcomingSeason(page = 1): Promise<JikanResponse<JikanAnime[]>> {
    const url = `${this.baseUrl}/seasons/upcoming?page=${page}`;
    return this.throttledFetch<JikanResponse<JikanAnime[]>>(url);
  }

  /**
   * Get anime by genre
   */
  async getAnimeByGenre(
    genreId: number,
    page = 1,
  ): Promise<JikanResponse<JikanAnime[]>> {
    const url = `${this.baseUrl}/anime?genres=${genreId}&page=${page}`;
    return this.throttledFetch<JikanResponse<JikanAnime[]>>(url);
  }

  /**
   * Get anime recommendations
   */
  async getAnimeRecommendations(malId: number): Promise<
    JikanResponse<
      Array<{
        entry: Pick<JikanAnime, "mal_id" | "url" | "images" | "title">;
        url: string;
        votes: number;
      }>
    >
  > {
    const url = `${this.baseUrl}/anime/${malId}/recommendations`;
    return this.throttledFetch(url);
  }
}
