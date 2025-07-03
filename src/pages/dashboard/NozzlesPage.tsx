/**
 * @file pages/dashboard/NozzlesPage.tsx
 * @description Nozzles page component
 */
import { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Fuel, 
  ArrowLeft, 
  Plus,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { usePump, usePumps } from '@/hooks/api/usePumps';
import { useNozzles } from '@/hooks/api/useNozzles';
import { useStations } from '@/hooks/api/useStations';

export default function NozzlesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
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

  // Handle record reading click
  const handleRecordReading = (nozzleId: string) => {
    navigate(`/dashboard/readings/new/${nozzleId}`);
  };

  // Handle back button click
  const handleBack = () => {
    if (selectedStationId) {
      navigate(`/dashboard/pumps?stationId=${selectedStationId}`);
    } else {
      navigate('/dashboard/pumps');
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Nozzles</h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Please select a pump to view its nozzles
            </p>
          </div>
        </div>
        
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Select a Pump</CardTitle>
            <CardDescription>Choose a station and pump to view nozzles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => navigate('/dashboard/pumps')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    View All Pumps
                  </Button>
                  
                  {selectedStationId && (
                    <Button 
                      onClick={() => navigate(`/dashboard/nozzles/new?stationId=${selectedStationId}`)}
                      disabled={!selectedStationId}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Pump
                    </Button>
                  )}
                </div>
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
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Nozzles</h1>
              <p className="text-muted-foreground">
                Pump: {pump.name} | Serial: {pump.serialNumber || 'N/A'}
              </p>
            </div>
          </div>
          <Button size="sm" onClick={() => navigate(`/dashboard/nozzles/new?pumpId=${selectedPumpId}`)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Nozzle
          </Button>
        </div>

        <Card className="p-8 text-center">
          <Fuel className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No nozzles yet</h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first nozzle to this pump
          </p>
          <Button onClick={() => navigate(`/dashboard/nozzles/new?pumpId=${selectedPumpId}`)}>
            <Plus className="mr-2 h-4 w-4" />
            Add First Nozzle
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Nozzles</h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-muted-foreground text-sm">
                Pump: 
              </p>
              <Select 
                value={selectedPumpId} 
                onValueChange={handlePumpChange}
              >
                <SelectTrigger className="w-[200px] h-8">
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
        <Button size="sm" onClick={() => navigate(`/dashboard/nozzles/new?pumpId=${selectedPumpId}`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Nozzle
        </Button>
      </div>

      {/* Nozzles List */}
      <div className="space-y-4">
        {nozzlesError ? (
          <Card className="p-6 text-center">
            <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p>Error loading nozzles: {nozzlesError.message}</p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {nozzles.map((nozzle) => (
              <Card key={nozzle.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>Nozzle #{nozzle.nozzleNumber}</CardTitle>
                      <CardDescription>Fuel: {nozzle.fuelType}</CardDescription>
                    </div>
                    <Badge 
                      variant={nozzle.status === 'active' ? 'default' : 'secondary'}
                      className={
                        nozzle.status === 'active' ? 'bg-green-100 text-green-800' :
                        nozzle.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }
                    >
                      {nozzle.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mb-2"
                    onClick={() => handleRecordReading(nozzle.id)}
                  >
                    Record Reading
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}