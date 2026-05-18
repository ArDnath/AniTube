import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { animeApi } from '@anitube/api';
import type { EpisodeInfo } from '@anitube/api';
import { WatchPageClient } from './WatchPageClient';

interface Props {
  params: Promise<{ animeId: string; episode: string }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// SEO Metadata
// ─────────────────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { animeId, episode } = await params;
  const id = parseInt(animeId);
  const ep = parseInt(episode);

  if (isNaN(id) || isNaN(ep)) {
    return { title: 'Watch | AniTube' };
  }

  try {
    const anime = await animeApi.getAnimeById(id, 'anilist');
    const title = anime.title.english || anime.title.romaji || 'Anime';

    return {
      title: `${title} — Episode ${ep} | AniTube`,
      description: `Watch ${title} Episode ${ep} on AniTube. ${
        anime.description?.replace(/<[^>]*>/g, '').slice(0, 120) ?? ''
      }`,
      openGraph: {
        title: `${title} — Episode ${ep}`,
        description: `Streaming ${title} Episode ${ep} on AniTube`,
        images: [{ url: anime.coverImage, alt: title }],
        type: 'video.episode',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${title} — Episode ${ep} | AniTube`,
        images: [anime.coverImage],
      },
    };
  } catch {
    return {
      title: `Watch Episode ${ep} | AniTube`,
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Page Component
// ─────────────────────────────────────────────────────────────────────────────
export default async function WatchPage({ params }: Props) {
  const { animeId, episode } = await params;

  const animeIdNum = parseInt(animeId);
  const episodeNum = parseInt(episode);

  if (isNaN(animeIdNum) || isNaN(episodeNum) || episodeNum < 1) {
    notFound();
  }

  // Fetch anime details from AniList
  let anime;
  try {
    anime = await animeApi.getAnimeById(animeIdNum, 'anilist');
  } catch {
    notFound();
  }

  // Fetch episode list from Jikan (via MAL ID) if available
  let episodes: EpisodeInfo[] | null = null;
  if (anime.malId) {
    try {
      const result = await animeApi.getEpisodes(anime.malId);
      episodes = result.data;
    } catch {
      // Episode list is optional — silently ignore
    }
  }

  return (
    <WatchPageClient
      anime={anime}
      episodes={episodes}
      animeId={animeIdNum}
      episode={episodeNum}
    />
  );
}
