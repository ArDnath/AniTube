# @anitube/api

Modern TypeScript API wrapper for anime data, combining **Jikan (MyAnimeList API)** and **AniList GraphQL API**.

## Features

- 🚀 Modern TypeScript with full type safety
- 📊 Combines AniList and Jikan APIs
- 🎯 Unified data format across providers
- ⚡ Built-in rate limiting
- 🔄 Automatic retries and error handling
- 📦 ES Module support
- 🎨 Clean, consistent API

## Installation

This package is part of the AniTube monorepo. Install dependencies:

```bash
pnpm install
```

## Build

```bash
pnpm build
```

## Usage

### Basic Usage

```typescript
import { animeApi } from "@anitube/api";

// Search for anime
const results = await animeApi.searchAnime("Naruto");
console.log(results.data); // Array of SearchResult

// Get anime details by AniList ID
const anime = await animeApi.getAnimeById(1);
console.log(anime.title.english);

// Get anime by MAL ID
const malAnime = await animeApi.getAnimeById(1, "mal");

// Get trending anime
const trending = await animeApi.getTrending();

// Get popular anime
const popular = await animeApi.getPopular();

// Get current season anime
const currentSeason = await animeApi.getCurrentSeason();

// Get specific season anime
const winterAnime = await animeApi.getSeasonalAnime("WINTER", 2024);

// Get anime by genre
const actionAnime = await animeApi.getAnimeByGenre("Action");

// Get episodes (requires MAL ID)
const episodes = await animeApi.getEpisodes(1);

// Get specific episode
const episode = await animeApi.getEpisode(1, 1);

// Get recommendations
const recommendations = await animeApi.getRecommendations(1);
```

### Custom Configuration

```typescript
import { AnimeService } from "@anitube/api";

const customApi = new AnimeService({
  aniListEndpoint: "https://graphql.anilist.co",
  jikanEndpoint: "https://api.jikan.moe/v4",
  rateLimit: {
    requestsPerMinute: 60,
  },
});
```

### Using Individual Clients

```typescript
import { AniListClient, JikanClient } from "@anitube/api";

// Use AniList client directly
const anilist = new AniListClient();
const media = await anilist.getAnimeById(1);

// Use Jikan client directly
const jikan = new JikanClient();
const anime = await jikan.getAnimeById(1);
const topAnime = await jikan.getTopAnime({ type: "tv", filter: "airing" });
```

## API Reference

### AnimeService

Main service that combines both APIs.

#### Methods

- `getAnimeById(id, provider?)` - Get anime by ID (default: AniList)
- `searchAnime(query, options?)` - Search for anime
- `getTrending(page?, perPage?)` - Get trending anime
- `getPopular(page?, perPage?)` - Get popular anime
- `getTopAnime(options?)` - Get top anime from MAL
- `getSeasonalAnime(season, year, page?, perPage?)` - Get seasonal anime
- `getCurrentSeason(page?, perPage?)` - Get current season anime
- `getAnimeByGenre(genre, page?, perPage?)` - Get anime by genre
- `getEpisodes(malId, page?)` - Get episodes (requires MAL ID)
- `getEpisode(malId, episodeNumber)` - Get specific episode
- `getRecommendations(malId)` - Get recommendations

### Types

#### AnimeInfo

Unified anime information format:

```typescript
interface AnimeInfo {
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
```

#### SearchResult

Simplified format for search results:

```typescript
interface SearchResult {
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
```

#### EpisodeInfo

Episode information:

```typescript
interface EpisodeInfo {
  number: number;
  title: string | null;
  aired: string | null;
  duration: number | null;
  filler: boolean;
  recap: boolean;
  synopsis: string | null;
}
```

## Rate Limiting

- **Jikan API**: 3 requests per second (automatically handled)
- **AniList**: 90 requests per minute (monitored server-side)

The library automatically handles rate limiting for Jikan. For AniList, the server monitors usage.

## Error Handling

```typescript
import { animeApi, APIError } from "@anitube/api";

try {
  const anime = await animeApi.getAnimeById(999999);
} catch (error) {
  if (error instanceof Error && "provider" in error) {
    const apiError = error as APIError;
    console.error(`Error from ${apiError.provider}:`, apiError.message);
    console.error("Status code:", apiError.statusCode);
  }
}
```

## Examples

### Get Anime with Full Details

```typescript
const anime = await animeApi.getAnimeById(1, "anilist");
console.log(`Title: ${anime.title.english || anime.title.romaji}`);
console.log(`Score: ${anime.averageScore}`);
console.log(`Genres: ${anime.genres.join(", ")}`);
console.log(`Studios: ${anime.studios.join(", ")}`);
```

### Search with Filters

```typescript
const results = await animeApi.searchAnime("Attack on Titan", {
  page: 1,
  perPage: 10,
  genres: ["Action", "Drama"],
  season: "SPRING",
  seasonYear: 2013,
  status: "FINISHED",
});

for (const anime of results.data) {
  console.log(anime.title.english || anime.title.romaji);
}
```

### Get Current Season's Popular Anime

```typescript
const currentSeason = await animeApi.getCurrentSeason(1, 25);
const sortedByScore = currentSeason.data.sort(
  (a, b) => (b.averageScore || 0) - (a.averageScore || 0),
);
```

## License

AGPL-3.0-only

## Author

Ariyaman Debnath <ariyamandebnath.ad@gmail.com>
