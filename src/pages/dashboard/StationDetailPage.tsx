/**
 * @file StationDetailPage.tsx
 * @description Station detail page component
 * @see docs/API_INTEGRATION_GUIDE.md - API integration patterns
 * @see docs/journeys/OWNER.md - Owner journey for station management
 */
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  MapPin, 
  Fuel, 
  ArrowLeft, 
  Settings, 
  BarChart3, 
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { useStation } from '@/hooks/api/useStations';
import { usePumps } from '@/hooks/api/usePumps';

export default function StationDetailPage() {
  // Get station ID from URL params
  const { stationId } = useParams<{ stationId: string }>();
  
  // Fetch station details
  const { 
    data: station, 
    isLoading: stationLoading, 
    error: stationError 
  } = useStation(stationId || '');
  
  // Fetch pumps for this station
  const { 
    data: pumps, 
    isLoading: pumpsLoading, 
    error: pumpsError 
  } = usePumps(stationId);

  // Loading state
  if (stationLoading || pumpsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Error state
  if (stationError || !station) {
    return (
      <div className="text-center p-8">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Error loading station details</h3>
        <p className="text-muted-foreground mb-4">
          {stationError?.message || "Station not found"}
        </p>
        <Button asChild>
          <Link to="/dashboard/stations">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Stations
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/dashboard/stations">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{station.name}</h1>
            <p className="text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {station.address}
            </p>
          </div>
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

      {/* Station Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pumps</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pumps?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {pumps?.filter(p => p.status === 'active').length || 0} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(station.todaySales || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {station.salesGrowth > 0 ? '+' : ''}{station.salesGrowth || 0}% from yesterday
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Sales</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(station.monthlySales || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pumps List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Pumps</h2>
          <Button size="sm" asChild>
            <Link to={`/dashboard/pumps/new?stationId=${stationId}`}>
              <Fuel className="mr-2 h-4 w-4" />
              Add Pump
            </Link>
          </Button>
        </div>

        {pumpsError ? (
          <Card className="p-6 text-center">
            <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p>Error loading pumps: {pumpsError.message}</p>
          </Card>
        ) : pumps?.length === 0 ? (
          <Card className="p-8 text-center">
            <Fuel className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No pumps yet</h3>
            <p className="text-muted-foreground mb-4">
              Get started by adding your first pump to this station
            </p>
            <Button asChild>
              <Link to={`/dashboard/pumps/new?stationId=${stationId}`}>
                Add First Pump
              </Link>
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pumps?.map((pump) => (
              <Card key={pump.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{pump.name}</CardTitle>
                      <CardDescription>Serial: {pump.serialNumber}</CardDescription>
                    </div>
                    <Badge 
                      variant={pump.status === 'active' ? 'default' : 'secondary'}
                      className={
                        pump.status === 'active' ? 'bg-green-100 text-green-800' :
                        pump.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }
                    >
                      {pump.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="text-sm text-muted-foreground">Nozzles</div>
                    <div className="font-semibold">{pump.nozzleCount || 0}</div>
                  </div>
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link to={`/dashboard/pumps/${pump.id}`}>
                      View Details
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}