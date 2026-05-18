'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState } from 'react';

export function GenreFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [sort, setSort] = useState(searchParams.get('sort') || 'popularity');
  const [format, setFormat] = useState(searchParams.get('format') || 'any');
  const [status, setStatus] = useState(searchParams.get('status') || 'any');

  const updateFilters = (newSort?: string, newFormat?: string, newStatus?: string) => {
    const params = new URLSearchParams(searchParams.toString());

    const sortVal = newSort ?? sort;
    const formatVal = newFormat ?? format;
    const statusVal = newStatus ?? status;

    if (sortVal && sortVal !== 'popularity') params.set('sort', sortVal);
    else params.delete('sort');

    if (formatVal && formatVal !== 'any') params.set('format', formatVal);
    else params.delete('format');

    if (statusVal && statusVal !== 'any') params.set('status', statusVal);
    else params.delete('status');

    params.delete('page'); // Reset to page 1

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="bg-pastel-blue-100 border-4 border-black shadow-brutal p-6 mb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sort By */}
        <div>
          <label className="block font-black uppercase mb-2 text-sm">Sort By</label>
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              updateFilters(e.target.value, undefined, undefined);
            }}
            className="w-full border-3 border-black px-4 py-2 font-bold focus:outline-none focus:ring-4 focus:ring-pastel-purple-400 bg-white"
          >
            <option value="popularity">Popularity</option>
            <option value="score">Score</option>
            <option value="trending">Trending</option>
          </select>
        </div>

        {/* Format */}
        <div>
          <label className="block font-black uppercase mb-2 text-sm">Format</label>
          <select
            value={format}
            onChange={(e) => {
              setFormat(e.target.value);
              updateFilters(undefined, e.target.value, undefined);
            }}
            className="w-full border-3 border-black px-4 py-2 font-bold focus:outline-none focus:ring-4 focus:ring-pastel-purple-400 bg-white"
          >
            <option value="any">Any</option>
            <option value="TV">TV</option>
            <option value="MOVIE">Movie</option>
            <option value="OVA">OVA</option>
            <option value="ONA">ONA</option>
            <option value="SPECIAL">Special</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block font-black uppercase mb-2 text-sm">Status</label>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              updateFilters(undefined, undefined, e.target.value);
            }}
            className="w-full border-3 border-black px-4 py-2 font-bold focus:outline-none focus:ring-4 focus:ring-pastel-purple-400 bg-white"
          >
            <option value="any">Any</option>
            <option value="RELEASING">Airing</option>
            <option value="FINISHED">Finished</option>
            <option value="NOT_YET_RELEASED">Upcoming</option>
          </select>
        </div>
      </div>
    </div>
  );
}
