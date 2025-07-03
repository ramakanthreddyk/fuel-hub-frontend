
/**
 * @file pages/dashboard/NozzlesPage.tsx
 * @description Nozzles page component with improved mobile layout and functionality
 * Updated layout for mobile-friendliness – 2025-07-03
 */
import { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Fuel, 
  ArrowLeft, 
  Plus,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { usePump, usePumps } from '@/hooks/api/usePumps';
import { useNozzles, useDeleteNozzle } from '@/hooks/api/useNozzles';
import { useStations } from '@/hooks/api/useStations';
import { useToast } from '@/hooks/use-toast';
import { NozzleCard } from '@/components/nozzles/NozzleCard';
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

  // Handle record reading click
  const handleRecordReading = (nozzleId: string) => {
    navigate(`/dashboard/readings/new?nozzleId=${nozzleId}&pumpId=${selectedPumpId}&stationId=${selectedStationId}`);
  };

  // Handle edit nozzle
  const handleEditNozzle = (nozzleId: string) => {
    navigate(`/dashboard/nozzles/${nozzleId}/edit?pumpId=${selectedPumpId}&stationId=${selectedStationId}`);
  };

  // Handle delete nozzle
  const handleDeleteNozzle = async (nozzleId: string) => {
    if (window.confirm('Are you sure you want to delete this nozzle?')) {
      try {
        await deleteNozzle.mutateAsync(nozzleId);
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
      }
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

  // Handle create nozzle - Fixed API binding
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
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If no pump is selected, show pump selector
  if (!selectedPumpId) {
    return (
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Nozzles</h1>
            <p className="text-muted-foreground text-sm md:text-base mt-1">
              Please select a pump to view its nozzles
            </p>
          </div>
        </div>
        
        <Card className="overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Select a Pump</CardTitle>
            <CardDescription className="text-sm">Choose a station and pump to view nozzles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label htmlFor="station-select" className="text-sm font-medium">
                  Station
                </label>
                <Select 
                  value={selectedStationId} 
                  onValueChange={handleStationChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select station" />
                  </SelectTrigger>
                  <SelectContent>
                    {stationsLoading ? (
                      <SelectItem value="loading" disabled>Loading stations...</SelectItem>
                    ) : stations.length === 0 ? (
                      <SelectItem value="no-stations" disabled>No stations available</SelectItem>
                    ) : (
                      stations.map((station) => (
                        <SelectItem key={station.id} value={station.id}>
                          {station.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="pump-select" className="text-sm font-medium">
                  Pump
                </label>
                <Select 
                  value={selectedPumpId} 
                  onValueChange={handlePumpChange}
                  disabled={!selectedStationId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select pump" />
                  </SelectTrigger>
                  <SelectContent>
                    {!selectedStationId ? (
                      <SelectItem value="no-station" disabled>Select a station first</SelectItem>
                    ) : pumpsLoading ? (
                      <SelectItem value="loading" disabled>Loading pumps...</SelectItem>
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
              
              <div className="flex flex-col gap-3 pt-2">
                <Button variant="outline" onClick={() => navigate('/dashboard/pumps')} className="w-full sm:w-auto">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  View All Pumps
                </Button>
                
                {selectedStationId && (
                  <Button 
                    onClick={() => navigate(`/dashboard/pumps/new?stationId=${selectedStationId}`)}
                    disabled={!selectedStationId}
                    className="w-full sm:w-auto"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Pump
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state for pump details and nozzles
  if (pumpLoading || nozzlesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Error state for pump
  if (pumpError || !pump) {
    return (
      <div className="text-center p-8">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Error loading pump details</h3>
        <p className="text-muted-foreground mb-4">
          {pumpError?.message || "Pump not found"}
        </p>
        <Button onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
    );
  }

  // No nozzles found
  if (nozzles.length === 0 && !nozzlesLoading) {
    return (
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        {/* Header with improved mobile layout */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Nozzles</h1>
              <p className="text-muted-foreground text-sm truncate">
                Pump: {pump.name} {pump.serialNumber ? `| Serial: ${pump.serialNumber}` : ''}
              </p>
            </div>
          </div>
          <Button onClick={handleCreateNozzle} className="w-full sm:w-auto sm:self-start">
            <Plus className="mr-2 h-4 w-4" />
            Add Nozzle
          </Button>
        </div>

        <Card className="p-6 sm:p-8 text-center overflow-hidden">
          <Fuel className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No nozzles yet</h3>
          <p className="text-muted-foreground mb-4 text-sm sm:text-base">
            Get started by adding your first nozzle to this pump
          </p>
          <Button onClick={handleCreateNozzle}>
            <Plus className="mr-2 h-4 w-4" />
            Add First Nozzle
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Header with improved mobile layout */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Nozzles</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
              <p className="text-muted-foreground text-sm hidden sm:block">
                Pump: 
              </p>
              <Select 
                value={selectedPumpId} 
                onValueChange={handlePumpChange}
              >
                <SelectTrigger className="w-full sm:w-[200px] h-8 text-xs sm:text-sm">
                  <SelectValue placeholder="Select pump" />
                </SelectTrigger>
                <SelectContent>
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
        <Button onClick={handleCreateNozzle} className="w-full sm:w-auto sm:self-start">
          <Plus className="mr-2 h-4 w-4" />
          Add Nozzle
        </Button>
      </div>

      {/* Nozzles List with improved mobile grid */}
      <div className="space-y-4">
        {nozzlesError ? (
          <Card className="p-6 text-center">
            <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-sm">Error loading nozzles: {nozzlesError.message}</p>
          </Card>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {nozzles.map((nozzle) => (
              <div key={nozzle.id} className="overflow-hidden">
                <NozzleCard
                  nozzle={{
                    id: nozzle.id,
                    nozzleNumber: nozzle.nozzleNumber || 0,
                    fuelType: nozzle.fuelType || 'petrol',
                    status: nozzle.status,
                    serialNumber: nozzle.serialNumber,
                  }}
                  onEdit={handleEditNozzle}
                  onDelete={handleDeleteNozzle}
                  onRecordReading={handleRecordReading}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
