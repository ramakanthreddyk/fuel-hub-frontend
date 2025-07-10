
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertTriangle } from 'lucide-react';
import { 
  useAttendantStations, 
  useAttendantPumps, 
  useAttendantNozzles,
  useAttendantCreditors
} from '@/hooks/api/useAttendant';
import { useCanCreateReading, useCreateAttendantReading, useLatestNozzleReading } from '@/hooks/api/useAttendantReadings';

interface AttendantReadingFormProps {
  onSuccess?: () => void;
}

export function AttendantReadingForm({ onSuccess }: AttendantReadingFormProps) {
  const [selectedStationId, setSelectedStationId] = useState<string>('');
  const [selectedPumpId, setSelectedPumpId] = useState<string>('');
  const [selectedNozzleId, setSelectedNozzleId] = useState<string>('');
  const [readingValue, setReadingValue] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi' | 'credit'>('cash');
  const [creditorId, setCreditorId] = useState<string>('');

  const { data: stations, isLoading: stationsLoading } = useAttendantStations();
  const { data: pumps, isLoading: pumpsLoading } = useAttendantPumps(selectedStationId);
  const { data: nozzles, isLoading: nozzlesLoading } = useAttendantNozzles(selectedPumpId);
  const { data: creditors, isLoading: creditorsLoading } = useAttendantCreditors();
  const { data: canCreateData } = useCanCreateReading(selectedNozzleId);
  const { data: latestReading } = useLatestNozzleReading(selectedNozzleId);
  
  const createReading = useCreateAttendantReading();

  const handleStationChange = (value: string) => {
    setSelectedStationId(value);
    setSelectedPumpId('');
    setSelectedNozzleId('');
    setReadingValue('');
  };

  const handlePumpChange = (value: string) => {
    setSelectedPumpId(value);
    setSelectedNozzleId('');
    setReadingValue('');
  };

  const handleNozzleChange = (value: string) => {
    setSelectedNozzleId(value);
    setReadingValue('');
  };

  const handlePaymentMethodChange = (value: 'cash' | 'card' | 'upi' | 'credit') => {
    setPaymentMethod(value);
    if (value !== 'credit') {
      setCreditorId('');
    }
  };

  const handleSubmitReading = async () => {
    if (!selectedNozzleId || !readingValue) return;
    
    try {
      await createReading.mutateAsync({
        nozzleId: selectedNozzleId,
        reading: parseFloat(readingValue),
        recordedAt: new Date().toISOString(),
        paymentMethod,
        creditorId: paymentMethod === 'credit' ? creditorId : undefined
      });
      
      // Reset form
      setReadingValue('');
      setPaymentMethod('cash');
      setCreditorId('');
      
      onSuccess?.();
    } catch (error) {
      console.error('Failed to submit reading:', error);
    }
  };

  const isSubmitDisabled = !canCreateData?.canCreate || 
                          !readingValue || 
                          createReading.isPending || 
                          (paymentMethod === 'credit' && !creditorId);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Record Meter Reading</CardTitle>
        <CardDescription>
          Select a station, pump, and nozzle to record a reading
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Station Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Station</label>
          <Select value={selectedStationId} onValueChange={handleStationChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a station" />
            </SelectTrigger>
            <SelectContent>
              {stations?.map(station => (
                <SelectItem key={station.id} value={station.id}>
                  {station.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Pump Selection */}
        {selectedStationId && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Pump</label>
            <Select 
              value={selectedPumpId} 
              onValueChange={handlePumpChange} 
              disabled={pumpsLoading || !pumps?.length}
            >
              <SelectTrigger className="w-full">
                <SelectValue 
                  placeholder={
                    pumpsLoading ? "Loading..." : 
                    pumps?.length ? "Select a pump" : 
                    "No pumps available"
                  } 
                />
              </SelectTrigger>
              <SelectContent>
                {pumps?.map(pump => (
                  <SelectItem key={pump.id} value={pump.id}>
                    {pump.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {/* Nozzle Selection */}
        {selectedPumpId && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Nozzle</label>
            <Select 
              value={selectedNozzleId} 
              onValueChange={handleNozzleChange} 
              disabled={nozzlesLoading || !nozzles?.length}
            >
              <SelectTrigger className="w-full">
                <SelectValue 
                  placeholder={
                    nozzlesLoading ? "Loading..." : 
                    nozzles?.length ? "Select a nozzle" : 
                    "No nozzles available"
                  } 
                />
              </SelectTrigger>
              <SelectContent>
                {nozzles?.map(nozzle => (
                  <SelectItem key={nozzle.id} value={nozzle.id}>
                    Nozzle #{nozzle.nozzleNumber} - {nozzle.fuelType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {/* Reading Input Section */}
        {selectedNozzleId && (
          <div className="space-y-4 pt-4 border-t">
            {latestReading && (
              <div className="text-sm bg-muted p-3 rounded-md">
                <span className="font-medium">Previous reading: </span>
                <span className="font-semibold">{latestReading.reading}</span>
              </div>
            )}
            
            {canCreateData?.canCreate === false && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Cannot create reading</AlertTitle>
                <AlertDescription>{canCreateData.reason}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Reading</label>
              <Input 
                type="number" 
                value={readingValue} 
                onChange={(e) => setReadingValue(e.target.value)}
                placeholder="Enter current meter reading"
                disabled={!canCreateData?.canCreate}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Method</label>
              <Select 
                value={paymentMethod} 
                onValueChange={handlePaymentMethodChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="credit">Credit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {paymentMethod === 'credit' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Creditor</label>
                <Select 
                  value={creditorId} 
                  onValueChange={setCreditorId} 
                  disabled={creditorsLoading || !creditors?.length}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue 
                      placeholder={
                        creditorsLoading ? "Loading..." : 
                        creditors?.length ? "Select a creditor" : 
                        "No creditors available"
                      } 
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {creditors?.map(creditor => (
                      <SelectItem key={creditor.id} value={creditor.id}>
                        {creditor.name || creditor.partyName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <Button 
              onClick={handleSubmitReading} 
              disabled={isSubmitDisabled}
              className="w-full"
            >
              {createReading.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : "Submit Reading"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
