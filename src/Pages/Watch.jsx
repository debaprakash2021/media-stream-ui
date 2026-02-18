import React, { useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  TRENDING_VIDEOS,
  TrendingVideoCard,
} from '../Components/TrendingVideoCard';

const YT_BASE = 'https://www.youtube.com/embed/';
const SAMPLE_URLS = {
  ScMzIvxBSi4: {
    '1080p': 'https://www.w3schools.com/html/mov_bbb.mp4',
    '720p': 'https://www.w3schools.com/html/movie.mp4',
    '480p': 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
};

const COMMENTS = [
  { id: 1, user: 'Rab', text: 'Amazing video! So inspiring.' },
  { id: 2, user: 'Sam', text: 'Loved the scenery.' },
];

const Watch = () => {
  const location = useLocation();
  const state = location.state || {};
  const [likes, setLikes] = useState(1234);
  const [dislikes, setDislikes] = useState(56);
  const [subscribed, setSubscribed] = useState(false);
  const [comments, setComments] = useState(COMMENTS);
  const [commentInput, setCommentInput] = useState('');
  const [autoplay, setAutoplay] = useState(false);
  const [resolution, setResolution] = useState('1080p');
  const videoRef = useRef(null);
  const [hoverTime, setHoverTime] = useState(null);
  const [duration, setDuration] = useState(0);

  // Simulate next video for autoplay
  // const nextVideo = TRENDING_VIDEOS[1];

  const handleLike = () => setLikes(likes + 1);
  const handleDislike = () => setDislikes(dislikes + 1);
  const handleSubscribe = () => setSubscribed(s => !s);
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Video link copied!');
  };
  const handleComment = e => {
    e.preventDefault();
    if (commentInput.trim()) {
      setComments([
        { id: Date.now(), user: 'You', text: commentInput },
        ...comments,
      ]);
      setCommentInput('');
    }
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
    const rect = e.target.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setHoverTime(percent * duration);
  };
  const handleProgressLeave = () => setHoverTime(null);

  // Determine video source
  let videoSrc = SAMPLE_URLS['ScMzIvxBSi4'][resolution];
  let title = 'Epic Mountain Adventure';
  let channel = 'NatureX';
  let description =
    'Experience the thrill of mountain climbing in this breathtaking adventure video. Join us as we scale new heights!';
  let poster = 'https://i.ytimg.com/vi/ScMzIvxBSi4/maxresdefault.jpg';
  if (state.videoId) {
    // In real app, fetch video URLs for resolutions
    videoSrc = `https://www.youtube.com/embed/${state.videoId}`;
    title = state.title;
    channel = state.channel;
    description = state.description;
    poster = state.thumbnail;
  }

  return (
    <div className="p-4 flex flex-col md:flex-row items-start bg-black min-h-screen gap-8">
      {/* Main Video Section */}
      <div className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-3xl aspect-video bg-black mb-4 flex items-center justify-center rounded-lg border border-zinc-800 relative">
          {state.videoId ? (
            <iframe
              className="w-full h-full rounded-lg"
              src={videoSrc}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              poster={poster}
            />
          ) : (
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
          )}
          {/* Resolution selector (only for local sample video) */}
          {!state.videoId && (
            <div className="absolute top-2 right-2 z-20">
              <select
                value={resolution}
                onChange={e => setResolution(e.target.value)}
                className="bg-zinc-900 text-white border border-zinc-700 rounded px-2 py-1"
              >
                <option value="1080p">1080p</option>
                <option value="720p">720p</option>
                <option value="480p">480p</option>
              </select>
            </div>
          )}
          {/* Custom progress bar preview */}
          <div
            className="absolute bottom-2 left-0 w-full h-2 cursor-pointer z-10"
            onMouseMove={handleProgressHover}
            onMouseLeave={handleProgressLeave}
            style={{ pointerEvents: 'none' }}
          >
            {hoverTime !== null && (
              <div className="absolute left-1/2 -translate-x-1/2 bottom-6 bg-black text-white text-xs px-2 py-1 rounded shadow border border-zinc-700">
                {new Date(hoverTime * 1000).toISOString().substr(14, 5)}
              </div>
            )}
          </div>
        </div>
        <div className="w-full max-w-3xl">
          <h1 className="text-2xl font-bold mb-2 text-white">{title}</h1>
          <p className="text-gray-400 mb-4">{channel}</p>
          <div className="flex items-center gap-4 mb-4">
            <button
              className="flex items-center gap-1 px-3 py-1 rounded bg-zinc-800 text-white hover:bg-zinc-700"
              onClick={handleLike}
            >
              👍 {likes}
            </button>
            <button
              className="flex items-center gap-1 px-3 py-1 rounded bg-zinc-800 text-white hover:bg-zinc-700"
              onClick={handleDislike}
            >
              👎 {dislikes}
            </button>
            <button
              className={`px-3 py-1 rounded font-bold ${subscribed ? 'bg-red-600 text-white' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
              onClick={handleSubscribe}
            >
              {subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
            <button
              className="px-3 py-1 rounded bg-zinc-800 text-white hover:bg-zinc-700"
              onClick={handleShare}
            >
              Share
            </button>
            <label className="flex items-center gap-1 text-white cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoplay}
                onChange={e => setAutoplay(e.target.checked)}
                className="accent-red-600"
              />
              Autoplay next
            </label>
          </div>
          <p className="text-gray-300 mb-4">{description}</p>
          {/* Comments Section */}
          <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800 mt-6">
            <h3 className="text-lg font-bold text-white mb-2">Comments</h3>
            <form onSubmit={handleComment} className="flex gap-2 mb-4">
              <input
                type="text"
                value={commentInput}
                onChange={e => setCommentInput(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-1 rounded bg-zinc-800 text-white border border-zinc-700"
              />
              <button
                type="submit"
                className="px-4 py-1 rounded bg-red-600 text-white font-bold hover:bg-red-700"
              >
                Comment
              </button>
            </form>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {comments.length === 0 && (
                <div className="text-gray-400">No comments yet.</div>
              )}
              {comments.map(c => (
                <div key={c.id} className="bg-zinc-800 rounded p-2 text-white">
                  <span className="font-bold mr-2">{c.user}:</span>
                  {c.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Recommendations Section */}
      <aside className="w-full md:w-96 shrink-0 mt-8 md:mt-0">
        <h2 className="text-xl font-bold mb-4 text-white">Recommended</h2>
        <div className="flex flex-col gap-4">
          {TRENDING_VIDEOS.filter(v => v.id !== '1').map(video => (
            <div key={video.id} className="cursor-pointer">
              <TrendingVideoCard video={video} />
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
};

export default Watch;