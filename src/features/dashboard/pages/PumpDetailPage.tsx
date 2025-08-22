/**
 * @file PumpDetailPage.tsx
 * @description Pump detail page component
 * @see docs/API_INTEGRATION_GUIDE.md - API integration patterns
 * @see docs/journeys/MANAGER.md - Manager journey for pump management
 */
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Fuel, 
  ArrowLeft, 
  Plus,
  Loader2,
  AlertTriangle,
  Activity,
  Gauge,
  Settings,
  Droplets
} from 'lucide-react';
import { usePump } from '@/hooks/api/usePumps';
import { useNozzles } from '@/hooks/api/useNozzles';
import { useStation } from '@/hooks/api/useStations';
import { FuelLoader } from '@/components/ui/FuelLoader';

export default function PumpDetailPage() {
  // Get pump ID from URL params
  const { pumpId } = useParams<{ pumpId: string }>();
  
  // Fetch pump details
  const { 
    data: pump, 
    isLoading: pumpLoading, 
    error: pumpError 
  } = usePump(pumpId || '');
  
  // Fetch station details for breadcrumb
  const { data: station } = useStation(pump?.stationId || '');
  
  // Fetch nozzles for this pump
  const { 
    data: nozzles, 
    isLoading: nozzlesLoading, 
    error: nozzlesError 
  } = useNozzles(pumpId);
  
  console.log('[PUMP-DETAIL] PumpId:', pumpId);
  console.log('[PUMP-DETAIL] Nozzles:', nozzles);
  console.log('[PUMP-DETAIL] Nozzles loading:', nozzlesLoading);
  console.log('[PUMP-DETAIL] Nozzles error:', nozzlesError);

  // Loading state
  if (pumpLoading || nozzlesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FuelLoader size="md" text="Loading pump details..." />
      </div>
    );
  }

  // Error state
  if (pumpError || !pump) {
    return (
      <div className="text-center p-8">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Error loading pump details</h3>
        <p className="text-muted-foreground mb-4">
          {pumpError?.message || "Pump not found"}
        </p>
        <Button asChild>
          <Link to="/dashboard/pumps">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Pumps
          </Link>
        </Button>
      </div>
    );
  }

  const activeNozzles = nozzles?.filter(n => n.status === 'active').length || 0;
  const totalNozzles = nozzles?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header with Breadcrumb */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            asChild
            className="flex items-center gap-2"
          >
            <Link to="/dashboard/pumps">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
          <div className="text-sm text-muted-foreground">
            Dashboard → Stations → {station?.name || 'Station'} → <span className="font-medium text-foreground">{pump.name}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Fuel className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{pump.name}</h1>
              <p className="text-lg text-muted-foreground">Serial: {pump.serialNumber}</p>
            </div>
          </div>
          <Badge 
            className={
              pump.status === 'active' ? 'bg-green-100 text-green-800 border-green-200 px-4 py-2 text-sm' :
              pump.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800 border-yellow-200 px-4 py-2 text-sm' :
              'bg-red-100 text-red-800 border-red-200 px-4 py-2 text-sm'
            }
          >
            {pump.status}
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-900">{activeNozzles}</div>
                <div className="text-sm text-green-700 font-medium">Active Nozzles</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Gauge className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-900">{totalNozzles}</div>
                <div className="text-sm text-blue-700 font-medium">Total Nozzles</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-900">{Math.round((activeNozzles/totalNozzles)*100) || 0}%</div>
                <div className="text-sm text-purple-700 font-medium">Operational</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Nozzles Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Nozzles</h2>
          <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg" asChild>
            <Link to={`/dashboard/stations/${pump.stationId}/pumps/${pump.id}/nozzles/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Add Nozzle
            </Link>
          </Button>
        </div>

        {nozzlesError ? (
          <Card className="border-0 shadow-lg border-red-200">
            <CardContent className="p-12 text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 font-medium">Error loading nozzles: {nozzlesError.message}</p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline" 
                className="mt-4"
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : nozzles?.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <Fuel className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Nozzles Found</h3>
              <p className="text-muted-foreground mb-6">
                Get started by adding your first nozzle to this pump
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                <Link to={`/dashboard/stations/${pump.stationId}/pumps/${pump.id}/nozzles/new`}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Nozzle
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {nozzles?.map((nozzle) => (
              <Card key={nozzle.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Droplets className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold">Nozzle #{nozzle.nozzleNumber}</CardTitle>
                        <CardDescription className="font-medium">Fuel: {nozzle.fuelType}</CardDescription>
                      </div>
                    </div>
                    <Badge 
                      className={
                        nozzle.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' :
                        nozzle.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                        'bg-red-100 text-red-800 border-red-200'
                      }
                    >
                      {nozzle.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-200" 
                    asChild
                  >
                    <Link to={`/dashboard/stations/${pump.stationId}/pumps/${pump.id}/nozzles/${nozzle.id}/readings/new`}>
                      <Gauge className="mr-2 h-4 w-4" />
                      Record Reading
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