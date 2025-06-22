
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { Plus, Fuel, Settings, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { pumpsApi, CreatePumpRequest } from '@/api/pumps';
import { stationsApi } from '@/api/stations';
import { Link } from 'react-router-dom';

export default function PumpsPage() {
  const { stationId } = useParams<{ stationId: string }>();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CreatePumpRequest>({
    defaultValues: {
      stationId: stationId || '',
      name: '',
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

  const onSubmit = (data: CreatePumpRequest) => {
    createPumpMutation.mutate(data);
  };

  if (!stationId) {
    return <div>Station ID not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pumps</h1>
          <p className="text-muted-foreground">
            Manage pumps for {station?.name || 'Station'}
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Pump
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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pump Name</FormLabel>
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

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
            <Fuel className="h-4 w-4 text-muted-foreground" />
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
              {pumps?.reduce((sum, pump) => sum + pump.nozzleCount, 0) || 0}
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
          <Card key={pump.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{pump.name}</CardTitle>
                <Badge variant={pump.status === 'active' ? 'default' : 'secondary'}>
                  {pump.status}
                </Badge>
              </div>
              <CardDescription>
                Serial: {pump.serialNumber}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Nozzles:</span>
                  <span className="font-medium">{pump.nozzleCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Status:</span>
                  <span className="font-medium capitalize">{pump.status}</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link to={`/dashboard/stations/${stationId}/pumps/${pump.id}/nozzles`}>
                    <Eye className="mr-1 h-3 w-3" />
                    View Nozzles
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Settings className="mr-1 h-3 w-3" />
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
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
