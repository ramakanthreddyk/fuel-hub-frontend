/**
 * @file ReadingEntryForm.tsx
 * @description Form component for recording nozzle readings
 */
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useFuelStore } from '@/store/fuelStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, DollarSign, Gauge, Clock, CreditCard, Building2, Droplets, AlertTriangle } from 'lucide-react';
import { useToastNotifications } from '@/hooks/useToastNotifications';
import { getFuelTypeColor, getPaymentMethodColor } from '@/utils/reading-config';

// Import API hooks
import { useStations } from '@/hooks/api/useStations';
import { usePumps } from '@/hooks/api/usePumps';
import { useNozzles } from '@/hooks/api/useNozzles';
import { useCreateReading, useLatestReading, useCanCreateReading } from '@/hooks/api/useReadings';
import { useFuelPrices } from '@/hooks/api/useFuelPrices';
import { useAutoLoader } from '@/hooks/useAutoLoader';
import { CreateReadingRequest } from '@/api/services/readingsService';

// Import creditors API
import { creditorsApi } from '@/api/creditors';
import { useQuery } from '@tanstack/react-query';
import { fetchSales } from '@/services/salesService';

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
  readonly preselected?: {
    stationId?: string;
    pumpId?: string;
    nozzleId?: string;
  };
}

// Helper function for sales data
function useSales(nozzleId: string, from: string, to: string, options: { enabled: boolean }) {
  const { data, refetch } = useQuery({
    queryKey: ['sales', nozzleId, from, to],
    queryFn: () => fetchSales(nozzleId, from, to),
    enabled: options.enabled,
  });
  return { data: data || [], refetch };
}

