/**
 * @file pages/LoginPage.tsx
 * @description Login page component
 */
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Fuel, Crown, Shield, Zap, Building, BarChart3, Users, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttemptType, setLoginAttemptType] = useState<'regular' | 'admin' | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login } = useAuth();

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

  const features = [
    { icon: Building, title: "Multi-Station Management", desc: "Manage multiple fuel stations from one platform" },
    { icon: BarChart3, title: "Real-time Analytics", desc: "Track sales, inventory, and performance metrics" },
    { icon: Users, title: "Role-based Access", desc: "Secure user management with granular permissions" },
    { icon: Settings, title: "Complete Control", desc: "Full operational control over your fuel business" }
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
      {/* Left Side - Branding and Features */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 bg-gradient-to-br from-blue-600 to-purple-700 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-300 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-blue-300 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Fuel className="h-12 w-12 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">FuelSync Hub</h1>
              <p className="text-blue-100 text-lg">Comprehensive Fuel Station ERP</p>
            </div>
          </div>

          {/* Hero Text */}
          <div className="mb-12">
            <h2 className="text-3xl font-semibold mb-4">
              Streamline Your Fuel Station Operations
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed">
              From inventory management to sales analytics, manage your entire fuel station network with ease and precision.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                <div className="p-2 bg-white/20 rounded-lg">
                  <feature.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-blue-100">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center space-y-2">
            <div className="flex justify-center">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <Fuel className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FuelSync Hub
            </h1>
          </div>

          {/* Login Card */}
          <Card className="shadow-2xl border-0 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center pb-6">
              <CardTitle className="text-2xl font-semibold flex items-center justify-center gap-2">
                Welcome Back
                {isAdminLoginRoute && (
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 flex items-center gap-1">
                    <Crown className="h-3 w-3" />
                    Admin Portal
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-base">
                {isAdminLoginRoute 
                  ? 'Platform Management & Analytics Dashboard'
                  : 'Access your fuel station management dashboard'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 px-4 text-base"
                  />
                  {isAdminLoginRoute && (
                    <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400">
                      <Shield className="h-3 w-3" />
                      <span>SuperAdmin authentication endpoint</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12 px-4 pr-12 text-base"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
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
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium text-base shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {loginAttemptType === 'admin' ? 'Authenticating...' : 'Signing In...'}
                    </div>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      {isAdminLoginRoute ? 'Admin Sign In' : 'Sign In'}
                    </>
                  )}
                </Button>
              </form>

              {/* Route Switch */}
              <div className="text-center">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200 dark:border-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-gray-950 px-2 text-gray-500">or</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  {isAdminLoginRoute ? (
                    <Button
                      variant="outline"
                      onClick={() => navigate('/login')}
                      className="text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      Switch to Regular Login
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => navigate('/login/admin')}
                      className="text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950 border-purple-200"
                    >
                      <Crown className="mr-2 h-3 w-3" />
                      SuperAdmin Portal
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>© 2024 FuelSync Hub. All rights reserved.</p>
            <p className="mt-1">Secure • Reliable • Scalable</p>
          </div>
        </div>
      </div>
    </div>
  );
}
