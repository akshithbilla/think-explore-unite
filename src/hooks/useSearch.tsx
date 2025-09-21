import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnail?: string;
  source: string;
  type: 'blog' | 'news' | 'image' | 'video' | 'music';
  publishedAt?: string;
  author?: string;
  duration?: string;
  views?: number;
}

// Direct API search functions as fallback
const searchDirectAPIs = async (query: string, type: string): Promise<SearchResult[]> => {
  const results: SearchResult[] = [];
  
  try {
    switch (type) {
      case 'news':
        const newsResponse = await fetch(`https://nexus-search.onrender.com/api/searchNews?query=${encodeURIComponent(query)}&limit=10`);
        if (newsResponse.ok) {
          const newsData = await newsResponse.json();
          const newsResults = (newsData.results || newsData || []).map((item: any) => ({
            id: `news-${item.id || Math.random()}`,
            title: item.title,
            description: item.description,
            url: item.url,
            thumbnail: item.thumbnail,
            source: item.source || 'News API',
            type: 'news' as const,
            publishedAt: item.publishedAt,
          }));
          results.push(...newsResults);
        }
        break;
        
      case 'images':
        const imagesResponse = await fetch(`https://nexus-search.onrender.com/api/searchImages?query=${encodeURIComponent(query)}&limit=10`);
        if (imagesResponse.ok) {
          const imagesData = await imagesResponse.json();
          const imageResults = (imagesData.results || imagesData || []).map((item: any) => ({
            id: `image-${item.id || Math.random()}`,
            title: item.title,
            description: item.description,
            url: item.url,
            thumbnail: item.thumbnail,
            source: item.source || 'Images API',
            type: 'image' as const,
          }));
          results.push(...imageResults);
        }
        break;
        
      case 'videos':
        const videosResponse = await fetch(`https://nexus-search.onrender.com/api/youtube/search?query=${encodeURIComponent(query)}&limit=10`);
        if (videosResponse.ok) {
          const videosData = await videosResponse.json();
          const videoResults = (videosData.results || videosData || []).map((item: any) => ({
            id: `video-${item.id || Math.random()}`,
            title: item.title,
            description: item.description,
            url: item.url,
            thumbnail: item.thumbnail,
            source: item.source || 'YouTube API',
            type: 'video' as const,
            duration: item.duration,
            views: item.views,
            publishedAt: item.publishedAt,
          }));
          results.push(...videoResults);
        }
        break;
        
      case 'music':
        const musicResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBgGGMjRi95r9IcSpLEUaF8EUIQ3bpHO50`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Search for music related to "${query}". Return a JSON array of 10 music results with the following structure: [{"id": "unique_id", "title": "song_title", "artist": "artist_name", "album": "album_name", "url": "spotify_url", "thumbnail": "album_cover_url", "source": "Spotify", "duration": "3:45", "publishedAt": "2023-01-01"}]`
              }]
            }]
          })
        });
        if (musicResponse.ok) {
          const musicData = await musicResponse.json();
          const content = musicData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (content) {
            try {
              const jsonMatch = content.match(/\[.*\]/s);
              if (jsonMatch) {
                const musicResults = JSON.parse(jsonMatch[0]);
                const musicItems = (Array.isArray(musicResults) ? musicResults : []).map((item: any) => ({
                  id: `music-${item.id || Math.random()}`,
                  title: item.title,
                  description: `${item.artist} - ${item.album}`,
                  url: item.url,
                  thumbnail: item.thumbnail,
                  source: item.source || 'Music API',
                  type: 'music' as const,
                  duration: item.duration,
                  publishedAt: item.publishedAt,
                }));
                results.push(...musicItems);
              }
            } catch (parseError) {
              console.error('Error parsing music response:', parseError);
            }
          }
        }
        break;
        
      case 'all':
        // Search all types
        const [newsRes, imagesRes, videosRes] = await Promise.all([
          fetch(`https://nexus-search.onrender.com/api/searchNews?query=${encodeURIComponent(query)}&limit=3`),
          fetch(`https://nexus-search.onrender.com/api/searchImages?query=${encodeURIComponent(query)}&limit=3`),
          fetch(`https://nexus-search.onrender.com/api/youtube/search?query=${encodeURIComponent(query)}&limit=3`)
        ]);
        
        // Process news
        if (newsRes.ok) {
          const newsData = await newsRes.json();
          const newsResults = (newsData.results || newsData || []).map((item: any) => ({
            id: `news-${item.id || Math.random()}`,
            title: item.title,
            description: item.description,
            url: item.url,
            thumbnail: item.thumbnail,
            source: item.source || 'News API',
            type: 'news' as const,
            publishedAt: item.publishedAt,
          }));
          results.push(...newsResults);
        }
        
        // Process images
        if (imagesRes.ok) {
          const imagesData = await imagesRes.json();
          const imageResults = (imagesData.results || imagesData || []).map((item: any) => ({
            id: `image-${item.id || Math.random()}`,
            title: item.title,
            description: item.description,
            url: item.url,
            thumbnail: item.thumbnail,
            source: item.source || 'Images API',
            type: 'image' as const,
          }));
          results.push(...imageResults);
        }
        
        // Process videos
        if (videosRes.ok) {
          const videosData = await videosRes.json();
          const videoResults = (videosData.results || videosData || []).map((item: any) => ({
            id: `video-${item.id || Math.random()}`,
            title: item.title,
            description: item.description,
            url: item.url,
            thumbnail: item.thumbnail,
            source: item.source || 'YouTube API',
            type: 'video' as const,
            duration: item.duration,
            views: item.views,
            publishedAt: item.publishedAt,
          }));
          results.push(...videoResults);
        }
        break;
    }
  } catch (error) {
    console.error('Direct API search error:', error);
  }
  
  return results;
};

