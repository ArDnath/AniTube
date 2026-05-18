"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Loader2,
  Maximize,
  Minimize,
  Pause,
  Play,
  RefreshCw,
  Settings,
  Volume2,
  VolumeX,
} from "lucide-react";
import { usePlayerStore } from "@/lib/store/player-store";
import { useAppStore } from "@/lib/store/app-store";

const DEMO_URL =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

const PLAYBACK_RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export interface VideoPlayerProps {
  animeId: number;
  animeTitle: string;
  episodeNumber: number;
  episodeTitle?: string | null;
  videoUrl?: string;
  posterUrl?: string;
  onEnded?: () => void;
}

export function VideoPlayer({
  animeId,
  animeTitle,
  episodeNumber,
  episodeTitle,
  videoUrl,
  posterUrl,
  onEnded,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const progressInterval = useRef<ReturnType<typeof setInterval>>(undefined);
  const hasStarted = useRef(false);

  // Keep onEnded in a ref so it doesn't stale-close in event handlers
  const onEndedRef = useRef(onEnded);
  useEffect(() => {
    onEndedRef.current = onEnded;
  });

  // ---------- Local transient UI state ----------
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Use a ref so timer callbacks can read the latest value without re-registering
  const isPlayingRef = useRef(false);
  isPlayingRef.current = isPlaying;

  const volumeRef = useRef(1);

  // ---------- Persisted store state ----------
  const {
    volume,
    isMuted,
    playbackRate,
    setVolume,
    setIsMuted,
    setPlaybackRate,
  } = usePlayerStore();

  const { updateContinueWatching, addToWatchHistory } = useAppStore();

  volumeRef.current = volume;

  const src = videoUrl || DEMO_URL;

  // ──────────────────────────────────────────────
  // Helpers
  // ──────────────────────────────────────────────
  const formatTime = (s: number) => {
    if (!isFinite(s) || isNaN(s)) return "0:00";
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    if (h > 0)
      return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  /** Show controls and reset the auto-hide timer. */
  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => {
      if (isPlayingRef.current) setShowControls(false);
    }, 3000);
  }, []);

  // ──────────────────────────────────────────────
  // On mount: sync persisted settings → video element
  // ──────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = volume;
    video.muted = isMuted;
    video.playbackRate = playbackRate;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ──────────────────────────────────────────────
  // Cleanup on unmount (persist is handled by Zustand)
  // ──────────────────────────────────────────────
  useEffect(() => {
    return () => {
      clearTimeout(controlsTimeout.current);
      clearInterval(progressInterval.current);
    };
  }, []);

  // ──────────────────────────────────────────────
  // updateContinueWatching every 10 s while playing
  // ──────────────────────────────────────────────
  useEffect(() => {
    if (!isPlaying) {
      clearInterval(progressInterval.current);
      return;
    }
    progressInterval.current = setInterval(() => {
      const video = videoRef.current;
      if (video?.duration) {
        const pct = Math.round((video.currentTime / video.duration) * 100);
        updateContinueWatching(animeId, episodeNumber, pct);
      }
    }, 10_000);
    return () => clearInterval(progressInterval.current);
  }, [isPlaying, animeId, episodeNumber, updateContinueWatching]);

  // ──────────────────────────────────────────────
  // Video event listeners
  // ──────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => {
      setIsPlaying(true);
      if (!hasStarted.current) {
        hasStarted.current = true;
        updateContinueWatching(animeId, episodeNumber, 0);
      }
    };
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onLoadedMetadata = () => {
      setDuration(video.duration);
      setIsBuffering(false);
    };
    const onWaiting = () => setIsBuffering(true);
    const onCanPlay = () => setIsBuffering(false);
    const onPlaying = () => setIsBuffering(false);
    const onError = () => {
      setHasError(true);
      setIsBuffering(false);
    };
    const handleVideoEnded = () => {
      setIsPlaying(false);
      addToWatchHistory(animeId, episodeNumber, Date.now());
      onEndedRef.current?.();
    };
    const onFullscreenChange = () =>
      setIsFullscreen(!!document.fullscreenElement);

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("error", onError);
    video.addEventListener("ended", handleVideoEnded);
    document.addEventListener("fullscreenchange", onFullscreenChange);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("error", onError);
      video.removeEventListener("ended", handleVideoEnded);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, [animeId, episodeNumber, addToWatchHistory, updateContinueWatching]);

  // ──────────────────────────────────────────────
  // Control callbacks
  // ──────────────────────────────────────────────
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    isPlayingRef.current ? video.pause() : video.play();
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const next = !video.muted;
    video.muted = next;
    setIsMuted(next);
  }, [setIsMuted]);

  const setVideoVolume = useCallback(
    (val: number) => {
      const video = videoRef.current;
      if (!video) return;
      const clamped = Math.max(0, Math.min(1, val));
      video.volume = clamped;
      setVolume(clamped);
      if (clamped === 0) {
        video.muted = true;
        setIsMuted(true);
      } else if (video.muted) {
        video.muted = false;
        setIsMuted(false);
      }
    },
    [setVolume, setIsMuted],
  );

  const seekTo = useCallback((val: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = val;
    setCurrentTime(val);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  const changeSpeed = useCallback(
    (rate: number) => {
      const video = videoRef.current;
      if (!video) return;
      video.playbackRate = rate;
      setPlaybackRate(rate);
      setShowSettings(false);
    },
    [setPlaybackRate],
  );

  const handleRetry = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setHasError(false);
    setIsBuffering(true);
    video.load();
    video.play().catch(() => {});
  }, []);

  // ──────────────────────────────────────────────
  // Keyboard shortcuts
  // ──────────────────────────────────────────────
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      )
        return;

      const video = videoRef.current;
      if (!video) return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          togglePlay();
          showControlsTemporarily();
          break;
        case "KeyF":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "KeyM":
          e.preventDefault();
          toggleMute();
          showControlsTemporarily();
          break;
        case "ArrowLeft":
          e.preventDefault();
          video.currentTime = Math.max(0, video.currentTime - 10);
          showControlsTemporarily();
          break;
        case "ArrowRight":
          e.preventDefault();
          video.currentTime = Math.min(
            video.duration || 0,
            video.currentTime + 10,
          );
          showControlsTemporarily();
          break;
        case "ArrowUp": {
          e.preventDefault();
          setVideoVolume(volumeRef.current + 0.1);
          showControlsTemporarily();
          break;
        }
        case "ArrowDown": {
          e.preventDefault();
          setVideoVolume(volumeRef.current - 0.1);
          showControlsTemporarily();
          break;
        }
        default:
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    togglePlay,
    toggleMute,
    toggleFullscreen,
    setVideoVolume,
    showControlsTemporarily,
  ]);

  // ──────────────────────────────────────────────
  // Derived values
  // ──────────────────────────────────────────────
  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const displayVolume = isMuted ? 0 : volume;

  // ──────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className="relative bg-black rounded-lg overflow-hidden border-4 border-black shadow-brutal-lg select-none"
      onMouseMove={showControlsTemporarily}
      onMouseLeave={() => {
        if (isPlayingRef.current) setShowControls(false);
      }}
      onClick={() => setShowSettings(false)}
    >
      {/* ── Video element ── */}
      <video
        ref={videoRef}
        src={src}
        poster={posterUrl}
        className="w-full aspect-video cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          togglePlay();
          showControlsTemporarily();
        }}
        preload="metadata"
      />

      {/* ── Buffering spinner ── */}
      {isBuffering && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
          <div className="bg-black/70 border-3 border-white rounded-full p-4">
            <Loader2 className="w-10 h-10 text-pastel-purple-400 animate-spin" />
          </div>
        </div>
      )}

      {/* ── Error state ── */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="bg-pastel-coral-300 border-4 border-black rounded-xl shadow-brutal p-6 text-center max-w-xs">
            <AlertCircle className="w-12 h-12 text-black mx-auto mb-3" />
            <p className="font-black text-xl uppercase mb-1">Playback Error</p>
            <p className="font-bold text-sm text-gray-800 mb-4">
              Failed to load the video stream.
            </p>
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 mx-auto px-5 py-2.5 bg-black text-white font-bold rounded-lg border-3 border-black shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </div>
      )}

      {/* ── Large center play button (paused) ── */}
      {!isPlaying && !isBuffering && !hasError && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
        >
          <div className="bg-pastel-purple-400 border-4 border-white rounded-full p-5 shadow-brutal-lg hover:scale-110 transition-transform">
            <Play className="w-12 h-12 text-white fill-white" />
          </div>
        </div>
      )}

      {/* ── Controls overlay ── */}
      <div
        className={`absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/80 via-transparent to-black/50 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top info bar */}
        <div className="px-4 pt-3 pb-6">
          <p className="text-white font-black text-base uppercase drop-shadow truncate">
            {animeTitle}
          </p>
          <p className="text-pastel-yellow-300 font-bold text-sm drop-shadow-sm">
            Episode {episodeNumber}
            {episodeTitle ? ` — ${episodeTitle}` : ""}
          </p>
        </div>

        {/* Bottom controls */}
        <div className="px-4 pb-4 space-y-2">
          {/* Seek bar */}
          <div className="relative h-5 flex items-center group/seek">
            <div className="w-full h-1.5 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-pastel-purple-400 rounded-full transition-none"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={currentTime}
              onChange={(e) => seekTo(parseFloat(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
              aria-label="Seek"
            />
            {/* Thumb indicator */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white border-2 border-black rounded-full shadow pointer-events-none"
              style={{ left: `calc(${progressPct}% - 7px)` }}
            />
          </div>

          {/* Controls row */}
          <div className="flex items-center justify-between gap-3">
            {/* Left group */}
            <div className="flex items-center gap-2.5">
              {/* Play / Pause */}
              <button
                onClick={togglePlay}
                className="p-2 bg-pastel-purple-400 hover:bg-pastel-purple-300 border-2 border-white rounded-lg shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-white fill-white" />
                ) : (
                  <Play className="w-5 h-5 text-white fill-white" />
                )}
              </button>

              {/* Volume */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={toggleMute}
                  className="p-2 bg-pastel-blue-400 hover:bg-pastel-blue-300 border-2 border-white rounded-lg shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-5 h-5 text-white" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-white" />
                  )}
                </button>
                <div className="w-20 hidden sm:flex items-center">
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={displayVolume}
                    onChange={(e) => setVideoVolume(parseFloat(e.target.value))}
                    className="w-full h-1.5 appearance-none bg-white/30 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-pastel-blue-400 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
                    aria-label="Volume"
                  />
                </div>
              </div>

              {/* Time */}
              <span className="text-white font-bold text-sm tabular-nums select-none hidden sm:block">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Right group */}
            <div className="flex items-center gap-2">
              {/* Speed indicator */}
              {playbackRate !== 1 && (
                <span className="hidden sm:block text-pastel-yellow-300 font-black text-sm">
                  {playbackRate}x
                </span>
              )}

              {/* Settings */}
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setShowSettings((s) => !s)}
                  className="p-2 bg-pastel-pink-400 hover:bg-pastel-pink-300 border-2 border-white rounded-lg shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                  aria-label="Settings"
                  aria-expanded={showSettings}
                >
                  <Settings className="w-5 h-5 text-white" />
                </button>

                {showSettings && (
                  <div className="absolute bottom-full right-0 mb-2 bg-white border-4 border-black rounded-xl shadow-brutal p-3 min-w-[160px] z-50">
                    <p className="font-black text-xs uppercase text-black mb-2 tracking-wider">
                      Playback Speed
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      {PLAYBACK_RATES.map((rate) => (
                        <button
                          key={rate}
                          onClick={() => changeSpeed(rate)}
                          className={`px-2 py-1.5 text-sm font-bold border-2 border-black rounded-lg transition-all hover:translate-x-0.5 hover:translate-y-0.5 shadow-brutal-sm hover:shadow-none ${
                            playbackRate === rate
                              ? "bg-pastel-purple-400 text-white"
                              : "bg-white text-black hover:bg-pastel-purple-100"
                          }`}
                        >
                          {rate}×
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="p-2 bg-pastel-yellow-400 hover:bg-pastel-yellow-300 border-2 border-white rounded-lg shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize className="w-5 h-5 text-black" />
                ) : (
                  <Maximize className="w-5 h-5 text-black" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Keyboard shortcuts hint ── */}
      <div
        className={`absolute bottom-20 left-4 hidden sm:block bg-black/60 border-2 border-white/30 rounded-lg px-3 py-1.5 transition-opacity duration-500 pointer-events-none ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="text-white/70 font-bold text-[10px] uppercase tracking-wider">
          Space · F · M · ← → ↑ ↓
        </p>
      </div>

      {/* ── Demo badge ── */}
      <div
        className={`absolute top-14 right-4 bg-pastel-yellow-300 border-3 border-black rounded-lg px-2.5 py-1 shadow-brutal-sm transition-opacity duration-300 pointer-events-none ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="text-black font-black text-[10px] uppercase tracking-wider">
          Demo
        </p>
      </div>
    </div>
  );
}
