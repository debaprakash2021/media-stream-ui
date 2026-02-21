import { useState, useEffect, useCallback } from 'react';
import { YT_API_BASE, YT_API_KEY } from '../constants/api';

// ✅ Extracts the first 5 meaningful words from a video title
// These become the search query for related videos
// e.g. "How to Make Perfect Scrambled Eggs at Home" → "How to Make Perfect Scrambled"
function extractKeywords(title = '') {
  return title
    .replace(/[^a-zA-Z0-9\s]/g, '') // strip special chars
    .split(' ')
    .filter(Boolean)
    .slice(0, 5)
    .join(' ');
}

export function useRelatedVideos(videoId, videoTitle) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // ✅ Derive search query from title keywords — avoids deprecated relatedToVideoId
  const searchQuery = extractKeywords(videoTitle);

  // ── Fetch one page of related videos ─────────────────────────────
  const fetchRelated = useCallback(async (pageToken = '', reset = false) => {
    if (!searchQuery) return;

    if (reset) setLoading(true);
    else setLoadingMore(true);

    try {
      const res = await fetch(
        `${YT_API_BASE}/search?part=snippet&type=video&maxResults=10` +
        `&q=${encodeURIComponent(searchQuery)}` +
        `&pageToken=${pageToken}` +
        `&key=${YT_API_KEY}`
      );
      const data = await res.json();

      // Exclude the currently playing video from recommendations
      const items = (data.items || [])
        .filter(item => item.id.videoId !== videoId)
        .map(item => ({
          id: item.id.videoId,
          title: item.snippet.title,
          channel: item.snippet.channelTitle,
          thumbnail: item.snippet.thumbnails.medium.url,
        }));

      setVideos(prev => reset ? items : [...prev, ...items]);
      setNextPageToken(data.nextPageToken || null);
      setHasMore(!!data.nextPageToken);
    } catch (err) {
      console.error('Failed to fetch related videos:', err);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [searchQuery, videoId]);

  // ── Reset when video changes ───────────────────────────────────────
  useEffect(() => {
    if (!videoId || !videoTitle) return;
    setVideos([]);
    setNextPageToken(null);
    setHasMore(true);
    fetchRelated('', true);
  }, [videoId, videoTitle]);

  // ── loadMore exposed to the component for IntersectionObserver ─────
  const loadMore = useCallback(() => {
    if (!loadingMore && !loading && hasMore) {
      fetchRelated(nextPageToken || '');
    }
  }, [loadingMore, loading, hasMore, nextPageToken, fetchRelated]);

  return { videos, loading, loadingMore, hasMore, loadMore };
}