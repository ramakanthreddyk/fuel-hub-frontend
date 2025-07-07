
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Fuel, Eye, Trash2, MapPin } from 'lucide-react';

interface Nozzle {
  id: string;
  nozzleNumber: number;
  fuelType: string;
  status: 'active' | 'maintenance' | 'inactive';
  stationName?: string;
  pumpName?: string;
  lastReading?: number;
}

interface ModernNozzleCardProps {
  nozzle: Nozzle;
  onView?: (nozzleId: string) => void;
  onDelete?: (nozzleId: string) => void;
  onRecord?: (nozzleId: string) => void;
}

export function ModernNozzleCard({ nozzle, onView, onDelete, onRecord }: ModernNozzleCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getFuelTypeColor = (fuelType: string) => {
    switch (fuelType.toLowerCase()) {
      case 'petrol': return 'text-green-700';
      case 'diesel': return 'text-blue-700';
      case 'premium': return 'text-purple-700';
      default: return 'text-gray-700';
    }
  };

  return (
    <Card className="bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-50">
              <Fuel className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Nozzle #{nozzle.nozzleNumber}
              </h3>
              <p className="text-sm text-gray-500">
                {nozzle.fuelType} Dispenser
              </p>
            </div>
          </div>
          <Badge className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(nozzle.status)}`}>
            {nozzle.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Station Info */}
        {nozzle.stationName && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{nozzle.stationName}</span>
            {nozzle.pumpName && <span>• {nozzle.pumpName}</span>}
          </div>
        )}

        {/* Nozzle Display */}
        <div className="flex justify-center py-4">
          <div className="relative">
            <div className="w-24 h-32 bg-gradient-to-b from-gray-400 to-gray-600 rounded-lg shadow-lg flex items-center justify-center">
              <div className="bg-gray-800 text-white px-2 py-1 rounded text-sm font-bold">
                #{nozzle.nozzleNumber}
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
          </div>
        </div>

        {/* Reading Info */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-sm text-blue-600 font-medium mb-1">Last Reading</div>
            <div className="text-lg font-bold text-gray-900">
              {nozzle.lastReading ? nozzle.lastReading.toFixed(3) : 'N/A'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-green-600 font-medium mb-1">Fuel Type</div>
            <div className={`text-lg font-bold capitalize ${getFuelTypeColor(nozzle.fuelType)}`}>
              {nozzle.fuelType}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {onRecord && (
            <Button 
              onClick={() => onRecord(nozzle.id)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg"
            >
              Record
            </Button>
          )}
          {onView && (
            <Button 
              onClick={() => onView(nozzle.id)}
              variant="outline"
              size="sm"
              className="rounded-lg border-gray-300"
            >
              <Eye className="w-4 h-4" />
            </Button>
          )}
          {onDelete && (
            <Button 
              onClick={() => onDelete(nozzle.id)}
              variant="outline"
              size="sm"
              className="rounded-lg border-red-300 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
