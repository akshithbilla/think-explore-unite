import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiClient } from "@/lib/api";
import { Eye, EyeOff, Brain, Sparkles, ArrowRight, User, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("signin");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refreshAuth } = useAuth();

  useEffect(() => {
    const checkUser = async () => {
      try {
        if (apiClient.isAuthenticated()) {
          await apiClient.getCurrentUser();
          navigate("/");
        }
      } catch (err) {
        // User not authenticated, stay on auth page
        console.error("Session check error:", err);
      }
    };
    checkUser();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const displayName = formData.get("displayName") as string;
    const username = formData.get("username") as string;

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      await apiClient.signUp(email, password, displayName, username);
      
      // Refresh auth state immediately after signup
      await refreshAuth();
      
      setIsLoading(false);
      
      toast({
        title: "Account created!",
        description: "You have been successfully signed up.",
      });
      
      // Navigate to home page after successful signup
      navigate("/");
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || "Failed to create account. Please try again.");
      console.error("Sign up error:", err);
    }
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await apiClient.signIn(email, password);
      
      // Refresh auth state immediately after signin
      await refreshAuth();
      
      setIsLoading(false);
      navigate("/");
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || "Failed to sign in. Please check your credentials.");
      console.error("Sign in error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/20 flex">
      {/* Left Side - Brand Section */}
      <div className="hidden lg:flex lg:flex-1 flex-col justify-between p-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <Brain className="h-7 w-7 text-white" />
          </div>
          <span className="text-xl font-bold">ThinkSearch</span>
        </div>
        
        <div className="max-w-md space-y-6">
          <div className="flex items-center space-x-2 text-blue-100">
            <Sparkles className="h-5 w-5" />
            <span className="font-medium">Intelligent Search Platform</span>
          </div>
          <h1 className="text-4xl font-bold leading-tight">
            Write, search, and understand everything in one place
          </h1>
          <p className="text-blue-100/80 text-lg">
            Join thousands of professionals who use ThinkSearch to enhance their productivity and knowledge discovery.
          </p>
        </div>

        <div className="flex space-x-4 text-sm text-blue-100/60">
          <span>© 2024 ThinkSearch</span>
          <span>•</span>
          <span>Privacy Policy</span>
          <span>•</span>
          <span>Terms of Service</span>
        </div>
      </div>

      {/* Right Side - Auth Section */}
      <div className="flex-1 flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600">
                <Brain className="h-7 w-7 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Think Search
            </h1>
            <p className="text-muted-foreground mt-2">
              Write, search, and understand everything in one place
            </p>
          </div>

          <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-white/70 backdrop-blur-sm">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-1 w-full"></div>
            <CardHeader className="pb-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/30 rounded-xl h-12">
                  <TabsTrigger 
                    value="signin" 
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 font-medium transition-all duration-200"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup" 
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 font-medium transition-all duration-200"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Sign Up
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>

            <CardContent className="pt-2">
              {error && (
                <Alert className="mb-6 border-red-200 bg-red-50 text-red-800 rounded-xl">
                  <AlertDescription className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsContent value="signin" className="space-y-6 mt-0">
                  <form onSubmit={handleSignIn} className="space-y-5">
                    <div className="space-y-3">
                      <Label htmlFor="signin-email" className="text-sm font-medium text-gray-700">
                        Email Address
                      </Label>
                      <Input
                        id="signin-email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        className="h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                        required
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="signin-password" className="text-sm font-medium text-gray-700">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="signin-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-12 transition-colors"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-sm transition-all duration-200 hover:shadow-md"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Signing in...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>Continue</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      )}
                    </Button>
                  </form>
                  
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-3 bg-white text-gray-500">New to ThinkSearch?</span>
                    </div>
                  </div>
                  
                  <Button 
                    type="button"
                    variant="outline" 
                    className="w-full h-12 rounded-xl border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                    onClick={() => setActiveTab("signup")}
                  >
                    Create an account
                  </Button>
                </TabsContent>

                <TabsContent value="signup" className="space-y-6 mt-0">
                  <form onSubmit={handleSignUp} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <Label htmlFor="displayName" className="text-sm font-medium text-gray-700">
                          Display Name
                        </Label>
                        <Input
                          id="displayName"
                          name="displayName"
                          placeholder="John Doe"
                          className="h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                          required
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                          Username
                        </Label>
                        <Input
                          id="username"
                          name="username"
                          placeholder="johndoe"
                          className="h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="signup-email" className="text-sm font-medium text-gray-700">
                        Email Address
                      </Label>
                      <Input
                        id="signup-email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        className="h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                        required
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="signup-password" className="text-sm font-medium text-gray-700">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Choose a strong password"
                          className="h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-12 transition-colors"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Must be at least 6 characters long
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                        Confirm Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        className="h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-sm transition-all duration-200 hover:shadow-md"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Creating account...</span>
                        </div>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                  
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-3 bg-white text-gray-500">Already have an account?</span>
                    </div>
                  </div>
                  
                  <Button 
                    type="button"
                    variant="outline" 
                    className="w-full h-12 rounded-xl border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                    onClick={() => setActiveTab("signin")}
                  >
                    Sign in instead
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-gray-500 mt-6">
            <p>By continuing, you agree to our Terms of Service and Privacy Policy.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;