
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Fuel, Plus, Settings, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStationsWithMetrics } from '@/hooks/useStations';

export default function StationsPage() {
  const { data: stations, isLoading, error } = useStationsWithMetrics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-8">
        Error loading stations: {error.message}
      </div>
    );
  }

  const stationsList = stations || [];
  const totalPumps = stationsList.reduce((sum, station) => sum + (station.pumpCount || 0), 0);
  const totalSales = stationsList.reduce((sum, station) => sum + (station.metrics?.totalSales || 0), 0);

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
            <div className="text-2xl font-bold">{stationsList.length}</div>
            <p className="text-xs text-muted-foreground">
              Active stations
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pumps</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPumps}</div>
            <p className="text-xs text-muted-foreground">
              Across all stations
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalSales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total across stations
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Stations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stationsList.filter(s => s.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">
              Currently operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stations Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stationsList.map((station) => (
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
                {station.address || 'No address provided'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Pumps:</span>
                  <span className="font-medium">{station.pumpCount || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Attendants:</span>
                  <span className="font-medium">{station.attendantCount || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Today's Sales:</span>
                  <span className="font-medium">₹{(station.metrics?.totalSales || 0).toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link to={`/dashboard/stations/${station.id}/pumps`}>
                    <Fuel className="mr-1 h-3 w-3" />
                    Pumps
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Settings className="mr-1 h-3 w-3" />
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {stationsList.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No stations found</h3>
          <p className="text-muted-foreground">Get started by adding your first station.</p>
          <Button className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Add Station
          </Button>
        </div>
      )}
    </div>
  );
}
