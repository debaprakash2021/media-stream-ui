import { RAPID_API_HOST } from "../constants/api";

const SEARCH_ENDPOINT = "https://youtube-v2.p.rapidapi.com/search";

export async function fetchSearchResults(query) {
  const res = await fetch(`${SEARCH_ENDPOINT}?query=${query}`, {
    headers: {
      "X-RapidAPI-Key": import.meta.env.VITE_RAPID_API_KEY,
      "X-RapidAPI-Host": RAPID_API_HOST,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch search results");
  }

  const data = await res.json();

  // ✅ CORRECTION: normalize response here
  return data.videos || data.items || [];
}
