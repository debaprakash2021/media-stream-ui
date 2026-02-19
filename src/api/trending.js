import { YT_API_BASE, YT_API_KEY } from "../constants/api";

export async function fetchTrendingVideos() {
  const res = await fetch(
    `${YT_API_BASE}/videos?part=snippet&chart=mostPopular&maxResults=12&regionCode=US&key=${YT_API_KEY}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch trending videos");
  }

  const data = await res.json();

  // ✅ Normalize to the consistent shape TrendingCard expects
  return (data.items || []).map(item => ({
    video_id: item.id,
    title: item.snippet.title,
    thumbnails: [{ url: item.snippet.thumbnails.medium.url }],
    channel: item.snippet.channelTitle,
  }));
}
