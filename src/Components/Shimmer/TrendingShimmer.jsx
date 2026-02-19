function TrendingShimmer() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-video bg-zinc-800 rounded-lg mb-3"></div>
          <div className="h-4 bg-zinc-700 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-zinc-700 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}

export default TrendingShimmer;
