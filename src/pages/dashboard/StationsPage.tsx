
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Fuel, Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const mockStations = [
  {
    id: '1',
    name: 'Downtown Station',
    address: '123 Main St, City Center',
    status: 'active',
    pumps: 8,
    fuelTypes: ['Petrol', 'Diesel', 'Premium'],
    dailySales: 15420.50
  },
  {
    id: '2', 
    name: 'Highway Station',
    address: '456 Highway Rd, Outskirts',
    status: 'active',
    pumps: 12,
    fuelTypes: ['Petrol', 'Diesel'],
    dailySales: 22150.75
  },
  {
    id: '3',
    name: 'Mall Station',
    address: '789 Mall Ave, Shopping District', 
    status: 'maintenance',
    pumps: 6,
    fuelTypes: ['Petrol', 'Premium'],
    dailySales: 8750.25
  }
];

export default function StationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stations</h1>
          <p className="text-muted-foreground">
            Manage your fuel stations and monitor their performance
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Station
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              +1 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Pumps</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">26</div>
            <p className="text-xs text-muted-foreground">
              2 under maintenance
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹46,321</div>
            <p className="text-xs text-muted-foreground">
              +12% from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Daily Sales</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹42,108</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stations Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockStations.map((station) => (
          <Card key={station.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{station.name}</CardTitle>
                <Badge variant={station.status === 'active' ? 'default' : 'secondary'}>
                  {station.status}
                </Badge>
              </div>
              <CardDescription className="flex items-center">
                <MapPin className="mr-1 h-3 w-3" />
                {station.address}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Pumps:</span>
                  <span className="font-medium">{station.pumps}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Fuel Types:</span>
                  <span className="font-medium">{station.fuelTypes.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Today's Sales:</span>
                  <span className="font-medium">₹{station.dailySales.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
