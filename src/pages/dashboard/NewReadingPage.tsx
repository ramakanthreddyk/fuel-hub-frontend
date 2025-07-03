/**
 * @file NewReadingPage.tsx
 * @description Simplified page component for recording new nozzle readings
 */
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useStations } from '@/hooks/api/useStations';
import { usePumps } from '@/hooks/api/usePumps';
import { useNozzles } from '@/hooks/api/useNozzles';
import { useCreateReading, useLatestReading } from '@/hooks/api/useReadings';
import { useFuelPrices } from '@/hooks/api/useFuelPrices';

export default function NewReadingPage() {
  const navigate = useNavigate();
  const { nozzleId } = useParams();
  
  // Form state
  const [selectedStationId, setSelectedStationId] = useState('');
  const [selectedPumpId, setSelectedPumpId] = useState('');
  const [selectedNozzleId, setSelectedNozzleId] = useState(nozzleId || '');
  const [reading, setReading] = useState(0);
  const [recordedAt, setRecordedAt] = useState(new Date().toISOString().slice(0, 16));
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Data fetching
  const { data: stations = [], isLoading: stationsLoading } = useStations();
  const { data: pumps = [], isLoading: pumpsLoading } = usePumps(selectedStationId);
  const { data: nozzles = [], isLoading: nozzlesLoading } = useNozzles(selectedPumpId);
  const { data: latestReading } = useLatestReading(selectedNozzleId);
  const { data: fuelPrices = [] } = useFuelPrices(selectedStationId);
  const createReading = useCreateReading();
  
  // If nozzleId is provided in URL, fetch its details
  useEffect(() => {
    if (nozzleId) {
      // Find the nozzle in the list
      const nozzle = nozzles.find(n => n.id === nozzleId);
      if (nozzle) {
        // Set pump and station IDs
        setSelectedPumpId(nozzle.pumpId);
        setSelectedStationId(nozzle.stationId);
      }
    }
  }, [nozzleId, nozzles]);
  
  // Set minimum reading based on latest reading
  const minReading = latestReading?.reading || 0;
  
  // Check if we can submit (has fuel prices)
  const hasFuelPrices = fuelPrices.length > 0;
  
  // Handle station change
  const handleStationChange = (value: string) => {
    setSelectedStationId(value);
    setSelectedPumpId('');
    setSelectedNozzleId('');
  };
  
  // Handle pump change
  const handlePumpChange = (value: string) => {
    setSelectedPumpId(value);
    setSelectedNozzleId('');
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedNozzleId || reading < minReading) {
      return;
    }
    
    setIsSubmitting(true);
    
    createReading.mutate({
      nozzleId: selectedNozzleId,
      reading: reading,
      recordedAt: new Date(recordedAt).toISOString(),
      paymentMethod: paymentMethod as 'cash' | 'card' | 'upi' | 'credit'
    }, {
      onSuccess: () => {
        // Navigate to readings page
        navigate('/dashboard/readings');
      },
      onError: (error) => {
        console.error('Error creating reading:', error);
        setIsSubmitting(false);
      }
    });
  };
  
  // Loading state
  if (stationsLoading || (nozzleId && nozzlesLoading)) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  // Get selected nozzle details
  const selectedNozzle = nozzles.find(n => n.id === selectedNozzleId);
  
  // Get station and pump details for display
  const selectedStation = stations.find(s => s.id === selectedStationId);
  const selectedPump = pumps.find(p => p.id === selectedPumpId);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/readings')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Readings
          </Button>
          <h1 className="text-2xl font-bold">New Reading Entry</h1>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Reading Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Station, Pump, Nozzle Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Station */}
              <div className="space-y-2">
                <Label htmlFor="station">Station</Label>
                {nozzleId && selectedStation ? (
                  <div className="p-2 border rounded-md bg-muted">
                    <span className="font-medium">{selectedStation.name}</span>
                  </div>
                ) : (
                  <Select 
                    value={selectedStationId} 
                    onValueChange={handleStationChange}
                    disabled={!!nozzleId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select station" />
                    </SelectTrigger>
                    <SelectContent>
                      {stations.map((station) => (
                        <SelectItem key={station.id} value={station.id}>
                          {station.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              
              {/* Pump */}
              <div className="space-y-2">
                <Label htmlFor="pump">Pump</Label>
                {nozzleId && selectedPump ? (
                  <div className="p-2 border rounded-md bg-muted">
                    <span className="font-medium">{selectedPump.name}</span>
                  </div>
                ) : (
                  <Select 
                    value={selectedPumpId} 
                    onValueChange={handlePumpChange}
                    disabled={!selectedStationId || !!nozzleId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select pump" />
                    </SelectTrigger>
                    <SelectContent>
                      {pumps.length > 0 ? (
                        pumps.map((pump) => (
                          <SelectItem key={pump.id} value={pump.id}>
                            {pump.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem key="no-pumps" value="no-pumps" disabled>
                          No pumps available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                )}
              </div>
              
              {/* Nozzle */}
              <div className="space-y-2">
                <Label htmlFor="nozzle">Nozzle</Label>
                {nozzleId && selectedNozzle ? (
                  <div className="p-2 border rounded-md bg-muted">
                    <span className="font-medium">
                      Nozzle {selectedNozzle.nozzleNumber} ({selectedNozzle.fuelType})
                    </span>
                  </div>
                ) : (
                  <Select 
                    value={selectedNozzleId} 
                    onValueChange={setSelectedNozzleId}
                    disabled={!selectedPumpId || !!nozzleId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select nozzle" />
                    </SelectTrigger>
                    <SelectContent>
                      {nozzles.length > 0 ? (
                        nozzles.map((nozzle) => (
                          <SelectItem key={nozzle.id} value={nozzle.id}>
                            Nozzle {nozzle.nozzleNumber} ({nozzle.fuelType})
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem key="no-nozzles" value="no-nozzles" disabled>
                          No nozzles available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
            
            {/* Nozzle Info Panel */}
            {selectedNozzle && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Fuel Type:</span>
                    <span className="ml-2 font-medium">{selectedNozzle.fuelType}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Previous Reading:</span>
                    <span className="ml-2 font-medium">{latestReading?.reading || 0} L</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Nozzle:</span>
                    <span className="ml-2 font-medium">#{selectedNozzle.nozzleNumber}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <span className="ml-2 font-medium capitalize">{selectedNozzle.status}</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Reading and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reading">Current Reading (L)</Label>
                <Input
                  id="reading"
                  type="number"
                  min={minReading}
                  value={reading}
                  onChange={(e) => setReading(Number(e.target.value))}
                  required
                />
                {reading < minReading && (
                  <p className="text-sm text-red-500">
                    Reading must be at least {minReading}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="recordedAt">Recorded At</Label>
                <Input
                  id="recordedAt"
                  type="datetime-local"
                  value={recordedAt}
                  onChange={(e) => setRecordedAt(e.target.value)}
                  required
                />
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="credit">Credit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              type="submit" 
              disabled={isSubmitting || !selectedNozzleId || reading < minReading || !hasFuelPrices} 
              className="w-full"
            >
              {isSubmitting ? 'Recording...' : 'Record Reading'}
            </Button>
            
            {!hasFuelPrices && selectedStationId && (
              <p className="text-sm text-red-500 text-center">
                This station has no active fuel prices. Please add fuel prices before recording readings.
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}