import { RAPID_API_HOST, TRENDING_ENDPOINT } from "../constants/api";

export async function fetchTrendingVideos() {
  const res = await fetch(TRENDING_ENDPOINT, {
    headers: {
      "X-RapidAPI-Key": import.meta.env.VITE_RAPID_API_KEY,
      "X-RapidAPI-Host": RAPID_API_HOST,
    },
  });

  if (!res.ok) {
    // ✅ CORRECTION: Proper error signaling to UI
    throw new Error("Failed to fetch trending videos");
  }

  const data = await res.json();

  // ✅ CORRECTION:
  // Normalize API response HERE, not in UI.
  // RapidAPI responses vary between `videos` and `items`
  return data.videos || data.items || [];
}
