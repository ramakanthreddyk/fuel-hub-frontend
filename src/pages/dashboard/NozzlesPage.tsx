/**
 * @file pages/dashboard/NozzlesPage.tsx
 * @description Redesigned nozzles page with improved error handling
 */
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useSearchParams, Link, useParams } from 'react-router-dom';
import { useFuelStore } from '@/store/fuelStore';
import { useFuelStoreSync } from '@/hooks/useFuelStoreSync';
import { isNavigationFrom } from '@/utils/navigationHelper';
import { Button } from '@/components/ui/button';
import { Plus, Droplets, Search } from 'lucide-react';
import { FuelLoader } from '@/components/ui/FuelLoader';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNozzles, useDeleteNozzle } from '@/hooks/api/useNozzles';
import { usePumps } from '@/hooks/api/usePumps';
import { useStations } from '@/hooks/api/useStations';
import { useToastNotifications } from '@/hooks/useToastNotifications';
import { FuelNozzleCard } from '@/components/nozzles/FuelNozzleCard';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

export default function NozzlesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { pumpId } = useParams<{ pumpId: string }>();
  const { showSuccess, showError } = useToastNotifications();

  console.log('NozzlesPage - pumpId:', pumpId);
  // Removed unused queryClient assignment
  const { refreshNozzles } = useFuelStoreSync();
  
  // Get state from Zustand store
  const { 
    selectedStationId, 
  // Removed unused selectedPumpId assignment
    selectStation,
    selectPump,
    selectNozzle,
    resetSelections
  } = useFuelStore();
  
  // Reset selections if we're on the main nozzles page
  const isInitialMount = useRef(true);
  
  useEffect(() => {
    if (location.pathname === '/dashboard/nozzles' && !pumpId && !searchParams.get('pumpId')) {
      // Skip on initial render to avoid circular dependencies
      if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
      }
      
      // Use setTimeout to avoid state updates during render
      const timer = setTimeout(() => {
        // Make sure resetSelections exists before calling it
        if (typeof resetSelections === 'function') {
          resetSelections();
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, pumpId, searchParams, resetSelections]);
  
  // Local state with fallbacks
  const [selectedStation, setSelectedStation] = useState<string>(selectedStationId || 'all');
  const [selectedPump, setSelectedPump] = useState<string>(pumpId || searchParams.get('pumpId') || 'all');
  
  // Get data first to avoid reference errors
  const { data: stations = [] } = useStations();
  const { data: pumps = [] } = usePumps(selectedStation === 'all' ? undefined : selectedStation);
  
  // Effect to update selectedPump when pumpId param changes
  useEffect(() => {
    if (pumpId) {
      setSelectedPump(pumpId);
      selectPump(pumpId);
      
      // Ensure we have the latest data when navigating directly to a pump's nozzles
      refreshNozzles(pumpId);
    }
  }, [pumpId, selectPump, refreshNozzles]);
  
  // Separate effect to update document title after pumps data is loaded
  useEffect(() => {
    if (pumpId && pumps.length > 0) {
      const pumpName = pumps.find(p => p.id === pumpId)?.name || 'Pump';
      document.title = `Nozzles for ${pumpName} | FuelSync`;
    }
  }, [pumpId, pumps]);
  
  // Separate effect to handle navigation from pumps page
  useEffect(() => {
    // Check if we came from the pumps page using our helper
    const fromPumpsPage = isNavigationFrom(location.state, 'pumps') || 
                         location.pathname.includes('/pumps/');
    
    if (fromPumpsPage && pumpId) {
      // Force refresh nozzles data when coming from pumps page
      console.log('[NOZZLES-PAGE] Coming from pumps page, refreshing nozzles data');
      // Use a timeout to avoid immediate refresh that could cause loops
      const timer = setTimeout(() => {
        refreshNozzles(pumpId);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location, pumpId, refreshNozzles]);
  
  // Effect to update store when station selection changes
  useEffect(() => {
    if (selectedStation !== 'all') {
      selectStation(selectedStation);
    }
  }, [selectedStation, selectStation]);
  
  // Effect to update store when pump selection changes
  useEffect(() => {
    if (selectedPump !== 'all') {
      selectPump(selectedPump);
    }
  }, [selectedPump, selectPump]);
  const [fuelTypeFilter, setFuelTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [nozzleToDelete, setNozzleToDelete] = useState<string | null>(null);

  // Get nozzles based on selected pump - error handling is in the hook
  console.log('NozzlesPage - selectedPump:', selectedPump);
  console.log('NozzlesPage - using pumpId for useNozzles:', selectedPump !== 'all' ? selectedPump : undefined);
  const { data: nozzles = [], isLoading } = useNozzles(selectedPump !== 'all' ? selectedPump : undefined);

  console.log('NozzlesPage - nozzles data:', nozzles);
  console.log('NozzlesPage - isLoading:', isLoading);
  
  // Use a local state for cached nozzles instead of calling store during render
  const [cachedNozzles, setCachedNozzles] = useState<any[]>([]);
  
  // Get cached nozzles in an effect to avoid render-time state updates
  useEffect(() => {
    // Use setTimeout to ensure this happens after render
    const timer = setTimeout(() => {
      if (selectedPump !== 'all') {
        // Access the store state directly without hooks
        const fuelStore = useFuelStore.getState();
        if (fuelStore && typeof fuelStore.getNozzlesForPump === 'function') {
          const cached = fuelStore.getNozzlesForPump(selectedPump);
          setCachedNozzles(cached);
        }
      } else {
        setCachedNozzles([]);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [selectedPump]);
  
  // Use API data if available, otherwise use cached data
  const displayNozzles = nozzles.length > 0 ? nozzles : cachedNozzles;
  
  // Effect to update station selection when pump is selected
  useEffect(() => {
    if (selectedPump !== 'all' && pumps.length > 0) {
      const pump = pumps.find(p => p.id === selectedPump);
      if (pump?.stationId && selectedStation !== pump.stationId) {
        setSelectedStation(pump.stationId);
      }
    }
  }, [selectedPump, pumps, selectedStation]);
  const deleteNozzleMutation = useDeleteNozzle(); // Toast handling is in the hook

  // Filter nozzles based on search, fuel type, station, and pump
  const filteredNozzles = displayNozzles.filter(nozzle => {
    // Get pump and station info for this nozzle
    const nozzlePump = pumps.find(p => p.id === nozzle.pumpId);
    const nozzleStation = stations.find(s => s.id === nozzlePump?.stationId);
    
    // Pump filter - if we're on a pump-specific page, only show nozzles for that pump
    if (pumpId && nozzle.pumpId !== pumpId) {
      return false;
    }
    
    // Station filter
    if (selectedStation !== 'all' && nozzlePump?.stationId !== selectedStation) {
      return false;
    }
    
    // Pump filter from dropdown
    if (selectedPump !== 'all' && nozzle.pumpId !== selectedPump) {
      return false;
    }
    
    // Search filter
    const matchesSearch = !searchQuery || 
  nozzle.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nozzle.fuelType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nozzlePump?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nozzleStation?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Fuel type filter
    const matchesFuelType = fuelTypeFilter === 'all' || nozzle.fuelType === fuelTypeFilter;
    
    return matchesSearch && matchesFuelType;
  });

  const handleDeleteNozzle = (nozzleId: string) => {
    setNozzleToDelete(nozzleId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteNozzle = async () => {
    if (!nozzleToDelete) return;
    
    try {
      await deleteNozzleMutation.mutateAsync(nozzleToDelete);
      showSuccess('Nozzle Deleted', 'Nozzle deleted successfully');
    } catch (error: any) {
      showError('Delete Failed', error.message || 'Failed to delete nozzle');
      console.error('Delete failed:', error);
    } finally {
      setNozzleToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="relative">
          <FuelLoader size="md" text="Loading nozzles..." />
          <div className="absolute inset-0 h-8 w-8 animate-ping rounded-full bg-blue-600/20"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-3 sm:p-4 space-y-4">
        {/* Compact Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link>
              <span>/</span>
              {selectedPump !== 'all' && (
                <>
                  <Link to="/dashboard/pumps" className="hover:text-blue-600">Pumps</Link>
                  <span>/</span>
                </>  
              )}
              <span className="text-gray-900 font-medium">Nozzles</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
              {selectedPump !== 'all' && pumps.length > 0 ? 
                `Nozzles for ${pumps.find(p => p.id === selectedPump)?.name || 'Pump'}` : 
                '🛢️ Fuel Nozzle Control'}
            </h1>
            <p className="text-gray-600 text-sm truncate">Precision fuel dispensing at your fingertips</p>
          </div>
          
          <Button 
            onClick={() => navigate('/dashboard/nozzles/new')} 
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-3 py-2 rounded-xl shadow-lg flex-shrink-0"
            size="sm"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Add Nozzle</span>
          </Button>
        </div>

        {/* Compact Filters */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 p-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-3 py-2 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm"
              />
            </div>
            
            <Select
              value={selectedStation}
              onValueChange={setSelectedStation}
            >
              <SelectTrigger className="bg-white border-gray-300 text-gray-800 rounded-xl">
                <SelectValue placeholder="All Stations">
                  {selectedStation !== 'all' ? 
                    stations.find(s => s.id === selectedStation)?.name || 'All Stations' : 
                    'All Stations'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 z-50">
                <SelectItem value="all">All Stations</SelectItem>
                {stations.map((station) => (
                  <SelectItem key={station.id} value={station.id}>
                    {station.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={selectedPump}
              onValueChange={setSelectedPump}
            >
              <SelectTrigger className="bg-white border-gray-300 text-gray-800 rounded-xl">
                <SelectValue placeholder="All Pumps">
                  {selectedPump !== 'all' ? 
                    pumps.find(p => p.id === selectedPump)?.name || 'All Pumps' : 
                    'All Pumps'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 z-50">
                <SelectItem value="all">All Pumps</SelectItem>
                {pumps.map((pump) => (
                  <SelectItem key={pump.id} value={pump.id}>
                    {pump.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={fuelTypeFilter}
              onValueChange={setFuelTypeFilter}
            >
              <SelectTrigger className="bg-white border-gray-300 text-gray-800 rounded-xl">
                <SelectValue placeholder="All Fuel Types" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 z-50">
                <SelectItem value="all">All Fuel Types</SelectItem>
                <SelectItem value="petrol">⛽ Petrol</SelectItem>
                <SelectItem value="diesel">🛢️ Diesel</SelectItem>
                <SelectItem value="premium">✨ Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Nozzles Grid */}
        {filteredNozzles.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <EmptyState
              icon={<Droplets className="h-16 w-16 text-blue-600" />}
              title={searchQuery || selectedPump !== 'all' || fuelTypeFilter !== 'all' ? "No nozzles found" : "No nozzles yet"}
              description={
                searchQuery || selectedPump !== 'all' || fuelTypeFilter !== 'all'
                  ? "Try adjusting your search or filter criteria"
                  : "Begin with your first fuel dispensing nozzle"
              }
              action={{
                label: "Add First Nozzle",
                onClick: () => navigate('/dashboard/nozzles/new')
              }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 pb-8">
            {filteredNozzles.map((nozzle) => {
              const pump = pumps.find(p => p.id === nozzle.pumpId);
              const station = stations.find(s => s.id === pump?.stationId);
              
              return (
                <FuelNozzleCard
                  key={nozzle.id}
                  nozzle={{
                    id: nozzle.id,
                    name: nozzle.name,
                    fuelType: (nozzle.fuelType as 'petrol' | 'diesel' | 'premium') || 'petrol',
                    status: (nozzle.status as 'active' | 'maintenance' | 'inactive') || 'inactive',
                    lastReading: nozzle.lastReading,
                    pumpName: pump?.name,
                    stationName: station?.name,
                    pumpId: pump?.id,
                    stationId: station?.id
                  }}
                  onEdit={(id) => navigate(`/dashboard/nozzles/${id}/edit`)}
                  onDelete={handleDeleteNozzle}
                  onRecordReading={(nozzleId) => {
                    // Find the nozzle data
                    const nozzleData = filteredNozzles.find(n => n.id === nozzleId);
                    const pump = pumps.find(p => p.id === nozzleData?.pumpId);
                    const stationId = pump?.stationId;

                    // Update the store with all three values
                    if (stationId) selectStation(stationId);
                    if (nozzleData?.pumpId) selectPump(nozzleData.pumpId);
                    selectNozzle(nozzleId);

                    // Navigate to simple readings page with nozzle pre-selected
                    navigate('/dashboard/readings/new', {
                      state: {
                        preselected: {
                          stationId: stationId,
                          pumpId: nozzleData?.pumpId,
                          nozzleId: nozzleId
                        }
                      }
                    });
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title="Delete Nozzle"
          description="Are you sure you want to delete this nozzle? This action cannot be undone and will also delete all associated readings."
          confirmText="Delete"
          variant="destructive"
          onConfirm={confirmDeleteNozzle}
          onCancel={() => setNozzleToDelete(null)}
        />
      </div>
    </div>
  );
}
