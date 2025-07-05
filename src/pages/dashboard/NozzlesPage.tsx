
/**
 * @file pages/dashboard/NozzlesPage.tsx
 * @description Redesigned nozzles page with realistic dispenser cards
 */
import { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, ArrowLeft, Loader2, AlertTriangle, Droplets } from 'lucide-react';
import { usePump, usePumps } from '@/hooks/api/usePumps';
import { useNozzles, useDeleteNozzle } from '@/hooks/api/useNozzles';
import { useStations } from '@/hooks/api/useStations';
import { useToast } from '@/hooks/use-toast';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { FuelNozzleCard } from '@/components/nozzles/FuelNozzleCard';
import { EmptyState } from '@/components/common/EmptyState';
import { navigateBack } from '@/utils/navigation';

export default function NozzlesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get station and pump IDs from URL params
  const { stationId, pumpId } = useParams<{ stationId: string; pumpId: string }>();
  
  // Check for IDs in query params if not in route params
  const queryParams = new URLSearchParams(location.search);
  const pumpIdFromQuery = queryParams.get('pumpId');
  const stationIdFromQuery = queryParams.get('stationId');
  
  const [selectedPumpId, setSelectedPumpId] = useState(pumpId || pumpIdFromQuery || '');
  const [selectedStationId, setSelectedStationId] = useState(stationId || stationIdFromQuery || '');
  
  // Fetch stations
  const { data: stations = [], isLoading: stationsLoading } = useStations();
  
  // Fetch pumps for selected station
  const { data: pumps = [], isLoading: pumpsLoading } = usePumps(selectedStationId);
  
  // Fetch pump details
  const { 
    data: pump, 
    isLoading: pumpLoading, 
    error: pumpError 
  } = usePump(selectedPumpId);
  
  // Fetch nozzles for this pump
  const { 
    data: nozzles = [], 
    isLoading: nozzlesLoading, 
    error: nozzlesError 
  } = useNozzles(selectedPumpId);

  // Delete nozzle mutation
  const deleteNozzle = useDeleteNozzle();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [nozzleToDelete, setNozzleToDelete] = useState<string | null>(null);

  // Handle record reading click
  const handleRecordReading = (nozzleId: string) => {
    navigate(`/dashboard/readings/new?nozzleId=${nozzleId}&pumpId=${selectedPumpId}&stationId=${selectedStationId}`);
  };

  // Handle edit nozzle
  const handleEditNozzle = (nozzleId: string) => {
    navigate(`/dashboard/nozzles/${nozzleId}/edit?pumpId=${selectedPumpId}&stationId=${selectedStationId}`);
  };

  // Show delete confirmation dialog
  const handleDeleteNozzle = (nozzleId: string) => {
    setNozzleToDelete(nozzleId);
    setDeleteDialogOpen(true);
  };

  // Confirm deletion
  const confirmDeleteNozzle = async () => {
    if (!nozzleToDelete) return;
    try {
      await deleteNozzle.mutateAsync(nozzleToDelete);
      toast({
        title: 'Success',
        description: 'Nozzle deleted successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete nozzle',
        variant: 'destructive'
      });
    } finally {
      setNozzleToDelete(null);
    }
  };

  // Handle back button click
  const handleBack = () => {
    if (selectedStationId) {
      navigate(`/dashboard/pumps?stationId=${selectedStationId}`);
    } else {
      navigateBack(navigate, '/dashboard/pumps');
    }
  };

  // Handle station change
  const handleStationChange = (value: string) => {
    setSelectedStationId(value);
    setSelectedPumpId(''); // Reset pump when station changes
  };

  // Handle pump change
  const handlePumpChange = (value: string) => {
    setSelectedPumpId(value);
    navigate(`/dashboard/nozzles?pumpId=${value}&stationId=${selectedStationId}`);
  };

  // Handle create nozzle
  const handleCreateNozzle = () => {
    if (selectedPumpId && selectedStationId) {
      navigate(`/dashboard/nozzles/new?pumpId=${selectedPumpId}&stationId=${selectedStationId}`);
    } else {
      toast({
        title: 'Error',
        description: 'Please select a pump first',
        variant: 'destructive'
      });
    }
  };

  // Loading state
  if ((stationsLoading || pumpsLoading) && !selectedPumpId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  // If no pump is selected, show pump selector
  if (!selectedPumpId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-4">
        <div className="container mx-auto space-y-8">
          <div className="flex items-center gap-4 pt-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBack}
              className="p-2 hover:bg-white/60 rounded-full"
            >
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Fuel Nozzles
              </h1>
              <p className="text-slate-600 mt-1">Select a pump to view its nozzles</p>
            </div>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 max-w-md mx-auto">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700">Station</label>
                <Select value={selectedStationId} onValueChange={handleStationChange}>
                  <SelectTrigger className="bg-white border-2 shadow-sm">
                    <SelectValue placeholder="Select station" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-2 shadow-xl">
                    {stations.map((station) => (
                      <SelectItem key={station.id} value={station.id}>
                        {station.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700">Pump</label>
                <Select 
                  value={selectedPumpId} 
                  onValueChange={handlePumpChange}
                  disabled={!selectedStationId}
                >
                  <SelectTrigger className="bg-white border-2 shadow-sm">
                    <SelectValue placeholder="Select pump" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-2 shadow-xl">
                    {!selectedStationId ? (
                      <SelectItem value="no-station" disabled>Select a station first</SelectItem>
                    ) : pumps.length === 0 ? (
                      <SelectItem value="no-pumps" disabled>No pumps available</SelectItem>
                    ) : (
                      pumps.map((pump) => (
                        <SelectItem key={pump.id} value={pump.id}>
                          {pump.name} {pump.serialNumber ? `(${pump.serialNumber})` : ''}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state for pump details and nozzles
  if (pumpLoading || nozzlesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  // Error state for pump
  if (pumpError || !pump) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-4">
        <div className="container mx-auto">
          <div className="text-center p-8">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error loading pump details</h3>
            <p className="text-slate-600 mb-4">
              {pumpError?.message || "Pump not found"}
            </p>
            <Button onClick={handleBack} className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Pumps
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="container mx-auto p-4 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBack}
              className="p-2 hover:bg-white/60 rounded-full"
            >
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Fuel Dispensers
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-sm font-medium text-slate-600">Pump:</span>
                <Select value={selectedPumpId} onValueChange={handlePumpChange}>
                  <SelectTrigger className="w-[250px] bg-white/80 border-2 border-white shadow-lg">
                    <SelectValue placeholder="Select pump" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-2 shadow-xl">
                    {pumps.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} {p.serialNumber ? `(${p.serialNumber})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleCreateNozzle} 
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Nozzle
          </Button>
        </div>

        {/* Pump Info */}
        {pump && (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                {pump.name} Fuel Dispensers
              </h2>
              <p className="text-slate-600">
                {nozzles.length} dispensing points available
              </p>
            </div>
          </div>
        )}

        {/* Nozzles Grid */}
        {nozzles.length === 0 ? (
          <EmptyState
            icon={<Droplets className="h-12 w-12 text-green-500" />}
            title="No nozzles yet"
            description={`Get started by adding your first nozzle to ${pump.name}`}
            action={{
              label: "Add First Nozzle",
              onClick: handleCreateNozzle
            }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 pb-8">
            {nozzles.map((nozzle) => (
              <FuelNozzleCard
                key={nozzle.id}
                nozzle={{
                  id: nozzle.id,
                  nozzleNumber: nozzle.nozzleNumber || 0,
                  fuelType: (nozzle.fuelType || 'petrol') as 'petrol' | 'diesel' | 'premium',
                  status: nozzle.status as 'active' | 'maintenance' | 'inactive',
                }}
                onEdit={handleEditNozzle}
                onDelete={handleDeleteNozzle}
                onRecordReading={handleRecordReading}
              />
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title="Delete Nozzle"
          description="Are you sure you want to delete this nozzle? This action cannot be undone."
          confirmText="Delete"
          variant="destructive"
          onConfirm={confirmDeleteNozzle}
          onCancel={() => setNozzleToDelete(null)}
        />
      </div>
    </div>
  );
}
