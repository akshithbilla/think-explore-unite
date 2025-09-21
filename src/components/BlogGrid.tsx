import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, User, Eye, Heart, MessageCircle, Bookmark } from "lucide-react";

const BlogGrid = () => {
  // Mock blog data
  const blogs = [
    {
      id: 1,
      title: "The Evolution of Search Technology",
      excerpt: "From simple keyword matching to AI-powered semantic understanding, search technology has come a long way. Let's explore the journey and what lies ahead.",
      author: {
        name: "Alex Chen",
        avatar: "/placeholder.svg",
        handle: "@alexchen"
      },
      date: "2 hours ago",
      readTime: "5 min read",
      tags: ["Technology", "AI", "Search"],
      views: 1240,
      likes: 85,
      comments: 12,
      featured: true
    },
    {
      id: 2,
      title: "Building Sustainable Content Strategies",
      excerpt: "Creating content that resonates with your audience while maintaining consistency and quality over time requires a strategic approach.",
      author: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg",
        handle: "@sarahj"
      },
      date: "1 day ago",
      readTime: "8 min read",
      tags: ["Content", "Strategy", "Marketing"],
      views: 892,
      likes: 67,
      comments: 8,
      featured: false
    },
    {
      id: 3,
      title: "The Art of Information Architecture",
      excerpt: "How we organize and structure information dramatically impacts user experience and content discoverability.",
      author: {
        name: "Marcus Williams",
        avatar: "/placeholder.svg",
        handle: "@marcusw"
      },
      date: "3 days ago",
      readTime: "12 min read",
      tags: ["UX", "Information Architecture", "Design"],
      views: 1580,
      likes: 124,
      comments: 18,
      featured: true
    },
    {
      id: 4,
      title: "Democratizing Knowledge Through AI",
      excerpt: "Artificial intelligence is breaking down barriers to information access, making complex topics understandable for everyone.",
      author: {
        name: "Dr. Emily Zhang",
        avatar: "/placeholder.svg",
        handle: "@emilyzhang"
      },
      date: "5 days ago",
      readTime: "6 min read",
      tags: ["AI", "Education", "Knowledge"],
      views: 2340,
      likes: 198,
      comments: 34,
      featured: false
    },
    {
      id: 5,
      title: "The Future of Multimedia Content",
      excerpt: "As bandwidth increases and devices become more powerful, how will multimedia content evolve to meet user expectations?",
      author: {
        name: "Jordan Lee",
        avatar: "/placeholder.svg",
        handle: "@jordanlee"
      },
      date: "1 week ago",
      readTime: "7 min read",
      tags: ["Multimedia", "Future", "Technology"],
      views: 756,
      likes: 45,
      comments: 6,
      featured: false
    },
    {
      id: 6,
      title: "Creating Inclusive Digital Experiences",
      excerpt: "Building digital products that work for everyone requires intentional design and continuous improvement based on diverse user feedback.",
      author: {
        name: "Maya Patel",
        avatar: "/placeholder.svg",
        handle: "@mayapatel"
      },
      date: "1 week ago",
      readTime: "10 min read",
      tags: ["Accessibility", "UX", "Inclusion"],
      views: 1120,
      likes: 89,
      comments: 15,
      featured: true
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Discover Amazing Blogs</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore thoughtful articles from our community of writers and thinkers
        </p>
      </div>

      {/* Featured Blogs Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Featured Articles</h3>
        <div className="grid lg:grid-cols-2 gap-6">
          {blogs.filter(blog => blog.featured).slice(0, 2).map((blog) => (
            <Card key={blog.id} className="group hover:shadow-elegant transition-all duration-300 cursor-pointer bg-gradient-card border-0">
              <CardHeader className="space-y-4">
                <div className="flex items-start justify-between">
                  <Badge variant="secondary" className="bg-gradient-primary text-white">Featured</Badge>
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                  {blog.title}
                </CardTitle>
                <CardDescription className="text-base leading-relaxed line-clamp-3">
                  {blog.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={blog.author.avatar} alt={blog.author.name} />
                    <AvatarFallback>{blog.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{blog.author.name}</p>
                    <p className="text-xs text-muted-foreground">{blog.author.handle}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {blog.date} • {blog.readTime}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {blog.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>{blog.views}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-3 w-3" />
                      <span>{blog.likes}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* All Blogs Grid */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Latest Articles</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Card key={blog.id} className="group hover:shadow-card-custom transition-all duration-300 cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex space-x-2">
                    {blog.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                  {blog.title}
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed line-clamp-3">
                  {blog.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={blog.author.avatar} alt={blog.author.name} />
                    <AvatarFallback className="text-xs">{blog.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-xs">{blog.author.name}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {blog.readTime}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{blog.date}</span>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Heart className="h-3 w-3" />
                      <span>{blog.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-3 w-3" />
                      <span>{blog.comments}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" size="lg">
          Load More Articles
        </Button>
      </div>
    </div>
  );
};

export default BlogGrid;