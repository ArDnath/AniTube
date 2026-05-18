export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Skeleton */}
      <div className="h-[70vh] min-h-[500px] bg-gray-200 dark:bg-gray-800 animate-pulse" />
      {/* Section skeletons */}
      <div className="container mx-auto px-4 py-12 space-y-16">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-6">
            <div className="h-10 w-48 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, j) => (
                <div key={j} className="border-4 border-gray-200 dark:border-gray-700 animate-pulse">
                  <div className="aspect-[2/3] bg-gray-200 dark:bg-gray-800" />
                  <div className="p-3 space-y-2 bg-gray-100 dark:bg-gray-900">
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
