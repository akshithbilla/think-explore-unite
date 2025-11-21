import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { apiClient, Blog } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Calendar, 
  Clock, 
  TrendingUp,
  FileText,
  Filter,
  MoreVertical,
  BarChart3,
  Users,
  BookOpen,
  ArrowUpRight,
  Sparkles
} from "lucide-react";

const BlogDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "drafts">("all");
  const [error, setError] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      fetchBlogs();
    }
  }, [user, filterStatus]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const status = filterStatus === "all" ? undefined : filterStatus;
      const data = await apiClient.getMyBlogs(status);
      setBlogs(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (blogId: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) {
      return;
    }

    try {
      await apiClient.deleteBlog(blogId);
      setBlogs(blogs.filter(blog => blog.id !== blogId));
      toast({
        title: "Blog deleted",
        description: "The blog post has been deleted successfully.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete the blog post.",
        variant: "destructive",
      });
    }
  };

  const togglePublishStatus = async (blog: Blog) => {
    try {
      const updatedBlog = await apiClient.updateBlog(blog.id, {
        is_published: !blog.is_published,
      });

      setBlogs(blogs.map(b => 
        b.id === blog.id ? updatedBlog : b
      ));

      toast({
        title: blog.is_published ? "Blog unpublished" : "Blog published",
        description: `The blog post has been ${blog.is_published ? "unpublished" : "published"} successfully.`,
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update the blog status.",
        variant: "destructive",
      });
    }
  };

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-6 lg:mb-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Blog Dashboard
                </h1>
                <p className="text-muted-foreground mt-1">Manage and track your blog posts</p>
              </div>
            </div>
          </div>
          <Button 
            onClick={() => navigate("/write-blog")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-sm transition-all duration-200 h-11 px-6 rounded-xl"
          >
            <Plus className="w-4 h-4 mr-2" />
            Write New Blog
          </Button>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50 text-red-800 rounded-xl">
            <AlertDescription className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-white to-blue-50/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Blogs</p>
                  <p className="text-3xl font-bold text-gray-900">{blogs.length}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <FileText className="h-6 w-6" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3 text-xs text-gray-500">
                <TrendingUp className="h-3 w-3" />
                <span>All your content</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-white to-green-50/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Published</p>
                  <p className="text-3xl font-bold text-gray-900">{blogs.filter(b => b.is_published).length}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                  <Eye className="h-6 w-6" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3 text-xs text-gray-500">
                <Sparkles className="h-3 w-3" />
                <span>Live posts</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-white to-orange-50/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Drafts</p>
                  <p className="text-3xl font-bold text-gray-900">{blogs.filter(b => !b.is_published).length}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <Edit className="h-6 w-6" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>In progress</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-white to-purple-50/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Views</p>
                  <p className="text-3xl font-bold text-gray-900">{blogs.reduce((sum, blog) => sum + blog.view_count, 0)}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                  <BarChart3 className="h-6 w-6" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3 text-xs text-gray-500">
                <Users className="h-3 w-3" />
                <span>Reader engagement</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Section */}
        <Card className="border-0 shadow-lg rounded-2xl mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search blogs by title, excerpt, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-center gap-2 w-full lg:w-auto">
                <Filter className="w-4 h-4 text-gray-400 mr-2" />
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <Button
                    variant={filterStatus === "all" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setFilterStatus("all")}
                    className={`rounded-md px-4 ${
                      filterStatus === "all" 
                        ? "bg-white shadow-sm text-blue-600" 
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    All
                  </Button>
                  <Button
                    variant={filterStatus === "published" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setFilterStatus("published")}
                    className={`rounded-md px-4 ${
                      filterStatus === "published" 
                        ? "bg-white shadow-sm text-green-600" 
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Published
                  </Button>
                  <Button
                    variant={filterStatus === "drafts" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setFilterStatus("drafts")}
                    className={`rounded-md px-4 ${
                      filterStatus === "drafts" 
                        ? "bg-white shadow-sm text-orange-600" 
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Drafts
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blogs List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600">Loading your blogs...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <Card className="border-0 shadow-lg rounded-2xl">
            <CardContent className="p-12 text-center">
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                  <FileText className="h-8 w-8" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">No blogs found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchQuery ? "No blogs match your search criteria." : "Start your writing journey by creating your first blog post."}
              </p>
              {!searchQuery && (
                <Button 
                  onClick={() => navigate("/write-blog")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-sm transition-all duration-200 h-11 px-6 rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Write Your First Blog
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredBlogs.map((blog) => (
              <Card key={blog.id} className="border-0 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
                            {blog.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={blog.is_published ? "default" : "secondary"}
                              className={`rounded-full px-3 py-1 text-xs ${
                                blog.is_published 
                                  ? "bg-green-100 text-green-700 border-green-200" 
                                  : "bg-orange-100 text-orange-700 border-orange-200"
                              }`}
                            >
                              {blog.is_published ? "Published" : "Draft"}
                            </Badge>
                            {blog.is_featured && (
                              <Badge className="rounded-full px-3 py-1 text-xs bg-purple-100 text-purple-700 border-purple-200">
                                Featured
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-4 leading-relaxed">{blog.excerpt}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {blog.is_published && blog.published_at
                                ? new Date(blog.published_at).toLocaleDateString()
                                : new Date(blog.created_at).toLocaleDateString()
                              }
                            </span>
                          </div>
                          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1">
                            <Clock className="w-4 h-4" />
                            <span>{blog.reading_time} min read</span>
                          </div>
                          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1">
                            <Eye className="w-4 h-4" />
                            <span>{blog.view_count} views</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {blog.tags.map((tag) => (
                            <Badge 
                              key={tag} 
                              variant="outline" 
                              className="rounded-full px-3 py-1 text-xs bg-blue-50 text-blue-700 border-blue-200"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 lg:flex-col">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/blog/${blog.slug}`)}
                          className="rounded-lg border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/edit-blog/${blog.id}`)}
                          className="rounded-lg border-gray-200 hover:border-green-300 hover:bg-green-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePublishStatus(blog)}
                          className={`rounded-lg border-gray-200 ${
                            blog.is_published 
                              ? "hover:border-orange-300 hover:bg-orange-50" 
                              : "hover:border-green-300 hover:bg-green-50"
                          }`}
                        >
                          {blog.is_published ? "Unpublish" : "Publish"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteBlog(blog.id)}
                          className="rounded-lg border-gray-200 hover:border-red-300 hover:bg-red-50 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Last updated: {new Date(blog.updated_at).toLocaleDateString()}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/blog/${blog.slug}`)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                      >
                        View Post
                        <ArrowUpRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDashboard;