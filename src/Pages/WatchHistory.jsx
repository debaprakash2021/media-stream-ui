import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WatchHistory = () => {
    const [history, setHistory] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem('watchHistory')) || [];
        setHistory(savedHistory);
    }, []);

    const clearHistory = () => {
        localStorage.removeItem('watchHistory');
        setHistory([]);
    };

    return (
        <div className="p-4 min-h-screen bg-black text-white">
            <div className="flex justify-between items-center mb-6 max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold">Watch History</h1>
                {history.length > 0 && (
                    <button
                        onClick={clearHistory}
                        className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 font-bold transition"
                    >
                        Clear History
                    </button>
                )}
            </div>

            {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <p className="text-xl">No watch history yet.</p>
                    <p className="text-sm mt-2">Videos you watch will appear here.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4 max-w-6xl mx-auto">
                    {history.map(video => (
                        <div
                            key={video.videoId}
                            className="flex gap-4 p-2 rounded hover:bg-zinc-900 cursor-pointer transition group"
                            onClick={() =>
                                navigate(`/watch?v=${video.videoId}`, {
                                    state: {
                                        videoId: video.videoId,
                                        title: video.title,
                                        channel: video.channel,
                                        description: video.description,
                                        thumbnail: video.thumbnail,
                                    },
                                })
                            }
                        >
                            <div className="relative shrink-0 w-40 sm:w-64 aspect-video rounded overflow-hidden">
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-lg font-semibold line-clamp-2 mb-1 group-hover:text-blue-400 transition">
                                    {video.title}
                                </h2>
                                <p className="text-gray-400 text-sm mb-2">{video.channel}</p>
                                <p className="text-gray-500 text-xs hidden sm:block line-clamp-2">
                                    {video.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WatchHistory;
