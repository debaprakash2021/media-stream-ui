import React from 'react';

const ShimmerCard = () => (
  <div className="bg-zinc-900 rounded-lg shadow border border-zinc-800 animate-pulse">
    <div className="w-full h-48 bg-zinc-800 rounded-t-lg" />
    <div className="p-3">
      <div className="h-5 bg-zinc-700 rounded w-3/4 mb-2" />
      <div className="h-4 bg-zinc-800 rounded w-1/2" />
    </div>
  </div>
);

export default ShimmerCard;