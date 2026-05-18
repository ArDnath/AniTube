/**
 * Common types for the AniTube API
 */

// Jikan API Types
export interface JikanAnime {
  mal_id: number;
  url: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  trailer: {
    youtube_id: string | null;
    url: string | null;
    embed_url: string | null;
  };
  approved: boolean;
  titles: Array<{
    type: string;
    title: string;
  }>;
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  title_synonyms: string[];
  type: "TV" | "Movie" | "OVA" | "Special" | "ONA" | "Music" | null;
  source: string | null;
  episodes: number | null;
  status: "Finished Airing" | "Currently Airing" | "Not yet aired";
  airing: boolean;
  aired: {
    from: string | null;
    to: string | null;
    prop: {
      from: { day: number | null; month: number | null; year: number | null };
      to: { day: number | null; month: number | null; year: number | null };
    };
    string: string;
  };
  duration: string | null;
  rating: string | null;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  members: number | null;
  favorites: number | null;
  synopsis: string | null;
  background: string | null;
  season: "winter" | "spring" | "summer" | "fall" | null;
  year: number | null;
  broadcast: {
    day: string | null;
    time: string | null;
    timezone: string | null;
    string: string | null;
  };
  producers: Array<{ mal_id: number; type: string; name: string; url: string }>;
  licensors: Array<{ mal_id: number; type: string; name: string; url: string }>;
  studios: Array<{ mal_id: number; type: string; name: string; url: string }>;
  genres: Array<{ mal_id: number; type: string; name: string; url: string }>;
  explicit_genres: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  themes: Array<{ mal_id: number; type: string; name: string; url: string }>;
  demographics: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
}

export interface JikanEpisode {
  mal_id: number;
  url: string;
  title: string;
  title_japanese: string | null;
  title_romanji: string | null;
  duration: number | null;
  aired: string | null;
  filler: boolean;
  recap: boolean;
  synopsis: string | null;
}

export interface JikanPagination {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: {
    count: number;
    total: number;
    per_page: number;
  };
}

export interface JikanResponse<T> {
  data: T;
  pagination?: JikanPagination;
}

// AniList GraphQL Types
export interface AniListMedia {
  id: number;
  idMal: number | null;
  title: {
    romaji: string | null;
    english: string | null;
    native: string | null;
  };
  coverImage: {
    extraLarge: string;
    large: string;
    medium: string;
    color: string | null;
  };
  bannerImage: string | null;
  startDate: {
    year: number | null;
    month: number | null;
    day: number | null;
  };
  endDate: {
    year: number | null;
    month: number | null;
    day: number | null;
  };
  description: string | null;
  season: "WINTER" | "SPRING" | "SUMMER" | "FALL" | null;
  seasonYear: number | null;
  type: "ANIME" | "MANGA";
  format:
    | "TV"
    | "TV_SHORT"
    | "MOVIE"
    | "SPECIAL"
    | "OVA"
    | "ONA"
    | "MUSIC"
    | null;
  status:
    | "FINISHED"
    | "RELEASING"
    | "NOT_YET_RELEASED"
    | "CANCELLED"
    | "HIATUS"
    | null;
  episodes: number | null;
  duration: number | null;
  chapters: number | null;
  volumes: number | null;
  countryOfOrigin: string;
  isLicensed: boolean;
  source: string | null;
  hashtag: string | null;
  trailer: {
    id: string | null;
    site: string | null;
    thumbnail: string | null;
  } | null;
  updatedAt: number;
  genres: string[];
  synonyms: string[];
  averageScore: number | null;
  meanScore: number | null;
  popularity: number;
  trending: number;
  favourites: number;
  tags: Array<{
    id: number;
    name: string;
    description: string;
    category: string;
    rank: number;
    isGeneralSpoiler: boolean;
    isMediaSpoiler: boolean;
    isAdult: boolean;
  }>;
  relations: {
    edges: Array<{
      id: number;
      relationType: string;
      node: Partial<AniListMedia>;
    }>;
  };
  characters: {
    edges: Array<{
      id: number;
      role: string;
      node: {
        id: number;
        name: {
          full: string;
          native: string | null;
        };
        image: {
          large: string;
          medium: string;
        };
      };
    }>;
  };
  studios: {
    edges: Array<{
      id: number;
      isMain: boolean;
      node: {
        id: number;
        name: string;
        siteUrl: string;
      };
    }>;
  };
  streamingEpisodes: Array<{
    title: string | null;
    thumbnail: string | null;
    url: string | null;
    site: string | null;
  }>;
}

// Unified Anime Types
export interface AnimeInfo {
  id: number;
  malId: number | null;
  title: {
    english: string | null;
    romaji: string | null;
    native: string | null;
  };
  description: string | null;
  coverImage: string;
  bannerImage: string | null;
  genres: string[];
  episodes: number | null;
  status: string;
  season: string | null;
  seasonYear: number | null;
  averageScore: number | null;
  popularity: number;
  type: string | null;
  format: string | null;
  startDate: string | null;
  endDate: string | null;
  studios: string[];
  trailer: {
    id: string | null;
    site: string | null;
    url: string | null;
  } | null;
}

export interface EpisodeInfo {
  number: number;
  title: string | null;
  aired: string | null;
  duration: number | null;
  filler: boolean;
  recap: boolean;
  synopsis: string | null;
}

export interface SearchResult {
  id: number;
  malId: number | null;
  title: {
    english: string | null;
    romaji: string | null;
    native: string | null;
  };
  coverImage: string;
  type: string | null;
  episodes: number | null;
  status: string;
  averageScore: number | null;
  popularity: number;
  season: string | null;
  year: number | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    hasNextPage: boolean;
    total: number;
  };
}

// API Config
export interface APIConfig {
  aniListEndpoint?: string;
  jikanEndpoint?: string;
  rateLimit?: {
    requestsPerMinute: number;
  };
}

// Error Types
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public provider?: "anilist" | "jikan",
  ) {
    super(message);
    this.name = "APIError";
  }
}
