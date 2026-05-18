export default function AnimeLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50">
      {/* Header Skeleton */}
      <div className="relative">
        <div className="h-[500px] bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200 animate-pulse" />

        <div className="container mx-auto px-4 relative">
          <div className="absolute -top-72 left-4 flex gap-8 items-end">
            {/* Cover Skeleton */}
            <div className="w-[230px] h-[340px] bg-gray-200 border-4 border-black rounded-lg animate-pulse shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" />

            {/* Title & Metadata Skeleton */}
            <div className="pb-8 max-w-3xl space-y-4">
              <div className="h-12 bg-gray-200 border-3 border-black rounded-lg w-96 animate-pulse shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
              <div className="h-6 bg-gray-200 border-2 border-black rounded w-64 animate-pulse shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />

              <div className="flex gap-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 w-24 bg-gray-200 border-3 border-black rounded-lg animate-pulse shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  />
                ))}
              </div>

              <div className="flex gap-2 flex-wrap">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-8 w-20 bg-gray-200 border-2 border-black rounded animate-pulse shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  />
                ))}
              </div>

              <div className="flex gap-4">
                <div className="h-12 w-36 bg-gray-200 border-3 border-black rounded-lg animate-pulse shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
                <div className="h-12 w-36 bg-gray-200 border-3 border-black rounded-lg animate-pulse shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <main className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description Skeleton */}
            <div className="bg-white border-4 border-black rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
              <div className="h-8 w-48 bg-gray-200 border-2 border-black rounded mb-4 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              </div>
            </div>

            {/* Episodes Skeleton */}
            <div className="bg-white border-4 border-black rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
              <div className="h-8 w-48 bg-gray-200 border-2 border-black rounded mb-4 animate-pulse" />
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-24 bg-gray-200 border-3 border-black rounded-lg animate-pulse shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  />
                ))}
              </div>
            </div>

            {/* Characters Skeleton */}
            <div className="bg-white border-4 border-black rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
              <div className="h-8 w-48 bg-gray-200 border-2 border-black rounded mb-4 animate-pulse" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i}>
                    <div className="aspect-[2/3] bg-gray-200 border-2 border-black rounded-lg mb-2 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded mb-1 animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Info Skeleton */}
            <div className="bg-white border-4 border-black rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
              <div className="h-8 w-40 bg-gray-200 border-2 border-black rounded mb-4 animate-pulse" />
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-20 bg-gray-200 border-2 border-black rounded-lg animate-pulse shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  />
                ))}
              </div>
            </div>

            {/* Recommendations Skeleton */}
            <div className="bg-white border-4 border-black rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
              <div className="h-8 w-48 bg-gray-200 border-2 border-black rounded mb-4 animate-pulse" />
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-28 bg-gray-200 border-2 border-black rounded-lg animate-pulse shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
