import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchSearchResults } from "../api/search";
import SearchShimmer from "../Components/Shimmer/SearchShimmer";
import TrendingCard from "../Components/Trending/TrendingCard";

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q");
  const pageToken = searchParams.get("pageToken") || ""; // ✅ token-based pagination

  const [videos, setVideos] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [prevPageToken, setPrevPageToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) return;
    let ignore = false;

    async function loadSearch() {
      setLoading(true);
      setError(null);

      try {
        // ✅ fetchSearchResults now returns { videos, nextPageToken, prevPageToken }
        const result = await fetchSearchResults(query, pageToken);

        if (!ignore) {
          setVideos(result.videos);
          setNextPageToken(result.nextPageToken);
          setPrevPageToken(result.prevPageToken);
        }
      } catch {
        if (!ignore) setError("Failed to load search results");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadSearch();
    return () => { ignore = true; };
  }, [query, pageToken]);

  const goNext = () => {
    if (nextPageToken) setSearchParams({ q: query, pageToken: nextPageToken });
  };

  const goPrev = () => {
    if (prevPageToken) setSearchParams({ q: query, pageToken: prevPageToken });
    else setSearchParams({ q: query });
  };

  if (!query) return <div className="p-4 text-white">Enter a search term above</div>;
  if (loading) return <SearchShimmer />;
  if (error) return <div className="p-4 text-red-500 font-semibold">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="mb-6 text-xl font-semibold text-white">
        Results for <span className="text-blue-400">"{query}"</span>
      </h2>

      {videos.length === 0 ? (
        <div className="text-gray-400 text-center mt-12">No results found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {videos.map((video) => (
            <TrendingCard key={video.video_id} video={video} />
          ))}
        </div>
      )}

      {/* ✅ Token-based pagination — works correctly with YouTube v3 */}
      <div className="flex justify-center gap-4 mt-8">
        {prevPageToken && (
          <button
            onClick={goPrev}
            className="px-4 py-2 bg-zinc-700 rounded text-white hover:bg-zinc-600 transition"
          >
            ← Previous
          </button>
        )}
        {nextPageToken && (
          <button
            onClick={goNext}
            className="px-4 py-2 bg-zinc-700 rounded text-white hover:bg-zinc-600 transition"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}

export default Search;
