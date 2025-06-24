
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Fuel, Gauge, Settings, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Pump {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'maintenance';
  nozzleCount: number;
  fuelType: string;
  lastReading?: {
    totalizer: number;
    timestamp: string;
  };
}

interface FuelPumpCardProps {
  pump: Pump;
  onViewNozzles?: (pumpId: string) => void;
  onSettings?: (pumpId: string) => void;
}

export function FuelPumpCard({ pump, onViewNozzles, onSettings }: FuelPumpCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'maintenance':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getFuelTypeColor = (fuelType: string) => {
    switch (fuelType.toLowerCase()) {
      case 'petrol':
      case 'gasoline':
        return 'from-green-400 to-emerald-500';
      case 'diesel':
        return 'from-yellow-400 to-orange-500';
      case 'premium':
        return 'from-purple-400 to-violet-500';
      default:
        return 'from-blue-400 to-indigo-500';
    }
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className={cn(
              "relative p-4 rounded-2xl bg-gradient-to-br shadow-lg",
              getFuelTypeColor(pump.fuelType)
            )}>
              <Fuel className="h-8 w-8 text-white" />
              {pump.status === 'maintenance' && (
                <div className="absolute -top-1 -right-1 p-1 bg-amber-500 rounded-full">
                  <AlertTriangle className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{pump.name}</h3>
              <p className="text-sm text-muted-foreground font-medium">{pump.fuelType}</p>
            </div>
          </CardTitle>
          <Badge className={cn("border font-medium", getStatusColor(pump.status))}>
            {pump.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Fuel Pump Visual */}
        <div className="relative">
          <div className="bg-gradient-to-b from-gray-100 to-gray-200 rounded-2xl p-6 shadow-inner">
            {/* Pump Body */}
            <div className="relative mx-auto w-24 h-32 bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-lg">
              {/* Display Screen */}
              <div className="absolute top-4 left-2 right-2 h-12 bg-black rounded border-2 border-gray-600 flex items-center justify-center">
                <div className="text-green-400 font-mono text-xs text-center">
                  <div className="text-[10px] opacity-75">TOTAL L</div>
                  <div className="font-bold">
                    {pump.lastReading?.totalizer?.toLocaleString() || '0'}
                  </div>
                </div>
              </div>
              
              {/* Nozzle Holders */}
              <div className="absolute -right-6 top-20 space-y-2">
                {Array.from({ length: pump.nozzleCount }, (_, i) => (
                  <div key={i} className="relative">
                    <div className="w-8 h-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-r-full shadow-md"></div>
                    <div className="absolute -right-4 top-1 w-6 h-2 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full"></div>
                  </div>
                ))}
              </div>
              
              {/* Base */}
              <div className="absolute -bottom-2 -left-2 -right-2 h-6 bg-gradient-to-b from-gray-700 to-gray-800 rounded-b-lg"></div>
            </div>
          </div>
        </div>

        {/* Pump Statistics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
            <Gauge className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <div className="text-lg font-bold text-blue-700">{pump.nozzleCount}</div>
            <div className="text-xs text-muted-foreground font-medium">Nozzles</div>
          </div>
          
          <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
            <div className="text-lg font-bold text-green-700">
              {pump.lastReading ? 'Active' : 'Idle'}
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              {pump.lastReading ? 'Last Reading' : 'Status'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {onViewNozzles && (
            <Button 
              onClick={() => onViewNozzles(pump.id)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              size="sm"
            >
              <Gauge className="h-4 w-4 mr-2" />
              View Nozzles
            </Button>
          )}
          
          {onSettings && (
            <Button 
              onClick={() => onSettings(pump.id)}
              variant="outline"
              size="sm"
              className="hover:bg-gray-50"
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}
        </div>

        {pump.lastReading && (
          <div className="text-xs text-muted-foreground text-center pt-2 border-t">
            Last reading: {new Date(pump.lastReading.timestamp).toLocaleString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
