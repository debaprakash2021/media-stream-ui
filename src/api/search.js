import { RAPID_API_HOST } from "../constants/api";
import { PAGE_SIZE } from "../constants/pagination";

const SEARCH_ENDPOINT = "https://youtube-v2.p.rapidapi.com/search";

export async function fetchSearchResults(query, page = 1) {
  // ✅ CORRECTION: calculate offset based on page
  const offset = (page - 1) * PAGE_SIZE;

  const res = await fetch(
    `${SEARCH_ENDPOINT}?query=${query}&limit=${PAGE_SIZE}&offset=${offset}`,
    {
      headers: {
        "X-RapidAPI-Key": import.meta.env.VITE_RAPID_API_KEY,
        "X-RapidAPI-Host": RAPID_API_HOST,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch search results");
  }

  const data = await res.json();

  // ✅ CORRECTION: normalize API response
  return data.videos || data.items || [];
}
