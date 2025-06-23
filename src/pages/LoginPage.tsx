
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { Fuel, AlertCircle, Eye, EyeOff, Wifi, WifiOff, Globe } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'failed'>('unknown');
  const { login, setUser, setToken } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    return email.includes('@');
  };

  const testConnection = async () => {
    try {
      console.log('[LOGIN-PAGE] Testing API connection...');
      setConnectionStatus('unknown');
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/health`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        setConnectionStatus('connected');
        toast({
          title: "✅ Backend Connected",
          description: "Successfully connected to Azure backend",
        });
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error: any) {
      console.error('[LOGIN-PAGE] Connection test failed:', error);
      setConnectionStatus('failed');
      toast({
        title: "❌ Backend Connection Failed",
        description: `CORS or network issue: ${error.message}`,
        variant: "destructive",
      });
    }
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
            description: "Successfully logged in via direct connection.",
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
          'CORS issue: Backend not accessible from this domain' : errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
    
    return false;
  };

  const demoCredentials = [
    { role: 'SuperAdmin', email: 'admin@fuelsync.dev', password: 'password', color: 'bg-purple-500' },
    { role: 'Owner', email: 'owner@demo.com', password: 'password', color: 'bg-blue-500' },
    { role: 'Manager', email: 'manager@demo.com', password: 'password', color: 'bg-green-500' },
    { role: 'Attendant', email: 'attendant@demo.com', password: 'password', color: 'bg-orange-500' }
  ];

  const quickLogin = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
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
              
              <div className="flex gap-2 mt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1 border-purple-200 text-purple-600 hover:bg-purple-50" 
                  onClick={testConnection}
                >
                  {connectionStatus === 'connected' ? (
                    <Wifi className="mr-2 h-4 w-4 text-green-500" />
                  ) : connectionStatus === 'failed' ? (
                    <WifiOff className="mr-2 h-4 w-4 text-red-500" />
                  ) : (
                    <Globe className="mr-2 h-4 w-4" />
                  )}
                  Test Backend
                </Button>
                
                <Button 
                  type="button" 
                  variant="secondary" 
                  className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100" 
                  onClick={() => {
                    toast({
                      title: "🌐 API Configuration",
                      description: `Backend URL: ${import.meta.env.VITE_API_BASE_URL}`,
                    });
                  }}
                >
                  Show API URL
                </Button>
              </div>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-900 mb-3">🧪 Test Credentials (password: "password"):</p>
                  <div className="space-y-2">
                    {demoCredentials.map((cred) => (
                      <div key={cred.role} className="flex items-center justify-between p-2 bg-white/70 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${cred.color}`}></div>
                          <span className="text-gray-800">
                            <strong>{cred.role}:</strong> <code className="text-xs bg-gray-100 px-1 rounded">{cred.email}</code>
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-1 text-purple-600 hover:text-purple-800 hover:bg-purple-50"
                          onClick={() => quickLogin(cred.email, cred.password)}
                        >
                          Use
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 p-2 bg-red-50 rounded border border-red-200">
                    <p className="text-xs text-red-700">
                      ⚠️ <strong>CORS Issue:</strong> If login fails with "Failed to fetch", your Azure backend needs CORS configuration to allow requests from <code className="bg-red-100 px-1 rounded">lovableproject.com</code>
                    </p>
                  </div>
                </div>
              </div>
            </div>
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
