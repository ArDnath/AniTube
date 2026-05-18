export default function WatchLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-950 dark:via-purple-950 dark:to-gray-950 pb-12">
      <div className="container mx-auto px-4 py-6 max-w-screen-2xl">
        {/* Back button skeleton */}
        <div className="mb-4">
          <div className="inline-block h-9 w-36 bg-gray-200 dark:bg-gray-800 border-3 border-black dark:border-gray-700 rounded-lg animate-pulse shadow-brutal-sm" />
        </div>

        <div className="flex flex-col lg:flex-row gap-5">
          {/* ── Left / Main area ── */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Player skeleton */}
            <div className="w-full aspect-video bg-gray-900 border-4 border-black rounded-lg animate-pulse shadow-brutal-lg flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gray-700 border-4 border-gray-600 flex items-center justify-center">
                <div className="w-0 h-0 border-y-8 border-y-transparent border-l-[14px] border-l-gray-500 ml-1" />
              </div>
            </div>

            {/* Title + info skeleton */}
            <div className="bg-white dark:bg-gray-900 border-4 border-black dark:border-gray-700 rounded-xl shadow-brutal p-5 space-y-3 animate-pulse">
              <div className="h-7 w-3/4 bg-gray-200 dark:bg-gray-700 border-2 border-black dark:border-gray-600 rounded-lg shadow-brutal-sm" />
              <div className="h-5 w-1/3 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            </div>

            {/* Navigation skeleton */}
            <div className="flex gap-3">
              <div className="h-12 w-28 bg-pastel-blue-200 dark:bg-gray-800 border-3 border-black dark:border-gray-700 rounded-full animate-pulse shadow-brutal" />
              <div className="h-12 w-28 bg-pastel-pink-200 dark:bg-gray-800 border-3 border-black dark:border-gray-700 rounded-full animate-pulse shadow-brutal" />
            </div>
          </div>

          {/* ── Right sidebar skeleton (desktop only) ── */}
          <aside className="hidden lg:block w-80 xl:w-96 flex-shrink-0">
            <div className="bg-white dark:bg-gray-900 border-4 border-black dark:border-gray-700 rounded-xl shadow-brutal overflow-hidden animate-pulse">
              {/* Header */}
              <div className="p-4 bg-pastel-purple-200 dark:bg-gray-800 border-b-4 border-black dark:border-gray-700">
                <div className="h-6 w-32 bg-gray-300 dark:bg-gray-600 rounded-lg" />
              </div>

              {/* Episode rows */}
              <div className="p-2 space-y-1.5">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg border-2 border-black/10 dark:border-gray-700"
                  >
                    {/* Number badge */}
                    <div className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-gray-700 border-2 border-black/20 flex-shrink-0" />
                    {/* Title */}
                    <div className="flex-1 space-y-1.5">
                      <div
                        className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded"
                        style={{ width: `${55 + (i % 5) * 9}%` }}
                      />
                      <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
