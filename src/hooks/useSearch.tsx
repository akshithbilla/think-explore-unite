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
        const { data: externalData, error: externalError } = await supabase.functions.invoke('search-external', {
          body: { query, type: searchType }
        });

        if (externalError) {
          console.error('External search error:', externalError);
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