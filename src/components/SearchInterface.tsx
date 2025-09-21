import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Newspaper, Image, Video, Music, Sparkles, Clock, User } from "lucide-react";

const SearchInterface = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    setIsSearching(true);
    // Simulate search delay
    setTimeout(() => setIsSearching(false), 1500);
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
            disabled={!searchQuery.trim() || isSearching}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-xl"
            variant="hero"
          >
            {isSearching ? (
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
              {isSearching ? (
                <span className="animate-pulse">Generating intelligent summary...</span>
              ) : (
                "Based on your search for 'AI technology trends', here's what's trending: Artificial Intelligence continues to evolve rapidly with significant investments from major tech companies. Key areas include machine learning, natural language processing, and automated content generation systems."
              )}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {searchQuery && (
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="blogs" className="w-full">
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

            <TabsContent value="blogs" className="space-y-6">
              {mockResults.blogs.map((blog) => (
                <Card key={blog.id} className="hover:shadow-card-custom transition-all duration-200 cursor-pointer">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <CardTitle className="text-xl hover:text-primary transition-colors">
                          {blog.title}
                        </CardTitle>
                        <CardDescription className="text-base leading-relaxed">
                          {blog.excerpt}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{blog.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{blog.date}</span>
                        </div>
                        <span>{blog.readTime}</span>
                      </div>
                      <div className="flex space-x-2">
                        {blog.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="news" className="space-y-6">
              {mockResults.news.map((article) => (
                <Card key={article.id} className="hover:shadow-card-custom transition-all duration-200 cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-xl hover:text-primary transition-colors">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {article.summary}
                    </CardDescription>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground pt-2">
                      <span className="font-medium">{article.source}</span>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{article.time}</span>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="images" className="text-center py-12">
              <div className="space-y-4">
                <Image className="h-16 w-16 mx-auto text-muted-foreground" />
                <h3 className="text-xl font-semibold">Image Search Coming Soon</h3>
                <p className="text-muted-foreground">We're working on integrating beautiful image search from top sources.</p>
              </div>
            </TabsContent>

            <TabsContent value="videos" className="text-center py-12">
              <div className="space-y-4">
                <Video className="h-16 w-16 mx-auto text-muted-foreground" />
                <h3 className="text-xl font-semibold">Video Search Coming Soon</h3>
                <p className="text-muted-foreground">Discover videos from YouTube and other platforms with AI summaries.</p>
              </div>
            </TabsContent>

            <TabsContent value="music" className="text-center py-12">
              <div className="space-y-4">
                <Music className="h-16 w-16 mx-auto text-muted-foreground" />
                <h3 className="text-xl font-semibold">Music Search Coming Soon</h3>
                <p className="text-muted-foreground">Find your favorite tracks and discover new music with intelligent recommendations.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default SearchInterface;