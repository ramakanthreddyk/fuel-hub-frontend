
/**
 * @file pages/dashboard/StationsPage.tsx
 * @description Modern stations management page with vibrant design and optimized space
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Building2, Loader2, Filter, Search, MapPin, Fuel, Activity, TrendingUp } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { Input } from '@/components/ui/input';
import { useStations, useDeleteStation } from '@/hooks/api/useStations';
import { useToast } from '@/hooks/use-toast';
import { useFuelPrices } from '@/hooks/api/useFuelPrices';
import { usePumps } from '@/hooks/api/usePumps';
import { useUnifiedStationData } from '@/store/stationStore';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

export default function StationsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [stationToDelete, setStationToDelete] = useState<string | null>(null);

  const { data: stations = [], isLoading } = useStations();
  const deleteStationMutation = useDeleteStation();

  const filteredStations = stations.filter(station =>
    station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    station.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteStation = (stationId: string) => {
    setStationToDelete(stationId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteStation = async () => {
    if (!stationToDelete) return;
    
    try {
      await deleteStationMutation.mutateAsync(stationToDelete);
      toast({
        title: 'Success',
        description: 'Station deleted successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete station',
        variant: 'destructive'
      });
    } finally {
      setStationToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50 flex items-center justify-center">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full bg-blue-600/20"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      <div className="space-y-6 p-4 sm:p-6">
        {/* Modern Header with Stats */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
          <div className="absolute -top-4 -right-4 h-32 w-32 rounded-full bg-white/10 blur-xl"></div>
          <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-purple-400/20 blur-2xl"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <Building2 className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">Station Network</h1>
                  <p className="text-blue-100 text-lg">Manage your fuel station empire</p>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="flex gap-6 mt-6">
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2 backdrop-blur-sm">
                  <Activity className="h-5 w-5 text-green-300" />
                  <span className="text-sm font-medium">{stations.filter(s => s.status === 'active').length} Active</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2 backdrop-blur-sm">
                  <TrendingUp className="h-5 w-5 text-blue-300" />
                  <span className="text-sm font-medium">{stations.length} Total Stations</span>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={() => navigate('/dashboard/stations/new')} 
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/20 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add New Station
            </Button>
          </div>
        </div>

        {/* Enhanced Search */}
        <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Filter className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Search & Filter</h3>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search stations by name, location, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl bg-white/80 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Stations Grid - Optimized Layout */}
        {filteredStations.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px] bg-white/50 backdrop-blur-sm rounded-2xl border border-white/50">
            <EmptyState
              icon={<Building2 className="h-20 w-20 text-blue-500" />}
              title={searchQuery ? "No stations found" : "No stations yet"}
              description={
                searchQuery 
                  ? "Try adjusting your search criteria"
                  : "Start building your fuel station network"
              }
              action={{
                label: "Add First Station",
                onClick: () => navigate('/dashboard/stations/new')
              }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {filteredStations.map((station) => (
              <ModernStationCard
                key={station.id}
                station={{
                  id: station.id,
                  name: station.name,
                  address: station.address,
                  status: (station.status as 'active' | 'maintenance' | 'inactive') || 'active',
                  pumpCount: station.pumpCount || 0,
                  rating: 4.5
                }}
                onView={(id) => navigate(`/dashboard/stations/${id}`)}
                onDelete={handleDeleteStation}
              />
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title="Delete Station"
          description="Are you sure you want to delete this station? This action cannot be undone and will also delete all associated pumps and nozzles."
          confirmText="Delete"
          variant="destructive"
          onConfirm={confirmDeleteStation}
          onCancel={() => setStationToDelete(null)}
        />
      </div>
    </div>
  );
}

// Modern Station Card Component
interface ModernStationCardProps {
  station: {
    id: string;
    name: string;
    address: string;
    status: 'active' | 'maintenance' | 'inactive';
    pumpCount: number;
    rating?: number;
  };
  onView: (stationId: string) => void;
  onDelete: (stationId: string) => void;
}

function ModernStationCard({ station, onView, onDelete }: ModernStationCardProps) {
  const { data: fuelPrices = [], isLoading: pricesLoading } = useFuelPrices(station.id);
  const { data: pumps = [] } = usePumps(station.id);
  // Get unified station data
  const { getStation } = useUnifiedStationData();
  const stationData = getStation(station.id);
  
  const todaySales = stationData?.todaySales || 0;
  const todayTransactions = stationData?.todayTransactions || 0;
  const activePumps = pumps.filter(p => p.status === 'active').length;
  
  const getStatusConfig = () => {
    switch (station.status) {
      case 'active':
        return {
          gradient: 'from-emerald-500 to-green-600',
          bgGradient: 'from-emerald-50 to-green-50',
          label: 'Operational',
          icon: '🟢'
        };
      case 'maintenance':
        return {
          gradient: 'from-orange-500 to-red-500',
          bgGradient: 'from-orange-50 to-red-50',
          label: 'Maintenance',
          icon: '🔧'
        };
      case 'inactive':
        return {
          gradient: 'from-gray-500 to-slate-600',
          bgGradient: 'from-gray-50 to-slate-50',
          label: 'Offline',
          icon: '⭕'
        };
      default:
        return {
          gradient: 'from-blue-500 to-indigo-600',
          bgGradient: 'from-blue-50 to-indigo-50',
          label: 'Unknown',
          icon: '❓'
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="group relative bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-[1.02] hover:-translate-y-2">
      {/* Status Indicator */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${statusConfig.gradient}`}></div>
      <div className={`absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center ${statusConfig.gradient === 'from-emerald-500 to-green-600' ? 'bg-green-500' : statusConfig.gradient === 'from-orange-500 to-red-500' ? 'bg-orange-500' : 'bg-gray-500'} shadow-lg z-10`}>
        <span className="text-white text-sm">{statusConfig.icon}</span>
      </div>
      
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${statusConfig.gradient} flex items-center justify-center shadow-lg`}>
              <Building2 className="h-7 w-7 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-xl text-gray-900 truncate">{station.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{station.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Badge removed */}
      </div>

      {/* Enhanced Station Visual */}
      <div className="px-6 pb-4">
        <div className="relative bg-gradient-to-br from-slate-100 to-blue-100 rounded-xl p-4 overflow-hidden">
          {/* Modern Station Building */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              {/* Canopy */}
              <div className="absolute -top-2 -left-8 -right-8 h-4 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-t-xl shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-white/20 rounded-t-xl"></div>
              </div>
              
              {/* Building */}
              <div className="w-24 h-16 bg-gradient-to-b from-white to-gray-100 rounded-lg shadow-xl border border-gray-200 relative">
                {/* Brand Sign */}
                <div className={`absolute top-1 left-1 right-1 h-4 bg-gradient-to-r ${statusConfig.gradient} rounded-md flex items-center justify-center`}>
                  <div className="text-[8px] font-bold text-white truncate px-1">
                    {station.name.slice(0, 8)}
                  </div>
                </div>
                
                {/* Windows */}
                <div className="absolute top-6 left-2 right-2 grid grid-cols-3 gap-1">
                  {Array.from({ length: 6 }, (_, i) => (
                    <div key={i} className="h-1.5 bg-blue-100 rounded-sm border border-blue-200"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Modern Fuel Pumps */}
          <div className="flex justify-center gap-3">
            {Array.from({ length: Math.min(station.pumpCount, 4) }, (_, i) => {
              // Get fuel price for this pump if available
              const fuelType = i % 3 === 0 ? 'petrol' : i % 3 === 1 ? 'diesel' : 'premium';
              const fuelPrice = fuelPrices.find(p => p.fuelType?.toLowerCase() === fuelType);
              const price = fuelPrice ? fuelPrice.price : (85 + Math.random() * 15);
              
              return (
                <div key={i} className="relative group/pump">
                  <div className="w-6 h-12 bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-lg relative transform hover:scale-105 transition-transform">
                    {/* Digital Display */}
                    <div className="absolute top-1 left-0.5 right-0.5 h-3 bg-green-400 rounded-sm animate-pulse">
                      <div className="text-[6px] text-black font-mono text-center leading-3">
                        ₹{price?.toFixed(1)}
                      </div>
                    </div>
                    
                    {/* Fuel Indicators */}
                    <div className="absolute top-5 left-1 right-1 flex justify-between">
                      <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                      <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                    </div>
                    
                    {/* Nozzle */}
                    <div className="absolute right-0 top-6 w-1 h-4 bg-gray-600 rounded-l-sm">
                      <div className="absolute -right-1 top-1 w-1 h-2 bg-gray-500 rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Fuel Type */}
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-[6px] font-medium text-gray-600 text-center">
                    {fuelType.charAt(0).toUpperCase() + fuelType.slice(1)}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Pump Count Badge */}
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-xs font-semibold text-gray-700 shadow-sm">
            {station.pumpCount} Pumps
          </div>
        </div>
      </div>

      {/* Quick Stats - Reorganized to prevent overflow */}
      <div className="px-6 pb-4">
        {/* Today's Sales - Full Width Row */}
        <div className="mb-3 text-center p-2 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
          <div className="text-xs text-green-600 mb-1">Today's Sales</div>
          <div className="text-lg font-bold text-green-700 truncate">
            {todaySales > 0 ? (
              formatCurrency(todaySales, { maximumFractionDigits: 0 })
            ) : (
              'No Sales'
            )}
          </div>
          {todaySales === 0 && (
            <div className="text-xs text-gray-500">No transactions today</div>
          )}
        </div>
        
        {/* Other Stats in 2-column Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <div className="text-lg font-bold text-blue-700">{formatNumber(todayTransactions)}</div>
            <div className="text-xs text-blue-600">Sales</div>
          </div>
          <div className="text-center p-2 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-100">
            <div className="text-lg font-bold text-purple-700">{activePumps}/{station.pumpCount}</div>
            <div className="text-xs text-purple-600">Active Pumps</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 pt-0 flex gap-3">
        <Button
          onClick={() => onView(station.id)}
          className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
        >
          <Activity className="mr-2 h-4 w-4" />
          Manage
        </Button>
        <Button
          onClick={() => onDelete(station.id)}
          variant="outline"
          className="px-4 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-xl transition-all duration-300"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </Button>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500 pointer-events-none rounded-2xl"></div>
    </div>
  );
}
