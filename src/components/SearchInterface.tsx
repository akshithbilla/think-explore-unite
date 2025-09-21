import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Newspaper, Image, Video, Music, Sparkles, Clock, User, ExternalLink } from "lucide-react";

// Define types for our search results
export interface SearchResult {
  id: string;
  type: 'blogs' | 'news' | 'images' | 'videos' | 'music';
  title: string;
  description: string;
  source: string;
  url: string;
  publishedAt?: string;
  duration?: string;
  views?: number;
  thumbnail?: string;
}

const SearchInterface = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeTab, setActiveTab] = useState("blogs");
  const [isLoading, setIsLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState("");

  // Function to call the Gemini API for AI summary
  const generateAISummary = async (query: string, results: SearchResult[]) => {
    const API_KEY = "AIzaSyBgGGMjRi95r9IcSpLEUaF8EUIQ3bpHO50";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
    
    try {
      const resultCounts = {
        blogs: results.filter(r => r.type === 'blogs').length,
        news: results.filter(r => r.type === 'news').length,
        images: results.filter(r => r.type === 'images').length,
        videos: results.filter(r => r.type === 'videos').length,
        music: results.filter(r => r.type === 'music').length
      };
      
      const prompt = `Provide a concise 2-3 sentence summary about "${query}" based on these search result counts: 
      Blogs: ${resultCounts.blogs}, News: ${resultCounts.news}, Images: ${resultCounts.images}, 
      Videos: ${resultCounts.videos}, Music: ${resultCounts.music}. If there are few results, suggest broadening the search.`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });
      
      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error("Error generating AI summary:", error);
      return `Found ${results.length} results for "${query}". The search includes content from various sources.`;
    }
  };

  // Function to perform search across all APIs
  const performSearch = async (query: string, type: string) => {
    setIsLoading(true);
    setResults([]);
    setAiSummary("");
    
    try {
      let allResults: SearchResult[] = [];
      
      // Search News API
      if (type === 'all' || type === 'news' || type === 'blogs') {
        try {
          const newsResponse = await fetch(`https://nexus-search.onrender.com/api/searchNews?query=${encodeURIComponent(query)}`);
          if (newsResponse.ok) {
            const newsData = await newsResponse.json();
            if (Array.isArray(newsData)) {
              const newsResults: SearchResult[] = newsData.map((article: any, index: number) => ({
                id: `news-${index}`,
                type: 'news',
                title: article.title || 'No title',
                description: article.description || 'No description available',
                source: article.source?.name || 'Unknown source',
                url: article.url || '#',
                publishedAt: article.publishedAt,
                thumbnail: article.urlToImage
              }));
              allResults = [...allResults, ...newsResults];
            }
          } else {
            console.error("News API error:", newsResponse.status);
          }
        } catch (error) {
          console.error("Error fetching news:", error);
        }
      }
      
      // Search Images API
      if (type === 'all' || type === 'images') {
        try {
          const imagesResponse = await fetch(`https://nexus-search.onrender.com/api/searchImages?query=${encodeURIComponent(query)}`);
          if (imagesResponse.ok) {
            const imagesData = await imagesResponse.json();
            if (Array.isArray(imagesData)) {
              const imageResults: SearchResult[] = imagesData.map((image: any, index: number) => ({
                id: `image-${index}`,
                type: 'images',
                title: image.title || 'Image result',
                description: '', // Images typically don't have descriptions
                source: 'Pixabay',
                url: image.link || '#',
                thumbnail: image.thumbnail || image.link
              }));
              allResults = [...allResults, ...imageResults];
            }
          } else {
            console.error("Images API error:", imagesResponse.status);
          }
        } catch (error) {
          console.error("Error fetching images:", error);
        }
      }
      
      // Search YouTube API
      if (type === 'all' || type === 'videos' || type === 'music') {
        try {
          const youtubeResponse = await fetch(`https://nexus-search.onrender.com/api/youtube/search?query=${encodeURIComponent(query)}`);
          if (youtubeResponse.ok) {
            const youtubeData = await youtubeResponse.json();
            if (Array.isArray(youtubeData)) {
              const videoResults: SearchResult[] = youtubeData.map((item: any, index: number) => ({
                id: `video-${index}`,
                type: 'videos', // Default to videos
                title: item.title || 'No title',
                description: item.description || 'No description available',
                source: 'YouTube',
                url: item.link || '#',
                thumbnail: item.thumbnail
              }));
              allResults = [...allResults, ...videoResults];
            }
          } else {
            console.error("YouTube API error:", youtubeResponse.status);
          }
        } catch (error) {
          console.error("Error fetching YouTube data:", error);
        }
      }
      
      setResults(allResults);
      
      // Generate AI summary
      if (allResults.length > 0) {
        const summary = await generateAISummary(query, allResults);
        setAiSummary(summary);
      } else {
        setAiSummary(`No results found for "${query}". Try different keywords or check the spelling.`);
      }
    } catch (error) {
      console.error("Search error:", error);
      setAiSummary("An error occurred during search. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    // Map tab values to search types
    const searchTypeMap: { [key: string]: string } = {
      'blogs': 'blogs',
      'news': 'news', 
      'images': 'images',
      'videos': 'videos',
      'music': 'music'
    };
    
    const searchType = searchTypeMap[activeTab] || 'all';
    await performSearch(searchQuery, searchType);
  };

  // Filter results by active tab
  const filteredResults = results.filter(result => {
    if (activeTab === 'all') return true;
    return result.type === activeTab;
  });

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Intelligent Multi-Domain Search</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Search across blogs, news, images, videos, and music with AI-powered insights
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search for anything... (e.g., 'AI technology trends')"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-20 h-14 text-lg rounded-2xl border-2 focus:border-primary"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button
            onClick={handleSearch}
            disabled={!searchQuery.trim() || isLoading}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-xl"
            variant="hero"
          >
            {isLoading ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* AI Summary Section */}
      {searchQuery && (
        <Card className="max-w-4xl mx-auto bg-gradient-card border-primary/20">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">AI Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {isLoading ? (
                <span className="animate-pulse">Generating intelligent summary...</span>
              ) : aiSummary ? (
                aiSummary
              ) : (
                "Enter a search query to get AI-powered results and summaries from multiple sources."
              )}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {searchQuery && (
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="blogs" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Blogs</span>
              </TabsTrigger>
              <TabsTrigger value="news" className="flex items-center space-x-2">
                <Newspaper className="h-4 w-4" />
                <span>News</span>
              </TabsTrigger>
              <TabsTrigger value="images" className="flex items-center space-x-2">
                <Image className="h-4 w-4" />
                <span>Images</span>
              </TabsTrigger>
              <TabsTrigger value="videos" className="flex items-center space-x-2">
                <Video className="h-4 w-4" />
                <span>Videos</span>
              </TabsTrigger>
              <TabsTrigger value="music" className="flex items-center space-x-2">
                <Music className="h-4 w-4" />
                <span>Music</span>
              </TabsTrigger>
            </TabsList>

            {/* Results for each tab */}
            {['blogs', 'news', 'images', 'videos', 'music'].map((type) => (
              <TabsContent key={type} value={type} className="space-y-6">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Searching for {type}...</p>
                  </div>
                ) : filteredResults.filter(r => r.type === type).length > 0 ? (
                  filteredResults.filter(r => r.type === type).map((result) => (
                    <Card key={result.id} className="hover:shadow-card-custom transition-all duration-200">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="space-y-2 flex-1">
                            <a href={result.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                              <CardTitle className="text-xl hover:text-primary transition-colors flex items-center gap-2">
                                {result.title} <ExternalLink className="h-4 w-4" />
                              </CardTitle>
                            </a>
                            <CardDescription className="text-base leading-relaxed">
                              {result.description}
                            </CardDescription>
                          </div>
                          {result.thumbnail && (
                            <div className="ml-4 flex-shrink-0">
                              <img 
                                src={result.thumbnail} 
                                alt={result.title}
                                className="w-24 h-24 object-cover rounded-lg"
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between pt-4">
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="font-medium">{result.source}</span>
                            {result.publishedAt && (
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{new Date(result.publishedAt).toLocaleDateString()}</span>
                              </div>
                            )}
                            {result.duration && <span>{result.duration}</span>}
                            {result.views && <span>{result.views.toLocaleString()} views</span>}
                          </div>
                          <Badge variant="secondary" className="capitalize">{result.type}</Badge>
                        </div>
                      </CardHeader>
                    </Card>
                  ))
                ) : searchQuery && !isLoading ? (
                  <div className="text-center py-12">
                    <div className="space-y-4">
                      {type === 'blogs' && <FileText className="h-16 w-16 mx-auto text-muted-foreground" />}
                      {type === 'news' && <Newspaper className="h-16 w-16 mx-auto text-muted-foreground" />}
                      {type === 'images' && <Image className="h-16 w-16 mx-auto text-muted-foreground" />}
                      {type === 'videos' && <Video className="h-16 w-16 mx-auto text-muted-foreground" />}
                      {type === 'music' && <Music className="h-16 w-16 mx-auto text-muted-foreground" />}
                      <h3 className="text-xl font-semibold">No {type} found</h3>
                      <p className="text-muted-foreground">No {type} results found for "{searchQuery}". Try different keywords.</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="space-y-4">
                      {type === 'blogs' && <FileText className="h-16 w-16 mx-auto text-muted-foreground" />}
                      {type === 'news' && <Newspaper className="h-16 w-16 mx-auto text-muted-foreground" />}
                      {type === 'images' && <Image className="h-16 w-16 mx-auto text-muted-foreground" />}
                      {type === 'videos' && <Video className="h-16 w-16 mx-auto text-muted-foreground" />}
                      {type === 'music' && <Music className="h-16 w-16 mx-auto text-muted-foreground" />}
                      <h3 className="text-xl font-semibold">
                        {type.charAt(0).toUpperCase() + type.slice(1)} Search
                      </h3>
                      <p className="text-muted-foreground">
                        {type === 'blogs' && "Search through our curated blog posts and articles."}
                        {type === 'news' && "Get the latest news articles from trusted sources."}
                        {type === 'images' && "Find relevant images from across the web."}
                        {type === 'videos' && "Discover videos with AI-powered summaries."}
                        {type === 'music' && "Find your favorite tracks and discover new music."}
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default SearchInterface;