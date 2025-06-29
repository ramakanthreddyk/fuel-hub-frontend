
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { Plus, Fuel, Settings, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { pumpsApi } from '@/api/pumps';
import { stationsApi } from '@/api/stations';
import { Link } from 'react-router-dom';
import { EnhancedFuelPumpCard } from '@/components/pumps/EnhancedFuelPumpCard';
import { MobileStatsCard } from '@/components/dashboard/MobileStatsCard';

export default function PumpsPage() {
  const { stationId } = useParams<{ stationId: string }>();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      label: '',
      serialNumber: ''
    }
  });

  // Fetch station details
  const { data: station } = useQuery({
    queryKey: ['station', stationId],
    queryFn: () => stationsApi.getStation(stationId!),
    enabled: !!stationId
  });

  // Fetch pumps for this station
  const { data: pumps, isLoading } = useQuery({
    queryKey: ['pumps', stationId],
    queryFn: () => pumpsApi.getPumps(stationId!),
    enabled: !!stationId
  });

  // Create pump mutation
  const createPumpMutation = useMutation({
    mutationFn: pumpsApi.createPump,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pumps', stationId] });
      setIsAddDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Pump created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create pump",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: any) => {
    createPumpMutation.mutate({ ...data, stationId: stationId! });
  };

  const handleViewNozzles = (pumpId: string) => {
    // Navigate to nozzles page for this pump
  };

  const handleSettings = (pumpId: string) => {
    // Handle pump settings
  };

  if (!stationId) {
    return <div>Station ID not found</div>;
  }

  const mobileStats = [
    { title: 'Total', value: pumps?.length || 0, icon: Fuel, color: 'text-blue-600' },
    { title: 'Active', value: pumps?.filter(p => p.status === 'active').length || 0, icon: Activity, color: 'text-green-600' },
    { title: 'Nozzles', value: pumps?.reduce((sum, pump) => sum + (pump.nozzleCount || 0), 0) || 0, icon: Settings, color: 'text-purple-600' },
    { title: 'Maintenance', value: pumps?.filter(p => p.status === 'maintenance').length || 0, icon: Settings, color: 'text-orange-600' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Pumps</h1>
          <p className="text-muted-foreground text-sm md:text-base hidden md:block">
            Manage pumps for {station?.name || 'Station'}
          </p>
          <p className="text-muted-foreground text-sm md:hidden">
            {station?.name || 'Station'} pumps
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="md:size-default">
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden md:inline">Add Pump</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Pump</DialogTitle>
              <DialogDescription>
                Add a new pump to {station?.name}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="label"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pump Label</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter pump label" {...field} />
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
                      <FormLabel>Serial Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter serial number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={createPumpMutation.isPending}>
                    {createPumpMutation.isPending ? "Creating..." : "Create Pump"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Mobile Stats Card */}
      <MobileStatsCard stats={mobileStats} />

      {/* Desktop Stats Cards */}
      <div className="hidden md:grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pumps</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pumps?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Pumps</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pumps?.filter(p => p.status === 'active').length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Nozzles</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pumps?.reduce((sum, pump) => sum + (pump.nozzleCount || 0), 0) || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Maintenance</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pumps?.filter(p => p.status === 'maintenance').length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pumps Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pumps?.map((pump) => (
          <EnhancedFuelPumpCard
            key={pump.id}
            pump={{
              ...pump,
              nozzleCount: pump.nozzleCount || 0
            }}
            onViewNozzles={() => {
              window.location.href = `/dashboard/stations/${stationId}/pumps/${pump.id}/nozzles`;
            }}
            onSettings={() => handleSettings(pump.id)}
          />
        ))}
      </div>

      {pumps?.length === 0 && !isLoading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Fuel className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No pumps found</h3>
            <p className="text-muted-foreground text-center mb-4">
              Get started by adding your first pump to this station.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Pump
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
