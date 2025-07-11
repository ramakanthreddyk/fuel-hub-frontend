
/**
 * @file pages/dashboard/StationsPage.tsx
 * @description Stations management page with proper styling
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Building2, Loader2, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useStations, useDeleteStation } from '@/hooks/api/useStations';
import { useToast } from '@/hooks/use-toast';
import { StationCard } from '@/components/stations/StationCard';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

export default function StationsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [stationToDelete, setStationToDelete] = useState<string | null>(null);

  const { data: stations = [], isLoading } = useStations();
  const deleteStationMutation = useDeleteStation();

  const filteredStations = stations.filter(station =>
    station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    station.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="relative">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div className="absolute inset-0 h-8 w-8 animate-ping rounded-full bg-primary/20"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">
              Station Management
            </h1>
            <p className="text-muted-foreground text-lg">Manage your fuel station network</p>
          </div>
          
          <Button 
            onClick={() => navigate('/dashboard/stations/new')} 
            className="px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Station
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-card border rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-card-foreground">Filter Stations</h3>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stations by name or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Stations Grid */}
        {filteredStations.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <EmptyState
              icon={<Building2 className="h-16 w-16 text-primary" />}
              title={searchQuery ? "No stations found" : "No stations yet"}
              description={
                searchQuery 
                  ? "Try adjusting your search criteria"
                  : "Start building your fuel station network"
              }
              action={{
                label: "Add First Station",
                onClick: () => navigate('/dashboard/stations/new')
              }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-8">
            {filteredStations.map((station) => (
              <StationCard
                key={station.id}
                station={{
                  id: station.id,
                  name: station.name,
                  address: station.address,
                  status: (station.status as 'active' | 'maintenance' | 'inactive') || 'active',
                  pumpCount: station.pumpCount || 0,
                  rating: 4.5
                }}
                onView={(id) => navigate(`/dashboard/stations/${id}`)}
                onDelete={handleDeleteStation}
              />
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
