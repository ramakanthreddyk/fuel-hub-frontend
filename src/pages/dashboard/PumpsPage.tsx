/**
 * @file pages/dashboard/PumpsPage.tsx
 * @description Redesigned pumps page with white theme and improved cards
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useFuelStore } from '@/store/fuelStore';
import { useFuelStoreSync } from '@/hooks/useFuelStoreSync';
import { createNavigationState } from '@/utils/navigationHelper';
import { Button } from '@/components/ui/button';
import { Plus, Fuel, Filter, Search } from 'lucide-react';
import { FuelLoader } from '@/components/ui/FuelLoader';
import { Input } from '@/components/ui/input';
import { usePumps, useDeletePump } from '@/hooks/api/usePumps';
import { useStations } from '@/hooks/api/useStations';
import { useNozzles } from '@/hooks/api/useNozzles';
import { useToast } from '@/hooks/use-toast';
import { FuelPumpCard } from '@/components/pumps/FuelPumpCard';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { StationSelector } from '@/components/filters/StationSelector';

export default function PumpsPage() {
  const navigate = useNavigate();
  const { stationId } = useParams<{ stationId: string }>();
  const { toast } = useToast();
  const { refreshPumps } = useFuelStoreSync();
  
  const { 
    selectedStationId, 
    selectStation,
    selectPump
  } = useFuelStore();
  
  const [selectedStation, setSelectedStation] = useState<string | undefined>(selectedStationId || undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pumpToDelete, setPumpToDelete] = useState<string | null>(null);
  
  useEffect(() => {
    if (stationId) {
      setSelectedStation(stationId);
      selectStation(stationId);
      refreshPumps(stationId);
    }
  }, [stationId, selectStation, refreshPumps]);
  
  useEffect(() => {
    if (!stationId && selectedStation) {
      selectStation(selectedStation);
    }
  }, [selectedStation, selectStation, stationId]);

  const { data: pumps = [], isLoading } = usePumps(selectedStation);
  const { data: stations = [] } = useStations();
  const { data: allNozzles = [] } = useNozzles();
  const deleteStationMutation = useDeletePump();

  const filteredPumps = pumps.filter(pump =>
    pump.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pump.serialNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeletePump = (pumpId: string) => {
    setPumpToDelete(pumpId);
    setDeleteDialogOpen(true);
  };

  const confirmDeletePump = async () => {
    if (!pumpToDelete) return;
    
    try {
      await deleteStationMutation.mutateAsync(pumpToDelete);
      toast({
        title: 'Success',
        description: 'Pump deleted successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete pump',
        variant: 'destructive'
      });
    } finally {
      setPumpToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="relative">
          <FuelLoader size="md" text="Loading pumps..." />
          <div className="absolute inset-0 h-8 w-8 animate-ping rounded-full bg-blue-600/20"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="space-y-8 p-6">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/dashboard" className="hover:text-gray-700">Dashboard</Link>
          <span>→</span>
          <span className="text-gray-900 font-medium">Pumps</span>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              🔧 Fuel Pump Management
            </h1>
            <p className="text-gray-600 text-lg">Control and monitor your fuel dispensing systems</p>
          </div>
          
          <Button 
            onClick={() => navigate('/dashboard/pumps/new')} 
            className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold px-8 py-4 rounded-2xl shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <Plus className="mr-2 h-5 w-5" />
            Add Pump
          </Button>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200 p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="h-5 w-5 text-cyan-600" />
            <h3 className="text-lg font-semibold text-gray-800">Filter Pumps</h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search pumps by name or serial..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-gray-300 text-gray-800 placeholder:text-gray-400 rounded-xl"
                />
              </div>
            </div>
            <div className="sm:w-64">
              <StationSelector
                value={selectedStation}
                onChange={setSelectedStation}
                showAll={true}
                placeholder="All Stations"
                className="bg-white border-gray-300 text-gray-800 rounded-xl"
              />
            </div>
          </div>
        </div>

        {filteredPumps.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <EmptyState
              icon={<Fuel className="h-16 w-16 text-cyan-600" />}
              title={searchQuery || selectedStation ? "No pumps found" : "No pumps yet"}
              description={
                searchQuery || selectedStation 
                  ? "Try adjusting your search or filter criteria"
                  : "Start building your fuel dispensing network"
              }
              action={{
                label: "Add First Pump",
                onClick: () => navigate('/dashboard/pumps/new')
              }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 pb-8">
            {filteredPumps.map((pump) => {
              const stationName = stations.find(s => s.id === pump.stationId)?.name;
              const pumpNozzles = allNozzles.filter(n => n.pumpId === pump.id);
              const nozzleCount = pumpNozzles.length;
              const needsAttention = nozzleCount === 0 || pump.status === 'maintenance';
              
              return (
                <FuelPumpCard
                  key={pump.id}
                  pump={{
                    ...pump,
                    nozzleCount,
                    stationName
                  }}
                  onViewNozzles={(id) => {
                    selectPump(id);
                    navigate(`/dashboard/pumps/${id}/nozzles`);
                  }}
                  onDelete={handleDeletePump}
                  needsAttention={needsAttention}
                />
              );
            })}
          </div>
        )}

        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title="Delete Pump"
          description="Are you sure you want to delete this pump? This action cannot be undone and will also delete all associated nozzles."
          confirmText="Delete"
          variant="destructive"
          onConfirm={confirmDeletePump}
          onCancel={() => setPumpToDelete(null)}
        />
      </div>
    </div>
  );
}