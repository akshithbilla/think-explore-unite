import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SearchRequest {
  query: string;
  type: 'all' | 'news' | 'images' | 'videos' | 'music';
  limit?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, type, limit = 10 }: SearchRequest = await req.json();

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Searching for: ${query}, type: ${type}`);

    let results: any[] = [];

    switch (type) {
      case 'news':
        results = await searchNews(query, limit);
        break;
      case 'images':
        results = await searchImages(query, limit);
        break;
      case 'videos':
        results = await searchVideos(query, limit);
        break;
      case 'music':
        results = await searchMusic(query, limit);
        break;
      default:
        // For 'all', we'll return a mix of results
        const [news, images, videos] = await Promise.all([
          searchNews(query, 3),
          searchImages(query, 3),
          searchVideos(query, 3)
        ]);
        results = [
          ...news.map(item => ({ ...item, type: 'news' })),
          ...images.map(item => ({ ...item, type: 'image' })),
          ...videos.map(item => ({ ...item, type: 'video' }))
        ];
        break;
    }

    return new Response(
      JSON.stringify({ results, total: results.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in search-external function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function searchNews(query: string, limit: number) {
  // Mock news results - replace with actual NewsAPI integration
  return Array.from({ length: Math.min(limit, 5) }, (_, i) => ({
    id: `news-${i}`,
    title: `${query} News Article ${i + 1}`,
    description: `This is a news article about ${query}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    url: `https://example-news.com/article-${i}`,
    thumbnail: `https://picsum.photos/400/300?random=${i}`,
    source: 'Example News',
    publishedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
  }));
}

async function searchImages(query: string, limit: number) {
  // Mock image results - replace with actual Unsplash/Pexels API integration
  return Array.from({ length: Math.min(limit, 8) }, (_, i) => ({
    id: `image-${i}`,
    title: `${query} Image ${i + 1}`,
    url: `https://picsum.photos/400/300?random=${i + 100}`,
    thumbnail: `https://picsum.photos/200/150?random=${i + 100}`,
    source: 'Picsum Photos',
    photographer: `Photographer ${i + 1}`,
  }));
}

async function searchVideos(query: string, limit: number) {
  // Mock video results - replace with actual YouTube API integration
  return Array.from({ length: Math.min(limit, 6) }, (_, i) => ({
    id: `video-${i}`,
    title: `${query} Video ${i + 1}`,
    description: `A video about ${query}. This is a mock description for demonstration purposes.`,
    url: `https://example-video.com/watch?v=${i}`,
    thumbnail: `https://picsum.photos/480/360?random=${i + 200}`,
    source: 'Example Video Platform',
    duration: `${Math.floor(Math.random() * 10) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
    views: Math.floor(Math.random() * 1000000),
    publishedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
  }));
}

async function searchMusic(query: string, limit: number) {
  // Mock music results - replace with actual Spotify/Deezer API integration
  return Array.from({ length: Math.min(limit, 8) }, (_, i) => ({
    id: `music-${i}`,
    title: `${query} Song ${i + 1}`,
    artist: `Artist ${i + 1}`,
    album: `Album ${i + 1}`,
    url: `https://example-music.com/track/${i}`,
    thumbnail: `https://picsum.photos/300/300?random=${i + 300}`,
    source: 'Example Music Platform',
    duration: `${Math.floor(Math.random() * 5) + 2}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
    releaseDate: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toISOString(),
  }));
}