import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ShimmerCard from '../Components/ShimmerCard';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const Home = ({
  searchQuery,
  pageToken,
  onTokens,
  onPageChange,
  nextPageToken,
  prevPageToken,
  currentPage,
}) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchQuery) return;
    let ignore = false;
    const fetchVideos = async () => {
      setLoading(true);
      setError(null);
      let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${encodeURIComponent(searchQuery)}&type=video&key=${API_KEY}`;
      if (pageToken) url += `&pageToken=${pageToken}`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        if (ignore) return;
        setVideos(data.items || []);
        setLoading(false);
        if (onTokens) onTokens(data.nextPageToken, data.prevPageToken);
      } catch {
        if (ignore) return;
        setError('Failed to fetch videos');
        setLoading(false);
      }
    };
    fetchVideos();
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line
  }, [searchQuery, pageToken]);

  if (loading) {
    return (
      <div className="p-4 min-h-screen bg-black flex flex-col">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 flex-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <ShimmerCard key={i} />
          ))}
        </div>
        <div className="flex justify-center gap-4 mt-8">
          <button
            className="px-4 py-2 rounded bg-zinc-800 text-white disabled:opacity-50"
            disabled
          >
            Previous
          </button>
          <span className="text-white font-semibold">Page {currentPage}</span>
          <button
            className="px-4 py-2 rounded bg-zinc-800 text-white disabled:opacity-50"
            disabled
          >
            Next
          </button>
        </div>
      </div>
    );
  }
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 min-h-screen bg-black flex flex-col">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 flex-1">
        {videos.map(video => (
          <div
            key={video.id.videoId}
            className="bg-zinc-900 rounded-lg shadow hover:shadow-lg transition border border-zinc-800 cursor-pointer"
            onClick={() =>
              navigate(`/watch?v=${video.id.videoId}`, {
                state: {
                  videoId: video.id.videoId,
                  title: video.snippet.title,
                  channel: video.snippet.channelTitle,
                  description: video.snippet.description,
                  thumbnail:
                    video.snippet.thumbnails.high?.url ||
                    video.snippet.thumbnails.medium.url,
                },
              })
            }
          >
            <img
              src={video.snippet.thumbnails.medium.url}
              alt={video.snippet.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="p-3">
              <h2 className="font-semibold text-lg mb-1 line-clamp-2 text-white">
                {video.snippet.title}
              </h2>
              <p className="text-gray-400 text-sm line-clamp-2">
                {video.snippet.channelTitle}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-4 mt-8">
        <button
          className="px-4 py-2 rounded bg-zinc-800 text-white disabled:opacity-50"
          onClick={() => onPageChange(prevPageToken, -1)}
          disabled={!prevPageToken || currentPage === 1}
        >
          Previous
        </button>
        <span className="text-white font-semibold">Page {currentPage}</span>
        <button
          className="px-4 py-2 rounded bg-zinc-800 text-white disabled:opacity-50"
          onClick={() => onPageChange(nextPageToken, 1)}
          disabled={!nextPageToken}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;