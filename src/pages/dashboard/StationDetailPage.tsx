/**
 * @file StationDetailPage.tsx
 * @description Station detail page component
 * @see docs/API_INTEGRATION_GUIDE.md - API integration patterns
 * @see docs/journeys/OWNER.md - Owner journey for station management
 */
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  AlertTriangle,
  Plus,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import { useStation } from '@/hooks/api/useStations';
import { usePumps } from '@/hooks/api/usePumps';

export default function StationDetailPage() {
  const { stationId } = useParams<{ stationId: string }>();
  const navigate = useNavigate();
  const { data: station, isLoading, error } = useStation(stationId!);
  const { data: pumps = [] } = usePumps(stationId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !station) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2">Station not found</h2>
        <Button onClick={() => navigate('/dashboard/stations')}>
          Back to Stations
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/stations')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Stations
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{station.name}</h1>
            <p className="text-muted-foreground">{station.address}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Pump
          </Button>
        </div>
      </div>

      {/* Station Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(station as any).todaySales?.toLocaleString() || '0'}</div>
            <p className="text-xs text-muted-foreground">
              {(station as any).salesGrowth ? 
                `+${(station as any).salesGrowth}% from yesterday` : 
                'No growth data available'
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(station as any).monthlySales?.toLocaleString() || '0'}</div>
            <p className="text-xs text-muted-foreground">
              Current month performance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Pumps</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pumps.length}</div>
            <p className="text-xs text-muted-foreground">
              Total pumps configured
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pumps Grid */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Fuel Pumps</CardTitle>
            <Button asChild>
              <Link to={`/dashboard/stations/${stationId}/pumps`}>
                View All Pumps
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {pumps.length === 0 ? (
            <div className="text-center py-8">
              <Fuel className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Pumps Added</h3>
              <p className="text-muted-foreground mb-4">
                Add fuel pumps to start managing this station.
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add First Pump
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pumps.slice(0, 6).map((pump) => (
                <Card key={pump.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{pump.name}</h3>
                    <Badge variant={pump.status === 'active' ? 'default' : 'secondary'}>
                      {pump.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Serial: {pump.serialNumber || 'N/A'}
                  </p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link to={`/dashboard/stations/${stationId}/pumps/${pump.id}`}>
                      View Details
                    </Link>
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
