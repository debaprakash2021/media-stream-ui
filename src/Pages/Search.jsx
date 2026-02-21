import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchSearchResults } from "../api/search";
import SearchShimmer from "../Components/Shimmer/SearchShimmer";
import TrendingCard from "../Components/Trending/TrendingCard";

function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const sentinelRef = useRef(null);

  // ── Fetch a page of search results ─────────────────────────────────
  const fetchMore = useCallback(async (pageToken = "", reset = false) => {
    if (!query) return;

    if (reset) setLoading(true);
    else setLoadingMore(true);

    setError(null);

    try {
      const result = await fetchSearchResults(query, pageToken);

      setVideos(prev => reset ? result.videos : [...prev, ...result.videos]);
      setNextPageToken(result.nextPageToken);
      setHasMore(!!result.nextPageToken);
    } catch {
      setError("Failed to load search results");
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [query]);

  // ── Reset when query changes ────────────────────────────────────────
  useEffect(() => {
    setVideos([]);
    setNextPageToken(null);
    setHasMore(true);
    setError(null);
    fetchMore("", true);
  }, [query]);

  // ── IntersectionObserver ────────────────────────────────────────────
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !loadingMore && !loading) {
          fetchMore(nextPageToken || "");
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0,
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, nextPageToken, fetchMore]);

  if (!query) {
    return (
      <div className="p-8 text-center text-gray-400">
        <p className="text-xl">🔍 Enter a search term above</p>
      </div>
    );
  }

  if (loading) return <SearchShimmer />;

  if (error) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-zinc-900 border border-red-800 rounded-xl p-8 text-center max-w-md">
          <p className="text-red-400 text-4xl mb-4">⚠️</p>
          <h2 className="text-white font-bold text-lg mb-2">Something went wrong</h2>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <h2 className="mb-6 text-xl font-semibold text-white">
        Results for{" "}
        <span className="text-red-400">"{query}"</span>
        <span className="text-gray-400 text-sm font-normal ml-3">
          {videos.length} videos loaded
        </span>
      </h2>

      {videos.length === 0 && !loadingMore ? (
        <div className="text-center mt-12">
          <p className="text-gray-400 text-xl">No results found.</p>
          <p className="text-gray-500 text-sm mt-2">Try a different search term.</p>
        </div>
      ) : (
        <>
          {/* Results grid — appends as user scrolls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {videos.map((video, index) => (
              <TrendingCard
                key={`${video.video_id}-${index}`}
                video={video}
              />
            ))}
          </div>

          {/* Loading more spinner */}
          {loadingMore && (
            <div className="flex justify-center items-center py-10 gap-3">
              <div className="w-6 h-6 border-2 border-zinc-600 border-t-red-500 rounded-full animate-spin" />
              <span className="text-gray-400 text-sm">Loading more results...</span>
            </div>
          )}

          {/* End of results */}
          {!hasMore && !loadingMore && videos.length > 0 && (
            <div className="flex flex-col items-center py-10 gap-2">
              <div className="w-10 h-px bg-zinc-700" />
              <p className="text-gray-500 text-sm">You've reached the end</p>
              <div className="w-10 h-px bg-zinc-700" />
            </div>
          )}

          {/* Sentinel */}
          <div ref={sentinelRef} className="h-1 w-full" />
        </>
      )}
    </div>
  );
}

export default Search;