import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface PlayerState {
  // Player state
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTime: number;
  duration: number;

  // Playback settings
  playbackRate: number;
  quality: string;
  autoPlay: boolean;
  autoNext: boolean;

  // UI state
  isFullscreen: boolean;
  showControls: boolean;

  // Actions
  setIsPlaying: (playing: boolean) => void;
  setIsMuted: (muted: boolean) => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setPlaybackRate: (rate: number) => void;
  setQuality: (quality: string) => void;
  setAutoPlay: (autoPlay: boolean) => void;
  setAutoNext: (autoNext: boolean) => void;
  setIsFullscreen: (fullscreen: boolean) => void;
  setShowControls: (show: boolean) => void;
  reset: () => void;
}

const initialState = {
  isPlaying: false,
  isMuted: false,
  volume: 1,
  currentTime: 0,
  duration: 0,
  playbackRate: 1,
  quality: 'auto',
  autoPlay: false,
  autoNext: true,
  isFullscreen: false,
  showControls: true,
};

export const usePlayerStore = create<PlayerState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setIsPlaying: (playing) => set({ isPlaying: playing }),
        setIsMuted: (muted) => set({ isMuted: muted }),
        setVolume: (volume) => set({ volume }),
        setCurrentTime: (time) => set({ currentTime: time }),
        setDuration: (duration) => set({ duration }),
        setPlaybackRate: (rate) => set({ playbackRate: rate }),
        setQuality: (quality) => set({ quality }),
        setAutoPlay: (autoPlay) => set({ autoPlay }),
        setAutoNext: (autoNext) => set({ autoNext }),
        setIsFullscreen: (fullscreen) => set({ isFullscreen: fullscreen }),
        setShowControls: (show) => set({ showControls: show }),
        reset: () => set(initialState),
      }),
      {
        name: 'player-storage',
        partialize: (state) => ({
          volume: state.volume,
          isMuted: state.isMuted,
          playbackRate: state.playbackRate,
          autoPlay: state.autoPlay,
          autoNext: state.autoNext,
        }),
      }
    ),
    { name: 'PlayerStore' }
  )
);
