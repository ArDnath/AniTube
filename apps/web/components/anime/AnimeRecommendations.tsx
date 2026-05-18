import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import type { SearchResult } from "@anitube/api";

interface AnimeRecommendationsProps {
  recommendations: SearchResult[];
}

export function AnimeRecommendations({
  recommendations,
}: AnimeRecommendationsProps) {
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  // Show top 5 recommendations
  const topRecommendations = recommendations.slice(0, 5);

  return (
    <div className="bg-white border-4 border-black rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
      <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
        <span className="w-2 h-8 bg-yellow-500 rounded" />
        Recommendations
      </h2>

      <div className="space-y-3">
        {topRecommendations.map((rec) => {
          const title = rec.title.english || rec.title.romaji || "Unknown";
          const animeId = rec.id;

          return (
            <Link
              key={rec.id}
              href={`/anime/${animeId}`}
              className="group block border-2 border-black rounded-lg overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-gradient-to-r from-white to-yellow-50"
            >
              <div className="flex gap-3 p-2">
                <div className="relative w-16 h-24 flex-shrink-0 border-2 border-black rounded overflow-hidden bg-gradient-to-br from-yellow-100 to-pink-100">
                  <Image
                    src={rec.coverImage}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h3 className="font-bold text-sm line-clamp-2 mb-1 group-hover:text-pink-600 transition-colors">
                    {title}
                  </h3>
                  {rec.popularity > 0 && (
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Sparkles className="w-3 h-3" />
                      {rec.popularity.toLocaleString()} fans
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {recommendations.length > 5 && (
        <div className="mt-4 text-center text-sm text-gray-600 font-bold">
          +{recommendations.length - 5} more recommendations
        </div>
      )}
    </div>
  );
}
