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
  try {
    const response = await fetch(`https://nexus-search.onrender.com/api/searchNews?query=${encodeURIComponent(query)}&limit=${limit}`);
    if (!response.ok) {
      throw new Error(`News API error: ${response.status}`);
    }
    const data = await response.json();
    return data.results || data || [];
  } catch (error) {
    console.error('News search error:', error);
    // Fallback to mock data
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
}

async function searchImages(query: string, limit: number) {
  try {
    const response = await fetch(`https://nexus-search.onrender.com/api/searchImages?query=${encodeURIComponent(query)}&limit=${limit}`);
    if (!response.ok) {
      throw new Error(`Images API error: ${response.status}`);
    }
    const data = await response.json();
    return data.results || data || [];
  } catch (error) {
    console.error('Images search error:', error);
    // Fallback to mock data
    return Array.from({ length: Math.min(limit, 8) }, (_, i) => ({
      id: `image-${i}`,
      title: `${query} Image ${i + 1}`,
      url: `https://picsum.photos/400/300?random=${i + 100}`,
      thumbnail: `https://picsum.photos/200/150?random=${i + 100}`,
      source: 'Picsum Photos',
      photographer: `Photographer ${i + 1}`,
    }));
  }
}

async function searchVideos(query: string, limit: number) {
  try {
    const response = await fetch(`https://nexus-search.onrender.com/api/youtube/search?query=${encodeURIComponent(query)}&limit=${limit}`);
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }
    const data = await response.json();
    return data.results || data || [];
  } catch (error) {
    console.error('Videos search error:', error);
    // Fallback to mock data
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
}

async function searchMusic(query: string, limit: number) {
  try {
    // Use Gemini API for music search
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBgGGMjRi95r9IcSpLEUaF8EUIQ3bpHO50`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Search for music related to "${query}". Return a JSON array of ${limit} music results with the following structure: [{"id": "unique_id", "title": "song_title", "artist": "artist_name", "album": "album_name", "url": "spotify_url", "thumbnail": "album_cover_url", "source": "Spotify", "duration": "3:45", "releaseDate": "2023-01-01"}]`
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (content) {
      try {
        // Extract JSON from the response
        const jsonMatch = content.match(/\[.*\]/s);
        if (jsonMatch) {
          const musicResults = JSON.parse(jsonMatch[0]);
          return Array.isArray(musicResults) ? musicResults : [];
        }
      } catch (parseError) {
        console.error('Error parsing Gemini response:', parseError);
      }
    }

    // Fallback to mock data
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
  } catch (error) {
    console.error('Music search error:', error);
    // Fallback to mock data
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
}