
/**
 * @file pages/dashboard/StationsPage.tsx
 * @description Redesigned stations page with creative card designs and dark mode support
 */
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Building2, Loader2, MapPin, Fuel, Settings, Activity, BarChart3, DollarSign, Zap, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStations, useDeleteStation } from '@/hooks/api/useStations';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { cn } from '@/lib/utils';

export default function StationsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: stations = [], isLoading } = useStations();
  const deleteStationMutation = useDeleteStation();
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [stationToDelete, setStationToDelete] = useState<string | null>(null);

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

  const getStationGradient = (index: number) => {
    const gradients = [
      'from-violet-500 via-purple-500 to-pink-500',
      'from-cyan-500 via-blue-500 to-indigo-500',
      'from-emerald-500 via-green-500 to-teal-500',
      'from-orange-500 via-red-500 to-pink-500',
      'from-yellow-500 via-orange-500 to-red-500',
      'from-indigo-500 via-purple-500 to-pink-500'
    ];
    return gradients[index % gradients.length];
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { 
          icon: Zap, 
          color: 'text-emerald-400', 
          bg: 'bg-emerald-500/30 border-emerald-500/50',
          glow: 'shadow-emerald-500/20'
        };
      case 'maintenance':
        return { 
          icon: Settings, 
          color: 'text-amber-400', 
          bg: 'bg-amber-500/30 border-amber-500/50',
          glow: 'shadow-amber-500/20'
        };
      case 'inactive':
        return { 
          icon: Activity, 
          color: 'text-red-400', 
          bg: 'bg-red-500/30 border-red-500/50',
          glow: 'shadow-red-500/20'
        };
      default:
        return { 
          icon: Activity, 
          color: 'text-gray-400', 
          bg: 'bg-gray-500/30 border-gray-500/50',
          glow: 'shadow-gray-500/20'
        };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black dark:from-gray-900 dark:via-slate-900 dark:to-black flex items-center justify-center">
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
              ⛽ Fuel Station Network
            </h1>
            <p className="text-slate-400 text-lg">Manage your empire of fuel stations</p>
          </div>
          
          <Button 
            onClick={() => navigate('/dashboard/stations/new')} 
            className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold px-8 py-4 rounded-2xl shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <Plus className="mr-2 h-5 w-5" />
            Add Station
          </Button>
        </div>

        {/* Stations Grid */}
        {stations.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <EmptyState
              icon={<Building2 className="h-16 w-16 text-cyan-400" />}
              title="No stations yet"
              description="Begin your fuel empire by adding your first station"
              action={{
                label: "Launch First Station",
                onClick: () => navigate('/dashboard/stations/new')
              }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 pb-8">
            {stations.map((station, index) => {
              const statusConfig = getStatusConfig(station.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <div
                  key={station.id}
                  className={cn(
                    "group relative overflow-hidden rounded-3xl border backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] cursor-pointer",
                    "bg-slate-800/80 dark:bg-slate-900/80 border-slate-600/30 dark:border-slate-700/30",
                    "shadow-2xl hover:shadow-3xl",
                    statusConfig.glow
                  )}
                  onClick={() => navigate(`/dashboard/stations/${station.id}`)}
                >
                  {/* Animated Background */}
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity duration-500",
                    getStationGradient(index)
                  )}></div>
                  
                  {/* Floating Station Icon */}
                  <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300 z-10">
                    <Building2 className="h-6 w-6 text-white/80" />
                  </div>
                  
                  <div className="relative p-8 space-y-6">
                    {/* Header */}
                    <div className="space-y-3">
                      <div className="flex items-start justify-between pr-16">
                        <div className="space-y-2 flex-1 min-w-0">
                          <h3 className="font-bold text-2xl text-white dark:text-white truncate">
                            {station.name}
                          </h3>
                          <p className="text-slate-300 dark:text-slate-300 flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{station.address}</span>
                          </p>
                        </div>
                      </div>
                      
                      <div className={cn(
                        "inline-flex px-3 py-1 rounded-full border items-center gap-2 backdrop-blur-sm z-20 relative",
                        statusConfig.bg
                      )}>
                        <StatusIcon className={cn("w-3 h-3", statusConfig.color)} />
                        <span className={cn("text-xs font-semibold", statusConfig.color)}>
                          {station.status}
                        </span>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/20 dark:bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30 dark:border-white/30">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-xl bg-blue-500/30 dark:bg-blue-500/30">
                            <Fuel className="h-5 w-5 text-blue-400 dark:text-blue-400" />
                          </div>
                          <span className="text-sm font-semibold text-slate-200 dark:text-slate-200">Pumps</span>
                        </div>
                        <div className="text-2xl font-bold text-white dark:text-white">
                          {station.pumpCount || 0}
                        </div>
                        <div className="text-xs text-slate-400 dark:text-slate-400 mt-1">
                          {station.activePumps || 0} active
                        </div>
                      </div>
                      
                      <div className="bg-white/20 dark:bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30 dark:border-white/30">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-xl bg-emerald-500/30 dark:bg-emerald-500/30">
                            <Star className="h-5 w-5 text-emerald-400 dark:text-emerald-400" />
                          </div>
                          <span className="text-sm font-semibold text-slate-200 dark:text-slate-200">Rating</span>
                        </div>
                        <div className="text-2xl font-bold text-white dark:text-white">
                          {station.efficiency || 0}%
                        </div>
                        <div className="text-xs text-slate-400 dark:text-slate-400 mt-1">
                          Performance
                        </div>
                      </div>
                    </div>

                    {/* Revenue Section */}
                    {(station.todaySales || station.monthlySales) && (
                      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 dark:from-purple-500/20 dark:to-pink-500/20 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/30 dark:border-purple-500/30">
                        <div className="flex items-center gap-2 mb-3">
                          <DollarSign className="h-5 w-5 text-purple-400 dark:text-purple-400" />
                          <span className="text-sm font-semibold text-purple-200 dark:text-purple-200">Revenue Performance</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {station.todaySales && (
                            <div className="text-center">
                              <div className="text-xl font-bold text-white dark:text-white">
                                ₹{station.todaySales.toLocaleString()}
                              </div>
                              <div className="text-xs text-purple-300 dark:text-purple-300">Today</div>
                            </div>
                          )}
                          {station.monthlySales && (
                            <div className="text-center">
                              <div className="text-xl font-bold text-white dark:text-white">
                                ₹{station.monthlySales.toLocaleString()}
                              </div>
                              <div className="text-xs text-purple-300 dark:text-purple-300">This Month</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 bg-white/20 dark:bg-white/20 backdrop-blur-sm border-white/30 dark:border-white/30 text-white dark:text-white hover:bg-white/30 dark:hover:bg-white/30 hover:border-white/40 dark:hover:border-white/40"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/dashboard/stations/${station.id}/edit`);
                        }}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Manage
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 bg-white/20 dark:bg-white/20 backdrop-blur-sm border-white/30 dark:border-white/30 text-white dark:text-white hover:bg-white/30 dark:hover:bg-white/30 hover:border-white/40 dark:hover:border-white/40"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/dashboard/pumps?stationId=${station.id}`);
                        }}
                      >
                        <Fuel className="w-4 h-4 mr-2" />
                        Pumps
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
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
