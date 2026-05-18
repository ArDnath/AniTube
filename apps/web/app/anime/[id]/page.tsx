import { Metadata } from "next";
import { notFound } from "next/navigation";
import { animeApi } from "@anitube/api";
import type { EpisodeInfo, SearchResult } from "@anitube/api";
import { AnimeHeader } from "../../../components/anime/AnimeHeader";
import { AnimeDescription } from "../../../components/anime/AnimeDescription";
import { AnimeEpisodes } from "../../../components/anime/AnimeEpisodes";
import { AnimeCharacters } from "../../../components/anime/AnimeCharacters";
import { AnimeRecommendations } from "../../../components/anime/AnimeRecommendations";
import { AnimeInfo as AnimeInfoSection } from "../../../components/anime/AnimeInfo";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const anime = await animeApi.getAnimeById(parseInt(id), "anilist");
    const title = anime.title.english || anime.title.romaji || "Anime Details";
    const description =
      anime.description?.replace(/<[^>]*>/g, "").slice(0, 155) ||
      "Watch anime and discover new favorites on AniTube";

    return {
      title: `${title} | AniTube`,
      description,
      openGraph: {
        title,
        description,
        images: [
          {
            url: anime.coverImage,
            width: 460,
            height: 664,
            alt: title,
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [anime.coverImage],
      },
    };
  } catch {
    return {
      title: "Anime Not Found | AniTube",
      description: "The requested anime could not be found.",
    };
  }
}

export default async function AnimePage({ params }: Props) {
  const { id } = await params;
  const animeId = parseInt(id);

  if (isNaN(animeId)) {
    notFound();
  }

  let anime;
  let episodes: EpisodeInfo[] | null = null;
  let recommendations: SearchResult[] | null = null;

  try {
    // Fetch anime details
    anime = await animeApi.getAnimeById(animeId, "anilist");

    // Fetch episodes if MAL ID is available
    if (anime.malId) {
      try {
        const episodesResponse = await animeApi.getEpisodes(anime.malId);
        episodes = episodesResponse.data;
      } catch (err) {
        console.error("Failed to fetch episodes:", err);
      }

      // Fetch recommendations
      try {
        recommendations = await animeApi.getRecommendations(anime.malId);
      } catch (err) {
        console.error("Failed to fetch recommendations:", err);
      }
    }
  } catch (error) {
    console.error("Failed to fetch anime:", error);
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50">
      <AnimeHeader anime={anime} />

      <main className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <AnimeDescription description={anime.description} />
            {episodes && episodes.length > 0 && (
              <AnimeEpisodes
                episodes={episodes}
                animeTitle={anime.title.english || anime.title.romaji || ""}
              />
            )}
            <AnimeCharacters animeId={animeId} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <AnimeInfoSection anime={anime} />
            {recommendations && recommendations.length > 0 && (
              <AnimeRecommendations recommendations={recommendations} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
