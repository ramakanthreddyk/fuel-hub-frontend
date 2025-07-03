/**
 * @file ReadingEntryForm.tsx
 * @description Form component for recording nozzle readings
 * @see docs/API_INTEGRATION_GUIDE.md - API integration patterns
 * @see docs/journeys/MANAGER.md - Manager journey for recording readings
 */
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

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
    if (preselected?.stationId) {
      setSelectedStation(preselected.stationId);
      form.setValue('stationId', preselected.stationId);
    }
    if (preselected?.pumpId) {
      setSelectedPump(preselected.pumpId);
      form.setValue('pumpId', preselected.pumpId);
    }
    if (preselected?.nozzleId) {
      setSelectedNozzle(preselected.nozzleId);
      form.setValue('nozzleId', preselected.nozzleId);
    }
  }, [preselected, form]);

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
    console.log('[READING-FORM] Submitting reading:', data);
    
    const readingData: CreateReadingRequest = {
      nozzleId: data.nozzleId,
      reading: data.reading,
      recordedAt: new Date(data.recordedAt).toISOString(),
      paymentMethod: data.paymentMethod,
      creditorId: data.paymentMethod === 'credit' ? data.creditorId : undefined,
    };

    createReading.mutate(readingData, {
      onSuccess: () => {
        console.log('[READING-FORM] Reading created successfully');
        
        // Navigate back to nozzles page if we came from there
        if (preselected?.stationId && preselected?.pumpId) {
          navigate(`/dashboard/stations/${preselected.stationId}/pumps/${preselected.pumpId}/nozzles`);
        } else {
          // Otherwise go to readings page
          navigate('/dashboard/readings');
        }
      },
      onError: (error) => {
        console.error('[READING-FORM] Error creating reading:', error);
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
                  disabled={!!preselected?.stationId}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select station" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
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
                  disabled={!selectedStation || !!preselected?.pumpId}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pump" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {pumps.length > 0 ? (
                      pumps.map((pump) => (
                        <SelectItem key={pump.id} value={pump.id}>
                          {pump.name} {pump.serialNumber ? `(${pump.serialNumber})` : ''}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem key="no-pumps" value="no-pumps" disabled>
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
                  disabled={!selectedPump || !!preselected?.nozzleId}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select nozzle" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-background border shadow-lg z-50">
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
                  <Select onValueChange={field.onChange} value={field.value || "select-creditor"}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select party" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {creditors.length > 0 ? (
                        creditors.map((creditor) => (
                          <SelectItem key={creditor.id} value={creditor.id}>
                            {creditor.partyName}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem key="no-creditors" value="no-creditors" disabled>
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
          className="w-full"
        >
          {createReading.isPending ? 'Recording...' : 
           !canSubmit ? 'Set Fuel Price Required' : 'Record Reading'}
        </Button>
      </form>
    </Form>
  );
}