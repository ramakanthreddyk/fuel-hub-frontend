/**
 * @file ReadingEntryForm.tsx
 * @description Form component for recording nozzle readings
 */
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFuelStore } from '@/store/fuelStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, DollarSign, Fuel, Gauge, Clock, CreditCard, Building2, Droplets, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToastNotifications } from '@/hooks/useToastNotifications';

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

// Helper function for sales data
function useSales(nozzleId: string, from: string, to: string, options: { enabled: boolean }) {
  const { data, refetch } = useQuery({
    queryKey: ['sales', nozzleId, from, to],
    queryFn: async () => {
      if (!nozzleId || !from || !to) {
        return [];
      }
      const response = await fetch(`/api/sales?nozzleId=${nozzleId}&from=${from}&to=${to}`);
      if (!response.ok) {
        throw new Error('Failed to fetch sales data');
      }
      return response.json();
    },
    enabled: options.enabled,
  });

  return { data: data || [], refetch };
}

export function ReadingEntryForm({ preselected }: ReadingEntryFormProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess, showError } = useToastNotifications();
  
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
  const [selectedStation, setSelectedStation] = useState(initialValues.current.stationId);
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
  const { data: latestReading, isLoading: loadingLatestReading } = useLatestReading(selectedNozzle);
  const { data: canCreateReading, isLoading: loadingCanCreate } = useCanCreateReading(selectedNozzle);
  const { data: fuelPrices = [], isLoading: loadingPrices } = useFuelPrices(selectedStation);
  const { data: creditors = [] } = useQuery({
    queryKey: ['creditors', selectedStation],
    queryFn: () => creditorsApi.getCreditors(selectedStation),
    enabled: !!selectedStation
  });

  // Sale summary state
  const [saleSummary, setSaleSummary] = useState(null);
  const [readingWindow, setReadingWindow] = useState(null);
  const createReading = useCreateReading();
  
  useAutoLoader(createReading.isPending, 'Recording reading...');
  useAutoLoader(loadingLatestReading, 'Loading latest reading...');
  useAutoLoader(loadingCanCreate, 'Checking reading permissions...');
  useAutoLoader(loadingPrices, 'Loading fuel prices...');
  
  // Fetch sales for the nozzle between previous and new reading
  const { data: sales = [], refetch: refetchSales } = useSales(
    readingWindow?.nozzleId,
    readingWindow?.from,
    readingWindow?.to,
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

  // Check if we can create reading
  const canSubmit = loadingCanCreate ? true : canCreateReading?.canCreate !== false;
  const hasMissingPrices = !loadingCanCreate && !canCreateReading?.canCreate && canCreateReading?.missingPrice;

  const onSubmit = async (data: ReadingFormData) => {
    const readingData: CreateReadingRequest = {
      nozzleId: data.nozzleId,
      reading: data.reading,
      recordedAt: new Date(data.recordedAt).toISOString(),
      paymentMethod: data.paymentMethod,
      creditorId: data.paymentMethod === 'credit' ? data.creditorId : undefined,
    };

    const nozzleNumber = selectedNozzleData?.nozzleNumber;
    
    createReading.mutate(readingData, {
      onSuccess: (newReading) => {
        showSuccess('Reading Recorded', `Successfully recorded reading ${newReading?.reading || data.reading}L${nozzleNumber ? ` for nozzle #${nozzleNumber}` : ''}`);

        // Navigate back to dashboard after successful submission
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);

        if (latestReading?.recordedAt && newReading?.recordedAt) {
          setReadingWindow({
            nozzleId: newReading.nozzleId,
            from: latestReading.recordedAt,
            to: newReading.recordedAt,
          });
          refetchSales();
        }
      },
      onError: (error: any) => {
        showError('Failed to Record Reading', error.message || 'Please check your input and try again.');
      }
    });
  };

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

        {/* Sale Summary after reading creation */}
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
                    <strong>Total Liters:</strong> {saleSummary.totalLiters.toFixed(2)} L
                  </div>
                  <div className="text-green-800">
                    <strong>Total Amount:</strong> ₹{saleSummary.totalAmount.toFixed(2)}
                  </div>
                </div>
                <div>
                  <strong className="text-green-900">By Payment Method:</strong>
                  <ul className="list-disc ml-6 mt-2">
                    {Object.entries(saleSummary.byPayment).map(([method, stats]) => (
                      <li key={method} className="text-green-700">
                        {method}: {stats.liters.toFixed(2)} L, ₹{stats.amount.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-4">
                <Link to="/dashboard/sales" className="text-green-700 font-medium hover:underline">
                  View detailed sales →
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-0 shadow-xl">
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {selectedNozzle && hasMissingPrices && (
                  <Alert className="border-orange-200 bg-orange-50">
                    <DollarSign className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-orange-800">
                      <strong>Cannot record reading:</strong> {canCreateReading?.reason || 'Missing fuel price for this nozzle type'}. {' '}
                      <Link to="/dashboard/fuel-prices" className="underline font-medium">
                        Set fuel price first
                      </Link>.
                    </AlertDescription>
                  </Alert>
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
                          <Select 
                            value={field.value} 
                            onValueChange={(value) => {
                              field.onChange(value);
                              setSelectedStation(value);
                            }}
                            disabled={!!initialValues.current.stationId}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12 bg-white border-gray-200">
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
                          <FormLabel className="text-sm font-medium">Pump</FormLabel>
                          <Select 
                            value={field.value} 
                            onValueChange={(value) => {
                              field.onChange(value);
                              setSelectedPump(value);
                            }}
                            disabled={!selectedStation || !!initialValues.current.pumpId}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12 bg-white border-gray-200">
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
                          <FormLabel className="text-sm font-medium">Nozzle</FormLabel>
                          <Select 
                            value={field.value} 
                            onValueChange={(value) => {
                              field.onChange(value);
                              setSelectedNozzle(value);
                            }}
                            disabled={!selectedPump || !!initialValues.current.nozzleId}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12 bg-white border-gray-200">
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
                            <span className="text-gray-600">Nozzle Number:</span>
                            <span className="font-semibold text-gray-900">#{selectedNozzleData.nozzleNumber}</span>
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
                          value: minReading,
                          message: `Reading must be at least ${minReading}`,
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
                                if (value) {
                                  const normalized = parseFloat(value).toFixed(2);
                                  field.onChange(parseFloat(normalized));
                                } else {
                                  field.onChange('');
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
                          <FormLabel className="text-sm font-medium flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Recorded At
                          </FormLabel>
                          <FormControl>
                            <Input type="datetime-local" className="h-12 bg-white border-gray-200" {...field} />
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
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Payment Method</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 bg-white border-gray-200">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white z-50">
                              <SelectItem value="cash">💵 Cash</SelectItem>
                              <SelectItem value="card">💳 Card</SelectItem>
                              <SelectItem value="upi">📱 UPI</SelectItem>
                              <SelectItem value="credit">🏢 Credit</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {paymentMethod === 'credit' && (
                      <FormField
                        control={form.control}
                        name="creditorId"
                        rules={{ required: 'Credit party is required for credit payments' }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Credit Party</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || ""}>
                              <FormControl>
                                <SelectTrigger className="h-12 bg-white border-gray-200">
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
                </div>

                <Button 
                  type="submit" 
                  disabled={createReading.isPending || !canSubmit} 
                  className="w-full h-14 text-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {createReading.isPending ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Recording...
                    </>
                  ) : !canSubmit ? (
                    'Set Fuel Price Required'
                  ) : (
                    <>
                      <Gauge className="mr-2 h-5 w-5" />
                      Record Reading
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}