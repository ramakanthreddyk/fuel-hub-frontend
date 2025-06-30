
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Fuel, Crown, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttemptType, setLoginAttemptType] = useState<'regular' | 'admin' | null>(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Check if this is admin login via route path
  const isAdminLoginRoute = location.pathname.includes('/admin') || location.pathname === '/login/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginAttemptType(isAdminLoginRoute ? 'admin' : 'regular');

    try {
      await login(email, password, isAdminLoginRoute);
      // Navigation is handled by AuthContext
    } catch (error: any) {
      setLoginAttemptType(null);
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              <Fuel className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            FuelSync Hub
          </h1>
          <p className="text-gray-600">
            Comprehensive fuel station management platform
          </p>
        </div>

        {/* Login Form */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-semibold flex items-center justify-center gap-2">
              Welcome Back
              {isAdminLoginRoute && (
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 flex items-center gap-1">
                  <Crown className="h-3 w-3" />
                  Admin Portal
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {isAdminLoginRoute 
                ? 'SuperAdmin Portal - Platform Management Access'
                : 'Enter your credentials to access your account'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
                {isAdminLoginRoute && (
                  <div className="flex items-center gap-2 text-xs text-purple-600">
                    <Shield className="h-3 w-3" />
                    <span>Using SuperAdmin authentication endpoint</span>
                  </div>
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
                    className="h-11 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {loginAttemptType === 'admin' ? 'Authenticating Admin...' : 'Signing In...'}
                  </div>
                ) : (
                  isAdminLoginRoute ? 'Admin Sign In' : 'Sign In'
                )}
              </Button>
            </form>

            {/* Route Switch Links */}
            <div className="mt-4 text-center text-sm">
              {isAdminLoginRoute ? (
                <button
                  onClick={() => navigate('/login')}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Switch to Regular Login
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login/admin')}
                  className="text-purple-600 hover:text-purple-800 underline"
                >
                  SuperAdmin Portal →
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>© 2024 FuelSync Hub. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
