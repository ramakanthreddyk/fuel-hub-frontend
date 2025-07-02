import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { stationsApi } from '@/api/stations';
import { creditorsApi } from '@/api/creditors';
import { useCreateContractReading, useContractLatestReading, useContractCanCreateReading } from '@/hooks/useContractReadings';
import { useContractPumps } from '@/hooks/useContractPumps';
import { useContractNozzles } from '@/hooks/useContractNozzles';
import { useStationPriceValidation } from '@/hooks/useFuelPriceValidation';
import { CreateReadingRequest } from '@/api/api-contract';
import { AlertTriangle, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ReadingFormData {
  stationId: string;
  pumpId: string;
  nozzleId: string;
  reading: number;
  recordedAt: string;
  paymentMethod: 'cash' | 'card' | 'upi' | 'credit';
  creditorId?: string;
}

export function ReadingEntryForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const preselected = location.state?.preselected;
  
  const [selectedStation, setSelectedStation] = useState(preselected?.stationId || '');
  const [selectedPump, setSelectedPump] = useState(preselected?.pumpId || '');
  const [selectedNozzle, setSelectedNozzle] = useState(preselected?.nozzleId || '');

  const form = useForm<ReadingFormData>({
    defaultValues: {
      stationId: preselected?.stationId || '',
      pumpId: preselected?.pumpId || '',
      nozzleId: preselected?.nozzleId || '',
      reading: 0,
      recordedAt: new Date().toISOString().slice(0, 16),
      paymentMethod: 'cash',
    },
  });

  const createReading = useCreateContractReading();

  // Fetch data for dropdowns using contract services
  const { data: stations } = useQuery({
    queryKey: ['stations'],
    queryFn: () => stationsApi.getStations(),
  });

  const { data: pumps } = useContractPumps(selectedStation);
  const { data: nozzles = [] } = useContractNozzles(selectedPump);

  const { data: creditors } = useQuery({
    queryKey: ['creditors'],
    queryFn: creditorsApi.getCreditors,
  });

  const { data: latestReading } = useContractLatestReading(selectedNozzle);

  const paymentMethod = form.watch('paymentMethod');

  useEffect(() => {
    if (selectedStation) {
      if (!preselected?.pumpId) {
        setSelectedPump('');
        setSelectedNozzle('');
        form.setValue('pumpId', '');
        form.setValue('nozzleId', '');
      }
    }
  }, [selectedStation, form, preselected]);

  useEffect(() => {
    if (selectedPump) {
      if (!preselected?.nozzleId) {
        setSelectedNozzle('');
        form.setValue('nozzleId', '');
      }
    }
  }, [selectedPump, form, preselected]);

  const onSubmit = async (data: ReadingFormData) => {
    const readingData: CreateReadingRequest = {
      nozzleId: data.nozzleId,
      reading: data.reading,
      recordedAt: new Date(data.recordedAt).toISOString(),
      paymentMethod: data.paymentMethod,
      creditorId: data.paymentMethod === 'credit' ? data.creditorId : undefined,
    };

    try {
      await createReading.mutateAsync(readingData);
      console.log('[READING-FORM] Reading created, navigating back');
      
      // Navigate back to nozzles page if we came from there
      if (preselected?.stationId && preselected?.pumpId) {
        navigate(`/dashboard/stations/${preselected.stationId}/pumps/${preselected.pumpId}/nozzles`);
      } else {
        // Otherwise go to sales page
        navigate('/dashboard/sales');
      }
    } catch (error) {
      console.error('Error creating reading:', error);
    }
  };

  // Add fuel price validation with better error handling
  const { data: canCreateReading, isLoading: loadingCanCreate } = useContractCanCreateReading(selectedNozzle);
  const { data: stationPriceValidation, isLoading: loadingPriceValidation } = useStationPriceValidation(selectedStation);
  
  // Debug validation data
  console.log('Station price validation:', stationPriceValidation);
  console.log('Can create reading:', canCreateReading);

  const selectedNozzleData = Array.isArray(nozzles) ? nozzles.find(n => n.id === selectedNozzle) : null;
  const minReading = latestReading?.reading || 0;

  // Check if we can create reading - default to true if data is still loading
  const canSubmit = loadingCanCreate ? true : canCreateReading?.canCreate !== false;
  const hasMissingPrices = !loadingCanCreate && !canCreateReading?.canCreate && canCreateReading?.missingPrice;

  return (
    <Card className="max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle>Record Nozzle Reading</CardTitle>
        <CardDescription>
          Enter the current cumulative reading to auto-generate a sale
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Fuel Price Warnings */}
        {/* Only show warning if we have selected a station and validation data shows missing prices */}
        {selectedStation && stationPriceValidation && stationPriceValidation.hasActivePrices === false && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Missing Fuel Prices!</strong>{' '}
              {stationPriceValidation.missingFuelTypes && Array.isArray(stationPriceValidation.missingFuelTypes) && stationPriceValidation.missingFuelTypes.length > 0 ? 
                `This station is missing prices for: ${stationPriceValidation.missingFuelTypes.join(', ')}. ` : 
                'This station has no active fuel prices. '}
              <Link to="/dashboard/fuel-prices" className="underline font-medium">
                Update fuel prices here
              </Link> before recording readings.
            </AlertDescription>
          </Alert>
        )}

        {selectedNozzle && hasMissingPrices && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <DollarSign className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Cannot record reading:</strong> {canCreateReading?.reason || 'Missing fuel price for this nozzle type'}. {' '}
              <Link to="/dashboard/fuel-prices" className="underline font-medium">
                Set fuel price first
              </Link>.
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Row 1: Station, Pump, Nozzle Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="station">Station</Label>
                <Select value={selectedStation} onValueChange={setSelectedStation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select station" />
                  </SelectTrigger>
                  <SelectContent>
                    {stations?.map((station) => (
                      <SelectItem key={station.id} value={station.id}>
                        {station.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

                <div className="space-y-2">
                <Label htmlFor="pump">Pump</Label>
                <Select value={selectedPump} onValueChange={setSelectedPump} disabled={!selectedStation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pump" />
                  </SelectTrigger>
                  <SelectContent>
                    {pumps?.map((pump) => (
                      <SelectItem key={pump.id} value={pump.id}>
                        {pump.name} {pump.serialNumber ? `(${pump.serialNumber})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <FormField
                control={form.control}
                name="nozzleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nozzle</FormLabel>
                    <Select value={field.value} onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedNozzle(value);
                    }} disabled={!selectedPump}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select nozzle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background border shadow-lg z-50">
                        {Array.isArray(nozzles) && nozzles.length > 0 ? nozzles.map((nozzle) => (
                          <SelectItem key={nozzle.id} value={nozzle.id}>
                            Nozzle {nozzle.nozzleNumber} ({nozzle.fuelType})
                          </SelectItem>
                        )) : (
                          <SelectItem value="" disabled>
                            No nozzles available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Nozzle Info Panel */}
            {selectedNozzleData && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Fuel Type:</span>
                    <span className="ml-2 font-medium">{selectedNozzleData.fuelType}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Previous Reading:</span>
                    <span className="ml-2 font-medium">{latestReading?.reading || 0} L</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Nozzle:</span>
                    <span className="ml-2 font-medium">#{selectedNozzleData.nozzleNumber}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <span className="ml-2 font-medium capitalize">{selectedNozzleData.status}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Row 2: Reading and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="reading"
                rules={{
                  required: 'Reading is required',
                  min: {
                    value: minReading,
                    message: `Reading must be at least ${minReading}`,
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Reading (L)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={minReading}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="recordedAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recorded At</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 3: Payment Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="credit">Credit</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Credit Party - shown only when needed */}
              {paymentMethod === 'credit' && (
                <FormField
                  control={form.control}
                  name="creditorId"
                  rules={{ required: 'Credit party is required for credit payments' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Credit Party</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select party" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {creditors?.map((creditor) => (
                            <SelectItem key={creditor.id} value={creditor.id}>
                              {creditor.partyName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <Button 
              type="submit" 
              disabled={createReading.isPending || !canSubmit} 
              className="w-full"
            >
              {createReading.isPending ? 'Recording...' : 
               !canSubmit ? 'Set Fuel Price Required' : 'Record Reading'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
