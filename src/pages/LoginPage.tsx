
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { Fuel, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const { login, setUser, setToken } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    return email.includes('@');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('[LOGIN-PAGE] Form submitted with email:', email);
    
    if (!validateEmail(email)) {
      console.log('[LOGIN-PAGE] Email validation failed - invalid format');
      setEmailError('Please enter a valid email address');
      return;
    }
    
    setEmailError('');
    setIsLoading(true);
    console.log('[LOGIN-PAGE] Starting login process');

    try {
      // Try the normal login flow first
      try {
        await login(email, password);
        console.log('[LOGIN-PAGE] Login successful');
        toast({
          title: "🎉 Welcome back!",
          description: "You have been successfully logged in.",
        });
        return false;
      } catch (loginError) {
        console.error('[LOGIN-PAGE] Normal login failed, trying direct fetch:', loginError);
        
        // Fallback to direct fetch with better CORS handling
        console.log('[LOGIN-PAGE] Attempting direct fetch login with CORS handling');
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
          method: 'POST',
          mode: 'cors',
          credentials: 'omit',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
        
        const data = await response.json();
        console.log('[LOGIN-PAGE] Direct fetch login response:', data);
        
        if (!response.ok) {
          const errorMsg = data.message || `HTTP error! Status: ${response.status}`;
          console.error('[LOGIN-PAGE] API error:', errorMsg);
          throw new Error(errorMsg);
        }
        
        if (data.token && data.user) {
          setUser(data.user);
          setToken(data.token);
          localStorage.setItem('fuelsync_token', data.token);
          localStorage.setItem('fuelsync_user', JSON.stringify(data.user));
          
          toast({
            title: "🎉 Welcome back!",
            description: "Successfully logged in.",
          });
          
          // Role-based redirect
          switch (data.user.role) {
            case 'superadmin':
              navigate('/superadmin/overview');
              break;
            case 'attendant':
              navigate('/dashboard/readings/new');
              break;
            default:
              navigate('/dashboard');
          }
        } else {
          throw new Error('Invalid response format: missing token or user data');
        }
      }
    } catch (error: any) {
      console.error('[LOGIN-PAGE] All login attempts failed:', error);
      
      const errorMessage = error?.message || 'Unknown error';
      
      toast({
        title: "🚫 Login failed",
        description: errorMessage.includes('fetch') ? 
          'Connection issue: Please check your network or try again later' : errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
    
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-2xl font-bold text-gray-900 hover:text-purple-600 transition-colors">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
              <Fuel className="h-8 w-8 text-white" />
            </div>
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              FuelSync Hub
            </span>
          </Link>
          <p className="text-gray-600 mt-2">Welcome back to your dashboard</p>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-t-lg">
            <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Sign In
            </CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4" action="javascript:void(0);">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  required
                  className={emailError ? 'border-red-500 focus:ring-red-500' : 'focus:ring-purple-500 focus:border-purple-500'}
                />
                {emailError && (
                  <p className="text-sm text-red-500 mt-1">{emailError}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="focus:ring-purple-500 focus:border-purple-500"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-purple-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white shadow-lg" 
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-gray-600 hover:text-purple-600 transition-colors">
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
