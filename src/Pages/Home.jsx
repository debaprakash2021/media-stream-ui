import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { YT_API_BASE, YT_API_KEY, getRandomTopic } from "../constants/api";
import ShimmerCard from "../Components/ShimmerCard";

function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // ✅ If no query param exists (e.g. fresh browser load or first visit),
  //    immediately redirect to a random topic so content is never the same
  useEffect(() => {
    const query = searchParams.get("query");
    if (!query) {
      const topic = getRandomTopic();
      setSearchParams({ query: topic }, { replace: true });
    }
  }, []);

  const query = searchParams.get("query") || "";

  const sentinelRef = useRef(null);

  // ── Fetch videos ────────────────────────────────────────────────────
  const fetchVideos = useCallback(async (pageToken = "", reset = false) => {
    if (!query) return;

    if (reset) setLoading(true);
    else setLoadingMore(true);

    try {
      const res = await fetch(
        `${YT_API_BASE}/search?part=snippet&type=video&maxResults=12` +
        `&q=${encodeURIComponent(query)}&pageToken=${pageToken}&key=${YT_API_KEY}`
      );
      const data = await res.json();

      const newVideos = data.items || [];
      const token = data.nextPageToken || null;

      setVideos(prev => reset ? newVideos : [...prev, ...newVideos]);
      setNextPageToken(token);
      setHasMore(!!token);
    } catch (error) {
      console.error("Error fetching videos:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [query]);

  // ── Reset and re-fetch whenever query changes ───────────────────────
  useEffect(() => {
    if (!query) return;
    setVideos([]);
    setNextPageToken(null);
    setHasMore(true);
    fetchVideos("", true);
  }, [query]);

  // ── IntersectionObserver for infinite scroll ────────────────────────
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !loadingMore && !loading) {
          fetchVideos(nextPageToken || "");
        }
      },
      { root: null, rootMargin: "200px", threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, nextPageToken, fetchVideos]);

  // ── Navigate to Watch ───────────────────────────────────────────────
  const handleVideoClick = (video) => {
    navigate("/watch", {
      state: {
        videoId: video.id.videoId,
        title: video.snippet.title,
        channel: video.snippet.channelTitle,
        description: video.snippet.description,
        thumbnail: video.snippet.thumbnails.medium.url,
      },
    });
  };

  return (
    <div className="p-4 min-h-screen">

      {/* Show current topic as subtle label */}
      {query && !loading && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-gray-500 text-xs uppercase tracking-widest">
            Showing
          </span>
          <span className="text-xs text-zinc-400 bg-zinc-800 px-3 py-1 rounded-full capitalize">
            {query}
          </span>
        </div>
      )}

      {/* Initial shimmer */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <ShimmerCard key={i} />
          ))}
        </div>
      ) : (
        <>
          {/* Video grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {videos.map((video, index) => (
              <div
                key={`${video.id.videoId}-${index}`}
                className="cursor-pointer group"
                onClick={() => handleVideoClick(video)}
              >
                <div className="aspect-video overflow-hidden rounded-lg relative">
                  <img
                    src={video.snippet.thumbnails.medium.url}
                    alt={video.snippet.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-white text-2xl ml-1">▶</span>
                    </div>
                  </div>
                </div>

                <div className="mt-2 flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center shrink-0 mt-1">
                    <span className="text-xs text-white font-bold">
                      {video.snippet.channelTitle?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-semibold line-clamp-2 text-white text-sm leading-snug">
                      {video.snippet.title}
                    </h3>
                    <p className="text-gray-400 text-xs mt-1">
                      {video.snippet.channelTitle}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Loading more spinner */}
          {loadingMore && (
            <div className="flex justify-center items-center py-10 gap-3">
              <div className="w-6 h-6 border-2 border-zinc-600 border-t-red-500 rounded-full animate-spin" />
              <span className="text-gray-400 text-sm">Loading more videos...</span>
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

          {/* Sentinel for IntersectionObserver */}
          <div ref={sentinelRef} className="h-1 w-full" />
        </>
      )}
    </div>
  );
}

export default Home;