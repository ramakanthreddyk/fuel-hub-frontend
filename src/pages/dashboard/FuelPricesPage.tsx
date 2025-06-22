
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Fuel, TrendingUp, TrendingDown, Edit, Plus } from 'lucide-react';

const mockFuelPrices = [
  {
    id: '1',
    fuelType: 'Petrol',
    currentPrice: 102.50,
    previousPrice: 101.75,
    change: 0.75,
    changePercent: 0.74,
    lastUpdated: '2024-01-15 09:30:00',
    effectiveDate: '2024-01-15',
    status: 'active'
  },
  {
    id: '2',
    fuelType: 'Diesel', 
    currentPrice: 89.25,
    previousPrice: 89.75,
    change: -0.50,
    changePercent: -0.56,
    lastUpdated: '2024-01-15 09:30:00',
    effectiveDate: '2024-01-15',
    status: 'active'
  },
  {
    id: '3',
    fuelType: 'Premium Petrol',
    currentPrice: 108.75,
    previousPrice: 108.00,
    change: 0.75,
    changePercent: 0.69,
    lastUpdated: '2024-01-15 09:30:00',
    effectiveDate: '2024-01-15',
    status: 'active'
  }
];

export default function FuelPricesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fuel Prices</h1>
          <p className="text-muted-foreground">
            Manage and monitor fuel pricing across all stations
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Update Prices
        </Button>
      </div>

      {/* Price Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {mockFuelPrices.map((fuel) => (
          <Card key={fuel.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Fuel className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">{fuel.fuelType}</CardTitle>
                </div>
                <Badge variant="default">{fuel.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">₹{fuel.currentPrice.toFixed(2)}</div>
                  <p className="text-sm text-muted-foreground">per litre</p>
                </div>
                
                <div className="flex items-center justify-center space-x-2">
                  {fuel.change > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    fuel.change > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {fuel.change > 0 ? '+' : ''}₹{fuel.change.toFixed(2)} ({fuel.changePercent.toFixed(2)}%)
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Previous Price:</span>
                    <span>₹{fuel.previousPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Effective Date:</span>
                    <span>{fuel.effectiveDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Updated:</span>
                    <span>{fuel.lastUpdated}</span>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="w-full">
                  <Edit className="mr-2 h-4 w-4" />
                  Update Price
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Price History */}
      <Card>
        <CardHeader>
          <CardTitle>Price History</CardTitle>
          <CardDescription>
            Recent fuel price changes across all fuel types
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockFuelPrices.map((fuel) => (
              <div key={fuel.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Fuel className="h-8 w-8 text-blue-600" />
                  <div>
                    <h4 className="font-medium">{fuel.fuelType}</h4>
                    <p className="text-sm text-muted-foreground">
                      Updated on {fuel.effectiveDate}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">₹{fuel.currentPrice.toFixed(2)}</div>
                  <div className={`text-sm flex items-center ${
                    fuel.change > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {fuel.change > 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {fuel.change > 0 ? '+' : ''}₹{fuel.change.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
