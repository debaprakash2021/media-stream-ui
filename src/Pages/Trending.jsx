import { useEffect, useState } from "react";
import { fetchTrendingVideos } from "../api/trending";
import TrendingShimmer from "../Components/Shimmer/TrendingShimmer";
import TrendingCard from "../Components/Trending/TrendingCard";

function Trending() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadTrending() {
      try {
        const normalizedVideos = await fetchTrendingVideos();
        if (!ignore) setVideos(normalizedVideos);
      } catch {
        if (!ignore) setError("Failed to load trending videos");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadTrending();
    return () => { ignore = true; };
  }, []);

  if (loading) return <TrendingShimmer />;

  // Styled error state
  if (error) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-zinc-900 border border-red-800 rounded-xl p-8 text-center max-w-md">
          <p className="text-red-400 text-4xl mb-4">⚠️</p>
          <h2 className="text-white font-bold text-lg mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-400 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-full transition"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (videos.length === 0) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center max-w-md">
          <p className="text-5xl mb-4">📭</p>
          <h2 className="text-white font-bold text-lg mb-2">
            No trending videos found
          </h2>
          <p className="text-gray-400 text-sm">
            Check back later for the latest trending content.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 min-h-screen">

      {/* Page header */}
      <div className="mb-6 border-b border-zinc-800 pb-4">
        <h1 className="text-2xl font-bold text-white">
          🔥 Trending
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Most popular videos right now
        </p>
      </div>

      {/* Video grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {videos.map((video) => (
          <TrendingCard key={video.video_id} video={video} />
        ))}
      </div>

    </div>
  );
}

export default Trending;