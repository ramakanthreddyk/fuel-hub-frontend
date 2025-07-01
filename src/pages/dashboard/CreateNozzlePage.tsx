
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EnhancedSelect } from '@/components/ui/enhanced-select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { pumpsApi } from '@/api/pumps';
import { nozzlesApi } from '@/api/nozzles';

const createNozzleSchema = z.object({
  pumpId: z.string().min(1, 'Pump selection is required'),
  nozzleNumber: z.number().min(1, 'Nozzle number must be at least 1'),
  fuelType: z.enum(['petrol', 'diesel', 'premium'], {
    required_error: 'Fuel type is required',
  }),
});

type CreateNozzleForm = z.infer<typeof createNozzleSchema>;

export default function CreateNozzlePage() {
  const navigate = useNavigate();
  
  const { data: pumps = [], isLoading: pumpsLoading } = useQuery({
    queryKey: ['pumps-all'],
    queryFn: async () => {
      // Get all pumps across all stations
      const allPumps = await pumpsApi.getPumps('all');
      return allPumps;
    },
  });

  const form = useForm<CreateNozzleForm>({
    resolver: zodResolver(createNozzleSchema),
    defaultValues: {
      pumpId: '',
      nozzleNumber: 1,
      fuelType: 'petrol',
    },
  });

  const onSubmit = async (data: CreateNozzleForm) => {
    try {
      await nozzlesApi.createNozzle({
        pumpId: data.pumpId,
        nozzleNumber: data.nozzleNumber,
        fuelType: data.fuelType,
        status: 'active',
      });
      
      toast({
        title: "Success",
        description: "Nozzle created successfully",
      });
      
      navigate('/setup');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create nozzle",
        variant: "destructive",
      });
    }
  };

  if (pumpsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (pumps.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="container mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>No Pumps Available</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Please create a pump before adding a nozzle.
              </p>
              <div className="flex gap-2">
                <Button onClick={() => navigate('/dashboard/pumps/create')}>
                  Create Pump
                </Button>
                <Button variant="outline" onClick={() => navigate('/setup')}>
                  Back to Setup
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const pumpOptions = pumps.map(pump => ({
    value: pump.id,
    label: `${pump.label} (${pump.serialNumber})`,
  }));

  const fuelTypeOptions = [
    { value: 'petrol', label: 'Petrol' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'premium', label: 'Premium' },
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Create New Nozzle</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="pumpId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pump *</FormLabel>
                      <FormControl>
                        <EnhancedSelect
                          placeholder="Select Pump"
                          options={pumpOptions}
                          value={field.value}
                          onValueChange={field.onChange}
                          error={form.formState.errors.pumpId?.message}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nozzleNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nozzle Number *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="Enter nozzle number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fuelType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fuel Type *</FormLabel>
                      <FormControl>
                        <EnhancedSelect
                          placeholder="Select Fuel Type"
                          options={fuelTypeOptions}
                          value={field.value}
                          onValueChange={field.onChange}
                          error={form.formState.errors.fuelType?.message}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? 'Creating...' : 'Create Nozzle'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/setup')}
                  >
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
