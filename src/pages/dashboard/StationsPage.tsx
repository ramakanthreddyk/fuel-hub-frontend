
/**
 * @file pages/dashboard/StationsPage.tsx
 * @description Modern stations management page with vibrant design and optimized space
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Building2, Loader2, Filter, Search, MapPin, Fuel, Activity, TrendingUp } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { Input } from '@/components/ui/input';
import { useStations, useDeleteStation } from '@/hooks/api/useStations';
import { useToast } from '@/hooks/use-toast';
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50 flex items-center justify-center">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full bg-blue-600/20"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      <div className="space-y-8 p-6">
        {/* Modern Header with Stats */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
          <div className="absolute -top-4 -right-4 h-32 w-32 rounded-full bg-white/10 blur-xl"></div>
          <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-purple-400/20 blur-2xl"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/20 rounded-3xl backdrop-blur-sm border border-white/30">
                  <Building2 className="h-10 w-10" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">Station Network</h1>
                  <p className="text-blue-100 text-lg">Manage your fuel station empire</p>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="flex gap-6 mt-6">
                <div className="flex items-center gap-3 bg-white/15 rounded-xl px-6 py-3 backdrop-blur-sm border border-white/20">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Activity className="h-5 w-5 text-green-300" />
                  </div>
                  <div>
                    <div className="text-lg font-bold">{stations.filter(s => s.status === 'active').length}</div>
                    <div className="text-sm text-white/80">Active Stations</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/15 rounded-xl px-6 py-3 backdrop-blur-sm border border-white/20">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-blue-300" />
                  </div>
                  <div>
                    <div className="text-lg font-bold">{stations.length}</div>
                    <div className="text-sm text-white/80">Total Network</div>
                  </div>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={() => navigate('/dashboard/stations/new')} 
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/30 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add New Station
            </Button>
          </div>
        </div>

        {/* Enhanced Search */}
        <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Search className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Search & Filter
            </h3>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search stations by name, location, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl bg-white/80 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Stations Grid */}
        {filteredStations.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px] bg-white/50 backdrop-blur-sm rounded-3xl border border-white/50">
            <EmptyState
              icon={<Building2 className="h-20 w-20 text-blue-500" />}
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
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
