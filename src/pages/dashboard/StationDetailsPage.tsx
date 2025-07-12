
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stationsApi } from '@/api/stations';
import { pumpsApi } from '@/api/pumps';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/ui/page-header';
import { EnhancedMetricsCard } from '@/components/ui/enhanced-metrics-card';
import { ArrowLeft, Edit, Trash2, Fuel, Settings, Plus, Users, Building2, Activity, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorFallback } from '@/components/common/ErrorFallback';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

export default function StationDetailsPage() {
  const { stationId } = useParams<{ stationId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Fetch station details using the correct API endpoint
  const { data: station, isLoading, error, refetch } = useQuery({
    queryKey: ['station', stationId],
    queryFn: () => stationsApi.getStation(stationId!),
    enabled: !!stationId,
  });

  // Fetch pumps for this station
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
      <div className="space-y-6 p-4 sm:p-6">
        <PageHeader 
          title="Error Loading Station"
          actions={
            <Button variant="outline" onClick={() => navigate('/dashboard/stations')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Stations
            </Button>
          }
        />
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
      <div className="space-y-6 p-4 sm:p-6">
        <PageHeader 
          title="Station Not Found"
          description="The requested station could not be found"
          actions={
            <Button variant="outline" onClick={() => navigate('/dashboard/stations')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Stations
            </Button>
          }
        />
      </div>
    );
  }

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate();
  };

  const handleCancel = () => {
    setDeleteDialogOpen(false);
  };

  const activePumps = pumps.filter(p => p.status === 'active').length;

  return (
    <div className="space-y-6 p-4 sm:p-6 pb-20">
      {/* Enhanced Header with Back Button */}
      <PageHeader 
        title={station.name}
        description={station.address}
        actions={
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => navigate('/dashboard/stations')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Stations
            </Button>
            <Badge 
              variant={station.status === 'active' ? 'default' : 'secondary'}
              className={`${
                station.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' :
                station.status === 'maintenance' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                'bg-red-100 text-red-800 border-red-200'
              } px-3 py-1`}
            >
              {station.status}
            </Badge>
          </div>
        }
      />

      {/* Enhanced Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <EnhancedMetricsCard
          title="Total Pumps"
          value={pumps.length}
          icon={<Fuel className="h-5 w-5" />}
          description="Fuel dispensers"
          gradient="from-blue-500 to-indigo-600"
        />
        
        <EnhancedMetricsCard
          title="Active Pumps"
          value={activePumps}
          icon={<Activity className="h-5 w-5" />}
          description="Currently operational"
          gradient="from-green-500 to-emerald-600"
        />

        <EnhancedMetricsCard
          title="Attendants"
          value={station.attendantCount || 0}
          icon={<Users className="h-5 w-5" />}
          description="Staff members"
          gradient="from-purple-500 to-pink-600"
        />

        <EnhancedMetricsCard
          title="Manager"
          value={station.manager ? "Assigned" : "Not Assigned"}
          icon={<Building2 className="h-5 w-5" />}
          description={station.manager || "No manager assigned"}
          gradient="from-orange-500 to-red-600"
        />
      </div>

      {/* Enhanced Staff Information */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-purple-50/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Staff Information</CardTitle>
                <CardDescription>Manage station personnel</CardDescription>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Staff
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
              <div className="text-sm text-blue-600 font-medium mb-1">Total Attendants</div>
              <div className="text-2xl font-bold text-blue-900">{station.attendantCount || 0}</div>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
              <div className="text-sm text-green-600 font-medium mb-1">Station Manager</div>
              <div className="text-lg font-medium text-green-900">{station.manager || 'Not Assigned'}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <Button 
          onClick={() => navigate(`/dashboard/pumps?stationId=${stationId}`)}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg"
        >
          <Fuel className="mr-2 h-4 w-4" />
          Manage Pumps
        </Button>
        <Button 
          variant="outline" 
          onClick={() => navigate(`/dashboard/stations/${stationId}/edit`)}
          className="hover:bg-blue-50"
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit Station
        </Button>
        <Button 
          variant="outline" 
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {deleteMutation.isPending ? 'Deleting...' : 'Delete Station'}
        </Button>
      </div>

      {/* Enhanced Pumps List */}
      {pumps.length > 0 && (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/30">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg">
                <Fuel className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Pumps at this Station</CardTitle>
                <CardDescription>
                  List of fuel pumps and their current status
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pumps.map((pump) => (
                <Card key={pump.id} className="group hover:shadow-lg transition-all duration-200 border-0 bg-gradient-to-br from-white to-gray-50/50 overflow-hidden">
                  <div className={`h-1 bg-gradient-to-r ${
                    pump.status === 'active' ? 'from-green-500 to-emerald-600' :
                    pump.status === 'maintenance' ? 'from-orange-500 to-yellow-600' :
                    'from-red-500 to-red-600'
                  }`} />
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg shadow-md ${
                          pump.status === 'active' ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
                          pump.status === 'maintenance' ? 'bg-gradient-to-br from-orange-500 to-yellow-600' :
                          'bg-gradient-to-br from-red-500 to-red-600'
                        } text-white`}>
                          <Fuel className="h-4 w-4" />
                        </div>
                        <h4 className="font-semibold">{pump.name}</h4>
                      </div>
                      <Badge 
                        variant={pump.status === 'active' ? 'default' : 'secondary'}
                        className={`${
                          pump.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' :
                          pump.status === 'maintenance' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                          'bg-red-100 text-red-800 border-red-200'
                        } text-xs`}
                      >
                        {pump.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                      <Zap className="h-3 w-3" />
                      Nozzles: {pump.nozzleCount || 0}
                    </p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => navigate(`/dashboard/nozzles?pumpId=${pump.id}`)}
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      <Settings className="mr-2 h-3 w-3" />
                      Manage
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Station"
        description="Are you sure you want to delete this station? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        onConfirm={confirmDelete}
        onCancel={handleCancel}
      />
    </div>
  );
}
