
/**
 * @file pages/dashboard/StationsPage.tsx
 * @description Modern stations management page with improved design and mobile responsiveness
 * Updated: 2025-07-27
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Building2, Search, Filter } from 'lucide-react';
import { FuelLoader } from '@/components/ui/FuelLoader';
import { Input } from '@/components/ui/input';
import { useStations, useDeleteStation } from '@/hooks/api/useStations';
import { useToast } from '@/hooks/use-toast';
import { useAutoLoader } from '@/hooks/useAutoLoader';
import { useFuelPrices } from '@/hooks/api/useFuelPrices';
import { usePumps } from '@/hooks/api/usePumps';
import { useUnifiedStationData } from '@/store/stationStore';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { ModernStationCard } from '@/components/stations/ModernStationCard';

export default function StationsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [stationToDelete, setStationToDelete] = useState<string | null>(null);

  const { data: stations = [], isLoading } = useStations();
  const deleteStationMutation = useDeleteStation();
  
  useAutoLoader(isLoading, 'Loading stations...');
  useAutoLoader(deleteStationMutation.isPending, 'Deleting station...');

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <FuelLoader size="lg" text="Loading stations..." />
          <p className="text-gray-600 mt-4">Loading stations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Modern Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border-0">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Building2 className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Station Network</h1>
                <p className="text-gray-600 text-lg">Manage your fuel stations</p>
              </div>
            </div>
            
            <Button 
              onClick={() => navigate('/dashboard/stations/new')} 
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Station
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-0">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search stations by name or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-lg"
              />
            </div>
            <Button
              variant="outline"
              className="px-6 py-3 border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 rounded-xl"
            >
              <Filter className="mr-2 h-5 w-5" />
              Filter
            </Button>
          </div>
        </div>

        {/* Stations Grid */}
        {filteredStations.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 border-0">
            <EmptyState
              icon={<Building2 className="h-16 w-16 text-gray-400" />}
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
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {filteredStations.map((station) => (
              <StationCardWithData
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

// Wrapper component to provide data to ModernStationCard
function StationCardWithData({ station, onView, onDelete }: {
  station: {
    id: string;
    name: string;
    address: string;
    status: 'active' | 'maintenance' | 'inactive';
    pumpCount: number;
    rating?: number;
  };
  onView: (stationId: string) => void;
  onDelete: (stationId: string) => void;
}) {
  const { data: fuelPrices = [] } = useFuelPrices(station.id);
  const { data: pumps = [] } = usePumps(station.id);
  const { getStation } = useUnifiedStationData();
  const stationData = getStation(station.id);
  
  const todaySales = stationData?.todaySales || 0;
  const todayTransactions = stationData?.todayTransactions || 0;
  const activePumps = pumps.filter(p => p.status === 'active').length;

  return (
    <ModernStationCard
      station={station}
      onView={onView}
      onDelete={onDelete}
      fuelPrices={fuelPrices}
      pumps={pumps}
      todaySales={todaySales}
      todayTransactions={todayTransactions}
      activePumps={activePumps}
    />
  );
}
