/**
 * @file NozzlesPage.tsx
 * @description Page component for managing nozzles for a specific pump
 */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { Plus, Settings, ArrowLeft, Activity, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EnhancedNozzleCard } from '@/components/nozzles/EnhancedNozzleCard';
import { MobileStatsCard } from '@/components/dashboard/MobileStatsCard';
import { useApiHook } from '@/hooks/useApiHook';

/**
 * Nozzle interface matching the API response
 */
interface Nozzle {
  id: string;
  pump_id?: string;
  pumpId?: string;
  nozzle_number?: number;
  nozzleNumber?: number;
  fuel_type?: string;
  fuelType?: string;
  status: string;
  created_at?: string;
  createdAt?: string;
}

/**
 * NozzlesPage component for managing nozzles for a specific pump
 */
export default function NozzlesPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { fetchData, createMutation, endpoints } = useApiHook();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Extract query parameters
  const queryParams = new URLSearchParams(window.location.search);
  const pumpId = queryParams.get('pumpId');
  const stationId = queryParams.get('stationId');
  
  // Form setup
  const form = useForm({
    defaultValues: {
      pumpId: pumpId || '',
      nozzleNumber: 1,
      fuelType: 'petrol',
      status: 'active'
    }
  });
  
  // Fetch pump details
  const { data: pump, isLoading: pumpLoading } = fetchData(
    `${endpoints.pumps}/${pumpId || ''}`,
    ['pump', pumpId],
    { enabled: !!pumpId }
  );
  
  // Fetch nozzles
  const { data: nozzlesData = [], isLoading: nozzlesLoading } = fetchData<any>(
    `${endpoints.nozzles}?pumpId=${pumpId || ''}`,
    ['nozzles', pumpId],
    { 
      enabled: !!pumpId
    }
  );
  
  // Ensure nozzles is always an array
  const nozzles = Array.isArray(nozzlesData) ? nozzlesData : 
                  nozzlesData?.nozzles && Array.isArray(nozzlesData.nozzles) ? nozzlesData.nozzles : 
                  nozzlesData?.data?.nozzles && Array.isArray(nozzlesData.data.nozzles) ? nozzlesData.data.nozzles : 
                  [];
  
  // Create nozzle mutation
  const createNozzleMutation = createMutation<any, any>(
    endpoints.nozzles,
    {
      invalidateQueries: [['nozzles', pumpId]],
      onSuccess: () => {
        setIsAddDialogOpen(false);
        form.reset({
          pumpId: pumpId || '',
          nozzleNumber: 1,
          fuelType: 'petrol',
          status: 'active'
        });
        toast({
          title: "Success",
          description: "Nozzle created successfully",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to create nozzle",
          variant: "destructive",
        });
      }
    }
  );
  
  // Handle form submission
  const onSubmit = (data: any) => createNozzleMutation.mutate(data);
  
  // Helper function to get property value (handles both camelCase and snake_case)
  const getProp = (obj: any, camelProp: string, snakeProp: string) => 
    obj?.[camelProp] || obj?.[snakeProp];
  
  // Prepare stats data
  const getFilteredCount = (prop: string, value: string) => {
    if (!Array.isArray(nozzles)) return 0;
    return nozzles.filter((n: any) => 
      getProp(n, prop, prop.replace(/[A-Z]/g, c => `_${c.toLowerCase()}`)) === value
    ).length || 0;
  };
  
  const mobileStats = [
    { title: 'Total', value: Array.isArray(nozzles) ? nozzles.length : 0, icon: Settings, color: 'text-blue-600' },
    { title: 'Active', value: getFilteredCount('status', 'active'), icon: Activity, color: 'text-green-600' },
    { title: 'Petrol', value: getFilteredCount('fuelType', 'petrol'), icon: Settings, color: 'text-purple-600' },
    { title: 'Diesel', value: getFilteredCount('fuelType', 'diesel'), icon: Settings, color: 'text-orange-600' }
  ];
  
  // Loading state
  if (pumpId && (pumpLoading || nozzlesLoading)) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  // No pump selected state
  if (!pumpId) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Nozzles</h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Please select a pump to manage its nozzles
            </p>
          </div>
          <Button asChild>
            <Link to="/dashboard/nozzles/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Nozzle
            </Link>
          </Button>
        </div>
        
        <Card className="p-8 text-center">
          <CardContent className="pt-6">
            <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Pump Selected</h3>
            <p className="text-muted-foreground mb-6">
              Please select a pump from the pumps page or create a new nozzle directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline">
                <Link to="/dashboard/pumps">
                  <Settings className="mr-2 h-4 w-4" />
                  View Pumps
                </Link>
              </Button>
              <Button asChild>
                <Link to="/dashboard/nozzles/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Nozzle
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Check if pump is active using a more comprehensive approach
  const isPumpActive = () => {
    // If pump data is missing, assume it's not active
    if (!pump) return false;
    
    // Check various possible status representations
    if (typeof (pump as any).status === 'string') {
      return (pump as any).status.toLowerCase() === 'active';
    }
    
    if (typeof (pump as any).status === 'boolean') {
      return (pump as any).status === true;
    }
    
    // Check alternative fields
    if (typeof (pump as any).isActive === 'boolean') {
      return (pump as any).isActive === true;
    }
    
    if (typeof (pump as any).active === 'boolean') {
      return (pump as any).active === true;
    }
    
    // If we have a pump object but no recognizable status field, assume it's active
    return true;
  };
  
  const canAddNozzles = isPumpActive();
  
  // Main UI
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Button asChild variant="ghost" size="sm">
              <Link to={stationId ? `/dashboard/pumps?stationId=${stationId}` : "/dashboard/pumps"}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Pumps
              </Link>
            </Button>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Nozzles</h1>
          <p className="text-muted-foreground text-sm md:text-base hidden md:block">
            Manage nozzles for {(pump as any)?.label || 'Pump'}
          </p>
          <p className="text-muted-foreground text-sm md:hidden">
            {(pump as any)?.label || 'Pump'} nozzles
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={!canAddNozzles} size="sm" className="md:size-default">
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden md:inline">Add Nozzle</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Nozzle</DialogTitle>
              <DialogDescription>
                Add a new nozzle to {(pump as any)?.label}
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

      {/* Mobile Stats Card */}
      <MobileStatsCard stats={mobileStats} />

      {/* Desktop Stats Cards */}
      <div className="hidden md:grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {mobileStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title} Nozzles</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Nozzles Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.isArray(nozzles) && nozzles.map((nozzle: Nozzle) => (
          <EnhancedNozzleCard 
            key={nozzle.id} 
            nozzle={nozzle} 
            onTakeReading={() => {
              navigate('/dashboard/readings/new', { 
                state: { 
                  preselected: { 
                    stationId: stationId, 
                    pumpId: pumpId, 
                    nozzleId: nozzle.id 
                  } 
                } 
              });
            }}
          />
        ))}
      </div>
      
      {/* Debug info removed */}
      
      {(!Array.isArray(nozzles) || nozzles.length === 0) && !nozzlesLoading && (
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