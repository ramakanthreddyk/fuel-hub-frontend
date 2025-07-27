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
  AlertTriangle
} from 'lucide-react';
import { usePump } from '@/hooks/api/usePumps';
import { useNozzles } from '@/hooks/api/useNozzles';
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
  
  // Fetch nozzles for this pump
  const { 
    data: nozzles, 
    isLoading: nozzlesLoading, 
    error: nozzlesError 
  } = useNozzles(pumpId);

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

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/dashboard/pumps">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{pump.name}</h1>
            <p className="text-muted-foreground">
              Serial: {pump.serialNumber}
            </p>
          </div>
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

      {/* Nozzles List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Nozzles</h2>
          <Button size="sm" asChild>
            <Link to={`/dashboard/stations/${pump.stationId}/pumps/${pump.id}/nozzles/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Add Nozzle
            </Link>
          </Button>
        </div>

        {nozzlesError ? (
          <Card className="p-6 text-center">
            <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p>Error loading nozzles: {nozzlesError.message}</p>
          </Card>
        ) : nozzles?.length === 0 ? (
          <Card className="p-8 text-center">
            <Fuel className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No nozzles yet</h3>
            <p className="text-muted-foreground mb-4">
              Get started by adding your first nozzle to this pump
            </p>
            <Button asChild>
              <Link to={`/dashboard/stations/${pump.stationId}/pumps/${pump.id}/nozzles/new`}>
                Add First Nozzle
              </Link>
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {nozzles?.map((nozzle) => (
              <Card key={nozzle.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>Nozzle #{nozzle.nozzleNumber}</CardTitle>
                      <CardDescription>Fuel: {nozzle.fuelType}</CardDescription>
                    </div>
                    <Badge 
                      variant={nozzle.status === 'active' ? 'default' : 'secondary'}
                      className={
                        nozzle.status === 'active' ? 'bg-green-100 text-green-800' :
                        nozzle.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }
                    >
                      {nozzle.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" asChild className="w-full mb-2">
                    <Link to={`/dashboard/stations/${pump.stationId}/pumps/${pump.id}/nozzles/${nozzle.id}/readings/new`}>
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