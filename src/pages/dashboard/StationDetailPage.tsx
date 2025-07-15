
/**
 * @file StationDetailPage.tsx
 * @description Station detail page component with enhanced design
 * @see docs/API_INTEGRATION_GUIDE.md - API integration patterns
 * @see docs/journeys/OWNER.md - Owner journey for station management
 */
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/ui/page-header';
import { EnhancedMetricsCard } from '@/components/ui/enhanced-metrics-card';
import { formatCurrency, formatNumber } from '@/utils/formatters';
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
  TrendingUp,
  Activity,
  Zap,
  Users,
  Eye,
  Edit3
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
      <div className="space-y-6 p-4 sm:p-6">
        <PageHeader 
          title="Station Not Found"
          description="The requested station could not be found"
          actions={
            <Button onClick={() => navigate('/dashboard/stations')} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Stations
            </Button>
          }
        />
      </div>
    );
  }

  const activePumps = pumps.filter(p => p.status === 'active').length;

  return (
    <div className="space-y-6 p-4 sm:p-6 pb-20">
      {/* Enhanced Header with Back Button */}
      <PageHeader 
        title={station.name}
        description={
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {station.address}
          </div>
        }
        actions={
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard/stations')}
              className="flex-1 sm:flex-none"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Stations
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/dashboard/stations/${stationId}/settings`)}
              className="flex-1 sm:flex-none"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button 
              size="sm"
              onClick={() => navigate(`/dashboard/pumps/new?stationId=${stationId}`)}
              className="flex-1 sm:flex-none"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Pump
            </Button>
          </div>
        }
      />

      {/* Station Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
        <EnhancedMetricsCard
          title="Active Pumps"
          value={`${activePumps}/${pumps.length}`}
          icon={<Fuel className="h-5 w-5" />}
          description="Operational fuel dispensers"
          gradient="from-orange-500 to-red-600"
        />
      </div>

      {/* Enhanced Pumps Section */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/30">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                <Fuel className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl">Fuel Pumps</CardTitle>
                <CardDescription>Manage station fuel dispensers</CardDescription>
              </div>
            </div>
            <Button asChild variant="default" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg">
              <Link to={`/dashboard/stations/${stationId}/pumps`}>
                <Eye className="mr-2 h-4 w-4" />
                View All Pumps
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {pumps.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 rounded-full bg-gradient-to-br from-orange-100 to-red-100 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Fuel className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">No Pumps Added</h3>
              <p className="text-muted-foreground mb-6 text-sm max-w-md mx-auto">
                Add fuel pumps to start managing this station and tracking fuel dispensing operations.
              </p>
              <Button 
                onClick={() => navigate(`/dashboard/pumps/new?stationId=${stationId}`)}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-lg"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add First Pump
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pumps.slice(0, 6).map((pump) => (
                <Card key={pump.id} className="group hover:shadow-lg transition-all duration-200 border-0 bg-gradient-to-br from-white to-gray-50/50 overflow-hidden">
                  <div className={`h-1 bg-gradient-to-r ${
                    pump.status === 'active' ? 'from-green-500 to-emerald-600' :
                    pump.status === 'maintenance' ? 'from-orange-500 to-yellow-600' :
                    'from-red-500 to-red-600'
                  }`} />
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg shadow-md ${
                          pump.status === 'active' ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
                          pump.status === 'maintenance' ? 'bg-gradient-to-br from-orange-500 to-yellow-600' :
                          'bg-gradient-to-br from-red-500 to-red-600'
                        } text-white`}>
                          <Fuel className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">{pump.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            Serial: {pump.serialNumber || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant={pump.status === 'active' ? 'default' : 'secondary'}
                        className={`${
                          pump.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' :
                          pump.status === 'maintenance' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                          'bg-red-100 text-red-800 border-red-200'
                        } text-xs font-medium`}
                      >
                        {pump.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          Nozzles
                        </span>
                        <span className="font-medium">{pump.nozzleCount || 0}</span>
                      </div>
                    </div>

                    <Button 
                      asChild 
                      variant="outline" 
                      size="sm" 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      <Link to={`/dashboard/stations/${stationId}/pumps/${pump.id}`}>
                        <Settings className="mr-2 h-3 w-3" />
                        Manage Pump
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* No Station Manager Card - Staff management is handled in Users section */}
    </div>
  );
}
