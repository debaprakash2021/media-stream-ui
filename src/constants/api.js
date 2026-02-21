export const YT_API_BASE = "https://www.googleapis.com/youtube/v3";
export const YT_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

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
  "food",
  "politics",
  "pets",
];

// ✅ Returns N unique random topics — used to build mixed feeds
export function getRandomTopics(count = 6, exclude = []) {
  const filtered = HOME_TOPICS.filter(t => !exclude.includes(t));
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// ✅ Shuffles an array — used to interleave videos from different genres
export function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}