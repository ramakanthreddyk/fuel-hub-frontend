import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Fuel, 
  Building, 
  BarChart3, 
  Users, 
  Settings, 
  Zap, 
  Shield, 
  ArrowRight,
  CheckCircle,
  Crown,
  LogIn
} from 'lucide-react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function LandingPage() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showLoginOptions, setShowLoginOptions] = useState(false);

  // Use useEffect for navigation
  useEffect(() => {
    // If user is authenticated, redirect to appropriate dashboard
    if (isAuthenticated && user) {
      if (user.role === 'superadmin') {
        navigate('/superadmin/overview', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Don't render anything if authenticated (will be redirected by useEffect)
  if (isAuthenticated && user) {
    return null;
  }

  const features = [
    { 
      icon: Building, 
      title: "Multi-Station Management", 
      desc: "Manage multiple fuel stations from one centralized platform with real-time monitoring." 
    },
    { 
      icon: BarChart3, 
      title: "Advanced Analytics", 
      desc: "Track sales, inventory, and performance metrics with comprehensive reporting tools." 
    },
    { 
      icon: Users, 
      title: "Role-Based Access", 
      desc: "Secure user management with granular permissions for owners, managers, and attendants." 
    },
    { 
      icon: Settings, 
      title: "Complete Control", 
      desc: "Full operational control over your fuel business operations and workflows." 
    }
  ];

  const benefits = [
    "Real-time inventory tracking",
    "Automated reconciliation",
    "Multi-tenant architecture",
    "Comprehensive reporting",
    "Mobile-friendly interface",
    "24/7 system monitoring"
  ];

  // Handle navigation with functions instead of direct navigate calls
  const handleUserLogin = () => {
    navigate('/login');
  };

  const handleAdminLogin = () => {
    navigate('/login/admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              <Fuel className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FuelSync Hub
              </h1>
              <p className="text-xs text-gray-600">Fuel Station ERP</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!showLoginOptions ? (
              <Button 
                onClick={() => setShowLoginOptions(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={handleUserLogin}
                  className="text-sm"
                >
                  User Login
                </Button>
                <Button 
                  onClick={handleAdminLogin}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-sm"
                >
                  <Crown className="mr-1 h-3 w-3" />
                  Admin
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Rest of the component remains unchanged */}
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 mb-6">
            <Zap className="mr-1 h-3 w-3" />
            Modern Fuel Station Management
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Streamline Your Fuel Station Operations
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Comprehensive ERP solution for fuel station networks. Manage inventory, track sales, 
            monitor performance, and optimize operations with advanced analytics and real-time insights.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => setShowLoginOptions(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="px-8 py-4 text-lg"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to manage your fuel station network efficiently and effectively.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-3">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg w-fit mx-auto mb-3">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  {feature.desc}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Why Choose FuelSync Hub?</h2>
            <p className="text-gray-600 mb-8">
              Built specifically for fuel station operations with deep industry knowledge and modern technology.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          
          <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Ready to Transform Your Business?</CardTitle>
              <CardDescription className="text-blue-100">
                Join hundreds of fuel station owners who trust FuelSync Hub for their operations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-blue-200" />
                  <span className="text-sm">Enterprise-grade security</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-blue-200" />
                  <span className="text-sm">Multi-user support</span>
                </div>
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-5 w-5 text-blue-200" />
                  <span className="text-sm">Advanced reporting</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              <Fuel className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">FuelSync Hub</span>
          </div>
          <p className="text-gray-400 mb-4">© 2024 FuelSync Hub. All rights reserved.</p>
          <p className="text-sm text-gray-500">Secure • Reliable • Scalable</p>
        </div>
      </footer>
    </div>
  );
}