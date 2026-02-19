import { useState, useEffect } from 'react';
import { YT_API_BASE, YT_API_KEY } from '../constants/api';

export function useRelatedVideos(videoId) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!videoId) return;
    let ignore = false;
    setLoading(true);

    fetch(
      `${YT_API_BASE}/search?part=snippet&type=video&relatedToVideoId=${videoId}&maxResults=8&key=${YT_API_KEY}`
    )
      .then(res => res.json())
      .then(data => {
        if (!ignore) {
          setVideos(
            (data.items || []).map(item => ({
              id: item.id.videoId,
              title: item.snippet.title,
              channel: item.snippet.channelTitle,
              thumbnail: item.snippet.thumbnails.medium.url,
            }))
          );
        }
      })
      .catch(() => { if (!ignore) setVideos([]); })
      .finally(() => { if (!ignore) setLoading(false); });

    return () => { ignore = true; };
  }, [videoId]);

  return { videos, loading };
}