export const useSearch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const search = async (
    query: string, 
    type: 'all' | 'blogs' | 'news' | 'images' | 'videos' | 'music' = 'all'
  ): Promise<SearchResult[]> => {
    if (!query.trim()) return [];

    setIsLoading(true);
    setError(null);

    try {
      let results: SearchResult[] = [];

      // Search internal blogs
      if (type === 'all' || type === 'blogs') {
        const { data: blogs, error: blogError } = await supabase
          .from('blogs')
          .select('*')
          .eq('is_published', true)
          .ilike('title', `%${query}%`)
          .order('published_at', { ascending: false })
          .limit(type === 'blogs' ? 20 : 5);

        if (blogError) {
          console.error('Blog search error:', blogError);
        } else if (blogs) {
          const blogResults: SearchResult[] = blogs.map(blog => ({
            id: blog.id,
            title: blog.title,
            description: blog.excerpt || '',
            url: `/blog/${blog.slug}`,
            source: 'Think Search Blogs',
            type: 'blog' as const,
            publishedAt: blog.published_at,
            author: 'Blog Author', // We'd need to join with profiles to get actual author
          }));
          results = [...results, ...blogResults];
        }
      }

      // Search external content
      if (type !== 'blogs') {
        const searchType = type === 'all' ? 'all' : type;
        console.log('Searching external content:', { query, type: searchType });
        
        try {
          const { data: externalData, error: externalError } = await supabase.functions.invoke('search-external', {
            body: { query, type: searchType }
          });

          console.log('External search response:', { externalData, externalError });

          if (externalError) {
            console.error('External search error:', externalError);
            // Fallback to direct API calls if Supabase function fails
            const directResults = await searchDirectAPIs(query, searchType);
            results = [...results, ...directResults];
          } else if (externalData?.results) {
            const externalResults: SearchResult[] = externalData.results.map((item: any) => ({
              id: item.id,
              title: item.title,
              description: item.description,
              url: item.url,
              thumbnail: item.thumbnail,
              source: item.source,
              type: item.type || type,
              publishedAt: item.publishedAt,
              duration: item.duration,
              views: item.views,
            }));
            results = [...results, ...externalResults];
          }
        } catch (functionError) {
          console.error('Supabase function error:', functionError);
          // Fallback to direct API calls
          const directResults = await searchDirectAPIs(query, searchType);
          results = [...results, ...directResults];
        }
      }

      // Save search history
      if (user) {
        await supabase.from('search_history').insert({
          user_id: user.id,
          query,
          search_type: type,
          results_count: results.length,
        });
      }

      return results;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      console.error('Search error:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getSearchHistory = async () => {
    if (!user) return [];

    const { data, error } = await supabase
      .from('search_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching search history:', error);
      return [];
    }

    return data || [];
  };

  return {
    search,
    getSearchHistory,
    isLoading,
    error,
  };
};