import { useEffect, useState } from "react";
import { fetchTrendingVideos } from "../api/trending";
import TrendingShimmer from "../Components/Shimmer/TrendingShimmer";
import TrendingCard from "../Components/Trending/TrendingCard";

function Trending() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // ✅ CORRECTION: explicit error state

  useEffect(() => {
    let ignore = false;

    async function loadTrending() {
      try {
        const normalizedVideos = await fetchTrendingVideos();

        if (!ignore) {
          setVideos(normalizedVideos);
        }
      } catch (err) {
        // ✅ CORRECTION: user-visible error
        if (!ignore) {
          setError("Failed to load trending videos");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadTrending();

    return () => {
      // ✅ CORRECTION: cleanup to prevent stale state update
      ignore = true;
    };
  }, []);

  if (loading) return <TrendingShimmer />;

  if (error) {
    // ✅ CORRECTION: error UI instead of silent failure
    return (
      <div className="p-4 text-red-500 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {videos.map((video) => (
          <TrendingCard key={video.video_id} video={video} />
        ))}
      </div>
    </div>
  );
}

export default Trending;
