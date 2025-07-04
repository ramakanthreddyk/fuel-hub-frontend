/**
 * @file pages/dashboard/PumpsPage.tsx
 * @description Page for managing pumps with improved mobile layout and responsive design
 * Updated layout for mobile-friendliness – 2025-07-03
 */
import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useForm } from 'react-hook-form';
import { Plus, Fuel, Settings, Activity, Building2, Loader2, ArrowLeft, Menu } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PumpCard } from '@/components/pumps/PumpCard';
import { MobileStatsCard } from '@/components/dashboard/MobileStatsCard';
import { usePumps } from '@/hooks/api/usePumps';
import { useStations, useStation } from '@/hooks/api/useStations';
import { navigateBack } from '@/utils/navigation';

export default function PumpsPage() {
  const { stationId } = useParams<{ stationId: string }>();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedStationId, setSelectedStationId] = useState(stationId || '');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check for stationId in query params if not in route params
  const queryParams = new URLSearchParams(location.search);
  const stationIdFromQuery = queryParams.get('stationId');
  const effectiveStationId = stationId || stationIdFromQuery || selectedStationId;

  const form = useForm({
    defaultValues: {
      name: '',
      serialNumber: ''
    }
  });

  // Fetch all stations
  const { data: stations = [], isLoading: stationsLoading } = useStations();
  
  // Fetch specific station details if we have a stationId
  const { data: station } = useStation(effectiveStationId);
  
  // Fetch pumps for selected station
  const { data: pumps = [], isLoading: pumpsLoading, refetch } = usePumps(effectiveStationId);

  // Create pump mutation
  const createPumpMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/v1/pumps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-id': localStorage.getItem('tenantId') || ''
        },
        body: JSON.stringify({ ...data, stationId: effectiveStationId })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create pump');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      // Immediately update the cache with the new pump
      queryClient.setQueryData(['pumps', effectiveStationId], (oldData: any) => {
        return [...(oldData || []), data];
      });
      
      // Then refetch to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ['pumps', effectiveStationId] });
      
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
    if (!effectiveStationId) {
      toast({
        title: "Error",
        description: "Please select a station first",
        variant: "destructive",
      });
      return;
    }
    createPumpMutation.mutate(data);
  };

  // Handle station change
  const handleStationChange = (value: string) => {
    setSelectedStationId(value);
    navigate(`/dashboard/pumps?stationId=${value}`);
  };

  // Handle view nozzles navigation
  const handleViewNozzles = (pumpId: string) => {
    if (effectiveStationId) {
      navigate(`/dashboard/nozzles?pumpId=${pumpId}&stationId=${effectiveStationId}`);
    } else {
      navigate(`/dashboard/nozzles?pumpId=${pumpId}`);
    }
  };

  // Handle pump settings - placeholder for future feature
  const handlePumpSettings = (pumpId: string) => {
    toast({
      title: "Coming Soon",
      description: "Pump settings feature is under development",
    });
  };

  // Handle back to stations navigation
  const handleBackToStations = () => {
    navigateBack(navigate, '/dashboard/stations');
  };

  const isLoading = stationsLoading || pumpsLoading;

  // If no station is selected, show station selector
  if (!effectiveStationId) {
    return (
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Pumps</h1>
            <p className="text-muted-foreground text-sm md:text-base mt-1">
              Please select a station to manage its pumps
            </p>
          </div>
        </div>
        
        <Card className="overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Select a Station</CardTitle>
            <CardDescription className="text-sm">Choose a station to view its pumps</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label htmlFor="station-select" className="text-sm font-medium">
                  Station
                </label>
                <Select 
                  value={selectedStationId} 
                  onValueChange={handleStationChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select station" />
                  </SelectTrigger>
                  <SelectContent>
                    {stationsLoading ? (
                      <SelectItem value="loading" disabled>Loading stations...</SelectItem>
                    ) : stations.length === 0 ? (
                      <SelectItem value="no-stations" disabled>No stations available</SelectItem>
                    ) : (
                      stations.map((station) => (
                        <SelectItem key={station.id} value={station.id}>
                          {station.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button variant="outline" onClick={handleBackToStations} className="w-full sm:w-auto">
                  <Building2 className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">View All Stations</span>
                  <span className="sm:hidden">Stations</span>
                </Button>
                
                <Button 
                  onClick={() => navigate('/dashboard/stations/new')}
                  disabled={stationsLoading}
                  className="w-full sm:w-auto"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Create New Station</span>
                  <span className="sm:hidden">New Station</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const mobileStats = [
    { title: 'Total', value: pumps.length, icon: Fuel, color: 'text-blue-600' },
    { title: 'Active', value: pumps.filter(p => p.status === 'active').length, icon: Activity, color: 'text-green-600' },
    { title: 'Nozzles', value: pumps.reduce((sum, pump) => sum + (pump.nozzleCount || 0), 0), icon: Settings, color: 'text-purple-600' },
    { title: 'Maintenance', value: pumps.filter(p => p.status === 'maintenance').length, icon: Settings, color: 'text-orange-600' }
  ];

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 lg:p-6">
      {/* Improved responsive header layout */}
      <div className="space-y-4">
        {/* Back button and title row */}
        <div className="flex items-start gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBackToStations}
            className="shrink-0 h-9"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="hidden xs:inline">Back</span>
          </Button>
          
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight truncate">
              Pumps
            </h1>
            <p className="text-muted-foreground text-sm mt-1 hidden sm:block">
              Manage fuel pumps for your stations
            </p>
          </div>
        </div>

        {/* Station selector and Add pump button row */}
        <div className="flex flex-col xs:flex-row gap-3 items-stretch xs:items-center">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
              <Select 
                value={effectiveStationId} 
                onValueChange={handleStationChange}
              >
                <SelectTrigger className="h-9 text-sm min-w-0">
                  <SelectValue placeholder="Select station" />
                </SelectTrigger>
                <SelectContent>
                  {stations.map((station) => (
                    <SelectItem key={station.id} value={station.id}>
                      {station.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="shrink-0 h-9">
                <Plus className="mr-2 h-4 w-4" />
                <span className="hidden xs:inline">Add Pump</span>
                <span className="xs:hidden">Add</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] mx-4">
              <DialogHeader>
                <DialogTitle>Add New Pump</DialogTitle>
                <DialogDescription>
                  Add a new pump to {station?.name || 'selected station'}
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
                  <DialogFooter className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsAddDialogOpen(false)}
                      className="order-2 sm:order-1"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createPumpMutation.isPending}
                      className="order-1 sm:order-2"
                    >
                      {createPumpMutation.isPending ? "Creating..." : "Create Pump"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Mobile Stats Card */}
      <div className="block lg:hidden">
        <MobileStatsCard stats={mobileStats} />
      </div>

      {/* Desktop Stats Cards */}
      <div className="hidden lg:grid gap-4 grid-cols-2 xl:grid-cols-4">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pumps</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pumps.length}</div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Pumps</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pumps.filter(p => p.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Nozzles</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pumps.reduce((sum, pump) => sum + (pump.nozzleCount || 0), 0)}
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Maintenance</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pumps.filter(p => p.status === 'maintenance').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Responsive Pumps Grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <TooltipProvider>
          {pumps.map((pump) => (
            <div key={pump.id} className="overflow-hidden">
              <PumpCard
                pump={{
                  id: pump.id,
                  name: pump.name,
                  serialNumber: pump.serialNumber,
                  status: pump.status,
                  nozzleCount: pump.nozzleCount || 0,
                }}
                onViewNozzles={() => handleViewNozzles(pump.id)}
                onSettings={() => handlePumpSettings(pump.id)}
              />
            </div>
          ))}
        </TooltipProvider>
      </div>

      {pumps.length === 0 && !isLoading && (
        <Card className="overflow-hidden">
          <CardContent className="flex flex-col items-center justify-center py-12 px-4">
            <Fuel className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No pumps found</h3>
            <p className="text-muted-foreground text-center mb-4 text-sm sm:text-base">
              Get started by adding your first pump to this station.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add First Pump
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
