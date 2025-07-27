
/**
 * @file StationDetailPage.tsx
 * @description Station detail page with modern design and realistic pump visuals
 * Updated: 2025-07-27
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
import { RealisticPumpCard } from '@/components/pumps/RealisticPumpCard';

export default function StationDetailPage() {
  const { stationId } = useParams<{ stationId: string }>();
  const navigate = useNavigate();
  const { data: station, isLoading, error } = useStation(stationId!);
  const { data: pumps = [] } = usePumps(stationId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !station) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
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
      </div>
    );
  }

  const activePumps = pumps.filter(p => p.status === 'active').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="space-y-8 p-4 sm:p-6 lg:p-8 pb-20">
        {/* Enhanced Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border-0">
          <PageHeader 
            title={station.name}
            description={
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-5 w-5" />
                {station.address}
              </div>
            }
            actions={
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/dashboard/stations')}
                  className="flex-1 sm:flex-none rounded-xl"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Stations
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/dashboard/stations/${stationId}/settings`)}
                  className="flex-1 sm:flex-none rounded-xl"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
                <Button 
                  size="sm"
                  onClick={() => navigate(`/dashboard/pumps/new?stationId=${stationId}`)}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Pump
                </Button>
              </div>
            }
          />
        </div>

        {/* Station Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-1 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-0">
            <EnhancedMetricsCard
              title="Active Pumps"
              value={`${activePumps}/${pumps.length}`}
              icon={<Fuel className="h-6 w-6" />}
              description="Operational fuel dispensers"
              gradient="from-orange-500 to-red-600"
            />
          </div>
        </div>

        {/* Enhanced Pumps Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-0 overflow-hidden">
          <CardHeader className="pb-6 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                  <Fuel className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Fuel Pumps</CardTitle>
                  <CardDescription className="text-lg">Manage station fuel dispensers</CardDescription>
                </div>
              </div>
              <Button asChild variant="default" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg rounded-xl">
                <Link to={`/dashboard/stations/${stationId}/pumps`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View All Pumps
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            {pumps.length === 0 ? (
              <div className="text-center py-16">
                <div className="p-6 rounded-full bg-gradient-to-br from-orange-100 to-red-100 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <Fuel className="h-12 w-12 text-orange-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-900">No Pumps Added</h3>
                <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                  Add fuel pumps to start managing this station and tracking fuel dispensing operations.
                </p>
                <Button 
                  onClick={() => navigate(`/dashboard/pumps/new?stationId=${stationId}`)}
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-lg rounded-xl px-8 py-3 text-lg"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Add First Pump
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                {pumps.slice(0, 6).map((pump) => (
                  <RealisticPumpCard
                    key={pump.id}
                    pump={pump}
                    onViewNozzles={(id) => navigate(`/dashboard/stations/${stationId}/pumps/${id}`)}
                    onSettings={(id) => navigate(`/dashboard/stations/${stationId}/pumps/${id}/settings`)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </div>
      </div>
    </div>
  );
}
