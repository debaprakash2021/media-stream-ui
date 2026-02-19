import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ CORRECTION: URL-driven state instead of props
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("query") || "music"; // default query
  const pageToken = searchParams.get("pageToken") || "";

  useEffect(() => {
    let ignore = false; // ✅ CORRECTION: Proper cleanup flag

    async function fetchVideos() {
      setLoading(true);

      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=12&q=${query}&pageToken=${pageToken}&key=${API_KEY}`
        );

        const data = await res.json();

        if (!ignore) {
          setVideos(data.items || []);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchVideos();

    return () => {
      // ✅ CORRECTION: Cleanup to prevent memory leaks
      ignore = true;
    };
  }, [query, pageToken]);

  const handlePagination = (token) => {
    // ✅ CORRECTION: Persist pagination in URL instead of state
    setSearchParams({
      query,
      pageToken: token,
    });
  };

  return (
    <div className="p-4 min-h-screen">
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* ✅ CORRECTION: Layout shift prevention using fixed aspect ratio */}
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-video bg-zinc-800 rounded-lg mb-3"></div>
              <div className="h-4 bg-zinc-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-zinc-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video.id.videoId} className="cursor-pointer">
                <div className="aspect-video overflow-hidden rounded-lg">
                  <img
                    src={video.snippet.thumbnails.medium.url}
                    alt={video.snippet.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="mt-2 font-semibold line-clamp-2">
                  {video.snippet.title}
                </h3>
              </div>
            ))}
          </div>

          {/* Example Pagination Button (Replace with component later) */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => handlePagination("CAUQAA")}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Next Page
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
