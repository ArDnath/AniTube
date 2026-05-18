import type { AnimeInfo as AnimeInfoType } from "@anitube/api";
import { Calendar, Film, TrendingUp, Building2 } from "lucide-react";

interface AnimeInfoProps {
  anime: AnimeInfoType;
}

export function AnimeInfo({ anime }: AnimeInfoProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, " ");
  };

  const infoItems = [
    {
      icon: <Film className="w-5 h-5" />,
      label: "Format",
      value: anime.format || "N/A",
      color: "bg-blue-100",
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: "Status",
      value: formatStatus(anime.status),
      color: "bg-green-100",
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: "Start Date",
      value: formatDate(anime.startDate),
      color: "bg-pink-100",
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: "End Date",
      value: formatDate(anime.endDate),
      color: "bg-purple-100",
    },
  ];

  return (
    <div className="bg-white border-4 border-black rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
      <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
        <span className="w-2 h-8 bg-green-500 rounded" />
        Information
      </h2>

      <div className="space-y-4">
        {infoItems.map((item, index) => (
          <div
            key={index}
            className={`${item.color} border-2 border-black rounded-lg p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="text-gray-700">{item.icon}</div>
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                {item.label}
              </span>
            </div>
            <div className="font-bold text-lg">{item.value}</div>
          </div>
        ))}

        {/* Studios */}
        {anime.studios && anime.studios.length > 0 && (
          <div className="bg-yellow-100 border-2 border-black rounded-lg p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-5 h-5 text-gray-700" />
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                Studios
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {anime.studios.map((studio, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-white border border-black rounded text-sm font-bold"
                >
                  {studio}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Popularity & Score */}
        <div className="grid grid-cols-2 gap-3">
          {anime.averageScore && (
            <div className="bg-gradient-to-br from-yellow-200 to-orange-200 border-2 border-black rounded-lg p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                Score
              </div>
              <div className="text-2xl font-black">{anime.averageScore}%</div>
            </div>
          )}
          <div className="bg-gradient-to-br from-blue-200 to-purple-200 border-2 border-black rounded-lg p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
              Popularity
            </div>
            <div className="text-2xl font-black">
              #{anime.popularity.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Native Title */}
        {anime.title.native && (
          <div className="bg-gray-100 border-2 border-black rounded-lg p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
              Native Title
            </div>
            <div className="font-bold text-lg">{anime.title.native}</div>
          </div>
        )}
      </div>
    </div>
  );
}
