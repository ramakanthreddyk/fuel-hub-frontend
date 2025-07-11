
/**
 * @file ReadingEntryForm.tsx
 * @description Form component for recording nozzle readings
 */
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Import new API hooks
import { useStations } from '@/hooks/api/useStations';
import { usePumps } from '@/hooks/api/usePumps';
import { useNozzles } from '@/hooks/api/useNozzles';
import { useCreateReading, useLatestReading, useCanCreateReading } from '@/hooks/api/useReadings';
import { useFuelPriceValidation, useFuelPrices } from '@/hooks/api/useFuelPrices';
import { CreateReadingRequest } from '@/api/services/readingsService';

// Import creditors API (to be migrated later)
import { creditorsApi } from '@/api/creditors';
import { useQuery } from '@tanstack/react-query';

interface ReadingFormData {
  stationId: string;
  pumpId: string;
  nozzleId: string;
  reading: number;
  recordedAt: string;
  paymentMethod: 'cash' | 'card' | 'upi' | 'credit';
  creditorId?: string;
}

interface ReadingEntryFormProps {
  preselected?: {
    stationId?: string;
    pumpId?: string;
    nozzleId?: string;
  };
}

export function ReadingEntryForm({ preselected }: ReadingEntryFormProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get preselected values from navigation state if available
  const navigationPreselected = location.state?.preselected;
  const finalPreselected = navigationPreselected || preselected;
  
  const [selectedStation, setSelectedStation] = useState(finalPreselected?.stationId || '');
  const [selectedPump, setSelectedPump] = useState(finalPreselected?.pumpId || '');
  const [selectedNozzle, setSelectedNozzle] = useState(finalPreselected?.nozzleId || '');

  const form = useForm<ReadingFormData>({
    defaultValues: {
      stationId: finalPreselected?.stationId || '',
      pumpId: finalPreselected?.pumpId || '',
      nozzleId: finalPreselected?.nozzleId || '',
      reading: 0,
      recordedAt: new Date().toISOString().slice(0, 16),
      paymentMethod: 'cash',
    },
  });

  // Use the new API hooks
  const { data: stations = [] } = useStations();
  const { data: pumps = [] } = usePumps(selectedStation);
  const { data: nozzles = [] } = useNozzles(selectedPump);
  const { data: latestReading } = useLatestReading(selectedNozzle);
  const { data: canCreateReading, isLoading: loadingCanCreate } = useCanCreateReading(selectedNozzle);
  const { data: stationPriceValidation, isLoading: loadingPriceValidation } = useFuelPriceValidation(selectedStation);
  const { data: fuelPrices = [] } = useFuelPrices(selectedStation);
  const createReading = useCreateReading();

  // Fetch creditors (to be migrated later)
  const { data: creditors = [] } = useQuery({
    queryKey: ['creditors'],
    queryFn: creditorsApi.getCreditors,
  });

  const paymentMethod = form.watch('paymentMethod');

  // Update form when preselected values change
  useEffect(() => {
    if (finalPreselected?.stationId) {
      setSelectedStation(finalPreselected.stationId);
      form.setValue('stationId', finalPreselected.stationId);
    }
    if (finalPreselected?.pumpId) {
      setSelectedPump(finalPreselected.pumpId);
      form.setValue('pumpId', finalPreselected.pumpId);
    }
    if (finalPreselected?.nozzleId) {
      setSelectedNozzle(finalPreselected.nozzleId);
      form.setValue('nozzleId', finalPreselected.nozzleId);
    }
  }, [finalPreselected, form]);

  useEffect(() => {
    if (selectedStation) {
      if (!finalPreselected?.pumpId) {
        setSelectedPump('');
        setSelectedNozzle('');
        form.setValue('pumpId', '');
        form.setValue('nozzleId', '');
      }
    }
  }, [selectedStation, form, finalPreselected]);

  useEffect(() => {
    if (selectedPump) {
      if (!finalPreselected?.nozzleId) {
        setSelectedNozzle('');
        form.setValue('nozzleId', '');
      }
    }
  }, [selectedPump, form, finalPreselected]);

  const onSubmit = async (data: ReadingFormData) => {
    console.log('[READING-FORM] Submitting reading:', data);
    
    const readingData: CreateReadingRequest = {
      nozzleId: data.nozzleId,
      reading: data.reading,
      recordedAt: new Date(data.recordedAt).toISOString(),
      paymentMethod: data.paymentMethod,
      creditorId: data.paymentMethod === 'credit' ? data.creditorId : undefined,
    };

    createReading.mutate(readingData, {
      onSuccess: (newReading) => {
        console.log('[READING-FORM] Reading created successfully');
        toast({
          title: "Reading Recorded",
          description: `Successfully recorded reading ${data.reading}L for nozzle #${selectedNozzleData?.nozzleNumber}`,
          variant: "success",
        });
        
        // Navigate back to nozzles page if we came from there
        if (finalPreselected?.stationId && finalPreselected?.pumpId) {
          navigate('/dashboard/nozzles');
        } else {
          // Otherwise go to readings page
          navigate('/dashboard/readings');
        }
      },
      onError: (error: any) => {
        console.error('[READING-FORM] Error creating reading:', error);
        toast({
          title: "Failed to Record Reading",
          description: error.message || "Please check your input and try again.",
          variant: "destructive",
        });
      }
    });
  };

  const selectedNozzleData = nozzles?.find(n => n.id === selectedNozzle);
  const minReading = latestReading?.reading || 0;

  // Check if we can create reading - default to true if data is still loading
  const canSubmit = loadingCanCreate ? true : canCreateReading?.canCreate !== false;
  const hasMissingPrices = !loadingCanCreate && !canCreateReading?.canCreate && canCreateReading?.missingPrice;
  
  // Check if station has fuel prices
  const hasFuelPrices = fuelPrices && fuelPrices.length > 0;
  const showMissingPricesWarning = selectedStation && 
    stationPriceValidation && 
    !stationPriceValidation.hasValidPrices && 
    !hasFuelPrices;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl border shadow-sm p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Record Reading</h1>
            <p className="text-gray-600">Enter the current meter reading for the selected nozzle</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Fuel Price Warnings */}
              {showMissingPricesWarning && (
                <Alert className="mb-6 border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>Missing Fuel Prices!</strong>{' '}
                    {stationPriceValidation.missingPrices && stationPriceValidation.missingPrices.length > 0 ? 
                      `This station is missing prices for: ${stationPriceValidation.missingPrices.map(p => p.fuelType).join(', ')}. ` : 
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

              {/* Row 1: Station, Pump, Nozzle Selection */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="stationId"
                  rules={{ required: 'Station is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Station</FormLabel>
                      <Select 
                        value={field.value} 
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedStation(value);
                        }}
                        disabled={!!finalPreselected?.stationId}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select station" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white z-50">
                          {stations.map((station) => (
                            <SelectItem key={station.id} value={station.id}>
                              {station.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pumpId"
                  rules={{ required: 'Pump is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pump</FormLabel>
                      <Select 
                        value={field.value} 
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedPump(value);
                        }}
                        disabled={!selectedStation || !!finalPreselected?.pumpId}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select pump" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white z-50">
                          {pumps.length > 0 ? (
                            pumps.map((pump) => (
                              <SelectItem key={pump.id} value={pump.id}>
                                {pump.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem key="no-pumps" value="no-pumps-placeholder" disabled>
                              No pumps available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nozzleId"
                  rules={{ required: 'Nozzle is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nozzle</FormLabel>
                      <Select 
                        value={field.value} 
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedNozzle(value);
                        }}
                        disabled={!selectedPump || !!finalPreselected?.nozzleId}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select nozzle" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white z-50">
                          {nozzles.length > 0 ? (
                            nozzles.map((nozzle) => (
                              <SelectItem key={nozzle.id} value={nozzle.id}>
                                Nozzle {nozzle.nozzleNumber} ({nozzle.fuelType})
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem key="no-nozzles" value="no-nozzles-placeholder" disabled>
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

              {/* Enhanced Nozzle Info Panel */}
              {selectedNozzleData && (
                <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Nozzle Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fuel Type:</span>
                        <span className="font-semibold text-gray-900 capitalize">{selectedNozzleData.fuelType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nozzle Number:</span>
                        <span className="font-semibold text-gray-900">#{selectedNozzleData.nozzleNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-semibold text-gray-900 capitalize">{selectedNozzleData.status}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="p-4 bg-white rounded-lg border border-gray-200">
                        <div className="text-center">
                          <div className="text-sm text-gray-600 mb-1">Previous Reading</div>
                          <div className="text-2xl font-bold text-blue-600">{latestReading?.reading || 0} L</div>
                          {latestReading?.recordedAt && (
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(latestReading.recordedAt).toLocaleDateString()} at{' '}
                              {new Date(latestReading.recordedAt).toLocaleTimeString()}
                            </div>
                          )}
                        </div>
                      </div>
                      {latestReading && (
                        <div className="text-xs text-gray-600 bg-orange-50 p-2 rounded border border-orange-200">
                          ⚠️ New reading must be greater than {latestReading.reading} L
                        </div>
                      )}
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
                          step="0.01"
                          min={minReading}
                          className="bg-white"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value) {
                              const normalized = parseFloat(value).toFixed(2);
                              field.onChange(parseFloat(normalized));
                            } else {
                              field.onChange('');
                            }
                          }}
                          onBlur={(e) => {
                            const value = e.target.value;
                            if (value && !isNaN(parseFloat(value))) {
                              const normalized = parseFloat(value).toFixed(2);
                              e.target.value = normalized;
                              field.onChange(parseFloat(normalized));
                            }
                          }}
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
                        <Input type="datetime-local" className="bg-white" {...field} />
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
                          <SelectTrigger className="bg-white">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white z-50">
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
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select party" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white z-50">
                            {creditors.length > 0 ? (
                              creditors.map((creditor) => (
                                <SelectItem key={creditor.id} value={creditor.id}>
                                  {creditor.partyName}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem key="no-creditors" value="no-creditors-placeholder" disabled>
                                No creditors available
                              </SelectItem>
                            )}
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
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {createReading.isPending ? 'Recording...' : 
                 !canSubmit ? 'Set Fuel Price Required' : 'Record Reading'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
