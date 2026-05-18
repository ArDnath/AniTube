import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface AppState {
  // Theme
  theme: 'light' | 'dark' | 'system';

  // User preferences
  language: string;
  preferredQuality: string;

  // UI state
  sidebarOpen: boolean;
  searchOpen: boolean;

  // Watch history
  watchHistory: Array<{
    animeId: number;
    episodeNumber: number;
    timestamp: number;
    lastWatched: Date;
  }>;

  // Favorites
  favorites: number[];

  // Continue watching
  continueWatching: Array<{
    animeId: number;
    episodeNumber: number;
    progress: number;
    updatedAt: Date;
  }>;

  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLanguage: (language: string) => void;
  setPreferredQuality: (quality: string) => void;
  setSidebarOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  toggleSearch: () => void;

  // Watch history actions
  addToWatchHistory: (animeId: number, episodeNumber: number, timestamp: number) => void;
  clearWatchHistory: () => void;

  // Favorites actions
  addToFavorites: (animeId: number) => void;
  removeFromFavorites: (animeId: number) => void;
  toggleFavorite: (animeId: number) => void;
  isFavorite: (animeId: number) => boolean;

  // Continue watching actions
  updateContinueWatching: (
    animeId: number,
    episodeNumber: number,
    progress: number
  ) => void;
  removeFromContinueWatching: (animeId: number) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        theme: 'system',
        language: 'en',
        preferredQuality: 'auto',
        sidebarOpen: false,
        searchOpen: false,
        watchHistory: [],
        favorites: [],
        continueWatching: [],

        // Theme actions
        setTheme: (theme) => set({ theme }),
        setLanguage: (language) => set({ language }),
        setPreferredQuality: (quality) => set({ preferredQuality: quality }),

        // UI actions
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        setSearchOpen: (open) => set({ searchOpen: open }),
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        toggleSearch: () => set((state) => ({ searchOpen: !state.searchOpen })),

        // Watch history actions
        addToWatchHistory: (animeId, episodeNumber, timestamp) =>
          set((state) => ({
            watchHistory: [
              {
                animeId,
                episodeNumber,
                timestamp,
                lastWatched: new Date(),
              },
              ...state.watchHistory.filter(
                (item) =>
                  !(item.animeId === animeId && item.episodeNumber === episodeNumber)
              ),
            ].slice(0, 50), // Keep only last 50 items
          })),

        clearWatchHistory: () => set({ watchHistory: [] }),

        // Favorites actions
        addToFavorites: (animeId) =>
          set((state) => ({
            favorites: state.favorites.includes(animeId)
              ? state.favorites
              : [...state.favorites, animeId],
          })),

        removeFromFavorites: (animeId) =>
          set((state) => ({
            favorites: state.favorites.filter((id) => id !== animeId),
          })),

        toggleFavorite: (animeId) =>
          set((state) => ({
            favorites: state.favorites.includes(animeId)
              ? state.favorites.filter((id) => id !== animeId)
              : [...state.favorites, animeId],
          })),

        isFavorite: (animeId) => get().favorites.includes(animeId),

        // Continue watching actions
        updateContinueWatching: (animeId, episodeNumber, progress) =>
          set((state) => {
            const filtered = state.continueWatching.filter(
              (item) => item.animeId !== animeId
            );

            return {
              continueWatching: [
                {
                  animeId,
                  episodeNumber,
                  progress,
                  updatedAt: new Date(),
                },
                ...filtered,
              ].slice(0, 20), // Keep only last 20 items
            };
          }),

        removeFromContinueWatching: (animeId) =>
          set((state) => ({
            continueWatching: state.continueWatching.filter(
              (item) => item.animeId !== animeId
            ),
          })),
      }),
      {
        name: 'app-storage',
      }
    ),
    { name: 'AppStore' }
  )
);