// Reusable Select Component
export function ReusableSelect({
  value,
  onChange,
  options,
  placeholder,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ id: string; name: string }>;
  placeholder: string;
  disabled?: boolean;
}) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="h-12 bg-white border-gray-200">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.id} value={option.id}>
            {option.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// Refactor Station, Pump, and Nozzle Selects
const StationSelect = ({ value, onChange, stations, disabled }: any) => (
  <ReusableSelect
    value={value}
    onChange={onChange}
    options={stations}
    placeholder="Select station"
    disabled={disabled}
  />
);

const PumpSelect = ({ value, onChange, pumps, disabled }: any) => (
  <ReusableSelect
    value={value}
    onChange={onChange}
    options={pumps}
    placeholder="Select pump"
    disabled={disabled}
  />
);

const NozzleSelect = ({ value, onChange, nozzles, disabled }: any) => (
  <ReusableSelect
    value={value}
    onChange={onChange}
    options={nozzles}
    placeholder="Select nozzle"
    disabled={disabled}
  />
);

// Refactor Payment Method Select
const PaymentMethodSelect = ({ value, onChange }: any) => (
  <ReusableSelect
    value={value}
    onChange={onChange}
    options={[
      { id: 'cash', name: 'Cash' },
      { id: 'card', name: 'Card' },
      { id: 'upi', name: 'UPI' },
      { id: 'credit', name: 'Credit' },
    ]}
    placeholder="Select payment method"
  />
);

export function ReadingEntryForm({ preselected }: ReadingEntryFormProps) {
  const navigate = useNavigate();
  const location = useLocation();
  useToastNotifications();
  
  // Get initial values from props, location state, or store
  const { selectedStationId, selectedPumpId, selectedNozzleId } = useFuelStore();
  const navigationState = location.state?.preselected;
  
  // Store initial values in a ref to prevent re-renders
  const initialValues = React.useRef({
    stationId: navigationState?.stationId || preselected?.stationId || selectedStationId || '',
    pumpId: navigationState?.pumpId || preselected?.pumpId || selectedPumpId || '',
    nozzleId: navigationState?.nozzleId || preselected?.nozzleId || selectedNozzleId || ''
  });
  
  // Local state for selections
  // Always ensure selectedStation is a string (never undefined/null)
  const [selectedStation, setSelectedStation] = useState<string>(initialValues.current.stationId || "");
  const [selectedPump, setSelectedPump] = useState(initialValues.current.pumpId);
  const [selectedNozzle, setSelectedNozzle] = useState(initialValues.current.nozzleId);

  // Initialize form
  const form = useForm<ReadingFormData>({
    defaultValues: {
      stationId: initialValues.current.stationId,
      pumpId: initialValues.current.pumpId,
      nozzleId: initialValues.current.nozzleId,
      reading: 0,
      recordedAt: new Date().toISOString().slice(0, 16),
      paymentMethod: 'cash',
    },
  });
  
  // Fetch data directly without store caching to avoid circular dependencies
  const { data: stations = [] } = useStations();
  const { data: pumps = [] } = usePumps(selectedStation);
  const { data: nozzles = [] } = useNozzles(selectedPump);
  const { data: latestReading, isLoading: loadingLatestReading, refetch: refetchLatestReading } = useLatestReading(selectedNozzle);
  const { data: canCreateReading, isLoading: loadingCanCreate } = useCanCreateReading(selectedNozzle);
  const { data: fuelPrices = [], isLoading: loadingPrices } = useFuelPrices(selectedStation);
  const { data: creditors = [] } = useQuery({
    queryKey: ['creditors'],
    queryFn: () => creditorsApi.getCreditors(),
    enabled: true,
  });

  // Sale summary state
  interface SaleSummary {
    totalLiters: number;
    totalAmount: number;
    byPayment: Record<string, { liters: number; amount: number }>;
    sales: Array<{ liters: number; amount: number; paymentMethod: string }>;
  }
  const [saleSummary, setSaleSummary] = useState<SaleSummary | null>(null);
  // Explicitly type readingWindow for useSales
  type ReadingWindow = { nozzleId: string; from: string; to: string } | null;
  const [readingWindow] = useState<ReadingWindow>(null);
  const createReading = useCreateReading({
    navigateAfterSuccess: true,
    navigateTo: '/dashboard'
  });
  
  useAutoLoader(createReading.isPending, 'Recording reading...');
  useAutoLoader(loadingLatestReading, 'Loading latest reading...');
  useAutoLoader(loadingCanCreate, 'Checking reading permissions...');
  useAutoLoader(loadingPrices, 'Loading fuel prices...');
  
  // Fetch sales for the nozzle between previous and new reading
  const { data: sales = [] } = useSales(
    readingWindow?.nozzleId ?? "",
    readingWindow?.from ?? "",
    readingWindow?.to ?? "",
    { enabled: !!readingWindow }
  );

  // Handle station change
  useEffect(() => {
    if (!initialValues.current.pumpId && selectedStation) {
      setSelectedPump('');
      setSelectedNozzle('');
      form.setValue('pumpId', '');
      form.setValue('nozzleId', '');
    }
  }, [selectedStation, form]);

  // Handle pump change
  useEffect(() => {
    if (!initialValues.current.nozzleId && selectedPump) {
      setSelectedNozzle('');
      form.setValue('nozzleId', '');
    }
  }, [selectedPump, form]);
  
  // Update sale summary when sales data changes
  useEffect(() => {
    if (sales?.length && readingWindow) {
      let totalLiters = 0;
      let totalAmount = 0;
      const byPayment = {};
      
      sales.forEach(sale => {
        totalLiters += sale.liters;
        totalAmount += sale.amount;
        if (!byPayment[sale.paymentMethod]) byPayment[sale.paymentMethod] = { liters: 0, amount: 0 };
        byPayment[sale.paymentMethod].liters += sale.liters;
        byPayment[sale.paymentMethod].amount += sale.amount;
      });
      
      setSaleSummary({ totalLiters, totalAmount, byPayment, sales });
    }
  }, [sales, readingWindow]);
  
  const paymentMethod = form.watch('paymentMethod');
  
  // Find selected nozzle data
  const selectedNozzleData = nozzles.find(n => n.id === selectedNozzle);
  const minReading = latestReading?.reading || 0;

  // Check if we can create reading - allow submission if loading or if canCreate is true/undefined
  const canSubmit = loadingCanCreate || !canCreateReading || canCreateReading?.canCreate !== false;
  const hasMissingPrices = !loadingCanCreate && canCreateReading?.canCreate === false && canCreateReading?.missingPrice;

  // Enhanced reading validation
  const formValues = form.watch();
  const currentReading = Number(formValues.reading) || 0;
  const previousReading = minReading;
  const calculatedVolume = currentReading - previousReading;
  const hasNoPreviousReading = !latestReading || previousReading === 0;

  // Check for various reading scenarios
  const isNegativeVolume = calculatedVolume < 0 && !hasNoPreviousReading;
  const isZeroVolume = calculatedVolume === 0 && !hasNoPreviousReading;
  const isLargeVolume = calculatedVolume > 5000; // More than 5000L might be unusual
  const isMeterReset = isNegativeVolume && currentReading > 0 && currentReading < 10000; // Likely meter reset
  const isFirstReading = hasNoPreviousReading && currentReading > 0;

  // Basic required fields validation
  const hasRequiredFields = formValues.stationId && formValues.pumpId && formValues.nozzleId && currentReading > 0;

  // Allow submission for meter resets but warn user
  const finalCanSubmit = canSubmit && hasRequiredFields;

  const onSubmit = async (data: ReadingFormData) => {
    const readingData: CreateReadingRequest = {
      nozzleId: data.nozzleId,
      reading: data.reading,
      recordedAt: new Date(data.recordedAt).toISOString(),
      paymentMethod: data.paymentMethod,
      creditorId: data.paymentMethod === 'credit' ? data.creditorId : undefined,
    };

  // nozzleNumber removed from contract; use nozzle name or id if needed
    
    createReading.mutate(readingData);
  };

  // Replace inline logic for colors with utility functions
  const fuelTypeColor = getFuelTypeColor(selectedNozzleData?.fuelType);
  const paymentMethodColor = getPaymentMethodColor(paymentMethod);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="text-sm text-muted-foreground">
              Dashboard → Readings → <span className="font-medium text-foreground">Record Reading</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Gauge className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Record Reading</h1>
              <p className="text-lg text-muted-foreground">Enter the current meter reading for the selected nozzle</p>
            </div>
          </div>
        </div>

        {/* Sale Summary */}
        {saleSummary && (
          <Card className="mb-8 border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-100">
            <CardHeader>
              <CardTitle className="text-green-900 flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Sale Summary (since last reading)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="text-green-800">
                    <strong>Total Liters:</strong> {saleSummary.totalLiters} L
                  </div>
                  <div className="text-green-800">
                    <strong>Total Amount:</strong> ₹{saleSummary.totalAmount}
                  </div>
                </div>
                <div>
                  <strong className="text-green-900">By Payment Method:</strong>
                  <ul className="list-disc ml-6 mt-2">
                    {Object.entries(saleSummary.byPayment).map(([method, stats]) => (
                      <li key={method} className="text-green-700">
                        {method}: {stats.liters} L, ₹{stats.amount}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Form Section */}
        <Card className="border-0 shadow-xl">
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Reading Validation Warnings */}
                {selectedNozzle && currentReading > 0 && (
                  <>
                    {isFirstReading && (
                      <Alert className="border-green-200 bg-green-50">
                        <AlertTriangle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          <strong>First Reading:</strong> This is the first reading for this nozzle.
                        </AlertDescription>
                      </Alert>
                    )}
                  </>
                )}

                {/* Selection Section */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Station & Equipment Selection
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="stationId"
                      rules={{ required: 'Station is required' }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Station</FormLabel>
                          <StationSelect 
                            value={field.value} 
                            onChange={(value) => {
                              field.onChange(value);
                              setSelectedStation(value);
                            }}
                            stations={stations}
                            disabled={!!initialValues.current.stationId}
                          />
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
                          <FormLabel className="text-sm font-medium">Pump</FormLabel>
                          <PumpSelect 
                            value={field.value} 
                            onChange={(value) => {
                              field.onChange(value);
                              setSelectedPump(value);
                            }}
                            pumps={pumps}
                            disabled={!selectedStation || !!initialValues.current.pumpId}
                          />
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
                          <FormLabel className="text-sm font-medium">Nozzle</FormLabel>
                          <NozzleSelect 
                            value={field.value} 
                            onChange={(value) => {
                              console.log('[READING-FORM] Nozzle selection changed to:', value);

                              // Find the selected nozzle data to log its details
                              const selectedNozzleData = nozzles.find(n => n.id === value);
                              console.log('[READING-FORM] Selected nozzle data:', selectedNozzleData);

                              field.onChange(value);
                              setSelectedNozzle(value);

                              // Clear any cached reading data for the previous nozzle to prevent mixing
                              // This ensures we get fresh data for the newly selected nozzle
                              if (refetchLatestReading) {
                                console.log('[READING-FORM] 🔄 Refetching latest reading for new nozzle:', value);
                                console.log('[READING-FORM] 🔄 Previous nozzle was:', selectedNozzle);

                                // Force refetch to get fresh data and avoid cache contamination
                                setTimeout(() => {
                                  refetchLatestReading();
                                }, 100); // Small delay to ensure state is updated
                              }
                            }}
                            nozzles={nozzles}
                            disabled={!selectedPump || !!initialValues.current.nozzleId}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Nozzle Info Panel */}
                {selectedNozzleData && (
                  <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-gray-900 flex items-center gap-2">
                        <Droplets className="h-5 w-5" />
                        Nozzle Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                            <span className="text-gray-600">Fuel Type:</span>
                            <span className="font-semibold text-gray-900 capitalize">{selectedNozzleData.fuelType}</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                            <span className="text-gray-600">Nozzle Name:</span>
                            <span className="font-semibold text-gray-900">{selectedNozzleData.name}</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                            <span className="text-gray-600">Status:</span>
                            <span className="font-semibold text-gray-900 capitalize">{selectedNozzleData.status}</span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <Card className="bg-white border-gray-200">
                            <CardContent className="p-6 text-center">
                              <div className="text-sm text-gray-600 mb-2">Previous Reading</div>
                              <div className="text-3xl font-bold text-blue-600 mb-2">{latestReading?.reading || 0} L</div>
                              {latestReading?.recordedAt && (
                                <div className="text-xs text-gray-500">
                                  {new Date(latestReading.recordedAt).toLocaleDateString()} at{' '}
                                  {new Date(latestReading.recordedAt).toLocaleTimeString()}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                          {latestReading && (
                            <div className="flex items-center gap-2 text-xs text-orange-700 bg-orange-50 p-3 rounded-lg border border-orange-200">
                              <AlertTriangle className="h-4 w-4" />
                              New reading must be greater than {latestReading.reading} L
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Reading & Time Section */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Gauge className="h-5 w-5" />
                    Reading Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="reading"
                      rules={{
                        required: 'Reading is required',
                        min: {
                          value: minReading === 0 ? 0.01 : minReading + 0.01,
                          message: `Reading must be greater than ${minReading}`,
                        },
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Current Reading (L)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              min={minReading}
                              className="h-12 bg-white border-gray-200 text-lg"
                              placeholder="Enter reading"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
                                  field.onChange(value);
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
                      rules={{ required: 'Recorded at time is required' }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Recorded At</FormLabel>
                          <FormControl>
                            <Input
                              type="datetime-local"
                              className="h-12 bg-white border-gray-200"
                              placeholder="Select date and time"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Payment Section */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      rules={{ required: 'Payment method is required' }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Payment Method</FormLabel>
                          <PaymentMethodSelect
                            value={field.value}
                            onChange={field.onChange}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch('paymentMethod') === 'credit' && (
                      <FormField
                        control={form.control}
                        name="creditorId"
                        rules={{ required: 'Creditor is required for credit payments' }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Creditor</FormLabel>
                            <Select 
                              value={field.value} 
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="h-12 bg-white border-gray-200">
                                <SelectValue placeholder="Select creditor" />
                              </SelectTrigger>
                              <SelectContent>
                                {creditors.map(creditor => (
                                  <SelectItem key={creditor.id} value={creditor.id}>
                                    {creditor.name}
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
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg font-semibold"
                    disabled={!finalCanSubmit}
                  >
                    {createReading.isPending ? 'Recording...' : 'Record Reading'}
                  </Button>
                  {!canSubmit && (
                    <div className="mt-4 text-sm text-red-600">
                      You cannot submit this reading yet. Please check the details and try again.
                    </div>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}