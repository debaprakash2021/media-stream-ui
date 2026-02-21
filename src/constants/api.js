export const YT_API_BASE = "https://www.googleapis.com/youtube/v3";
export const YT_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

// ✅ Pool of topics — logo click and browser refresh pick randomly from here
export const HOME_TOPICS = [
  "music",
  "gaming",
  "technology",
  "cooking",
  "travel",
  "sports",
  "movies",
  "science",
  "fitness",
  "fashion",
  "news",
  "comedy",
  "education",
  "nature",
  "cars",
  "photography",
  "history",
  "animation",
  "finance",
  "space",
  "art",
  "dance",
];

// ✅ Returns a random topic different from the current one
export function getRandomTopic(currentTopic = "") {
  const filtered = HOME_TOPICS.filter(t => t !== currentTopic);
  return filtered[Math.floor(Math.random() * filtered.length)];
}