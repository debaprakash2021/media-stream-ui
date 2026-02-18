import React from 'react';

const TRENDING_VIDEOS = [
  {
    id: '1',
    title: 'Epic Mountain Adventure',
    channel: 'NatureX',
    thumbnail: 'https://i.ytimg.com/vi/ScMzIvxBSi4/mqdefault.jpg',
  },
  {
    id: '2',
    title: 'Top 10 Coding Tricks',
    channel: 'CodeMaster',
    thumbnail: 'https://i.ytimg.com/vi/2Ji-clqUYnA/mqdefault.jpg',
  },
  {
    id: '3',
    title: 'Live Concert 2026',
    channel: 'MusicLive',
    thumbnail: 'https://i.ytimg.com/vi/3fumBcKC6RE/mqdefault.jpg',
  },
  {
    id: '4',
    title: 'SpaceX Launch Highlights',
    channel: 'SpaceWorld',
    thumbnail: 'https://i.ytimg.com/vi/1w7OgIMMRc4/mqdefault.jpg',
  },
  {
    id: '5',
    title: 'Street Food Tour',
    channel: 'Foodies',
    thumbnail: 'https://i.ytimg.com/vi/4UZrsTqkcW4/mqdefault.jpg',
  },
  {
    id: '6',
    title: 'React in 10 Minutes',
    channel: 'DevSimplified',
    thumbnail: 'https://i.ytimg.com/vi/bMknfKXIFA8/mqdefault.jpg',
  },
];

const TrendingVideoCard = ({ video }) => (
  <div className="bg-zinc-900 rounded-lg shadow hover:shadow-lg transition border border-zinc-800">
    <img
      src={video.thumbnail}
      alt={video.title}
      className="w-full h-48 object-cover rounded-t-lg"
    />
    <div className="p-3">
      <h2 className="font-semibold text-lg mb-1 line-clamp-2 text-white">
        {video.title}
      </h2>
      <p className="text-gray-400 text-sm line-clamp-2">{video.channel}</p>
    </div>
  </div>
);

export { TRENDING_VIDEOS, TrendingVideoCard };