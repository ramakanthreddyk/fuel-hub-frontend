import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stationsApi } from '@/api/stations';
import { pumpsApi } from '@/api/pumps';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2, Fuel, Settings, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorFallback } from '@/components/common/ErrorFallback';

export default function StationDetailsPage() {
  const { stationId } = useParams<{ stationId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch station details using the correct API endpoint
  const { data: station, isLoading, error, refetch } = useQuery({
    queryKey: ['station', stationId],
    queryFn: () => stationsApi.getStation(stationId!),
    enabled: !!stationId,
  });

  // Fetch pumps for this station - Fix: pass stationId string directly
  const { data: pumps = [] } = useQuery({
    queryKey: ['pumps', stationId],
    queryFn: () => pumpsApi.getPumps(stationId!),
    enabled: !!stationId,
  });

  // Delete station mutation
  const deleteMutation = useMutation({
    mutationFn: () => stationsApi.deleteStation(stationId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      toast({
        title: "Success",
        description: "Station deleted successfully",
      });
      navigate('/dashboard/stations');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete station",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/stations')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Stations
          </Button>
        </div>
        <ErrorFallback 
          error={error} 
          onRetry={() => refetch()} 
          title="Failed to load station details"
        />
      </div>
    );
  }

  if (!station) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/stations')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Stations
          </Button>
        </div>
        <div className="text-center py-8">
          <h2 className="text-lg font-semibold">Station not found</h2>
          <p className="text-muted-foreground">The requested station could not be found.</p>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this station? This action cannot be undone.')) {
      deleteMutation.mutate();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/stations')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Stations
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{station.name}</h1>
            <p className="text-muted-foreground">{station.address}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
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
      </div>

      {/* Station Info Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pumps</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pumps.length}</div>
            <p className="text-xs text-muted-foreground">
              Fuel dispensers
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Pumps</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pumps.filter(p => p.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently operational
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">{station.attendantCount || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manager</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">{station.manager || 'Not assigned'}</div>
          </CardContent>
        </Card>
      </div>

      {/* Staff Information */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Staff Information</h3>
            <p className="text-muted-foreground">Manage station personnel</p>
          </div>
          <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Staff
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-muted-foreground">Total Attendants</div>
            <div className="text-2xl font-bold">{(station as any).attendantCount || 0}</div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-muted-foreground">Station Manager</div>
            <div className="text-lg font-medium">{(station as any).manager || 'Not Assigned'}</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button onClick={() => navigate(`/dashboard/pumps?stationId=${stationId}`)}>
          <Fuel className="mr-2 h-4 w-4" />
          Manage Pumps
        </Button>
        <Button variant="outline" onClick={() => navigate(`/dashboard/stations/${stationId}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Station
        </Button>
        <Button 
          variant="outline" 
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {deleteMutation.isPending ? 'Deleting...' : 'Delete Station'}
        </Button>
      </div>

      {/* Pumps List */}
      {pumps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pumps at this Station</CardTitle>
            <CardDescription>
              List of fuel pumps and their current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pumps.map((pump) => (
                <Card key={pump.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{pump.name}</h4>
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
                  <p className="text-sm text-muted-foreground mb-2">
                    Nozzles: {pump.nozzleCount || 0}
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => navigate(`/dashboard/nozzles?pumpId=${pump.id}`)}
                  >
                    <Settings className="mr-2 h-3 w-3" />
                    Manage
                  </Button>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
