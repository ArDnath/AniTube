export default function GenreLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 py-16 px-4 animate-pulse">
      <div className="container mx-auto max-w-7xl">
        {/* Header Skeleton */}
        <div className="mb-12 space-y-6">
          <div className="bg-gray-300 dark:bg-gray-700 border-4 border-gray-400 dark:border-gray-600 h-32 w-96 inline-block" />
          <div className="bg-gray-300 dark:bg-gray-700 border-4 border-gray-400 dark:border-gray-600 h-16 w-64 inline-block" />
        </div>

        {/* Filters Skeleton */}
        <div className="bg-gray-200 dark:bg-gray-800 border-4 border-gray-400 dark:border-gray-600 h-32 mb-12" />

        {/* Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="border-4 border-gray-300 dark:border-gray-700 bg-gray-200 dark:bg-gray-800">
              <div className="aspect-[2/3] bg-gray-300 dark:bg-gray-700" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 w-3/4" />
                <div className="h-3 bg-gray-300 dark:bg-gray-700 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
