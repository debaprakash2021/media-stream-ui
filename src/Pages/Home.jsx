import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { YT_API_BASE, YT_API_KEY, getRandomTopics, shuffleArray } from "../constants/api";
import ShimmerCard from "../Components/ShimmerCard";

// ✅ Fetches 4 videos for a single topic
async function fetchTopicVideos(topic) {
  try {
    const res = await fetch(
      `${YT_API_BASE}/search?part=snippet&type=video&maxResults=4` +
      `&q=${encodeURIComponent(topic)}&key=${YT_API_KEY}`
    );
    const data = await res.json();
    return (data.items || []).map(item => ({
      ...item,
      _topic: topic,
    }));
  } catch {
    return [];
  }
}

// ✅ Fires 6 topic fetches in parallel then shuffles all results together
async function fetchMixedFeed() {
  const topics = getRandomTopics(6);
  const results = await Promise.all(topics.map(t => fetchTopicVideos(t)));
  const allVideos = results.flat();
  return shuffleArray(allVideos);
}

function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sentinelRef = useRef(null);

  // ✅ Reads refresh param — logo click changes this to force a new feed
  const refreshKey = searchParams.get("refresh");

  // ── Core fetch function ─────────────────────────────────────────────
  const loadFeed = useCallback(async (reset = false) => {
    if (reset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const mixed = await fetchMixedFeed();

      if (mixed.length === 0) {
        setHasMore(false);
        return;
      }

      setVideos(prev => reset ? mixed : [...prev, ...mixed]);
      setHasMore(true);
    } catch (err) {
      console.error("Feed load error:", err);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // ── On first mount — load initial mixed feed ────────────────────────
  useEffect(() => {
    loadFeed(true);
  }, []);

  // ── Logo click changes ?refresh=<timestamp> — this fires a fresh feed
  useEffect(() => {
    if (refreshKey === null) return;
    setVideos([]);
    setHasMore(true);
    loadFeed(true);
  }, [refreshKey]);

  // ── IntersectionObserver — load next mixed batch on scroll ─────────
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !loadingMore && !loading) {
          loadFeed(false);
        }
      },
      { root: null, rootMargin: "300px", threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, loadFeed]);

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

      {/* Initial shimmer */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <ShimmerCard key={i} />
          ))}
        </div>
      ) : (
        <>
          {/* Mixed genre video grid */}
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

                  {/* Hover play overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-white text-2xl ml-1">▶</span>
                    </div>
                  </div>

                  {/* Genre tag on thumbnail */}
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full capitalize">
                    {video._topic}
                  </div>
                </div>

                {/* Video info row */}
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

          {/* End of feed */}
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