import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchSearchResults } from "../api/search";
import SearchShimmer from "../Components/Shimmer/SearchShimmer";
import TrendingCard from "../Components/Trending/TrendingCard";

function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) return;

    let ignore = false;

    async function loadSearch() {
      setLoading(true);
      setError(null);

      try {
        const results = await fetchSearchResults(query);
        if (!ignore) setVideos(results);
      } catch {
        if (!ignore) setError("Failed to load search results");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadSearch();

    return () => {
      ignore = true; // ✅ cleanup
    };
  }, [query]);

  if (!query) {
    return <div className="p-4">Enter a search term</div>;
  }

  if (loading) return <SearchShimmer />;

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-semibold">
        Search results for "{query}"
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {videos.map((video) => (
          <TrendingCard key={video.video_id} video={video} />
        ))}
      </div>
    </div>
  );
}

export default Search;
