import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Newspaper, Image, Video, Music, Sparkles, Clock, User, ExternalLink, Play, Headphones, BookOpen, Globe, Zap, Brain, TrendingUp, ArrowRight } from "lucide-react";

export interface SearchResult {
  id: string;
  type: 'ai' | 'wikipedia' | 'google' | 'dictionary' | 'news' | 'images' | 'videos' | 'music';
  title: string;
  description: string;
  source: string;
  url: string;
  publishedAt?: string;
  duration?: string;
  views?: number;
  thumbnail?: string;
  aspectRatio?: string;
}

const SearchInterface = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [thinkSearchAI, setThinkSearchAI] = useState("");
  const [inputMeanAI, setInputMeanAI] = useState("");

  // Generate ThinkSearch AI - Fragmented summary from ALL fetched data
  const generateThinkSearchAI = async (query: string, allResults: SearchResult[]) => {
    const API_KEY = "AIzaSyBgGGMjRi95r9IcSpLEUaF8EUIQ3bpHO50";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    try {
      const contentToAnalyze = allResults
        .filter(result => result.type !== 'ai')
        .map(result => `${result.title}: ${result.description}`)
        .join('\n\n');

      const prompt = `Search Query: "${query}"

Review the full information below and provide a professional, structured summary organized by distinct themes. Each section should capture key points clearly, avoid repetition, and group related facts under concise headings. Do not include any introductory or closing text. Just return the summary.

SOURCE DATA:
${contentToAnalyze}`;

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

      if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error("Error generating ThinkSearch AI:", error);
      return `Analyzing ${allResults.length} sources for "${query}" to provide summary...`;
    }
  };

  // Generate Input Mean - General AI knowledge about the query
  const generateInputMeanAI = async (query: string) => {
    const API_KEY = "AIzaSyBgGGMjRi95r9IcSpLEUaF8EUIQ3bpHO50";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
    
    try {
      const prompt = `Provide a concise 2-3 sentence general explanation or definition about "${query}". This should be a basic AI-generated answer explaining what the search term means, without referencing specific search results. Focus on general knowledge and fundamental concepts.`;

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
      
      if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);
      
      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      return `AI-powered explanation about "${query}" based on general knowledge.`;
    }
  };

  const performSearch = async (query: string) => {
    setIsLoading(true);
    setResults([]);
    setThinkSearchAI("");
    setInputMeanAI("");

    try {
      let allResults: SearchResult[] = [];
      
      // Generate Input Mean AI first (general knowledge)
      const inputMeanAnswer = await generateInputMeanAI(query);
      setInputMeanAI(inputMeanAnswer);

      // Add Input Mean as first result
      allResults.push({
        id: 'input-mean',
        type: 'ai',
        title: `Input Mean: ${query}`,
        description: inputMeanAnswer,
        source: 'AI Knowledge',
        url: '#'
      });

      // Wikipedia API
      try {
        const wikiResponse = await fetch(
          `https://nexus-search.onrender.com/api/searchWikipedia?query=${encodeURIComponent(query)}`
        );
        if (wikiResponse.ok) {
          const wikiData = await wikiResponse.json();
          if (wikiData && typeof wikiData === "object") {
            allResults.push({
              id: `wiki-${wikiData.pageid || "unknown"}`,
              type: 'wikipedia',
              title: wikiData.title || "No title",
              description: wikiData.extract || "No description available",
              source: "Wikipedia",
              url: wikiData.page_url || "#",
              thumbnail: wikiData.thumbnail || null,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching Wikipedia:", error);
      }

      // Google Search API
      try {
        const googleResponse = await fetch(
          `https://nexus-search.onrender.com/api/fetchgoogleSearchResults?query=${encodeURIComponent(query)}`
        );
        if (googleResponse.ok) {
          const googleData = await googleResponse.json();
          if (Array.isArray(googleData)) {
            const googleResults: SearchResult[] = googleData.slice(0, 5).map((item: any, index: number) => ({
              id: `google-${index}`,
              type: 'google',
              title: item.title || 'No title',
              description: item.snippet || 'No description available',
              source: item.link ? new URL(item.link).hostname : 'Unknown source',
              url: item.link || '#',
            }));
            allResults = [...allResults, ...googleResults];
          }
        }
      } catch (error) {
        console.error("Error fetching Google search results:", error);
      }

      // Dictionary API
      try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(query)}`);
        if (response.ok) {
          const dictionaryData = await response.json();
          if (Array.isArray(dictionaryData)) {
            const dictionaryResults: SearchResult[] = dictionaryData.map((entry: any, index: number) => {
              const firstMeaning = entry.meanings?.[0];
              const firstDefinition = firstMeaning?.definitions?.[0];
              return {
                id: `dictionary-${index}`,
                type: 'dictionary',
                title: entry.word || 'No word',
                description: firstDefinition?.definition || 'No definition available',
                source: 'Dictionary API',
                url: `https://en.wiktionary.org/wiki/${encodeURIComponent(entry.word)}`,
              };
            });
            allResults = [...allResults, ...dictionaryResults];
          }
        }
      } catch (error) {
        console.error("Error fetching dictionary data:", error);
      }

      // News API
      try {
        const newsResponse = await fetch(`https://nexus-search.onrender.com/api/searchNews?query=${encodeURIComponent(query)}`);
        if (newsResponse.ok) {
          const newsData = await newsResponse.json();
          if (Array.isArray(newsData)) {
            const newsResults: SearchResult[] = newsData.slice(0, 8).map((article: any, index: number) => ({
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
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      }

      // Images API
      try {
        const imagesResponse = await fetch(`https://nexus-search.onrender.com/api/searchImages?query=${encodeURIComponent(query)}`);
        if (imagesResponse.ok) {
          const imagesData = await imagesResponse.json();
          if (Array.isArray(imagesData)) {
            const imageResults: SearchResult[] = imagesData.slice(0, 12).map((image: any, index: number) => ({
              id: `image-${index}`,
              type: 'images',
              title: `Image ${index + 1}`,
              description: image.tags || '',
              source: 'Pixabay',
              url: image.link || '#',
              thumbnail: image.thumbnail || image.link,
              aspectRatio: image.imageWidth && image.imageHeight ? 
                (image.imageWidth / image.imageHeight).toFixed(2) : '1.33'
            }));
            allResults = [...allResults, ...imageResults];
          }
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }

      // Videos API
      try {
        const videosResponse = await fetch(`https://nexus-search.onrender.com/api/youtube/search?query=${encodeURIComponent(query)}`);
        if (videosResponse.ok) {
          const videosData = await videosResponse.json();
          if (Array.isArray(videosData)) {
            const videoResults: SearchResult[] = videosData.slice(0, 6).map((item: any, index: number) => ({
              id: `video-${index}`,
              type: 'videos',
              title: item.title || 'No title',
              description: item.description || 'No description available',
              source: 'YouTube',
              url: item.link || '#',
              thumbnail: item.thumbnail,
              duration: item.duration,
              views: item.views
            }));
            allResults = [...allResults, ...videoResults];
          }
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      }

      // Music API
      try {
        const musicResponse = await fetch(`https://nexus-search.onrender.com/api/searchSong?query=${encodeURIComponent(query)}`);
        if (musicResponse.ok) {
          const musicData = await musicResponse.json();
          if (Array.isArray(musicData.tracks)) {
            const musicResults: SearchResult[] = musicData.tracks.slice(0, 8).map((track: any, index: number) => {
              const durationMs = track.duration || 0;
              const minutes = Math.floor(durationMs / 60000);
              const seconds = Math.floor((durationMs % 60000) / 1000);
              const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

              return {
                id: `music-${index}`,
                type: 'music',
                title: track.title || 'Unknown Title',
                description: `${track.artists || 'Unknown Artist'} • ${track.album || 'Unknown Album'}`,
                source: 'Spotify',
                url: track.external_urls || '#',
                duration: formattedDuration,
                thumbnail: track.images?.[0]?.url || undefined
              };
            });
            allResults = [...allResults, ...musicResults];
          }
        }
      } catch (error) {
        console.error("Error fetching music data:", error);
      }

      setResults(allResults);

      // Generate ThinkSearch AI after all data is fetched
      if (allResults.length > 1) { // More than just the input mean result
        const thinkSearchAnswer = await generateThinkSearchAI(query, allResults);
        setThinkSearchAI(thinkSearchAnswer);
      }

    } catch (error) {
      console.error("Search error:", error);
      setThinkSearchAI("An error occurred during search analysis. Please try again.");
      setInputMeanAI("Unable to generate AI explanation at this time.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    await performSearch(searchQuery);
  };

  const filteredResults = results.filter(result => {
    if (activeTab === 'all') return true;
    return result.type === activeTab;
  });

  // Render different layouts based on category
  const renderResultsByCategory = () => {
    const categoryResults = activeTab === 'all' ? 
      filteredResults.filter(r => r.type !== 'ai') : 
      filteredResults;
    
    switch (activeTab) {
      case 'all':
        return (
          <div className="space-y-6">
            {/* ThinkSearch AI Section */}
            {thinkSearchAI && (
              <Card className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white border-0 shadow-2xl rounded-3xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-400"></div>
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                      <Brain className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="flex items-center space-x-3 text-xl">
                        <span>ThinkSearch AI</span>
                        <Badge variant="secondary" className="bg-white/20 text-white border-0">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Intelligent Summary
                        </Badge>
                      </CardTitle>
                      <CardDescription className="text-blue-100/80 mt-1">
                        Fragmenting and synthesizing information from all sources...
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <p className="text-lg leading-relaxed font-light">{thinkSearchAI}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Input Mean Section */}
            {inputMeanAI && (
              <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200/50 shadow-lg rounded-2xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-gray-900">Input Mean</CardTitle>
                      <CardDescription className="text-green-600">
                        AI-powered general knowledge explanation
                      </CardDescription>
                    </div>
                  </div>
                  <CardDescription className="text-base leading-relaxed text-gray-700 bg-white/50 rounded-xl p-4 border border-green-100">
                    {inputMeanAI}
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
            
            {/* Regular Results */}
            {categoryResults.map((result) => (
              <SearchResultCard key={result.id} result={result} />
            ))}
          </div>
        );

      case 'images':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {categoryResults.map((result) => (
              <div key={result.id} className="group cursor-pointer">
                <div className="aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                  <img 
                    src={result.thumbnail} 
                    alt={result.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <p className="mt-3 text-sm text-gray-600 font-medium truncate px-1">{result.title}</p>
              </div>
            ))}
          </div>
        );

      case 'videos':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryResults.map((result) => (
              <div key={result.id} className="group cursor-pointer">
                <div className="relative aspect-video overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300">
                  <img 
                    src={result.thumbnail} 
                    alt={result.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <div className="bg-white/90 rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-2xl">
                      <Play className="h-6 w-6 text-gray-900 ml-1" fill="currentColor" />
                    </div>
                  </div>
                  {result.duration && (
                    <Badge className="absolute bottom-3 right-3 bg-black/80 text-white border-0 rounded-lg px-2 py-1 text-xs">
                      {result.duration}
                    </Badge>
                  )}
                </div>
                <div className="mt-4 space-y-2">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                    {result.title}
                  </h3>
                  <p className="text-sm text-gray-600">{result.source}</p>
                  {result.views && (
                    <p className="text-xs text-gray-500">{result.views.toLocaleString()} views</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        );

      case 'music':
        return (
          <div className="space-y-4">
            {categoryResults.map((result) => (
              <div key={result.id} className="flex items-center space-x-4 p-4 rounded-2xl border border-gray-200 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 group cursor-pointer shadow-sm hover:shadow-lg">
                <div className="relative flex-shrink-0">
                  <img 
                    src={result.thumbnail} 
                    alt={result.title}
                    className="w-16 h-16 rounded-xl object-cover shadow-md"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center rounded-xl">
                    <Play className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300" fill="white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                    {result.title}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">{result.description}</p>
                </div>
                {result.duration && (
                  <Badge variant="secondary" className="flex-shrink-0 bg-blue-100 text-blue-700 border-0 rounded-lg px-3 py-1">
                    {result.duration}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        );

      case 'news':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categoryResults.map((result) => (
              <Card key={result.id} className="hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 shadow-lg rounded-2xl overflow-hidden group">
                <CardHeader className="p-6">
                  <div className="flex space-x-4">
                    {result.thumbnail && (
                      <img 
                        src={result.thumbnail} 
                        alt={result.title}
                        className="w-20 h-20 object-cover rounded-xl flex-shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                        {result.title}
                      </CardTitle>
                      <CardDescription className="text-sm line-clamp-2 text-gray-600 leading-relaxed">
                        {result.description}
                      </CardDescription>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 rounded-full px-3 py-1">
                          {result.source}
                        </span>
                        {result.publishedAt && (
                          <span className="text-xs text-gray-500">
                            {new Date(result.publishedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            {categoryResults.map((result) => (
              <SearchResultCard key={result.id} result={result} />
            ))}
          </div>
        );
    }
  };

  const SearchResultCard = ({ result }: { result: SearchResult }) => (
    <Card key={result.id} className="hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 shadow-lg rounded-2xl overflow-hidden group">
      <CardHeader className="p-6">
        <div className="flex justify-between items-start space-x-4">
          <div className="space-y-3 flex-1 min-w-0">
            <a href={result.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
              <CardTitle className="text-xl hover:text-blue-600 transition-colors flex items-center gap-3 group">
                {result.title} 
                <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
              </CardTitle>
            </a>
            <CardDescription className="text-base leading-relaxed line-clamp-2 text-gray-600">
              {result.description}
            </CardDescription>
          </div>
          {result.thumbnail && (
            <div className="ml-4 flex-shrink-0">
              <img 
                src={result.thumbnail} 
                alt={result.title}
                className="w-24 h-24 object-cover rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
        </div>
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="font-medium text-gray-700 bg-gray-100 rounded-full px-3 py-1">{result.source}</span>
            {result.publishedAt && (
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{new Date(result.publishedAt).toLocaleDateString()}</span>
              </div>
            )}
            {result.duration && (
              <span className="bg-blue-100 text-blue-700 rounded-full px-2 py-1 text-xs font-medium">
                {result.duration}
              </span>
            )}
            {result.views && (
              <span className="text-gray-500">
                {result.views.toLocaleString()} views
              </span>
            )}
          </div>
          <Badge variant="secondary" className="capitalize bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 rounded-lg">
            {result.type === 'ai' ? 'AI Answer' : result.type}
          </Badge>
        </div>
      </CardHeader>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/20 space-y-8 p-4">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
      
      {/* Search Header */}
      <div className="text-center space-y-6 max-w-4xl mx-auto relative z-10">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
            <Search className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ThinkSearch
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Intelligent multi-source search with dual AI-powered insights and comprehensive results
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="relative">
          <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
          <Input
            placeholder="Search for anything... (e.g., 'artificial intelligence', 'quantum computing', 'modern architecture')"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-14 pr-24 h-16 text-lg rounded-2xl border-2 border-gray-200 focus:border-blue-500 shadow-2xl bg-white/80 backdrop-blur-sm"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button
            onClick={handleSearch}
            disabled={!searchQuery.trim() || isLoading}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-xl px-8 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            size="lg"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                <span>Searching</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4" />
                <span>Search</span>
              </div>
            )}
          </Button>
        </div>
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div className="max-w-7xl mx-auto relative z-10">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8 mb-8 bg-white/80 backdrop-blur-sm border border-gray-200 p-2 rounded-2xl shadow-lg">
              <TabsTrigger value="all" className="flex items-center space-x-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300">
                <Globe className="h-4 w-4" />
                <span>All</span>
              </TabsTrigger>
              <TabsTrigger value="images" className="flex items-center space-x-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300">
                <Image className="h-4 w-4" />
                <span>Images</span>
              </TabsTrigger>
              <TabsTrigger value="videos" className="flex items-center space-x-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300">
                <Video className="h-4 w-4" />
                <span>Videos</span>
              </TabsTrigger>
              <TabsTrigger value="news" className="flex items-center space-x-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300">
                <Newspaper className="h-4 w-4" />
                <span>News</span>
              </TabsTrigger>
              <TabsTrigger value="music" className="flex items-center space-x-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300">
                <Headphones className="h-4 w-4" />
                <span>Music</span>
              </TabsTrigger>
              <TabsTrigger value="wikipedia" className="flex items-center space-x-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300">
                <BookOpen className="h-4 w-4" />
                <span>Wikipedia</span>
              </TabsTrigger>
              <TabsTrigger value="google" className="flex items-center space-x-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300">
                <Globe className="h-4 w-4" />
                <span>Web</span>
              </TabsTrigger>
              <TabsTrigger value="dictionary" className="flex items-center space-x-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300">
                <FileText className="h-4 w-4" />
                <span>Dictionary</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-6">
              {isLoading ? (
                <div className="text-center py-20">
                  <div className="flex justify-center mb-6">
                    <div className="animate-spin h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                  </div>
                  <p className="text-xl text-gray-600 mb-2">
                    {activeTab === 'all' ? 'Searching across all sources...' : `Searching for ${activeTab}...`}
                  </p>
                  <p className="text-gray-500">This may take a few moments</p>
                </div>
              ) : filteredResults.length > 0 || thinkSearchAI || inputMeanAI ? (
                renderResultsByCategory()
              ) : (
                <div className="text-center py-20">
                  <div className="space-y-6">
                    <div className="flex justify-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-gray-200 to-gray-300">
                        <Search className="h-10 w-10 text-gray-400" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-600">
                      No {activeTab === 'all' ? 'results' : activeTab} found
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto text-lg">
                      No {activeTab === 'all' ? 'results' : `${activeTab} results`} found for "{searchQuery}". 
                      Try different keywords or check your spelling.
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default SearchInterface;