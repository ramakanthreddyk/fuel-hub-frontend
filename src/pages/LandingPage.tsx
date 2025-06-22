
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Fuel, Gauge, Users, DollarSign, ArrowRight, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Fuel className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">FuelSync Hub</span>
          </div>
          <div className="space-x-4">
            <Button variant="outline" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/login">Request Demo</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Run Your Fuel Station <span className="text-blue-600">Smartly</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Multi-tenant ERP for fuel distribution and retail automation. 
            Manage pumps, track inventory, handle payments, and optimize operations all in one place.
          </p>
          <div className="flex justify-center space-x-4 mb-12">
            <Button size="lg" asChild>
              <Link to="/login">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg">
              Watch Demo
            </Button>
          </div>
          
          {/* Hero Visual */}
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-3xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Gauge className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Pump Control</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Sales Tracking</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Fuel className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Inventory</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Staff Management</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Your Fuel Station
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From pump control to financial reporting, FuelSync Hub provides 
              comprehensive tools for modern fuel station management.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Gauge,
                title: "Real-time Monitoring",
                description: "Monitor pump status, fuel levels, and sales in real-time with automated alerts."
              },
              {
                icon: DollarSign,
                title: "Financial Management",
                description: "Track revenue, manage creditors, and generate comprehensive financial reports."
              },
              {
                icon: Users,
                title: "Multi-tenant Architecture",
                description: "Manage multiple locations with role-based access and tenant isolation."
              }
            ].map((feature, index) => (
              <Card key={index} className="p-6">
                <CardContent className="p-0">
                  <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Fuel Station?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of fuel station owners who trust FuelSync Hub
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/login">
              Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Fuel className="h-6 w-6" />
              <span className="text-lg font-semibold">FuelSync Hub</span>
            </div>
            <p className="text-sm">© 2024 FuelSync Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
