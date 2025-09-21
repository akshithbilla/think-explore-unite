import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Newspaper, Image, Video, Music, Sparkles, Clock, User } from "lucide-react";
import { useSearch, type SearchResult } from "@/hooks/useSearch";

const SearchInterface = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeTab, setActiveTab] = useState("blogs");
  const { search, isLoading } = useSearch();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    const searchResults = await search(searchQuery, activeTab as any);
    setResults(searchResults);
  };

  // Mock data for demonstration
  const mockResults = {
    blogs: [
      {
        id: 1,
        title: "The Future of AI in Content Creation",
        excerpt: "Exploring how artificial intelligence is revolutionizing the way we create and consume content...",
        author: "Alex Chen",
        date: "2 hours ago",
        tags: ["AI", "Technology", "Content"],
        readTime: "5 min read"
      },
      {
        id: 2,
        title: "Building Scalable Search Systems",
        excerpt: "A deep dive into the architecture patterns that power modern search engines...",
        author: "Sarah Johnson",
        date: "1 day ago",
        tags: ["Search", "Architecture", "Engineering"],
        readTime: "8 min read"
      }
    ],
    news: [
      {
        id: 1,
        title: "Tech Giants Invest Billions in AI Research",
        source: "TechNews",
        time: "3 hours ago",
        summary: "Major technology companies announce unprecedented investments in artificial intelligence research and development."
      },
      {
        id: 2,
        title: "New Search Algorithm Breakthrough",
        source: "Science Daily",
        time: "6 hours ago",
        summary: "Researchers develop innovative approach to semantic search with 40% improvement in accuracy."
      }
    ]
  };

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
              ) : results.length > 0 ? (
                `Found ${results.length} results for "${searchQuery}". The search includes content from various sources including blogs, news articles, and external media.`
              ) : searchQuery ? (
                `No results found for "${searchQuery}". Try different keywords or check the spelling.`
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
                {results.filter(r => r.type === type).length > 0 ? (
                  results.filter(r => r.type === type).map((result) => (
                    <Card key={result.id} className="hover:shadow-card-custom transition-all duration-200 cursor-pointer">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <CardTitle className="text-xl hover:text-primary transition-colors">
                              {result.title}
                            </CardTitle>
                            <CardDescription className="text-base leading-relaxed">
                              {result.description}
                            </CardDescription>
                          </div>
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