/**
 * AniList GraphQL Client
 * Documentation: https://anilist.gitbook.io/anilist-apiv2-docs/
 */

import { GraphQLClient } from "graphql-request";
import { gql } from "graphql-tag";
import type { AniListMedia, APIError } from "../types/index.js";

interface PageInfo {
  total: number;
  currentPage: number;
  lastPage: number;
  hasNextPage: boolean;
  perPage: number;
}

interface MediaConnection {
  edges: Array<{ node: AniListMedia }>;
  pageInfo: PageInfo;
}

export class AniListClient {
  private client: GraphQLClient;

  constructor(endpoint = "https://graphql.anilist.co") {
    this.client = new GraphQLClient(endpoint, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }

  /**
   * Get anime by AniList ID
   */
  async getAnimeById(id: number): Promise<AniListMedia> {
    const query = gql`
      query ($id: Int) {
        Media(id: $id, type: ANIME) {
          id
          idMal
          title {
            romaji
            english
            native
          }
          coverImage {
            extraLarge
            large
            medium
            color
          }
          bannerImage
          startDate {
            year
            month
            day
          }
          endDate {
            year
            month
            day
          }
          description
          season
          seasonYear
          type
          format
          status
          episodes
          duration
          countryOfOrigin
          isLicensed
          source
          hashtag
          trailer {
            id
            site
            thumbnail
          }
          updatedAt
          genres
          synonyms
          averageScore
          meanScore
          popularity
          trending
          favourites
          tags {
            id
            name
            description
            category
            rank
            isGeneralSpoiler
            isMediaSpoiler
            isAdult
          }
          relations {
            edges {
              id
              relationType
              node {
                id
                title {
                  romaji
                  english
                }
                coverImage {
                  large
                }
                type
                format
              }
            }
          }
          characters(sort: ROLE, perPage: 10) {
            edges {
              id
              role
              node {
                id
                name {
                  full
                  native
                }
                image {
                  large
                  medium
                }
              }
            }
          }
          studios {
            edges {
              id
              isMain
              node {
                id
                name
                siteUrl
              }
            }
          }
          streamingEpisodes {
            title
            thumbnail
            url
            site
          }
        }
      }
    `;

    try {
      const data = await this.client.request<{ Media: AniListMedia }>(query, {
        id,
      });
      return data.Media;
    } catch (error) {
      const apiError: APIError = new Error(
        `AniList API error: ${error instanceof Error ? error.message : "Unknown error"}`,
      ) as APIError;
      apiError.provider = "anilist";
      throw apiError;
    }
  }

  /**
   * Search anime
   */
  async searchAnime(
    search: string,
    options?: {
      page?: number;
      perPage?: number;
      sort?: string[];
      genres?: string[];
      season?: "WINTER" | "SPRING" | "SUMMER" | "FALL";
      seasonYear?: number;
      format?: string;
      status?: string;
    },
  ): Promise<{ media: AniListMedia[]; pageInfo: PageInfo }> {
    const query = gql`
      query (
        $search: String
        $page: Int
        $perPage: Int
        $sort: [MediaSort]
        $genres: [String]
        $season: MediaSeason
        $seasonYear: Int
        $format: MediaFormat
        $status: MediaStatus
      ) {
        Page(page: $page, perPage: $perPage) {
          pageInfo {
            total
            currentPage
            lastPage
            hasNextPage
            perPage
          }
          media(
            search: $search
            type: ANIME
            sort: $sort
            genre_in: $genres
            season: $season
            seasonYear: $seasonYear
            format: $format
            status: $status
          ) {
            id
            idMal
            title {
              romaji
              english
              native
            }
            coverImage {
              extraLarge
              large
              medium
              color
            }
            bannerImage
            startDate {
              year
              month
              day
            }
            endDate {
              year
              month
              day
            }
            description
            season
            seasonYear
            type
            format
            status
            episodes
            duration
            genres
            averageScore
            meanScore
            popularity
            trending
            favourites
            studios(isMain: true) {
              edges {
                node {
                  name
                }
              }
            }
          }
        }
      }
    `;

    try {
      const variables = {
        search,
        page: options?.page || 1,
        perPage: options?.perPage || 20,
        sort: options?.sort || ["POPULARITY_DESC", "SCORE_DESC"],
        ...(options?.genres && { genres: options.genres }),
        ...(options?.season && { season: options.season }),
        ...(options?.seasonYear && { seasonYear: options.seasonYear }),
        ...(options?.format && { format: options.format }),
        ...(options?.status && { status: options.status }),
      };

      const data = await this.client.request<{
        Page: { media: AniListMedia[]; pageInfo: PageInfo };
      }>(query, variables);

      return {
        media: data.Page.media,
        pageInfo: data.Page.pageInfo,
      };
    } catch (error) {
      const apiError: APIError = new Error(
        `AniList API error: ${error instanceof Error ? error.message : "Unknown error"}`,
      ) as APIError;
      apiError.provider = "anilist";
      throw apiError;
    }
  }

  /**
   * Get trending anime
   */
  async getTrending(
    page = 1,
    perPage = 20,
  ): Promise<{ media: AniListMedia[]; pageInfo: PageInfo }> {
    const query = gql`
      query ($page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          pageInfo {
            total
            currentPage
            lastPage
            hasNextPage
            perPage
          }
          media(type: ANIME, sort: TRENDING_DESC) {
            id
            idMal
            title {
              romaji
              english
              native
            }
            coverImage {
              extraLarge
              large
              medium
              color
            }
            bannerImage
            startDate {
              year
              month
              day
            }
            description
            season
            seasonYear
            format
            status
            episodes
            genres
            averageScore
            popularity
            trending
          }
        }
      }
    `;

    try {
      const data = await this.client.request<{
        Page: { media: AniListMedia[]; pageInfo: PageInfo };
      }>(query, { page, perPage });

      return {
        media: data.Page.media,
        pageInfo: data.Page.pageInfo,
      };
    } catch (error) {
      const apiError: APIError = new Error(
        `AniList API error: ${error instanceof Error ? error.message : "Unknown error"}`,
      ) as APIError;
      apiError.provider = "anilist";
      throw apiError;
    }
  }

  /**
   * Get popular anime
   */
  async getPopular(
    page = 1,
    perPage = 20,
  ): Promise<{ media: AniListMedia[]; pageInfo: PageInfo }> {
    const query = gql`
      query ($page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          pageInfo {
            total
            currentPage
            lastPage
            hasNextPage
            perPage
          }
          media(type: ANIME, sort: POPULARITY_DESC) {
            id
            idMal
            title {
              romaji
              english
              native
            }
            coverImage {
              extraLarge
              large
              medium
              color
            }
            bannerImage
            startDate {
              year
              month
              day
            }
            description
            season
            seasonYear
            format
            status
            episodes
            genres
            averageScore
            popularity
          }
        }
      }
    `;

    try {
      const data = await this.client.request<{
        Page: { media: AniListMedia[]; pageInfo: PageInfo };
      }>(query, { page, perPage });

      return {
        media: data.Page.media,
        pageInfo: data.Page.pageInfo,
      };
    } catch (error) {
      const apiError: APIError = new Error(
        `AniList API error: ${error instanceof Error ? error.message : "Unknown error"}`,
      ) as APIError;
      apiError.provider = "anilist";
      throw apiError;
    }
  }

  /**
   * Get seasonal anime
   */
  async getSeasonalAnime(
    season: "WINTER" | "SPRING" | "SUMMER" | "FALL",
    year: number,
    page = 1,
    perPage = 20,
  ): Promise<{ media: AniListMedia[]; pageInfo: PageInfo }> {
    return this.searchAnime("", {
      page,
      perPage,
      season,
      seasonYear: year,
      sort: ["POPULARITY_DESC"],
    });
  }

  /**
   * Get anime by genre
   */
  async getAnimeByGenre(
    genre: string,
    page = 1,
    perPage = 20,
  ): Promise<{ media: AniListMedia[]; pageInfo: PageInfo }> {
    return this.searchAnime("", {
      page,
      perPage,
      genres: [genre],
      sort: ["POPULARITY_DESC"],
    });
  }
}
