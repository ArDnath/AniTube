/**
 * Application constants and configuration
 */

export const APP_NAME = 'AniTube';
export const APP_DESCRIPTION = 'Modern anime streaming platform with a beautiful neu-brutalism design';

// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.jikan.moe/v4';
export const ANILIST_API_URL = 'https://graphql.anilist.co';

// Pagination
export const DEFAULT_PAGE_SIZE = 24;
export const MAX_PAGE_SIZE = 100;

// Video Player
export const DEFAULT_VIDEO_QUALITY = 'auto';
export const AVAILABLE_QUALITIES = ['auto', '1080p', '720p', '480p', '360p'];
export const PLAYBACK_RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

// UI
export const SIDEBAR_WIDTH = 280;
export const HEADER_HEIGHT = 64;

// Routes
export const ROUTES = {
  HOME: '/',
  BROWSE: '/browse',
  SEARCH: '/search',
  ANIME: (id: string | number) => `/anime/${id}`,
  WATCH: (id: string | number, episode: string | number) => `/anime/${id}/watch/${episode}`,
  FAVORITES: '/favorites',
  HISTORY: '/history',
  SETTINGS: '/settings',
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  THEME: 'theme',
  LANGUAGE: 'language',
  PLAYER_SETTINGS: 'player-settings',
  WATCH_HISTORY: 'watch-history',
  FAVORITES: 'favorites',
  CONTINUE_WATCHING: 'continue-watching',
} as const;

// Anime Genres
export const ANIME_GENRES = [
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Slice of Life',
  'Sports',
  'Supernatural',
  'Thriller',
] as const;

// Anime Status
export const ANIME_STATUS = {
  AIRING: 'Currently Airing',
  FINISHED: 'Finished Airing',
  UPCOMING: 'Not yet aired',
} as const;

// Time constants
export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
} as const;
