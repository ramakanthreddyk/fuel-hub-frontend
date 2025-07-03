
/**
 * @file components/nozzles/NozzleCard.tsx
 * @description Enhanced nozzle card component with colorful design and mobile-responsive layout
 * Updated for responsive colorful UI – 2025-07-03
 */
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Activity, Hash } from 'lucide-react';
import { ColorfulCard, CardContent, CardHeader } from '@/components/ui/colorful-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { FuelBadge } from '@/components/ui/fuel-badge';

interface NozzleCardProps {
  nozzle: {
    id: string;
    nozzleNumber: number;
    fuelType: string;
    status: string;
    serialNumber?: string;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onRecordReading: (id: string) => void;
}

export function NozzleCard({ nozzle, onEdit, onDelete, onRecordReading }: NozzleCardProps) {
  const getGradientByFuelType = (fuelType: string) => {
    switch (fuelType.toLowerCase()) {
      case 'petrol':
        return 'from-green-50 via-emerald-50 to-teal-50 border-green-200';
      case 'diesel':
        return 'from-orange-50 via-amber-50 to-yellow-50 border-orange-200';
      case 'premium':
        return 'from-purple-50 via-indigo-50 to-blue-50 border-purple-200';
      default:
        return 'from-gray-50 via-slate-50 to-zinc-50 border-gray-200';
    }
  };

  return (
    <ColorfulCard 
      gradient={getGradientByFuelType(nozzle.fuelType)}
      className="border"
    >
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Hash className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900 text-base sm:text-lg">
                  Nozzle #{nozzle.nozzleNumber}
                </h3>
                {nozzle.serialNumber && (
                  <p className="text-xs text-gray-600 font-mono truncate">
                    SN: {nozzle.serialNumber}
                  </p>
                )}
              </div>
            </div>
            <StatusBadge status={nozzle.status} size="sm" />
          </div>

          {/* Fuel Type and Stats Row */}
          <div className="flex flex-col gap-2">
            <FuelBadge fuelType={nozzle.fuelType} size="md" />
            
            <div className="bg-white/60 rounded-lg p-2 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-600">Current Status</p>
                  <p className="font-bold text-gray-900 capitalize">{nozzle.status}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex flex-col gap-2">
          <Button 
            variant="default" 
            size="sm" 
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md"
            onClick={() => onRecordReading(nozzle.id)}
            disabled={nozzle.status !== 'active'}
          >
            <Activity className="w-4 h-4 mr-2" />
            {nozzle.status === 'active' ? 'Record Reading' : 'Unavailable'}
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1 bg-white/80 backdrop-blur-sm hover:bg-white border-gray-300 hover:border-gray-400"
              onClick={() => onEdit(nozzle.id)}
            >
              <Edit className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1 bg-white/80 backdrop-blur-sm hover:bg-red-50 border-gray-300 hover:border-red-400 text-red-600 hover:text-red-700"
              onClick={() => onDelete(nozzle.id)}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Delete</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </ColorfulCard>
  );
}
