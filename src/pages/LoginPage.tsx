
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { Fuel, AlertCircle, Eye, EyeOff } from 'lucide-react';
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
    // Basic email validation - just check if it has @ symbol
    return email.includes('@');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Add immediate log to console
    console.log('[LOGIN-PAGE] Form submitted with email:', email);
    
    // Validate email format
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
          title: "Welcome back!",
          description: "You have been successfully logged in.",
        });
        return false;
      } catch (loginError) {
        console.error('[LOGIN-PAGE] Normal login failed, trying direct fetch:', loginError);
        
        // Fallback to direct fetch if the normal login fails
        console.log('[LOGIN-PAGE] Attempting direct fetch login');
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
        
        const data = await response.json();
        console.log('[LOGIN-PAGE] Direct fetch login response:', data);
        
        if (!response.ok) {
          // Show the specific error message from the server
          const errorMsg = data.message || `HTTP error! Status: ${response.status}`;
          console.error('[LOGIN-PAGE] API error:', errorMsg);
          throw new Error(errorMsg);
        }
        
        if (data.token && data.user) {
          // Manually update auth context
          setUser(data.user);
          setToken(data.token);
          localStorage.setItem('fuelsync_token', data.token);
          localStorage.setItem('fuelsync_user', JSON.stringify(data.user));
          
          toast({
            title: "Welcome back!",
            description: "You have been successfully logged in (direct method).",
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
      
      // Display detailed error message
      const errorMessage = error?.message || 'Unknown error';
      alert('Login failed: ' + errorMessage);
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
    
    return false; // Ensure no form submission
  };

  const demoCredentials = [
    { role: 'SuperAdmin', email: 'admin@fuelsync.dev', password: 'password' },
    { role: 'Owner', email: 'owner@demo.com', password: 'password' },
    { role: 'Manager', email: 'manager@demo.com', password: 'password' },
    { role: 'Attendant', email: 'attendant@demo.com', password: 'password' }
  ];

  const quickLogin = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            <Fuel className="h-8 w-8" />
            <span>FuelSync Hub</span>
          </Link>
          <p className="text-gray-600 mt-2">Welcome back to your dashboard</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                  className={emailError ? 'border-red-500' : ''}
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
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
              
              <div className="flex gap-2 mt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1" 
                  onClick={async () => {
                    try {
                      console.log('Testing API connection...');
                      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/test`);
                      const data = await response.json();
                      alert(`API test result: ${JSON.stringify(data)}`);
                    } catch (error: any) {
                      console.error('API test failed:', error);
                      alert(`API test failed: ${error?.message || 'Unknown error'}`);
                    }
                  }}
                >
                  Test API Connection
                </Button>
                
                <Button 
                  type="button" 
                  variant="secondary" 
                  className="flex-1" 
                  onClick={() => {
                    alert(`Current API URL: ${import.meta.env.VITE_API_BASE_URL}`);
                  }}
                >
                  Show API URL
                </Button>
              </div>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900 mb-2">Test Credentials (password: "password"):</p>
                  <p className="text-blue-700 mb-2"><strong>Note:</strong> Emails contain underscores in domain names</p>
                  <div className="space-y-1">
                    {demoCredentials.map((cred) => (
                      <div key={cred.role} className="flex items-center justify-between">
                        <span className="text-blue-700">
                          <strong>{cred.role}:</strong> {cred.email}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-1 text-blue-600 hover:text-blue-800"
                          onClick={() => quickLogin(cred.email, cred.password)}
                        >
                          Use
                        </Button>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-blue-600">
                    If login fails, run <code className="bg-blue-100 px-1 rounded">npm run reset:passwords</code> on the backend
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-gray-600 hover:text-blue-600">
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
