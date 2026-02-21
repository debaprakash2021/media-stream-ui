import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { YT_API_BASE, YT_API_KEY } from "../constants/api";
import ShimmerCard from "../Components/ShimmerCard";

function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextPageToken, setNextPageToken] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

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
          setNextPageToken(data.nextPageToken || "");
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

  const handleNext = () => {
    if (nextPageToken) setSearchParams({ query, pageToken: nextPageToken });
  };

  const handlePrev = () => {
    setSearchParams({ query, pageToken: "" });
  };

  return (
    <div className="p-4 min-h-screen">
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <ShimmerCard key={i} />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div
                key={video.id.videoId}
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

          <div className="mt-8 flex justify-center gap-4">
            {pageToken && (
              <button
                onClick={handlePrev}
                className="px-5 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition font-medium"
              >
                ← Previous
              </button>
            )}
            {nextPageToken && (
              <button
                onClick={handleNext}
                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
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