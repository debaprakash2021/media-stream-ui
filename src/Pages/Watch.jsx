import { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRelatedVideos } from '../hooks/useRelatedVideos';

const SAMPLE_URLS = {
  ScMzIvxBSi4: {
    '1080p': 'https://www.w3schools.com/html/mov_bbb.mp4',
    '720p': 'https://www.w3schools.com/html/movie.mp4',
    '480p': 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
};

const INITIAL_COMMENTS = [
  { id: 1, user: 'Rab', text: 'Amazing video! So inspiring.' },
  { id: 2, user: 'Sam', text: 'Loved the scenery.' },
];

const Watch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};

  // ✅ Real recommendations from YouTube API
  const { videos: relatedVideos, loading: relatedLoading } = useRelatedVideos(
    state.videoId || null
  );

  const [likes, setLikes] = useState(1234);
  const [dislikes, setDislikes] = useState(56);
  const [subscribed, setSubscribed] = useState(false);
  const [comments, setComments] = useState(INITIAL_COMMENTS);
  const [commentInput, setCommentInput] = useState('');
  const [autoplay, setAutoplay] = useState(false);
  const [resolution, setResolution] = useState('1080p');
  const videoRef = useRef(null);
  const [hoverTime, setHoverTime] = useState(null);
  const [duration, setDuration] = useState(0);

  const handleLike = () => setLikes(l => l + 1);
  const handleDislike = () => setDislikes(d => d + 1);
  const handleSubscribe = () => setSubscribed(s => !s);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Video link copied!');
  };

  const handleComment = e => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setComments(prev => [
      { id: Date.now(), user: 'You', text: commentInput },
      ...prev,
    ]);
    setCommentInput('');
  };

  const handleEnded = () => {
    if (autoplay && videoRef.current) {
      videoRef.current.src =
        SAMPLE_URLS['ScMzIvxBSi4'][resolution] ||
        SAMPLE_URLS['ScMzIvxBSi4']['1080p'];
      videoRef.current.play();
    }
  };

  const handleProgressHover = e => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setHoverTime(percent * duration);
  };

  const handleProgressLeave = () => setHoverTime(null);

  // Save to watch history
  useEffect(() => {
    if (state.videoId) {
      const videoData = {
        videoId: state.videoId,
        title: state.title,
        channel: state.channel,
        description: state.description,
        thumbnail: state.thumbnail,
        timestamp: Date.now(),
      };
      const history = JSON.parse(localStorage.getItem('watchHistory')) || [];
      const filtered = history.filter(v => v.videoId !== state.videoId);
      localStorage.setItem(
        'watchHistory',
        JSON.stringify([videoData, ...filtered].slice(0, 50))
      );
    }
  }, [state.videoId]);

  // ✅ Clicking a recommended video loads it in the same Watch page
  const handleRelatedClick = (video) => {
    navigate('/watch', {
      state: {
        videoId: video.id,
        title: video.title,
        channel: video.channel,
        description: '',
        thumbnail: video.thumbnail,
      },
    });
  };

  const videoSrc = state.videoId
    ? `https://www.youtube.com/embed/${state.videoId}?autoplay=1`
    : SAMPLE_URLS['ScMzIvxBSi4'][resolution];

  const title = state.title || 'Epic Mountain Adventure';
  const channel = state.channel || 'NatureX';
  const description =
    state.description ||
    'Experience the thrill of mountain climbing in this breathtaking adventure video.';
  const poster =
    state.thumbnail || 'https://i.ytimg.com/vi/ScMzIvxBSi4/maxresdefault.jpg';

  return (
    <div className="p-4 flex flex-col md:flex-row items-start bg-black min-h-screen gap-8">

      {/* ── Main Video Column ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* ✅ Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 text-gray-400 hover:text-white transition text-sm self-start"
        >
          <span className="text-lg">←</span> Back
        </button>

        {/* Video player */}
        <div className="w-full aspect-video bg-black rounded-lg border border-zinc-800 relative overflow-hidden">
          {state.videoId ? (
            <iframe
              className="w-full h-full rounded-lg"
              src={videoSrc}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              <video
                ref={videoRef}
                className="w-full h-full rounded-lg"
                controls
                poster={poster}
                onEnded={handleEnded}
                onLoadedMetadata={e => setDuration(e.target.duration)}
                src={videoSrc}
              >
                Your browser does not support the video tag.
              </video>

              {/* Resolution selector */}
              <div className="absolute top-2 right-2 z-20">
                <select
                  value={resolution}
                  onChange={e => setResolution(e.target.value)}
                  className="bg-zinc-900 text-white border border-zinc-700 rounded px-2 py-1 text-sm"
                >
                  <option value="1080p">1080p</option>
                  <option value="720p">720p</option>
                  <option value="480p">480p</option>
                </select>
              </div>
            </>
          )}

          {/* Progress bar hover tooltip */}
          <div
            className="absolute bottom-0 left-0 w-full h-4 z-10"
            onMouseMove={handleProgressHover}
            onMouseLeave={handleProgressLeave}
          >
            {hoverTime !== null && (
              <div className="absolute left-1/2 -translate-x-1/2 bottom-6 bg-black text-white text-xs px-2 py-1 rounded shadow border border-zinc-700">
                {new Date(hoverTime * 1000).toISOString().substr(14, 5)}
              </div>
            )}
          </div>
        </div>

        {/* Video meta */}
        <div className="mt-4 w-full">
          <h1 className="text-xl font-bold text-white leading-snug">{title}</h1>
          <p className="text-gray-400 text-sm mt-1">{channel}</p>

          {/* Action row */}
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <button
              className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-zinc-800 text-white hover:bg-zinc-700 text-sm transition"
              onClick={handleLike}
            >
              👍 <span className="font-medium">{likes.toLocaleString()}</span>
            </button>

            <button
              className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-zinc-800 text-white hover:bg-zinc-700 text-sm transition"
              onClick={handleDislike}
            >
              👎 <span className="font-medium">{dislikes.toLocaleString()}</span>
            </button>

            <button
              className={`px-4 py-1.5 rounded-full font-semibold text-sm transition ${
                subscribed
                  ? 'bg-zinc-600 text-white hover:bg-zinc-500'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
              onClick={handleSubscribe}
            >
              {subscribed ? '✓ Subscribed' : 'Subscribe'}
            </button>

            <button
              className="px-4 py-1.5 rounded-full bg-zinc-800 text-white hover:bg-zinc-700 text-sm transition"
              onClick={handleShare}
            >
              ↗ Share
            </button>

            <label className="flex items-center gap-2 text-white text-sm cursor-pointer select-none ml-auto">
              <input
                type="checkbox"
                checked={autoplay}
                onChange={e => setAutoplay(e.target.checked)}
                className="accent-red-600 w-4 h-4"
              />
              Autoplay
            </label>
          </div>

          {/* Description */}
          <div className="mt-4 bg-zinc-900 rounded-lg p-4 border border-zinc-800">
            <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
              {description}
            </p>
          </div>

          {/* Comments */}
          <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800 mt-4">
            <h3 className="text-base font-bold text-white mb-3">
              💬 Comments ({comments.length})
            </h3>

            <form onSubmit={handleComment} className="flex gap-2 mb-4">
              <input
                type="text"
                value={commentInput}
                onChange={e => setCommentInput(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700 text-sm outline-none focus:border-blue-500 transition"
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-bold hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Post
              </button>
            </form>

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {comments.map(c => (
                <div key={c.id} className="bg-zinc-800 rounded-lg p-3 text-white text-sm">
                  <span className="font-bold text-red-400 mr-2">{c.user}</span>
                  {c.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Recommendations Column ── */}
      <aside className="w-full md:w-80 shrink-0">
        <h2 className="text-base font-bold text-white mb-4">Up Next</h2>

        {relatedLoading ? (
          // Shimmer skeleton while loading
          <div className="flex flex-col gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-2 animate-pulse">
                <div className="w-40 aspect-video bg-zinc-800 rounded-lg shrink-0" />
                <div className="flex-1 py-1">
                  <div className="h-3 bg-zinc-700 rounded w-full mb-2" />
                  <div className="h-3 bg-zinc-700 rounded w-3/4 mb-2" />
                  <div className="h-2 bg-zinc-800 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : relatedVideos.length > 0 ? (
          // ✅ Real related videos from YouTube API
          <div className="flex flex-col gap-3">
            {relatedVideos.map(video => (
              <div
                key={video.id}
                className="flex gap-2 cursor-pointer group"
                onClick={() => handleRelatedClick(video)}
              >
                <div className="relative w-40 aspect-video rounded-lg overflow-hidden shrink-0">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <span className="text-white text-xl">▶</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0 py-0.5">
                  <p className="text-white text-xs font-semibold line-clamp-2 leading-snug group-hover:text-red-400 transition">
                    {video.title}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">{video.channel}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No recommendations available.</p>
        )}
      </aside>
    </div>
  );
};

export default Watch;