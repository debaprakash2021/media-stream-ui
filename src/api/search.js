import { YT_API_BASE, YT_API_KEY } from "../constants/api";
import { PAGE_SIZE } from "../constants/pagination";

export async function fetchSearchResults(query, pageToken = "") {
  const res = await fetch(
    `${YT_API_BASE}/search?part=snippet&type=video&maxResults=${PAGE_SIZE}&q=${encodeURIComponent(query)}&pageToken=${pageToken}&key=${YT_API_KEY}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch search results");
  }

  const data = await res.json();

  // ✅ Normalize to consistent shape TrendingCard expects
  const videos = (data.items || []).map(item => ({
    video_id: item.id.videoId,
    title: item.snippet.title,
    thumbnails: [{ url: item.snippet.thumbnails.medium.url }],
    channel: item.snippet.channelTitle,
  }));

  return {
    videos,
    nextPageToken: data.nextPageToken || null,
    prevPageToken: data.prevPageToken || null,
  };
}
