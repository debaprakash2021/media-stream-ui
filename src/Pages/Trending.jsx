import React from 'react';
import {
  TRENDING_VIDEOS,
  TrendingVideoCard,
} from '../Components/TrendingVideoCard';

const Trending = () => {
  return (
    <div className="p-4 bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-white">Trending</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {TRENDING_VIDEOS.map(video => (
          <TrendingVideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default Trending;