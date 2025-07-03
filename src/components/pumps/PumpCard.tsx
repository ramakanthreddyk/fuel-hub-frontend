
/**
 * @file components/pumps/PumpCard.tsx
 * @description Enhanced pump card component with colorful design and mobile-responsive layout
 * Updated for responsive colorful UI – 2025-07-03
 */
import { Button } from '@/components/ui/button';
import { Eye, Settings, Building2, Hash } from 'lucide-react';
import { ColorfulCard, CardContent, CardHeader } from '@/components/ui/colorful-card';
import { StatusBadge } from '@/components/ui/status-badge';

interface PumpCardProps {
  pump: {
    id: string;
    name: string;
    serialNumber?: string;
    status: string;
    nozzleCount: number;
  };
  onViewNozzles: (id: string) => void;
  onSettings: (id: string) => void;
}

export function PumpCard({ pump, onViewNozzles, onSettings }: PumpCardProps) {
  const getGradientByStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'from-green-50 via-emerald-50 to-teal-50 border-green-200';
      case 'maintenance':
        return 'from-yellow-50 via-orange-50 to-amber-50 border-yellow-200';
      case 'inactive':
        return 'from-red-50 via-pink-50 to-rose-50 border-red-200';
      default:
        return 'from-gray-50 via-slate-50 to-zinc-50 border-gray-200';
    }
  };

  return (
    <ColorfulCard 
      gradient={getGradientByStatus(pump.status)}
      className="border"
    >
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900 text-base sm:text-lg truncate">
                  {pump.name}
                </h3>
                {pump.serialNumber && (
                  <p className="text-xs text-gray-600 font-mono truncate">
                    SN: {pump.serialNumber}
                  </p>
                )}
              </div>
            </div>
            <StatusBadge status={pump.status} size="sm" />
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/60 rounded-lg p-2 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-600">Nozzles</p>
                  <p className="font-bold text-gray-900">{pump.nozzleCount}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/60 rounded-lg p-2 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-600">Status</p>
                  <p className="font-bold text-gray-900 capitalize text-sm">{pump.status}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md"
            onClick={() => onViewNozzles(pump.id)}
          >
            <Eye className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">View Nozzles</span>
            <span className="sm:hidden">Nozzles</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="bg-white/80 backdrop-blur-sm hover:bg-white border-gray-300 hover:border-gray-400"
            onClick={() => onSettings(pump.id)}
          >
            <Settings className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Settings</span>
          </Button>
        </div>
      </CardContent>
    </ColorfulCard>
  );
}
