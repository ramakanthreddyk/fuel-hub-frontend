
/**
 * @file components/pumps/PumpCard.tsx
 * @description Enhanced pump card component with realistic fuel station design
 * Updated for immersive fuel station UI – 2025-07-04
 */
import type { Pump } from '@/api/api-contract';
import { Button } from '@/components/ui/button';
import { Eye, Settings, Hash, Activity } from 'lucide-react';
import { ColorfulCard, CardContent, CardHeader } from '@/components/ui/colorful-card';
import { StatusBadge } from '@/components/ui/status-badge';

interface PumpCardProps {
  pump: Pump & { nozzleCount: number; serialNumber?: string };
  onViewNozzles: (id: string) => void;
  onSettings: (id: string) => void;
}

export function PumpCard({ pump, onViewNozzles, onSettings }: Readonly<PumpCardProps>) {
  const getGradientByStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'from-green-50 via-emerald-50 to-teal-50 border-green-200';
      case 'maintenance':
        return 'from-orange-50 via-red-50 to-pink-50 border-orange-200';
      case 'inactive':
        return 'from-red-50 via-pink-50 to-rose-50 border-red-200';
      default:
        return 'from-gray-50 via-slate-50 to-zinc-50 border-gray-200';
    }
  };

  const getPumpIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return '⛽';
      case 'maintenance':
        return '🔧';
      case 'inactive':
        return '🚫';
      default:
        return '⛽';
    }
  };

  return (
    <ColorfulCard 
      gradient={getGradientByStatus(pump.status)}
      className="border group hover:shadow-2xl"
    >
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="relative">
                <div className="p-3 bg-slate-800 rounded-xl shadow-lg">
                  <span className="text-2xl">{getPumpIcon(pump.status)}</span>
                </div>
                {pump.status === 'active' && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-gray-900 text-lg truncate group-hover:text-blue-700 transition-colors">
                  {pump.name}
                </h3>
                {pump.serialNumber && (
                  <p className="text-xs text-gray-600 font-mono truncate mt-1">
                    SN: {pump.serialNumber}
                  </p>
                )}
              </div>
            </div>
            <StatusBadge status={pump.status} size="sm" />
          </div>

          {/* Stats Rows */}
          <div className="space-y-2">
            <div className="bg-white/60 rounded-lg p-3 backdrop-blur-sm border border-white/30">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-blue-600" />
                  <p className="text-xs text-gray-600">Nozzles</p>
                </div>
                <p className="font-bold text-gray-900 text-lg ml-6">{pump.nozzleCount}</p>
              </div>
            </div>
            
            <div className="bg-white/60 rounded-lg p-3 backdrop-blur-sm border border-white/30">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-green-600" />
                  <p className="text-xs text-gray-600">Status</p>
                </div>
                <p className="font-bold text-gray-900 text-sm capitalize ml-6">{pump.status}</p>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex gap-2">
          <Button 
            onClick={() => onViewNozzles(pump.id)}
            size="sm" 
            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white shadow-md"
          >
            <Eye className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">View Nozzles</span>
            <span className="sm:hidden">Nozzles</span>
          </Button>
          <Button 
            onClick={() => onSettings(pump.id)}
            size="sm" 
            variant="outline"
            className="bg-white/60 backdrop-blur-sm border border-gray-300 hover:bg-white/80"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </ColorfulCard>
  );
}
