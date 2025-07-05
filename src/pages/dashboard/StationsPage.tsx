
/**
 * @file pages/dashboard/StationsPage.tsx
 * @description Redesigned stations page with consistent UI styling
 */
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Building2, Loader2, MapPin, Fuel, Settings, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStations, useDeleteStation } from '@/hooks/api/useStations';
import { useToast } from '@/hooks/use-toast';
import { ColorfulCard, CardHeader, CardContent } from '@/components/ui/colorful-card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { cn } from '@/lib/utils';

export default function StationsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: stations = [], isLoading } = useStations();
  const deleteStationMutation = useDeleteStation();
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [stationToDelete, setStationToDelete] = useState<string | null>(null);

  const handleDeleteStation = (stationId: string) => {
    setStationToDelete(stationId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteStation = async () => {
    if (!stationToDelete) return;
    
    try {
      await deleteStationMutation.mutateAsync(stationToDelete);
      toast({
        title: 'Success',
        description: 'Station deleted successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete station',
        variant: 'destructive'
      });
    } finally {
      setStationToDelete(null);
    }
  };

  const getStatusGradient = (status: string) => {
    switch (status) {
      case 'active':
        return 'from-green-50 via-emerald-50 to-teal-50';
      case 'maintenance':
        return 'from-yellow-50 via-orange-50 to-amber-50';
      case 'inactive':
        return 'from-red-50 via-pink-50 to-rose-50';
      default:
        return 'from-gray-50 via-slate-50 to-zinc-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto p-4 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Fuel Stations Network
            </h1>
            <p className="text-slate-600 mt-1">Manage your station network across all locations</p>
          </div>
          
          <Button 
            onClick={() => navigate('/dashboard/stations/new')} 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Station
          </Button>
        </div>

        {/* Stations Grid */}
        {stations.length === 0 ? (
          <EmptyState
            icon={<Building2 className="h-12 w-12 text-blue-500" />}
            title="No stations yet"
            description="Get started by adding your first fuel station to the network"
            action={{
              label: "Add First Station",
              onClick: () => navigate('/dashboard/stations/new')
            }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
            {stations.map((station) => (
              <ColorfulCard
                key={station.id}
                gradient={getStatusGradient(station.status)}
                className="cursor-pointer transform hover:scale-[1.02] transition-all duration-200"
                onClick={() => navigate(`/dashboard/stations/${station.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/80 backdrop-blur-sm">
                        <Building2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-lg">{station.name}</h3>
                        <p className="text-xs text-slate-600 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {station.address}
                        </p>
                      </div>
                    </div>
                    
                    <Badge className={cn("text-xs font-semibold", getStatusColor(station.status))}>
                      <Activity className="w-3 h-3 mr-1" />
                      {station.status}
                    </Badge>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Fuel className="h-4 w-4 text-blue-500" />
                        <span className="text-xs font-semibold text-slate-600">Pumps</span>
                      </div>
                      <div className="text-lg font-bold text-slate-800">
                        {station.pumpCount || 0}
                      </div>
                    </div>
                    
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Activity className="h-4 w-4 text-green-500" />
                        <span className="text-xs font-semibold text-slate-600">Active</span>
                      </div>
                      <div className="text-lg font-bold text-slate-800">
                        {station.activePumps || 0}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 bg-white/80 backdrop-blur-sm border-white hover:bg-white text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/dashboard/stations/${station.id}/edit`);
                      }}
                    >
                      <Settings className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 bg-white/80 backdrop-blur-sm border-white hover:bg-white text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/dashboard/pumps?stationId=${station.id}`);
                      }}
                    >
                      <Fuel className="w-3 h-3 mr-1" />
                      Pumps
                    </Button>
                  </div>
                </CardContent>
              </ColorfulCard>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title="Delete Station"
          description="Are you sure you want to delete this station? This action cannot be undone and will also delete all associated pumps and nozzles."
          confirmText="Delete"
          variant="destructive"
          onConfirm={confirmDeleteStation}
          onCancel={() => setStationToDelete(null)}
        />
      </div>
    </div>
  );
}
