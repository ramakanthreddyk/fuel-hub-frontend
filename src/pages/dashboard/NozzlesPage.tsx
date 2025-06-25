
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { Plus, Settings, ArrowLeft, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { nozzlesApi, CreateNozzleRequest } from '@/api/nozzles';
import { pumpsApi } from '@/api/pumps';
import { Link } from 'react-router-dom';
import { EnhancedNozzleCard } from '@/components/nozzles/EnhancedNozzleCard';

export default function NozzlesPage() {
  const { stationId, pumpId } = useParams<{ stationId: string; pumpId: string }>();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const form = useForm<CreateNozzleRequest>({
    defaultValues: {
      pumpId: pumpId || '',
      nozzleNumber: 1,
      fuelType: 'petrol'
    }
  });

  // Fetch pump details
  const { data: pump } = useQuery({
    queryKey: ['pump', pumpId],
    queryFn: () => pumpsApi.getPump(pumpId!),
    enabled: !!pumpId
  });

  // Fetch nozzles for this pump
  const { data: nozzles, isLoading } = useQuery({
    queryKey: ['nozzles', pumpId],
    queryFn: () => nozzlesApi.getNozzles(pumpId!),
    enabled: !!pumpId
  });

  // Create nozzle mutation
  const createNozzleMutation = useMutation({
    mutationFn: nozzlesApi.createNozzle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nozzles', pumpId] });
      queryClient.invalidateQueries({ queryKey: ['pumps', stationId] });
      setIsAddDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Nozzle created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create nozzle",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: CreateNozzleRequest) => {
    createNozzleMutation.mutate(data);
  };

  const handleTakeReading = (nozzleId: string) => {
    navigate('/dashboard/readings/new', { 
      state: { 
        preselected: { 
          stationId, 
          pumpId, 
          nozzleId 
        } 
      } 
    });
  };

  if (!stationId || !pumpId) {
    return <div>Station ID or Pump ID not found</div>;
  }

  const canAddNozzles = pump?.status === 'active';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Button asChild variant="ghost" size="sm">
              <Link to={`/dashboard/stations/${stationId}/pumps`}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Pumps
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Nozzles</h1>
          <p className="text-muted-foreground">
            Manage nozzles for {pump?.label || 'Pump'}
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={!canAddNozzles}>
              <Plus className="mr-2 h-4 w-4" />
              Add Nozzle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Nozzle</DialogTitle>
              <DialogDescription>
                Add a new nozzle to {pump?.label}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="nozzleNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nozzle Number</FormLabel>
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
                      <FormLabel>Fuel Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select fuel type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="petrol">Petrol</SelectItem>
                          <SelectItem value="diesel">Diesel</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={createNozzleMutation.isPending}>
                    {createNozzleMutation.isPending ? "Creating..." : "Create Nozzle"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {!canAddNozzles && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-4">
            <p className="text-orange-800 text-sm">
              <Settings className="inline mr-1 h-4 w-4" />
              Cannot add nozzles to inactive pumps. Please activate the pump first.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Nozzles</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nozzles?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Nozzles</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {nozzles?.filter(n => n.status === 'active').length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Petrol Nozzles</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {nozzles?.filter(n => n.fuelType === 'petrol').length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Diesel Nozzles</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {nozzles?.filter(n => n.fuelType === 'diesel').length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Nozzles Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {nozzles?.map((nozzle) => (
          <EnhancedNozzleCard 
            key={nozzle.id} 
            nozzle={nozzle} 
            onTakeReading={handleTakeReading}
          />
        ))}
      </div>
      
      {nozzles?.length === 0 && !isLoading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Settings className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No nozzles found</h3>
            <p className="text-muted-foreground text-center mb-4">
              Get started by adding your first nozzle to this pump.
            </p>
            {canAddNozzles && (
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add First Nozzle
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
