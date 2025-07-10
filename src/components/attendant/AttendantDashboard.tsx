import React, { useState } from 'react';
import { 
  useAttendantStations, 
  useAttendantPumps, 
  useAttendantNozzles,
  useAttendantCreditors,
  useAttendantAlerts,
  useSubmitCashReport,
  useFuelInventory,
  useFuelInventorySummary
} from '@/hooks/api/useAttendant';
import { useCanCreateReading, useCreateAttendantReading, useLatestNozzleReading } from '@/hooks/api/useAttendantReadings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

export function AttendantDashboard() {
  const [selectedStationId, setSelectedStationId] = useState<string>('');
  const [selectedPumpId, setSelectedPumpId] = useState<string>('');
  const [selectedNozzleId, setSelectedNozzleId] = useState<string>('');
  const [readingValue, setReadingValue] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi' | 'credit'>('cash');
  const [creditorId, setCreditorId] = useState<string>('');

  // Fetch data using the attendant hooks
  const { data: stations, isLoading: stationsLoading } = useAttendantStations();
  const { data: pumps, isLoading: pumpsLoading } = useAttendantPumps(selectedStationId);
  const { data: nozzles, isLoading: nozzlesLoading } = useAttendantNozzles(selectedPumpId);
  const { data: creditors, isLoading: creditorsLoading } = useAttendantCreditors();
  const { data: alerts } = useAttendantAlerts(selectedStationId, true);
  const { data: canCreateData } = useCanCreateReading(selectedNozzleId);
  const { data: latestReading } = useLatestNozzleReading(selectedNozzleId);
  const { data: inventory } = useFuelInventory(selectedStationId);
  const { data: inventorySummary } = useFuelInventorySummary();
  
  // Mutations
  const createReading = useCreateAttendantReading();
  const submitCashReport = useSubmitCashReport();

  // Handle station selection
  const handleStationChange = (value: string) => {
    setSelectedStationId(value);
    setSelectedPumpId('');
    setSelectedNozzleId('');
  };

  // Handle pump selection
  const handlePumpChange = (value: string) => {
    setSelectedPumpId(value);
    setSelectedNozzleId('');
  };

  // Handle nozzle selection
  const handleNozzleChange = (value: string) => {
    setSelectedNozzleId(value);
    setReadingValue('');
  };

  // Handle payment method selection
  const handlePaymentMethodChange = (value: 'cash' | 'card' | 'upi' | 'credit') => {
    setPaymentMethod(value);
    if (value !== 'credit') {
      setCreditorId('');
    }
  };

  // Handle reading submission
  const handleSubmitReading = () => {
    if (!selectedNozzleId || !readingValue) return;
    
    createReading.mutate({
      nozzleId: selectedNozzleId,
      reading: parseFloat(readingValue),
      recordedAt: new Date().toISOString(),
      paymentMethod,
      creditorId: paymentMethod === 'credit' ? creditorId : undefined
    });
  };

  // Handle cash report submission
  const handleSubmitCashReport = () => {
    if (!selectedStationId) return;
    
    submitCashReport.mutate({
      stationId: selectedStationId,
      reportDate: new Date().toISOString(),
      cashAmount: 0, // Replace with actual amount
      shift: 'morning'
    });
  };

  if (stationsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Attendant Dashboard</h1>
      
      {/* Alerts */}
      {alerts && alerts.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Alerts</h2>
          {alerts.map(alert => (
            <Alert key={alert.id} className="mb-2" variant={
              alert.severity === 'critical' ? 'destructive' : 
              alert.severity === 'warning' ? 'default' : 'outline'
            }>
              <AlertTitle>{alert.title}</AlertTitle>
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}
      
      {/* Station Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Record Meter Reading</CardTitle>
          <CardDescription>Select a station, pump, and nozzle to record a reading</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Station Selection */}
            <div>
              <label className="block text-sm font-medium mb-1">Station</label>
              <Select value={selectedStationId} onValueChange={handleStationChange}>
                <SelectTrigger>
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
              <div>
                <label className="block text-sm font-medium mb-1">Pump</label>
                <Select value={selectedPumpId} onValueChange={handlePumpChange} disabled={pumpsLoading || !pumps?.length}>
                  <SelectTrigger>
                    <SelectValue placeholder={pumpsLoading ? "Loading..." : pumps?.length ? "Select a pump" : "No pumps available"} />
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
              <div>
                <label className="block text-sm font-medium mb-1">Nozzle</label>
                <Select value={selectedNozzleId} onValueChange={handleNozzleChange} disabled={nozzlesLoading || !nozzles?.length}>
                  <SelectTrigger>
                    <SelectValue placeholder={nozzlesLoading ? "Loading..." : nozzles?.length ? "Select a nozzle" : "No nozzles available"} />
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
            
            {/* Reading Input */}
            {selectedNozzleId && (
              <>
                {latestReading && (
                  <div className="text-sm">
                    Previous reading: <span className="font-semibold">{latestReading.reading}</span>
                  </div>
                )}
                
                {canCreateData?.canCreate === false && (
                  <Alert variant="destructive" className="mb-2">
                    <AlertTitle>Cannot create reading</AlertTitle>
                    <AlertDescription>{canCreateData.reason}</AlertDescription>
                  </Alert>
                )}
                
                <div>
                  <label className="block text-sm font-medium mb-1">Current Reading</label>
                  <Input 
                    type="number" 
                    value={readingValue} 
                    onChange={(e) => setReadingValue(e.target.value)}
                    placeholder="Enter current meter reading"
                    disabled={!canCreateData?.canCreate}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Payment Method</label>
                  <Select value={paymentMethod} onValueChange={(value: any) => handlePaymentMethodChange(value)}>
                    <SelectTrigger>
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
                  <div>
                    <label className="block text-sm font-medium mb-1">Creditor</label>
                    <Select value={creditorId} onValueChange={setCreditorId} disabled={creditorsLoading || !creditors?.length}>
                      <SelectTrigger>
                        <SelectValue placeholder={creditorsLoading ? "Loading..." : creditors?.length ? "Select a creditor" : "No creditors available"} />
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
                  disabled={!canCreateData?.canCreate || !readingValue || createReading.isPending || (paymentMethod === 'credit' && !creditorId)}
                >
                  {createReading.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : "Submit Reading"}
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Cash Report */}
      <Card>
        <CardHeader>
          <CardTitle>Submit Cash Report</CardTitle>
          <CardDescription>Submit your daily cash report</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleSubmitCashReport} disabled={!selectedStationId || submitCashReport.isPending}>
            {submitCashReport.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : "Submit Cash Report"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}