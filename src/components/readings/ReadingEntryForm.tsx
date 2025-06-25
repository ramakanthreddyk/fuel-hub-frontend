
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { stationsApi } from '@/api/stations';
import { pumpsApi } from '@/api/pumps';
import { nozzlesApi } from '@/api/nozzles';
import { creditorsApi } from '@/api/creditors';
import { useCreateReading, useLatestReading } from '@/hooks/useReadings';
import { CreateReadingRequest } from '@/api/readings';
import { useNavigate } from 'react-router-dom';

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
  const [selectedStation, setSelectedStation] = useState('');
  const [selectedPump, setSelectedPump] = useState('');
  const [selectedNozzle, setSelectedNozzle] = useState('');
  const navigate = useNavigate();

  const form = useForm<ReadingFormData>({
    defaultValues: {
      stationId: '',
      pumpId: '',
      nozzleId: '',
      reading: 0,
      recordedAt: new Date().toISOString().slice(0, 16),
      paymentMethod: 'cash',
    },
  });

  const createReading = useCreateReading();

  // Fetch data for dropdowns
  const { data: stations } = useQuery({
    queryKey: ['stations'],
    queryFn: () => stationsApi.getStations(),
  });

  const { data: pumps } = useQuery({
    queryKey: ['pumps', selectedStation],
    queryFn: () => pumpsApi.getPumps(selectedStation),
    enabled: !!selectedStation,
  });

  const { data: nozzles } = useQuery({
    queryKey: ['nozzles', selectedPump],
    queryFn: () => nozzlesApi.getNozzles(selectedPump),
    enabled: !!selectedPump,
  });

  const { data: creditors } = useQuery({
    queryKey: ['creditors'],
    queryFn: creditorsApi.getCreditors,
  });

  const { data: latestReading } = useLatestReading(selectedNozzle);

  const paymentMethod = form.watch('paymentMethod');

  useEffect(() => {
    if (selectedStation) {
      setSelectedPump('');
      setSelectedNozzle('');
      form.setValue('pumpId', '');
      form.setValue('nozzleId', '');
    }
  }, [selectedStation, form]);

  useEffect(() => {
    if (selectedPump) {
      setSelectedNozzle('');
      form.setValue('nozzleId', '');
    }
  }, [selectedPump, form]);

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
      navigate('/dashboard/sales');
    } catch (error) {
      // Error handled by mutation
    }
  };

  const selectedNozzleData = nozzles?.find(n => n.id === selectedNozzle);
  const minReading = latestReading?.reading || 0;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Record Nozzle Reading</CardTitle>
        <CardDescription>
          Enter the current cumulative reading to auto-generate a sale
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Station Selection */}
            <div className="grid gap-2">
              <Label htmlFor="station">Station</Label>
              <Select value={selectedStation} onValueChange={setSelectedStation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a station" />
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

            {/* Pump Selection */}
            <div className="grid gap-2">
              <Label htmlFor="pump">Pump</Label>
              <Select value={selectedPump} onValueChange={setSelectedPump} disabled={!selectedStation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a pump" />
                </SelectTrigger>
                <SelectContent>
                  {pumps?.map((pump) => (
                    <SelectItem key={pump.id} value={pump.id}>
                      {pump.name} ({pump.serialNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Nozzle Selection */}
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
                        <SelectValue placeholder="Select a nozzle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {nozzles?.map((nozzle) => (
                        <SelectItem key={nozzle.id} value={nozzle.id}>
                          Nozzle {nozzle.nozzleNumber} ({nozzle.fuelType})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Reading Info */}
            {selectedNozzleData && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Fuel Type:</span>
                    <span className="ml-2 font-medium">{selectedNozzleData.fuelType}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Previous Reading:</span>
                    <span className="ml-2 font-medium">{latestReading?.reading || 0} L</span>
                  </div>
                </div>
              </div>
            )}

            {/* Current Reading */}
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
                  <FormLabel>Current Reading (Litres)</FormLabel>
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

            {/* Recorded At */}
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

            {/* Payment Method */}
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

            {/* Credit Party */}
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
                          <SelectValue placeholder="Select credit party" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {creditors?.map((creditor) => (
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

            <Button type="submit" disabled={createReading.isPending} className="w-full">
              {createReading.isPending ? 'Recording...' : 'Record Reading'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
