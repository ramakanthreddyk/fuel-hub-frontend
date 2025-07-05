import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { EnhancedSelect } from '@/components/ui/enhanced-select';
import { useContractStations } from '@/hooks/useContractStations';
import { usePump, useUpdatePump } from '@/hooks/api/usePumps';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { toast } from '@/hooks/use-toast';

const pumpSchema = z.object({
  name: z.string().min(1, 'Pump name is required'),
  stationId: z.string().min(1, 'Station selection is required'),
  serialNumber: z.string().min(1, 'Serial number is required'),
});

type PumpForm = z.infer<typeof pumpSchema>;

export default function EditPumpPage() {
  const { pumpId } = useParams<{ pumpId: string }>();
  const navigate = useNavigate();

  const { data: pump, isLoading: pumpLoading } = usePump(pumpId || '');
  const { data: stations = [], isLoading: stationsLoading } = useContractStations();
  const updatePump = useUpdatePump();

  const form = useForm<PumpForm>({
    resolver: zodResolver(pumpSchema),
    defaultValues: { name: '', stationId: '', serialNumber: '' },
  });

  useEffect(() => {
    if (pump) {
      form.reset({ name: pump.name, stationId: pump.stationId, serialNumber: pump.serialNumber });
    }
  }, [pump, form]);

  const onSubmit = async (data: PumpForm) => {
    if (!pumpId) return;
    try {
      await updatePump.mutateAsync({ id: pumpId, data });
      toast({ title: 'Success', description: 'Pump updated successfully' });
      navigate(`/dashboard/pumps/${pumpId}`);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to update pump', variant: 'destructive' });
    }
  };

  if (pumpLoading || stationsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const stationOptions = stations.map((s) => ({ value: s.id, label: s.name }));

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-2xl space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate(`/dashboard/pumps/${pumpId}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Edit Pump</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pump Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="stationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Station *</FormLabel>
                      <FormControl>
                        <EnhancedSelect
                          placeholder="Select Station"
                          options={stationOptions}
                          value={field.value}
                          onValueChange={field.onChange}
                          error={form.formState.errors.stationId?.message}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pump Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter pump name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="serialNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Serial Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter serial number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => navigate(`/dashboard/pumps/${pumpId}`)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
