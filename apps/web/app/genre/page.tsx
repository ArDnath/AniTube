import Link from 'next/link';
import type { Metadata } from 'next';
import { Film, Sparkles, Heart, Swords, Zap, Ghost, Search, Music, Laugh, Drama, Rocket, Cpu, Brain, Scroll, Mic2, MapPin, Shield, Users, Palette } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Browse by Genre | AniTube',
  description: 'Explore anime by genre: Action, Adventure, Comedy, Drama, Fantasy, Horror, Mystery, Romance, Sci-Fi, Slice of Life, Sports, Supernatural, Thriller, and more.',
};

const genres = [
  { name: 'Action', slug: 'action', icon: Swords, color: 'bg-pastel-pink-300' },
  { name: 'Adventure', slug: 'adventure', icon: MapPin, color: 'bg-pastel-purple-300' },
  { name: 'Comedy', slug: 'comedy', icon: Laugh, color: 'bg-pastel-yellow-300' },
  { name: 'Drama', slug: 'drama', icon: Drama, color: 'bg-pastel-blue-300' },
  { name: 'Fantasy', slug: 'fantasy', icon: Sparkles, color: 'bg-pastel-lavender-300' },
  { name: 'Horror', slug: 'horror', icon: Ghost, color: 'bg-pastel-coral-300' },
  { name: 'Mystery', slug: 'mystery', icon: Search, color: 'bg-pastel-mint-300' },
  { name: 'Romance', slug: 'romance', icon: Heart, color: 'bg-pastel-pink-300' },
  { name: 'Sci-Fi', slug: 'sci-fi', icon: Rocket, color: 'bg-pastel-blue-300' },
  { name: 'Slice of Life', slug: 'slice-of-life', icon: Film, color: 'bg-pastel-peach-300' },
  { name: 'Sports', slug: 'sports', icon: Zap, color: 'bg-pastel-yellow-300' },
  { name: 'Supernatural', slug: 'supernatural', icon: Ghost, color: 'bg-pastel-lavender-300' },
  { name: 'Thriller', slug: 'thriller', icon: Swords, color: 'bg-pastel-coral-300' },
  { name: 'Mecha', slug: 'mecha', icon: Cpu, color: 'bg-pastel-purple-300' },
  { name: 'Psychological', slug: 'psychological', icon: Brain, color: 'bg-pastel-mint-300' },
  { name: 'Historical', slug: 'historical', icon: Scroll, color: 'bg-pastel-peach-300' },
  { name: 'Music', slug: 'music', icon: Music, color: 'bg-pastel-pink-300' },
  { name: 'Isekai', slug: 'isekai', icon: MapPin, color: 'bg-pastel-blue-300' },
  { name: 'Shounen', slug: 'shounen', icon: Shield, color: 'bg-pastel-yellow-300' },
  { name: 'Shoujo', slug: 'shoujo', icon: Heart, color: 'bg-pastel-pink-300' },
  { name: 'Seinen', slug: 'seinen', icon: Users, color: 'bg-pastel-purple-300' },
  { name: 'Josei', slug: 'josei', icon: Palette, color: 'bg-pastel-lavender-300' },
];

export default function GenresPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 space-y-6">
          <div className="bg-pastel-purple-300 border-4 border-black shadow-brutal-lg p-8 -rotate-1 inline-block">
            <h1 className="text-6xl font-black uppercase">Browse Genres</h1>
          </div>
          <div className="bg-pastel-yellow-200 border-4 border-black shadow-brutal p-6 rotate-1 max-w-2xl">
            <p className="font-bold text-lg text-gray-900 dark:text-black">
              Discover anime by category. From action-packed adventures to heartwarming slice-of-life stories.
            </p>
          </div>
        </div>

        {/* Genre Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {genres.map((genre, index) => {
            const Icon = genre.icon;
            const rotations = ['-rotate-1', 'rotate-1', '-rotate-2', 'rotate-0', 'rotate-2'];
            const rotation = rotations[index % rotations.length];

            return (
              <Link
                key={genre.slug}
                href={`/genre/${genre.slug}`}
                className={`group block ${rotation} hover:rotate-0 transition-all duration-300 hover:scale-105 hover:shadow-brutal-lg`}
              >
                <div className={`${genre.color} border-4 border-black shadow-brutal p-6 h-full flex flex-col items-center justify-center gap-4 min-h-[180px]`}>
                  <Icon className="w-12 h-12 text-black group-hover:scale-110 transition-transform" />
                  <h2 className="font-black text-xl uppercase text-center text-black">
                    {genre.name}
                  </h2>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
