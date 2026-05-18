import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { animeApi } from '@anitube/api';
import { AnimeCard } from '@/components/home/AnimeCard';
import { GenreFilters } from './GenreFilters';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sort?: string; format?: string; status?: string }>;
}

// Convert slug to proper genre name
function slugToGenre(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const genreName = slugToGenre(slug);

  return {
    title: `${genreName} Anime | AniTube`,
    description: `Discover the best ${genreName.toLowerCase()} anime. Browse popular ${genreName.toLowerCase()} series and movies on AniTube.`,
  };
}

export default async function GenrePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page = '1', sort, format, status } = await searchParams;

  const genreName = slugToGenre(slug);
  const currentPage = parseInt(page);

  let animeList;
  try {
    const result = await animeApi.getAnimeByGenre(genreName, currentPage, 24);
    animeList = result;
  } catch (error) {
    console.error('Failed to fetch genre:', error);
    notFound();
  }

  const totalResults = animeList.pagination.total;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Hero Header */}
        <div className="mb-12 space-y-6">
          <div className="bg-pastel-purple-300 border-4 border-black shadow-brutal-lg p-8 -rotate-1 inline-block">
            <h1 className="text-5xl md:text-6xl font-black uppercase">{genreName}</h1>
          </div>
          <div className="bg-pastel-yellow-200 border-4 border-black shadow-brutal p-4 rotate-1 inline-block">
            <p className="font-bold text-lg text-gray-900 dark:text-black">
              {totalResults} anime in {genreName}
            </p>
          </div>
        </div>

        {/* Filters */}
        <GenreFilters />

        {/* Results Grid */}
        {animeList.data.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-12">
              {animeList.data.map((anime, index) => (
                <AnimeCard key={anime.id} anime={anime} index={index} />
              ))}
            </div>

            {/* Pagination */}
            {animeList.pagination.total > 24 && (
              <div className="flex justify-center gap-2 mt-12">
                {/* Previous */}
                {currentPage > 1 && (
                  <a
                    href={`/genre/${slug}?page=${currentPage - 1}${sort ? `&sort=${sort}` : ''}${format ? `&format=${format}` : ''}${status ? `&status=${status}` : ''}`}
                    className="bg-pastel-purple-300 border-4 border-black shadow-brutal px-6 py-3 font-black uppercase hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm transition-all"
                  >
                    Previous
                  </a>
                )}

                {/* Page Numbers */}
                {Array.from({ length: Math.min(5, Math.ceil(totalResults / 24)) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <a
                      key={pageNum}
                      href={`/genre/${slug}?page=${pageNum}${sort ? `&sort=${sort}` : ''}${format ? `&format=${format}` : ''}${status ? `&status=${status}` : ''}`}
                      className={`border-4 border-black shadow-brutal px-4 py-3 font-black uppercase hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm transition-all ${
                        pageNum === currentPage
                          ? 'bg-pastel-pink-400 text-white'
                          : 'bg-pastel-yellow-200 text-black'
                      }`}
                    >
                      {pageNum}
                    </a>
                  );
                })}

                {/* Next */}
                {animeList.pagination.hasNextPage && (
                  <a
                    href={`/genre/${slug}?page=${currentPage + 1}${sort ? `&sort=${sort}` : ''}${format ? `&format=${format}` : ''}${status ? `&status=${status}` : ''}`}
                    className="bg-pastel-blue-300 border-4 border-black shadow-brutal px-6 py-3 font-black uppercase hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm transition-all"
                  >
                    Next
                  </a>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="bg-pastel-coral-300 border-4 border-black shadow-brutal-lg p-12 inline-block -rotate-2">
              <h2 className="text-4xl font-black uppercase mb-4">No Anime Found</h2>
              <p className="font-bold text-lg text-gray-900 dark:text-black">
                Try a different genre or check back later!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
