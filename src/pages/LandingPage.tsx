import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  LogIn,
  Star,
  Sparkles,
  TrendingUp,
  Play,
  Rocket
} from 'lucide-react';
import { FuelLoadingSpinner } from '@/components/common/FuelLoadingSpinner';

export default function LandingPage() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [showTrial, setShowTrial] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  // Animated counter effect
  const [counters, setCounters] = useState({
    stations: 0,
    pumps: 0,
    users: 0
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'superadmin') {
        navigate('/superadmin/overview', { replace: true });
      } else if (user.role === 'attendant') {
        navigate('/attendant', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Animation sequence
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 6);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // Counter animation
  useEffect(() => {
    const animateCounters = () => {
      const targetValues = { stations: 150, pumps: 800, users: 2500 };
      const duration = 2000;
      const steps = 60;
      let step = 0;

      const interval = setInterval(() => {
        step++;
        const progress = step / steps;
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        setCounters({
          stations: Math.floor(targetValues.stations * easeProgress),
          pumps: Math.floor(targetValues.pumps * easeProgress),
          users: Math.floor(targetValues.users * easeProgress)
        });

        if (step >= steps) {
          clearInterval(interval);
        }
      }, duration / steps);
    };

    const timer = setTimeout(animateCounters, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <FuelLoadingSpinner size="lg" text="Initializing FuelSync Hub..." />
      </div>
    );
  }

  if (isAuthenticated && user) {
    return null;
  }

  const handleLaunchDashboard = () => {
    setShowLoginOptions(true);
  };

  const handleWatchDemo = () => {
    setShowDemo(true);
  };

  const handleStartTrial = () => {
    setShowTrial(true);
  };

  const handleUserLogin = () => {
    navigate('/login');
  };

  const handleAdminLogin = () => {
    navigate('/login/admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-purple-500/30 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-pink-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-green-500/25 rounded-full blur-xl animate-bounce delay-500"></div>
        
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 gap-4 h-full w-full p-8">
            {Array.from({ length: 144 }).map((_, i) => (
              <div 
                key={i} 
                className={`bg-white/5 rounded transition-all duration-1000 ${
                  animationStep === Math.floor(i / 24) ? 'bg-blue-500/20 scale-110' : ''
                }`}
                style={{ animationDelay: `${i * 50}ms` }}
              ></div>
            ))}
          </div>
        </div>

        {/* Floating Icons */}
        <div className="absolute top-1/4 left-10 text-blue-400/30 animate-spin">
          <Fuel className="h-16 w-16" />
        </div>
        <div className="absolute top-1/3 right-16 text-purple-400/30 animate-pulse">
          <BarChart3 className="h-12 w-12" />
        </div>
        <div className="absolute bottom-1/3 left-1/3 text-pink-400/30 animate-bounce">
          <Building className="h-14 w-14" />
        </div>
      </div>

      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl animate-pulse">
              <Fuel className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                FuelSync Hub
              </h1>
              <p className="text-xs text-gray-400">Next-Gen Fuel Station ERP</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {!showLoginOptions ? (
              <Button 
                onClick={() => setShowLoginOptions(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
            ) : (
              <div className="flex gap-2 animate-fade-in">
                <Button 
                  variant="outline"
                  onClick={handleUserLogin}
                  className="text-sm bg-white/10 border-white/20 text-white hover:bg-white/20"
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

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center relative z-10">
        <div className="max-w-6xl mx-auto">
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 mb-8 animate-bounce">
            <Sparkles className="mr-2 h-4 w-4" />
            Revolutionary Fuel Management Platform
          </Badge>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-fade-in">
            Power Your
            <span className="block text-white animate-pulse">Fuel Empire</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in delay-500">
            Experience the future of fuel station management with AI-powered analytics, 
            real-time monitoring, and seamless operations across your entire network.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button 
              size="lg"
              onClick={handleLaunchDashboard}
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-12 py-6 text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
            >
              <Zap className="mr-3 h-6 w-6" />
              Launch Dashboard
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={handleWatchDemo}
              className="px-12 py-6 text-xl bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-md"
            >
              <Play className="mr-3 h-6 w-6" />
              Watch Demo
            </Button>
          </div>

          {/* Animated Stats */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2 animate-pulse">
                  {counters.stations}+
                </div>
                <div className="text-gray-300">Active Stations</div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2 animate-pulse">
                  {counters.pumps}+
                </div>
                <div className="text-gray-300">Smart Pumps</div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="text-4xl font-bold text-pink-400 mb-2 animate-pulse">
                  {counters.users}+
                </div>
                <div className="text-gray-300">Happy Users</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 text-white">Supercharge Your Operations</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Advanced features designed to transform how you manage fuel stations.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Building, title: "Multi-Station Control", desc: "Centralized management across your entire network", color: "from-blue-500 to-cyan-500" },
            { icon: BarChart3, title: "Real-time Analytics", desc: "AI-powered insights and predictive analytics", color: "from-purple-500 to-indigo-500" },
            { icon: Users, title: "Smart Access Control", desc: "Role-based permissions with biometric security", color: "from-pink-500 to-rose-500" },
            { icon: Settings, title: "Automated Operations", desc: "Self-healing systems with 99.9% uptime", color: "from-green-500 to-emerald-500" }
          ].map((feature, index) => (
            <Card key={index} className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-500 transform hover:scale-105 hover:rotate-1 group">
              <CardContent className="p-8 text-center">
                <div className={`p-4 bg-gradient-to-r ${feature.color} rounded-2xl w-fit mx-auto mb-6 group-hover:animate-pulse`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-md border-white/20 p-12">
            <CardContent>
              <div className="flex items-center justify-center gap-4 mb-8">
                <Shield className="h-12 w-12 text-blue-400 animate-pulse" />
                <TrendingUp className="h-12 w-12 text-purple-400 animate-bounce" />
                <Zap className="h-12 w-12 text-pink-400 animate-pulse" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-6">Ready to Revolutionize Your Business?</h2>
              <p className="text-xl text-gray-300 mb-8">
                Join the fuel station owners who've transformed their operations with FuelSync Hub.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={handleStartTrial}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 text-lg shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <Rocket className="mr-2 h-5 w-5" />
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex items-center justify-center gap-8 mt-8 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>30-Day Free Trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>No Credit Card Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-md text-white py-12 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl animate-pulse">
              <Fuel className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              FuelSync Hub
            </span>
          </div>
          <p className="text-gray-400 mb-4">© 2024 FuelSync Hub. All rights reserved.</p>
          <p className="text-sm text-gray-500">🚀 Secure • 🔄 Reliable • ⚡ Scalable</p>
        </div>
      </footer>

      {/* Demo Dialog */}
      <Dialog open={showDemo} onOpenChange={setShowDemo}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-blue-500" />
              FuelSync Hub Demo
            </DialogTitle>
            <DialogDescription>
              Watch our interactive demo to see how FuelSync Hub transforms fuel station management.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 py-4">
            <div className="w-full h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
              <FuelLoadingSpinner text="Loading demo..." />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Demo coming soon! Our team is preparing an interactive showcase of all FuelSync Hub features.
            </p>
            <Button onClick={() => setShowLoginOptions(true)} className="w-full">
              Try Live Demo Instead
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Trial Dialog */}
      <Dialog open={showTrial} onOpenChange={setShowTrial}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-purple-500" />
              Start Your Free Trial
            </DialogTitle>
            <DialogDescription>
              Get started with FuelSync Hub today. No credit card required for your 30-day trial.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="font-medium">What's included:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Full access to all features
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Up to 5 fuel stations
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  24/7 customer support
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Data migration assistance
                </li>
              </ul>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleUserLogin} className="flex-1">
                Sign Up Now
              </Button>
              <Button variant="outline" onClick={handleAdminLogin}>
                Admin Setup
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
