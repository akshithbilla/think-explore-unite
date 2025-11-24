import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Search, Edit3, Brain, Zap, Globe, BookOpen } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/20" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 -left-10 w-72 h-72 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-gradient-to-r from-indigo-500/15 to-pink-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-6xl mx-auto">
          {/* Enhanced Badge */}
          <div className="inline-flex items-center space-x-3 px-6 py-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg mb-12 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI-Enhanced Content Platform
            </span>
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 animate-ping" />
          </div>

          {/* Enhanced Main heading */}
          <div className="mb-8">
            <h1 className="text-5xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Write, Search
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                & Understand
              </span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mt-8" />
          </div>

          {/* Enhanced Subtitle */}
          <p className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
            Think Search combines powerful blogging with intelligent multi-domain search and AI summaries. 
            Create content, discover knowledge, and comprehend faster than ever before.
          </p>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center mb-16">
            <Button 
              size="lg" 
              className="text-lg px-10 py-7 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
            >
              <Edit3 className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
              Start Writing
              <Zap className="ml-2 h-5 w-5 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-10 py-7 rounded-2xl border-2 border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 font-semibold shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 group"
            >
              <Search className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
              Explore Search
              <ArrowRight className="ml-2 h-5 w-5 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
            </Button>
          </div>

          {/* Enhanced Feature highlights */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="group text-center p-8 rounded-3xl bg-white/60 backdrop-blur-sm border border-gray-200 shadow-sm hover:shadow-2xl hover:border-blue-200 transition-all duration-500 hover:scale-105">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Edit3 className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                Rich Blogging
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Medium-style editor with advanced formatting and real-time collaboration
              </p>
            </div>
            
            <div className="group text-center p-8 rounded-3xl bg-white/60 backdrop-blur-sm border border-gray-200 shadow-sm hover:shadow-2xl hover:border-purple-200 transition-all duration-500 hover:scale-105">
              <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-3 text-gray-900 group-hover:text-purple-600 transition-colors">
                Smart Search
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Multi-domain search across blogs, news, research papers, and media content
              </p>
            </div>
            
            <div className="group text-center p-8 rounded-3xl bg-white/60 backdrop-blur-sm border border-gray-200 shadow-sm hover:shadow-2xl hover:border-indigo-200 transition-all duration-500 hover:scale-105">
              <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-3 text-gray-900 group-hover:text-indigo-600 transition-colors">
                AI Summaries
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Instant comprehension with intelligent summaries and key insights extraction
              </p>
            </div>
          </div>

          {/* Additional Stats Section */}
          <div className="mt-16 pt-12 border-t border-gray-200/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">10K+</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Active Writers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">50K+</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Articles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">1M+</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Searches</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">99.9%</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Uptime</div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="mt-16 animate-bounce">
            <div className="w-6 h-10 border-2 border-gray-400 rounded-full mx-auto flex justify-center">
              <div className="w-1 h-3 bg-gray-400 rounded-full mt-2" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;