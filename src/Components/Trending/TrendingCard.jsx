function TrendingCard({ video }) {
  return (
    <div className="cursor-pointer">
      <div className="aspect-video overflow-hidden rounded-lg">
        <img
          src={video.thumbnails[0]?.url}
          alt={video.title}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="mt-2 font-semibold line-clamp-2">
        {video.title}
      </h3>
    </div>
  );
}

export default TrendingCard;
