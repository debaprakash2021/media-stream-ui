import { useEffect, useState } from "react";
import { fetchTrendingVideos } from "../api/trending";
import TrendingShimmer from "../Components/Shimmer/TrendingShimmer";
import TrendingCard from "../Components/Trending/TrendingCard";
import { trendingDummy } from "../data/trendingDummy";

function Trending() {
  const [videos, setVideos] = useState(trendingDummy);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadTrending() {
      try {
        const data = await fetchTrendingVideos();
        if (!ignore) {
          setVideos(data.videos || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadTrending();
    return () => {
      ignore = true;
    };
  }, []);

  if (loading) return <TrendingShimmer />;

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
