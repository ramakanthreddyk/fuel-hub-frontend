
/**
 * @file pages/dashboard/PumpsPage.tsx
 * @description Redesigned pumps page with white theme and improved cards
 */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import { UnifiedPumpCard } from '@/components/pumps/UnifiedPumpCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { StationSelector } from '@/components/filters/StationSelector';
import { usePerformanceMonitor, useDebounce } from '@/hooks/usePerformance';

export default function PumpsPage() {
  // Performance monitoring
  usePerformanceMonitor('PumpsPage');

  const navigate = useNavigate();
  const { stationId } = useParams();
  const { toast } = useToast();
  const { refreshPumps } = useFuelStoreSync();

  const {
    selectedStationId,
    selectStation,
    selectPump
  } = useFuelStore();

  const [selectedStation, setSelectedStation] = useState(selectedStationId || undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pumpToDelete, setPumpToDelete] = useState(null);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

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

  const filteredPumps = useMemo(() => {
    if (!debouncedSearchQuery) return pumps;
    const query = debouncedSearchQuery.toLowerCase();
    return pumps.filter(pump =>
      pump.name.toLowerCase().includes(query) ||
      pump.serialNumber?.toLowerCase().includes(query)
    );
  }, [pumps, debouncedSearchQuery]);

  const handleDeletePump = useCallback((pumpId) => {
    setPumpToDelete(pumpId);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDeletePump = useCallback(async () => {
    if (!pumpToDelete) return;
    try {
      await deleteStationMutation.mutateAsync(pumpToDelete);
      toast({ title: 'Success', description: 'Pump deleted successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete pump', variant: 'destructive' });
    } finally {
      setDeleteDialogOpen(false);
      setPumpToDelete(null);
    }
  }, [pumpToDelete, deleteStationMutation, toast]);

  const handleViewNozzles = useCallback((id) => {
    selectPump(id);
    navigate(`/dashboard/pumps/${id}/nozzles`);
  }, [selectPump, navigate]);

  const handleEditPump = useCallback((id) => {
    // TODO: Implement edit functionality
    console.log('Edit pump:', id);
  }, []);

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
      <div className="space-y-4 p-3 sm:p-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/dashboard" className="hover:text-gray-700">Dashboard</Link>
          <span>→</span>
          <span className="text-gray-900 font-medium">Pumps</span>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <Fuel className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Fuel Pump Management</h1>
                <Button 
                  onClick={() => navigate('/dashboard/pumps/new')} 
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-2 py-1.5 rounded-lg shadow-lg flex-shrink-0"
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-gray-600 text-sm truncate">Control and monitor your fuel dispensing systems</p>
            </div>
          </div>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 p-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search pumps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-3 py-2 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm"
              />
            </div>
            <div className="w-32 sm:w-40">
              <StationSelector
                value={selectedStation}
                onChange={setSelectedStation}
                showAll={true}
                placeholder="All Stations"
                className="text-sm h-10 border-gray-300 rounded-lg"
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
              const stationName = Array.isArray(stations) ? stations.find(s => s.id === pump.stationId)?.name : 'Unknown Station';
              const pumpNozzles = allNozzles.filter(n => n.pumpId === pump.id);
              const nozzleCount = pumpNozzles.length;
              const needsAttention = nozzleCount === 0 || pump.status === 'maintenance';
              return (
                <UnifiedPumpCard
                  key={pump.id}
                  pump={{
                    ...pump,
                    nozzleCount,
                    stationName
                  }}
                  variant="standard"
                  actions={{
                    onViewNozzles: handleViewNozzles,
                    onDelete: handleDeletePump,
                    onEdit: handleEditPump
                  }}
                  needsAttention={needsAttention}
                  showStationName={true}
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
