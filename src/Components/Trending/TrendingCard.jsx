import { useNavigate } from "react-router-dom";

function TrendingCard({ video }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/watch", {
      state: {
        videoId: video.video_id,
        title: video.title,
        channel: video.channel || "",
        description: video.description || "",
        thumbnail: video.thumbnails?.[0]?.url || "",
      },
    });
  };

  return (
    <div
      className="cursor-pointer group"
      onClick={handleClick}
    >
      <div className="aspect-video overflow-hidden rounded-lg relative">
        <img
          src={video.thumbnails?.[0]?.url}
          alt={video.title}
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
            {video.channel?.[0]?.toUpperCase() || "V"}
          </span>
        </div>
        <div className="overflow-hidden">
          <h3 className="font-semibold line-clamp-2 text-white text-sm leading-snug group-hover:text-red-400 transition">
            {video.title}
          </h3>
          {video.channel && (
            <p className="text-gray-400 text-xs mt-1">{video.channel}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TrendingCard;