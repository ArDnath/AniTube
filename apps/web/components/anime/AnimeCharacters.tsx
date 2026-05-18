"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Users } from "lucide-react";

interface Character {
  id: number;
  role: string;
  name: {
    full: string;
    native: string | null;
  };
  image: {
    large: string;
    medium: string;
  };
}

interface AnimeCharactersProps {
  animeId: number;
}

export function AnimeCharacters({ animeId }: AnimeCharactersProps) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    async function fetchCharacters() {
      try {
        // Fetch from AniList API directly
        const query = `
          query ($id: Int) {
            Media(id: $id, type: ANIME) {
              characters(sort: [ROLE, RELEVANCE], page: 1, perPage: 12) {
                edges {
                  id
                  role
                  node {
                    id
                    name {
                      full
                      native
                    }
                    image {
                      large
                      medium
                    }
                  }
                }
              }
            }
          }
        `;

        const response = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query,
            variables: { id: animeId },
          }),
        });

        const json = await response.json();
        const edges = json.data?.Media?.characters?.edges || [];

        const characterData = edges.map((edge: any) => ({
          id: edge.node.id,
          role: edge.role,
          name: edge.node.name,
          image: edge.node.image,
        }));

        setCharacters(characterData);
      } catch (error) {
        console.error("Failed to fetch characters:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCharacters();
  }, [animeId]);

  if (loading) {
    return (
      <div className="bg-white border-4 border-black rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
        <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
          <span className="w-2 h-8 bg-purple-500 rounded" />
          Characters
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[2/3] bg-gray-200 border-2 border-black rounded-lg mb-2" />
              <div className="h-4 bg-gray-200 rounded mb-1" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (characters.length === 0) {
    return null;
  }

  const displayCharacters = showAll ? characters : characters.slice(0, 6);

  return (
    <div className="bg-white border-4 border-black rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
      <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
        <span className="w-2 h-8 bg-purple-500 rounded" />
        Characters
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {displayCharacters.map((character) => (
          <div
            key={character.id}
            className="group cursor-pointer border-3 border-black rounded-lg overflow-hidden bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <div className="aspect-[2/3] relative overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
              <Image
                src={character.image.large}
                alt={character.name.full}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              {character.role === "MAIN" && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-yellow-400 border-2 border-black rounded font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  MAIN
                </div>
              )}
            </div>
            <div className="p-3">
              <h3 className="font-bold text-sm line-clamp-1 mb-1">
                {character.name.full}
              </h3>
              {character.name.native && (
                <p className="text-xs text-gray-600 line-clamp-1">
                  {character.name.native}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {characters.length > 6 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 w-full px-4 py-2 bg-purple-300 hover:bg-purple-400 border-2 border-black rounded-lg font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          <Users className="w-4 h-4 inline mr-2" />
          {showAll ? "Show Less" : `Show All ${characters.length} Characters`}
        </button>
      )}
    </div>
  );
}
