/**
 * @file pages/dashboard/StationsPage.tsx
 * @description Page for managing fuel stations
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Fuel } from 'lucide-react';
import { useStations } from '@/hooks/api/useStations';

export default function StationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: stations = [], isLoading, error } = useStations();

  // Transform stations data to ensure all properties exist
  const stationsWithDefaults = stations.map(station => ({
    ...station,
    pumpCount: (station as any).pumpCount || 0,
    metrics: (station as any).metrics || { totalSales: 0, activePumps: 0, totalPumps: 0 }
  }));

  const filteredStations = stationsWithDefaults.filter(station =>
    station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    station.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2">Error loading stations</h2>
        <p className="text-muted-foreground">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Fuel Stations</h1>
          <p className="text-muted-foreground">
            Manage your fuel stations and their details.
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full md:w-auto">
            <Label htmlFor="search" className="sr-only">
              Search stations
            </Label>
            <Input
              id="search"
              type="search"
              placeholder="Search stations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button asChild>
            <Link to="/dashboard/stations/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Station
            </Link>
          </Button>
        </div>
      </div>

      {stations.length === 0 ? (
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold mb-2">No Stations Added Yet</h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first fuel station.
          </p>
          <Button asChild>
            <Link to="/dashboard/stations/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Station
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStations.map((station) => (
            <Card key={station.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{station.name}</CardTitle>
                  <Badge variant={station.status === 'active' ? 'default' : 'secondary'}>
                    {station.status}
                  </Badge>
                </div>
                <CardDescription>{station.address}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Pumps:</span>
                    <span className="font-medium">{station.pumpCount}</span>
                  </div>
                  
                  {station.metrics && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Today's Sales:</span>
                      <span className="font-medium">₹{station.metrics.totalSales.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-2">
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link to={`/dashboard/stations/${station.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link to={`/dashboard/stations/${station.id}/pumps`}>
                        <Fuel className="mr-2 h-4 w-4" />
                        Pumps
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
