// Static skeleton shown by Next.js while the search page streams in.
// Mirrors the visual structure of SearchContent so there's no layout shift.

export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-yellow-50 via-white to-pastel-pink-50">

      {/* ── Page Header skeleton ──────────────────────────────────────────── */}
      <div className="bg-black text-white py-10 px-4 border-b-4 border-black">
        <div className="max-w-7xl mx-auto">
          {/* "AniTube" badge */}
          <div className="h-5 w-24 bg-pastel-yellow-300 border-3 border-white mb-3 animate-pulse" />
          {/* "SEARCH" heading */}
          <div className="h-20 w-64 bg-neutral-700 animate-pulse" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

        {/* ── Search input skeleton ─────────────────────────────────────── */}
        <div className="flex items-stretch bg-white border-4 border-black shadow-brutal-lg animate-pulse">
          {/* Search icon placeholder */}
          <div className="ml-5 w-6 h-6 my-auto bg-neutral-300 shrink-0" />
          {/* Input placeholder */}
          <div className="flex-1 h-16 ml-4" />
          {/* GO button */}
          <div className="w-20 h-full bg-black opacity-70" />
        </div>

        {/* ── Filters toggle skeleton ───────────────────────────────────── */}
        <div className="h-12 w-36 bg-pastel-purple-300 border-4 border-black shadow-brutal animate-pulse" />

        {/* ── Results count skeleton ────────────────────────────────────── */}
        <div className="h-9 w-56 bg-pastel-yellow-300 border-3 border-black shadow-brutal-sm animate-pulse" />

        {/* ── Cards grid skeleton ───────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {Array.from({ length: 24 }).map((_, i) => (
            <SkeletonCard key={i} index={i} />
          ))}
        </div>

        {/* ── Pagination skeleton ───────────────────────────────────────── */}
        <div className="flex items-center justify-center gap-2 flex-wrap pt-8 pb-4">
          {/* Prev */}
          <div className="h-9 w-20 bg-white border-3 border-black shadow-brutal-sm animate-pulse" />
          {/* Page buttons */}
          {[1, 2, 3, 4, 5].map((n) => (
            <div
              key={n}
              className={`w-10 h-10 border-3 border-black animate-pulse ${n === 1 ? "bg-neutral-800" : "bg-white shadow-brutal-sm"}`}
            />
          ))}
          {/* Next */}
          <div className="h-9 w-20 bg-white border-3 border-black shadow-brutal-sm animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// ── Individual card skeleton ──────────────────────────────────────────────────
function SkeletonCard({ index }: { index: number }) {
  const rotations = ["-rotate-1", "rotate-1", "-rotate-2", "rotate-0"];
  const rotation = rotations[index % rotations.length];

  // Match the pastel-ish tone of the real cards
  const bgShades = [
    "bg-pastel-pink-100",
    "bg-pastel-purple-100",
    "bg-pastel-blue-100",
    "bg-pastel-mint-100",
    "bg-pastel-yellow-100",
    "bg-pastel-peach-100",
  ];
  const bg = bgShades[index % bgShades.length];

  return (
    <div className={`transform ${rotation} animate-pulse`}>
      <div className={`${bg} border-4 border-neutral-300 overflow-hidden shadow-brutal-sm`}>
        {/* Cover art placeholder */}
        <div className="relative aspect-[2/3] bg-neutral-300 border-b-4 border-neutral-300">
          {/* Score badge placeholder */}
          <div className="absolute top-2 right-2 h-6 w-14 bg-neutral-400" />
        </div>
        {/* Info section */}
        <div className="p-3 space-y-2">
          {/* Title */}
          <div className="h-4 bg-neutral-300 w-full" />
          <div className="h-4 bg-neutral-300 w-3/4" />
          {/* Tags */}
          <div className="flex gap-2">
            <div className="h-5 w-10 bg-neutral-400" />
            <div className="h-5 w-14 bg-neutral-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
