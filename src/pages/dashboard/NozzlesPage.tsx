
/**
 * @file pages/dashboard/NozzlesPage.tsx
 * @description Redesigned nozzles page with creative cards and dark mode support
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Droplets, Loader2, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNozzles, useDeleteNozzle } from '@/hooks/api/useNozzles';
import { usePumps } from '@/hooks/api/usePumps';
import { useStations } from '@/hooks/api/useStations';
import { useToast } from '@/hooks/use-toast';
import { FuelNozzleCard } from '@/components/nozzles/FuelNozzleCard';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { StationSelector } from '@/components/filters/StationSelector';

export default function NozzlesPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedStation, setSelectedStation] = useState<string | undefined>();
  const [selectedPump, setSelectedPump] = useState<string | undefined>();
  const [fuelTypeFilter, setFuelTypeFilter] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [nozzleToDelete, setNozzleToDelete] = useState<string | null>(null);

  const { data: nozzles = [], isLoading } = useNozzles(selectedPump);
  const { data: pumps = [] } = usePumps(selectedStation);
  const { data: stations = [] } = useStations();
  const deleteNozzleMutation = useDeleteNozzle();

  const filteredNozzles = nozzles.filter(nozzle => {
    const matchesSearch = nozzle.nozzleNumber?.toString().includes(searchQuery) ||
                         nozzle.fuelType?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFuelType = !fuelTypeFilter || nozzle.fuelType === fuelTypeFilter;
    return matchesSearch && matchesFuelType;
  });

  const handleDeleteNozzle = (nozzleId: string) => {
    setNozzleToDelete(nozzleId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteNozzle = async () => {
    if (!nozzleToDelete) return;
    
    try {
      await deleteNozzleMutation.mutateAsync(nozzleToDelete);
      toast({
        title: 'Success',
        description: 'Nozzle deleted successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete nozzle',
        variant: 'destructive'
      });
    } finally {
      setNozzleToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black dark:from-gray-950 dark:via-slate-950 dark:to-black flex items-center justify-center">
        <div className="relative">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          <div className="absolute inset-0 h-8 w-8 animate-ping rounded-full bg-cyan-400/20"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black dark:from-gray-950 dark:via-slate-950 dark:to-black">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              🛢️ Fuel Nozzle Control
            </h1>
            <p className="text-slate-400 text-lg">Precision fuel dispensing at your fingertips</p>
          </div>
          
          <Button 
            onClick={() => navigate('/dashboard/nozzles/new')} 
            className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold px-8 py-4 rounded-2xl shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <Plus className="mr-2 h-5 w-5" />
            Add Nozzle
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white/10 dark:bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-white/20 p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="h-5 w-5 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white dark:text-white">Filter Nozzles</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search nozzles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 dark:bg-white/10 border-white/20 dark:border-white/20 text-white dark:text-white placeholder:text-slate-400 rounded-xl"
              />
            </div>
            
            <StationSelector
              value={selectedStation}
              onChange={setSelectedStation}
              showAll={true}
              placeholder="All Stations"
              className="bg-white/10 dark:bg-white/10 border-white/20 dark:border-white/20 text-white dark:text-white rounded-xl"
            />
            
            <Select value={selectedPump || ''} onValueChange={(val) => setSelectedPump(val || undefined)}>
              <SelectTrigger className="bg-white/10 dark:bg-white/10 border-white/20 dark:border-white/20 text-white dark:text-white rounded-xl">
                <SelectValue placeholder="All Pumps" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="">All Pumps</SelectItem>
                {pumps.map((pump) => (
                  <SelectItem key={pump.id} value={pump.id} className="text-white">
                    {pump.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={fuelTypeFilter || ''} onValueChange={(val) => setFuelTypeFilter(val || undefined)}>
              <SelectTrigger className="bg-white/10 dark:bg-white/10 border-white/20 dark:border-white/20 text-white dark:text-white rounded-xl">
                <SelectValue placeholder="All Fuel Types" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="">All Fuel Types</SelectItem>
                <SelectItem value="petrol" className="text-white">⛽ Petrol</SelectItem>
                <SelectItem value="diesel" className="text-white">🛢️ Diesel</SelectItem>
                <SelectItem value="premium" className="text-white">✨ Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Nozzles Grid */}
        {filteredNozzles.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <EmptyState
              icon={<Droplets className="h-16 w-16 text-cyan-400" />}
              title={searchQuery || selectedPump || fuelTypeFilter ? "No nozzles found" : "No nozzles yet"}
              description={
                searchQuery || selectedPump || fuelTypeFilter
                  ? "Try adjusting your search or filter criteria"
                  : "Begin with your first fuel dispensing nozzle"
              }
              action={{
                label: "Add First Nozzle",
                onClick: () => navigate('/dashboard/nozzles/new')
              }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 pb-8">
            {filteredNozzles.map((nozzle) => {
              const pump = pumps.find(p => p.id === nozzle.pumpId);
              const pumpName = pump?.name;
              
              return (
                <FuelNozzleCard
                  key={nozzle.id}
                  nozzle={{
                    id: nozzle.id,
                    nozzleNumber: nozzle.nozzleNumber || 0,
                    fuelType: (nozzle.fuelType as 'petrol' | 'diesel' | 'premium') || 'petrol',
                    status: (nozzle.status as 'active' | 'maintenance' | 'inactive') || 'inactive',
                    lastReading: undefined,
                    pumpName
                  }}
                  onEdit={(id) => navigate(`/dashboard/nozzles/${id}/edit`)}
                  onDelete={handleDeleteNozzle}
                  onRecordReading={(id) => navigate(`/dashboard/nozzles/${id}/readings/new`)}
                />
              );
            })}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title="Delete Nozzle"
          description="Are you sure you want to delete this nozzle? This action cannot be undone and will also delete all associated readings."
          confirmText="Delete"
          variant="destructive"
          onConfirm={confirmDeleteNozzle}
          onCancel={() => setNozzleToDelete(null)}
        />
      </div>
    </div>
  );
}
