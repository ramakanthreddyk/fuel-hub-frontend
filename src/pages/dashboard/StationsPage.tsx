
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Fuel, Plus, Settings, Loader2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStationsWithMetrics } from '@/hooks/useStations';
import CreateStationDialog from '@/components/dashboard/CreateStationDialog';
import { MobileStatsCard } from '@/components/dashboard/MobileStatsCard';

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

  const mobileStats = [
    { title: 'Stations', value: stationsList.length, icon: Building2, color: 'text-blue-600' },
    { title: 'Pumps', value: totalPumps, icon: Fuel, color: 'text-green-600' },
    { title: 'Sales', value: `₹${totalSales.toLocaleString()}`, icon: Building2, color: 'text-purple-600' },
    { title: 'Active', value: stationsList.filter(s => s.status === 'active').length, icon: Building2, color: 'text-emerald-600' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Stations</h1>
          <p className="text-muted-foreground text-sm md:text-base hidden md:block">
            Manage your fuel stations and monitor their performance
          </p>
          <p className="text-muted-foreground text-sm md:hidden">
            Manage stations
          </p>
        </div>
        <div className="flex gap-2">
          <CreateStationDialog>
            <Button size="sm" className="md:hidden">
              <Plus className="h-4 w-4" />
            </Button>
          </CreateStationDialog>
          <div className="hidden md:block">
            <CreateStationDialog />
          </div>
        </div>
      </div>

      {/* Mobile Stats Card */}
      <MobileStatsCard stats={mobileStats} />

      {/* Desktop Stats Cards */}
      <div className="hidden md:grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stationsList.length}</div>
            <p className="text-xs text-muted-foreground">
              {stationsList.filter(s => s.status === 'active').length} active
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
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalSales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Combined revenue
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg per Station</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{stationsList.length > 0 ? Math.round(totalSales / stationsList.length).toLocaleString() : '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Average sales
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stations Grid */}
      <div className="grid gap-4 md:gap-6">
        {stationsList.length === 0 ? (
          <Card className="p-12 text-center">
            <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No stations yet</h3>
            <p className="text-muted-foreground mb-4">
              Get started by adding your first fuel station
            </p>
            <CreateStationDialog>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add First Station
              </Button>
            </CreateStationDialog>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stationsList.map((station) => (
              <Card key={station.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{station.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {station.address}
                      </CardDescription>
                    </div>
                    <Badge 
                      variant={station.status === 'active' ? 'default' : 'secondary'}
                      className={
                        station.status === 'active' ? 'bg-green-100 text-green-800' :
                        station.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }
                    >
                      {station.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Pumps</div>
                      <div className="font-semibold">{station.pumpCount || 0}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Sales</div>
                      <div className="font-semibold">₹{(station.metrics?.totalSales || 0).toLocaleString()}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild className="flex-1">
                      <Link to={`/dashboard/stations/${station.id}`}>
                        <Eye className="mr-2 h-3 w-3" />
                        View Details
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild className="flex-1">
                      <Link to={`/dashboard/pumps?stationId=${station.id}`}>
                        <Fuel className="mr-2 h-3 w-3" />
                        Pumps
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
