import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { 
  Save, 
  Eye, 
  Send, 
  ArrowLeft, 
  Image as ImageIcon, 
  Tag, 
  Clock, 
  FileText,
  BarChart3,
  Type,
  Edit3,
  Sparkles,
  Plus,
  X
} from "lucide-react";

const WriteBlog = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [error, setError] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      addTag();
    }
  };

  const saveDraft = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const slug = generateSlug(title);
      const readingTime = calculateReadingTime(content);

      await apiClient.createBlog({
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt.trim() || content.trim().substring(0, 160) + "...",
        slug,
        tags,
        cover_image_url: coverImageUrl || undefined,
        reading_time: readingTime,
        is_published: false,
      });

      toast({
        title: "Draft saved!",
        description: "Your blog post has been saved as a draft.",
      });
    } catch (err: any) {
      setError(err.message || "Failed to save draft");
    } finally {
      setIsSaving(false);
    }
  };

  const publishBlog = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }

    setIsPublishing(true);
    setError("");

    try {
      const slug = generateSlug(title);
      const readingTime = calculateReadingTime(content);

      await apiClient.createBlog({
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt.trim() || content.trim().substring(0, 160) + "...",
        slug,
        tags,
        cover_image_url: coverImageUrl || undefined,
        reading_time: readingTime,
        is_published: true,
      });

      toast({
        title: "Blog published!",
        description: "Your blog post has been published successfully.",
      });

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to publish blog");
    } finally {
      setIsPublishing(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-6 lg:mb-0">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600">
                <Edit3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Write New Blog
                </h1>
                <p className="text-muted-foreground mt-1">Share your thoughts with the world</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={() => setIsPreview(!isPreview)}
              className="rounded-lg border-gray-300 hover:border-blue-300 hover:bg-blue-50 h-11 px-4"
            >
              <Eye className="w-4 h-4 mr-2" />
              {isPreview ? "Edit" : "Preview"}
            </Button>
            <Button
              variant="outline"
              onClick={saveDraft}
              disabled={isSaving}
              className="rounded-lg border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700 h-11 px-4"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save Draft"}
            </Button>
            <Button
              onClick={publishBlog}
              disabled={isPublishing}
              className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-sm transition-all duration-200 h-11 px-6"
            >
              <Send className="w-4 h-4 mr-2" />
              {isPublishing ? "Publishing..." : "Publish"}
            </Button>
          </div>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50 text-red-800 rounded-xl">
            <AlertDescription className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-1 w-full"></div>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Blog Content
                </CardTitle>
                <CardDescription>
                  Write your blog post content here. Markdown is supported for rich formatting.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Type className="w-4 h-4 text-blue-600" />
                    Title *
                  </Label>
                  <Input
                    id="title"
                    placeholder="Enter your blog title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-lg h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="excerpt" className="text-sm font-medium text-gray-700">
                    Excerpt (Optional)
                  </Label>
                  <Textarea
                    id="excerpt"
                    placeholder="Write a brief description of your blog post..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    rows={3}
                    className="rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                      A good excerpt helps readers understand what your post is about
                    </p>
                    <p className={`text-sm ${excerpt.length > 160 ? 'text-red-500' : 'text-gray-500'}`}>
                      {excerpt.length}/160
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="content" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-blue-600" />
                    Content *
                  </Label>
                  {isPreview ? (
                    <Card className="border-2 border-dashed border-gray-200 rounded-xl">
                      <CardContent className="p-6 min-h-[400px]">
                        <div className="prose max-w-none">
                          <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4">
                            {title || "Untitled Blog Post"}
                          </h1>
                          {coverImageUrl && (
                            <div className="mb-6 rounded-lg overflow-hidden">
                              <img
                                src={coverImageUrl}
                                alt="Cover"
                                className="w-full h-64 object-cover"
                              />
                            </div>
                          )}
                          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                            {content || "No content yet. Start writing to see your preview here."}
                          </div>
                          {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t">
                              {tags.map((tag) => (
                                <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Textarea
                      id="content"
                      placeholder="Write your blog content here... (Markdown supported)
                      
# Use headings
## For structure

**Bold text** and *italic text*

- Lists
- Are supported

> Blockquotes work too"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={20}
                      className="rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 font-mono resize-none"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Cover Image */}
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  Cover Image
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="coverImage" className="text-xs font-medium text-gray-600">
                    Image URL
                  </Label>
                  <Input
                    id="coverImage"
                    placeholder="https://example.com/image.jpg"
                    value={coverImageUrl}
                    onChange={(e) => setCoverImageUrl(e.target.value)}
                    className="rounded-lg h-10 text-sm"
                  />
                </div>
                {coverImageUrl && (
                  <div className="aspect-video rounded-lg overflow-hidden border-2 border-dashed border-gray-200">
                    <img
                      src={coverImageUrl}
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                {!coverImageUrl && (
                  <div className="aspect-video rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                    <div className="text-center text-gray-400">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-xs">No cover image</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <Tag className="w-4 h-4 text-blue-600" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="rounded-lg h-10 text-sm flex-1"
                  />
                  <Button 
                    onClick={addTag} 
                    size="sm"
                    className="rounded-lg h-10 bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="rounded-full px-3 py-1 text-xs bg-blue-50 text-blue-700 border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors group"
                      onClick={() => removeTag(tag)}
                    >
                      {tag}
                      <X className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Badge>
                  ))}
                  {tags.length === 0 && (
                    <p className="text-xs text-gray-500 text-center w-full py-2">
                      No tags added yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Blog Stats */}
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  Writing Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Words</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">
                    {content.split(/\s+/).filter(word => word.length > 0).length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">Reading Time</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    {calculateReadingTime(content)} min
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">Characters</span>
                  </div>
                  <span className="text-lg font-bold text-purple-600">
                    {content.length}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Quick Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs text-gray-600">
                  • Use descriptive titles and excerpts
                </p>
                <p className="text-xs text-gray-600">
                  • Add relevant tags for better discovery
                </p>
                <p className="text-xs text-gray-600">
                  • Include a cover image to attract readers
                </p>
                <p className="text-xs text-gray-600">
                  • Preview before publishing
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteBlog;