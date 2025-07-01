
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
import { useContractStations } from '@/hooks/useContractStations';
import { toast } from '@/hooks/use-toast';
import { pumpsApi } from '@/api/pumps';
import { ownerService } from '@/api/contract/owner.service';

const createPumpSchema = z.object({
  label: z.string().min(1, 'Pump label is required'),
  stationId: z.string().min(1, 'Station selection is required'),
  serialNumber: z.string().min(1, 'Serial number is required'),
});

type CreatePumpForm = z.infer<typeof createPumpSchema>;

export default function CreatePumpPage() {
  const navigate = useNavigate();
  const { data: stations = [], isLoading: stationsLoading } = useContractStations();
  
  // Extract stationId from URL if present
  const queryParams = new URLSearchParams(window.location.search);
  const stationIdFromUrl = queryParams.get('stationId');

  const form = useForm<CreatePumpForm>({
    resolver: zodResolver(createPumpSchema),
    defaultValues: {
      label: '',
      stationId: stationIdFromUrl || '',
      serialNumber: '',
    },
  });

  const onSubmit = async (data: CreatePumpForm) => {
    try {
      // Try using the owner service first (for owner role)
      try {
        await ownerService.createPump({
          label: data.label,
          stationId: data.stationId,
          serialNumber: data.serialNumber,
          status: 'active',
        });
      } catch (ownerError) {
        // Fall back to pumpsApi if owner service fails
        await pumpsApi.createPump({
          label: data.label,
          stationId: data.stationId,
          serialNumber: data.serialNumber,
          status: 'active',
        });
      }
      
      toast({
        title: "Success",
        description: "Pump created successfully",
      });
      
      // If we came from a specific station page, go back there
      if (stationIdFromUrl) {
        navigate(`/dashboard/stations/${stationIdFromUrl}/pumps`);
      } else {
        navigate('/setup');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create pump",
        variant: "destructive",
      });
    }
  };

  if (stationsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (stations.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="container mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>No Stations Available</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Please create a station before adding a pump.
              </p>
              <div className="flex gap-2">
                <Button onClick={() => navigate('/dashboard/stations')}>
                  Create Station
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

  const stationOptions = stations.map(station => ({
    value: station.id,
    label: station.name,
  }));

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Create New Pump</CardTitle>
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
                  name="label"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pump Label *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter pump label"
                          {...field}
                        />
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
                        <Input
                          placeholder="Enter serial number"
                          {...field}
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
                    {form.formState.isSubmitting ? 'Creating...' : 'Create Pump'}
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
