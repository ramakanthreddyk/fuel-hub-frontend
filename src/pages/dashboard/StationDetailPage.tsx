
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
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/dashboard/stations')}
            className="flex-shrink-0"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Back to Stations</span>
            <span className="sm:hidden">Back</span>
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold truncate">{station.name}</h1>
            <p className="text-muted-foreground text-sm truncate">{station.address}</p>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/dashboard/stations/${stationId}/settings`)}
            className="flex-1 sm:flex-none"
          >
            <Settings className="mr-2 h-4 w-4" />
            <span className="sm:inline">Settings</span>
          </Button>
          <Button 
            size="sm"
            onClick={() => navigate(`/dashboard/pumps/new?stationId=${stationId}`)}
            className="flex-1 sm:flex-none"
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Add Pump</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* Station Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">₹{(station as any).todaySales?.toLocaleString() || '0'}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {(station as any).salesGrowth ? 
                `+${(station as any).salesGrowth}% from yesterday` : 
                'No growth data available'
              }
            </p>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">₹{(station as any).monthlySales?.toLocaleString() || '0'}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Current month performance
            </p>
          </CardContent>
        </Card>

        <Card className="w-full sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Pumps</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{pumps.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total pumps configured
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pumps Grid */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>Fuel Pumps</CardTitle>
            <Button asChild size="sm">
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
              <p className="text-muted-foreground mb-4 text-sm">
                Add fuel pumps to start managing this station.
              </p>
              <Button onClick={() => navigate(`/dashboard/pumps/new?stationId=${stationId}`)}>
                <Plus className="mr-2 h-4 w-4" />
                Add First Pump
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pumps.slice(0, 6).map((pump) => (
                <Card key={pump.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold truncate">{pump.name}</h3>
                    <Badge variant={pump.status === 'active' ? 'default' : 'secondary'} className="flex-shrink-0">
                      {pump.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 truncate">
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
