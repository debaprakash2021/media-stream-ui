import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { YT_API_BASE, YT_API_KEY } from "../constants/api";
import ShimmerCard from "../Components/ShimmerCard";

function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get("query") || "music";

  // Sentinel div ref — IntersectionObserver watches this
  const sentinelRef = useRef(null);
  // Track current query to reset on query change
  const currentQueryRef = useRef(query);

  // ── Fetch a page of videos ──────────────────────────────────────────
  const fetchVideos = useCallback(async (pageToken = "", reset = false) => {
    if (reset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

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

  // ── Reset when query changes ────────────────────────────────────────
  useEffect(() => {
    currentQueryRef.current = query;
    setVideos([]);
    setNextPageToken(null);
    setHasMore(true);
    fetchVideos("", true);
  }, [query]);

  // ── IntersectionObserver — fires when sentinel enters viewport ──────
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        // Only load more if: sentinel is visible + not already loading + more pages exist
        if (entry.isIntersecting && hasMore && !loadingMore && !loading) {
          fetchVideos(nextPageToken || "");
        }
      },
      {
        root: null,       // viewport
        rootMargin: "200px", // start loading 200px before sentinel is visible
        threshold: 0,
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, nextPageToken, fetchVideos]);

  // ── Navigate to Watch page ──────────────────────────────────────────
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

      {/* Initial load shimmer */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <ShimmerCard key={i} />
          ))}
        </div>
      ) : (
        <>
          {/* Video grid — new videos append here */}
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

          {/* Loading more spinner — shows between pages */}
          {loadingMore && (
            <div className="flex justify-center items-center py-10 gap-3">
              <div className="w-6 h-6 border-2 border-zinc-600 border-t-red-500 rounded-full animate-spin" />
              <span className="text-gray-400 text-sm">Loading more videos...</span>
            </div>
          )}

          {/* End of results message */}
          {!hasMore && !loadingMore && videos.length > 0 && (
            <div className="flex flex-col items-center py-10 gap-2">
              <div className="w-10 h-px bg-zinc-700" />
              <p className="text-gray-500 text-sm">You've reached the end</p>
              <div className="w-10 h-px bg-zinc-700" />
            </div>
          )}

          {/* Sentinel — IntersectionObserver watches this invisible div */}
          <div ref={sentinelRef} className="h-1 w-full" />
        </>
      )}
    </div>
  );
}

export default Home;