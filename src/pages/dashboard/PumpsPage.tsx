
/**
 * @file pages/dashboard/PumpsPage.tsx
 * @description Redesigned pumps page with realistic fuel dispenser cards
 */
import { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Building2, Loader2, ArrowLeft, Fuel } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FuelPumpCard } from '@/components/pumps/FuelPumpCard';
import { EmptyState } from '@/components/common/EmptyState';
import { usePumps, useCreatePump, useDeletePump } from '@/hooks/api/usePumps';
import { useStations, useStation } from '@/hooks/api/useStations';
import { navigateBack } from '@/utils/navigation';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';

export default function PumpsPage() {
  const { stationId } = useParams<{ stationId: string }>();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedStationId, setSelectedStationId] = useState(stationId || '');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pumpToDelete, setPumpToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check for stationId in query params if not in route params
  const queryParams = new URLSearchParams(location.search);
  const stationIdFromQuery = queryParams.get('stationId');
  const effectiveStationId =
    stationId ||
    (stationIdFromQuery && stationIdFromQuery !== 'all' ? stationIdFromQuery : undefined) ||
    (selectedStationId || undefined);

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
  const { data: pumps = [], isLoading: pumpsLoading } = usePumps(effectiveStationId);

  // Create pump mutation
  const createPumpMutation = useCreatePump();
  const deletePumpMutation = useDeletePump();

  const handleCreatePumpSuccess = () => {
    setIsAddDialogOpen(false);
    form.reset();
    toast({
      title: 'Success',
      description: 'Pump created successfully'
    });
  };

  const handleCreatePumpError = () => {
    toast({
      title: 'Error',
      description: 'Failed to create pump',
      variant: 'destructive'
    });
  };

  const onSubmit = (data: any) => {
    if (!effectiveStationId) {
      toast({
        title: 'Error',
        description: 'Please select a station first',
        variant: 'destructive'
      });
      return;
    }

    createPumpMutation.mutate(
      { ...data, stationId: effectiveStationId },
      { onSuccess: handleCreatePumpSuccess, onError: handleCreatePumpError }
    );
  };

  // Handle station change
  const handleStationChange = (value: string) => {
    if (!value || value === 'all') {
      setSelectedStationId('');
      navigate('/dashboard/pumps');
    } else {
      setSelectedStationId(value);
      navigate(`/dashboard/pumps?stationId=${value}`);
    }
  };

  // Handle view nozzles navigation
  const handleViewNozzles = (pumpId: string) => {
    if (effectiveStationId) {
      navigate(`/dashboard/nozzles?pumpId=${pumpId}&stationId=${effectiveStationId}`);
    } else {
      navigate(`/dashboard/nozzles?pumpId=${pumpId}`);
    }
  };

  // Handle pump deletion
  const handleDeletePump = (pumpId: string) => {
    setPumpToDelete(pumpId);
    setDeleteDialogOpen(true);
  };

  const confirmDeletePump = async () => {
    if (!pumpToDelete) return;
    
    try {
      await deletePumpMutation.mutateAsync(pumpToDelete);
      toast({
        title: 'Success',
        description: 'Pump deleted successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete pump',
        variant: 'destructive'
      });
    } finally {
      setPumpToDelete(null);
    }
  };

  // Handle back to stations navigation
  const handleBackToStations = () => {
    navigateBack(navigate, '/dashboard/stations');
  };

  const isLoading = stationsLoading || pumpsLoading;


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto p-4 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBackToStations}
              className="p-2 hover:bg-white/60 rounded-full"
            >
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Fuel Station Control
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <Building2 className="h-5 w-5 text-slate-500" />
                <Select value={effectiveStationId ?? 'all'} onValueChange={handleStationChange}>
                  <SelectTrigger className="w-[250px] bg-white/80 border-2 border-white shadow-lg">
                    <SelectValue placeholder="Select station" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-2 shadow-xl">
                    <SelectItem value="all">All Stations</SelectItem>
                    {stations.map((station) => (
                      <SelectItem key={station.id} value={station.id}>
                        {station.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => setIsAddDialogOpen(true)} 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Fuel Pump
          </Button>
        </div>

        {/* Station Info */}
        {station && (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                {station.name} Fuel Station
              </h2>
              <p className="text-slate-600">
                Managing {pumps.length} fuel dispensers
              </p>
            </div>
          </div>
        )}

        {/* Pumps Grid */}
        {pumps.length === 0 ? (
          <EmptyState
            icon={<Fuel className="h-12 w-12 text-blue-500" />}
            title="No fuel pumps yet"
            description={`Get started by adding your first fuel dispenser to ${station?.name || 'this station'}`}
            action={{
              label: "Add First Pump",
              onClick: () => setIsAddDialogOpen(true)
            }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-8">
            {pumps.map((pump) => (
              <FuelPumpCard
                key={pump.id}
                pump={{
                  id: pump.id,
                  name: pump.name,
                  serialNumber: pump.serialNumber,
                  status: pump.status as 'active' | 'maintenance' | 'inactive',
                  nozzleCount: pump.nozzleCount || 0
                }}
                onViewNozzles={handleViewNozzles}
                onDelete={handleDeletePump}
                needsAttention={pump.status === 'maintenance'}
              />
            ))}
          </div>
        )}

        {/* Add Pump Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-white border-2 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Add New Fuel Pump</DialogTitle>
              <DialogDescription className="text-slate-600">
                Add a new fuel dispenser to {station?.name || 'selected station'}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Pump Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter pump name" {...field} className="border-2" />
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
                      <FormLabel className="font-semibold">Serial Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter serial number" {...field} className="border-2" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsAddDialogOpen(false)}
                    className="border-2"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createPumpMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {createPumpMutation.isPending ? "Creating..." : "Create Pump"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title="Delete Fuel Pump"
          description="Are you sure you want to delete this fuel pump? This action cannot be undone and will also delete all associated nozzles."
          confirmText="Delete"
          variant="destructive"
          onConfirm={confirmDeletePump}
          onCancel={() => setPumpToDelete(null)}
        />
      </div>
    </div>
  );
}
