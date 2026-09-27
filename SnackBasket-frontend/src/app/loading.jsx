export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8 animate-pulse">
      {/* Banner Skeleton */}
      <div className="w-full h-64 bg-gray-200 rounded-3xl" />

      {/* Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="h-72 bg-gray-200 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}