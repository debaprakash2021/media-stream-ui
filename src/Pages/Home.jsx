import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { YT_API_BASE, YT_API_KEY } from "../constants/api";
import ShimmerCard from "../Components/ShimmerCard";

function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextPageToken, setNextPageToken] = useState(""); // ✅ dynamic token from API

  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") || "music";
  const pageToken = searchParams.get("pageToken") || "";

  useEffect(() => {
    let ignore = false;
    setLoading(true);

    async function fetchVideos() {
      try {
        const res = await fetch(
          `${YT_API_BASE}/search?part=snippet&type=video&maxResults=12&q=${encodeURIComponent(query)}&pageToken=${pageToken}&key=${YT_API_KEY}`
        );
        const data = await res.json();

        if (!ignore) {
          setVideos(data.items || []);
          setNextPageToken(data.nextPageToken || ""); // ✅ save real token from response
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchVideos();
    return () => { ignore = true; };
  }, [query, pageToken]);

  const handleNext = () => {
    if (nextPageToken) {
      setSearchParams({ query, pageToken: nextPageToken }); // ✅ real dynamic token
    }
  };

  const handlePrev = () => {
    setSearchParams({ query, pageToken: "" });
  };

  return (
    <div className="p-4 min-h-screen">
      {loading ? (
        // ✅ Using ShimmerCard component instead of inline shimmer
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <ShimmerCard key={i} />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video.id.videoId} className="cursor-pointer group">
                <div className="aspect-video overflow-hidden rounded-lg">
                  <img
                    src={video.snippet.thumbnails.medium.url}
                    alt={video.snippet.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <h3 className="mt-2 font-semibold line-clamp-2 text-white">
                  {video.snippet.title}
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  {video.snippet.channelTitle}
                </p>
              </div>
            ))}
          </div>

          {/* ✅ Pagination using real API tokens */}
          <div className="mt-8 flex justify-center gap-4">
            {pageToken && (
              <button
                onClick={handlePrev}
                className="px-4 py-2 bg-zinc-700 text-white rounded hover:bg-zinc-600 transition"
              >
                ← Previous
              </button>
            )}
            {nextPageToken && (
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Next →
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
