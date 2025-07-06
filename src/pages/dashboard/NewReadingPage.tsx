/**
 * @file pages/dashboard/NewReadingPage.tsx
 * @description Simplified page component for recording new nozzle readings
 * Updated layout for mobile-friendliness – 2025-07-03
 */
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useStations } from '@/hooks/api/useStations';
import { usePumps } from '@/hooks/api/usePumps';
import { useNozzles } from '@/hooks/api/useNozzles';
import {
  useAttendantStations,
  useAttendantPumps,
  useAttendantNozzles,
} from '@/hooks/api/useAttendant';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateReading, useLatestReading } from '@/hooks/api/useReadings';
import { useQuery } from '@tanstack/react-query';
import { fuelPricesService } from '@/api/services/fuelPricesService';
import { useToast } from '@/hooks/use-toast';

export default function NewReadingPage() {
  const navigate = useNavigate();
  const { nozzleId } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const isAttendant = user?.role === 'attendant';
  
  // Form state
  const [selectedStationId, setSelectedStationId] = useState('');
  const [selectedPumpId, setSelectedPumpId] = useState('');
  const [selectedNozzleId, setSelectedNozzleId] = useState(nozzleId || '');
  const [reading, setReading] = useState(0);
  const [recordedAt, setRecordedAt] = useState(new Date().toISOString().slice(0, 16));
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Data fetching
  const {
    data: stations = [],
    isLoading: stationsLoading,
  } = isAttendant ? useAttendantStations() : useStations();
  const {
    data: pumps = [],
    isLoading: pumpsLoading,
  } = isAttendant ? useAttendantPumps(selectedStationId) : usePumps(selectedStationId);
  const {
    data: nozzles = [],
    isLoading: nozzlesLoading,
  } = isAttendant ? useAttendantNozzles(selectedPumpId) : useNozzles(selectedPumpId);
  const { data: latestReading, isLoading: latestReadingLoading } = useLatestReading(selectedNozzleId);
  const { data: fuelPrices = [] } = useQuery({
    queryKey: ['fuel-prices', selectedStationId],
    queryFn: () => fuelPricesService.getFuelPrices(selectedStationId),
    enabled: !isAttendant && !!selectedStationId,
  });
  const createReading = useCreateReading();
  
  // If nozzleId is provided in URL, find its details to set station and pump
  useEffect(() => {
    if (nozzleId && nozzles.length > 0) {
      const nozzle = nozzles.find(n => n.id === nozzleId);
      if (nozzle) {
        setSelectedPumpId(nozzle.pumpId);
        // Find the station by looking through pumps
        const pump = pumps.find(p => p.id === nozzle.pumpId);
        if (pump) {
          setSelectedStationId(pump.stationId);
        }
      }
    }
  }, [nozzleId, nozzles, pumps]);
  
  // Set minimum reading based on latest reading
  const minReading = latestReading?.reading || 0;
  
  // Check if we can submit (has fuel prices)
  const hasFuelPrices = isAttendant ? true : fuelPrices.length > 0;
  
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
  
  // Handle form submission with better error handling
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedNozzleId || reading < minReading) {
      toast({
        title: 'Validation Error',
        description: 'Please ensure all fields are filled correctly and reading is valid',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await createReading.mutateAsync({
        nozzleId: selectedNozzleId,
        reading: reading,
        recordedAt: new Date(recordedAt).toISOString(),
        paymentMethod: paymentMethod as 'cash' | 'card' | 'upi' | 'credit'
      });
      
      toast({
        title: 'Success',
        description: 'Reading recorded successfully'
      });
      
      // Navigate to readings page
      navigate('/dashboard/readings');
    } catch (error) {
      console.error('Error creating reading:', error);
      toast({
        title: 'Error',
        description: 'Failed to record reading. Please try again.',
        variant: 'destructive'
      });
      setIsSubmitting(false);
    }
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
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/readings')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Back to Readings</span>
            <span className="sm:hidden">Back</span>
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold">New Reading Entry</h1>
        </div>
      </div>
      
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Reading Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Station, Pump, Nozzle Selection - Improved mobile layout */}
            <div className="grid grid-cols-1 gap-4">
              {/* Station */}
              <div className="space-y-2">
                <Label htmlFor="station" className="text-sm font-medium">Station</Label>
                {nozzleId && selectedStation ? (
                  <div className="p-3 border rounded-md bg-muted/50">
                    <span className="font-medium text-sm">{selectedStation.name}</span>
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
                <Label htmlFor="pump" className="text-sm font-medium">Pump</Label>
                {nozzleId && selectedPump ? (
                  <div className="p-3 border rounded-md bg-muted/50">
                    <span className="font-medium text-sm">{selectedPump.name}</span>
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
                <Label htmlFor="nozzle" className="text-sm font-medium">Nozzle</Label>
                {nozzleId && selectedNozzle ? (
                  <div className="p-3 border rounded-md bg-muted/50">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        Nozzle {selectedNozzle.nozzleNumber}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {selectedNozzle.fuelType}
                      </Badge>
                    </div>
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
                            Nozzle {nozzle.nozzleNumber || 'N/A'} ({nozzle.fuelType})
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
            
            {/* Nozzle Info Panel - Improved mobile layout */}
            {selectedNozzle && (
              <div className="p-4 bg-muted/30 rounded-lg border">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fuel Type:</span>
                    <Badge variant="outline" className="text-xs">
                      {selectedNozzle.fuelType}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Previous Reading:</span>
                    <span className="font-mono font-medium">
                      {latestReadingLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        `${Number(latestReading?.reading ?? 0).toFixed(3)} L`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nozzle Number:</span>
                    <span className="font-medium">#{selectedNozzle.nozzleNumber || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant={selectedNozzle.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                      {selectedNozzle.status}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
            
            {/* Reading and Time - Improved mobile layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reading" className="text-sm font-medium">Current Reading (L)</Label>
                <Input
                  id="reading"
                  type="number"
                  step="0.01"
                  min={minReading}
                  value={reading || ''}
                  onChange={(e) => setReading(Number(e.target.value))}
                  placeholder="Enter current reading"
                  required
                  className="font-mono"
                />
                {reading > 0 && reading < minReading && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    Reading must be at least {Number(minReading).toFixed(3)}
                  </div>
                )}
                {reading > minReading && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    Volume: {Number(reading - minReading).toFixed(3)} L
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="recordedAt" className="text-sm font-medium">Recorded At</Label>
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
              <Label htmlFor="paymentMethod" className="text-sm font-medium">Payment Method</Label>
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
            
            {/* Submit button with better validation feedback */}
            <div className="space-y-3">
              {!isAttendant && !hasFuelPrices && selectedStationId && (
                <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <p className="text-sm text-yellow-800">
                    This station has no active fuel prices. Please add fuel prices before recording readings.
                  </p>
                </div>
              )}
              
              <Button 
                type="submit" 
                disabled={isSubmitting || !selectedNozzleId || reading < minReading || (!isAttendant && !hasFuelPrices)}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Recording...
                  </>
                ) : (
                  'Record Reading'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
