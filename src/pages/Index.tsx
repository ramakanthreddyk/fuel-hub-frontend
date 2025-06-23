
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  Fuel, 
  BarChart3, 
  Users, 
  Shield, 
  Gauge, 
  DollarSign,
  Building2,
  Zap,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Globe
} from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: <Fuel className="h-8 w-8 text-blue-600" />,
      title: "Fuel Management",
      description: "Complete inventory tracking, deliveries, and pricing control across all stations"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-green-600" />,
      title: "Real-time Analytics",
      description: "Live sales data, performance metrics, and business intelligence dashboards"
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "Multi-Role Access",
      description: "Role-based permissions for owners, managers, attendants, and system administrators"
    },
    {
      icon: <Shield className="h-8 w-8 text-red-600" />,
      title: "Enterprise Security",
      description: "Multi-tenant architecture with isolated data and advanced security protocols"
    }
  ];

  const benefits = [
    "Streamline daily operations across multiple stations",
    "Real-time fuel inventory and sales tracking",
    "Automated reconciliation and reporting",
    "Credit management and payment processing",
    "Performance analytics and business insights",
    "Role-based access control and security"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Navigation */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Fuel className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">FuelSync Hub</h1>
              <p className="text-sm text-gray-500">Enterprise Fuel Station ERP</p>
            </div>
          </div>
          <Button asChild>
            <Link to="/login">
              <Shield className="mr-2 h-4 w-4" />
              Login
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4 px-3 py-1">
            <Globe className="mr-2 h-3 w-3" />
            Multi-Tenant ERP Platform
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Modern ERP for
            <span className="text-blue-600 block">Fuel Station Networks</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Streamline operations, track inventory, manage sales, and gain insights 
            across your entire fuel station network with our comprehensive enterprise solution.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link to="/login">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              <TrendingUp className="mr-2 h-5 w-5" />
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need to Manage Your Fuel Network
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From single stations to enterprise networks, FuelSync Hub scales with your business
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="mb-2">{feature.icon}</div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why Choose FuelSync Hub?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-6 text-center">
                  <Gauge className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Real-time</h3>
                  <p className="text-sm text-gray-600">Live Monitoring</p>
                </Card>
                <Card className="p-6 text-center">
                  <Building2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Multi-Station</h3>
                  <p className="text-sm text-gray-600">Network Support</p>
                </Card>
                <Card className="p-6 text-center">
                  <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Sales</h3>
                  <p className="text-sm text-gray-600">Complete Tracking</p>
                </Card>
                <Card className="p-6 text-center">
                  <Zap className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Automated</h3>
                  <p className="text-sm text-gray-600">Reconciliation</p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Fuel Station Operations?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of fuel station operators who trust FuelSync Hub 
            to manage their daily operations and drive business growth.
          </p>
          <Button size="lg" variant="secondary" asChild className="text-lg px-8 py-6">
            <Link to="/login">
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Fuel className="h-5 w-5 text-blue-400" />
            <span className="font-semibold">FuelSync Hub</span>
          </div>
          <p className="text-sm">
            Enterprise-grade fuel station management for the modern world.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
