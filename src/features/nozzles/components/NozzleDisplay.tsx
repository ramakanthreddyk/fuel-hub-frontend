
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Droplets, Activity, Settings, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Nozzle {
  id: string;
  name: string;
  fuelType: string;
  status: 'active' | 'inactive' | 'dispensing' | 'maintenance';
  currentReading?: number;
  lastReading?: number;
  flowRate?: number;
}

interface NozzleDisplayProps {
  nozzle: Nozzle;
  onTakeReading?: (nozzleId: string) => void;
  onSettings?: (nozzleId: string) => void;
}

export function NozzleDisplay({ nozzle, onTakeReading, onSettings }: NozzleDisplayProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'dispensing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
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
        return 'from-orange-400 to-red-500';
      case 'premium':
        return 'from-purple-400 to-violet-500';
      default:
        return 'from-blue-400 to-indigo-500';
    }
  };

  const isDispensing = nozzle.status === 'dispensing';

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className={cn(
              "relative p-3 rounded-xl bg-gradient-to-br shadow-lg",
              getFuelTypeColor(nozzle.fuelType)
            )}>
              <Droplets className={cn(
                "h-6 w-6 text-white transition-all duration-300",
                isDispensing && "animate-pulse"
              )} />
              {isDispensing && (
                <div className="absolute -top-1 -right-1 p-1 bg-blue-500 rounded-full animate-pulse">
                  <Activity className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                Nozzle {nozzle.name}
              </h3>
              <p className="text-sm text-muted-foreground font-medium">{nozzle.fuelType}</p>
            </div>
          </CardTitle>
          <Badge className={cn("border font-medium", getStatusColor(nozzle.status))}>
            {nozzle.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Nozzle Visual */}
        <div className="relative">
          <div className="bg-gradient-to-b from-gray-100 to-gray-200 rounded-2xl p-6 shadow-inner">
            {/* Nozzle Hose and Handle */}
            <div className="flex items-center justify-center">
              <div className="relative">
                {/* Hose */}
                <div className="w-32 h-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full shadow-lg"></div>
                
                {/* Nozzle Handle */}
                <div className="absolute -right-8 -top-4 w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg">
                  <div className="absolute top-2 left-2 w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-md"></div>
                  
                  {/* Digital Display on Nozzle */}
                  <div className="absolute -top-8 left-1 w-10 h-6 bg-black rounded border border-gray-600 flex items-center justify-center">
                    <div className="text-green-400 font-mono text-[8px] text-center">
                      <div className={cn(
                        "font-bold transition-all duration-300",
                        isDispensing && "animate-pulse text-blue-400"
                      )}>
                        {Number(nozzle.currentReading ?? 0).toFixed(3)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Flow indicator */}
                  {isDispensing && (
                    <div className="absolute -bottom-2 left-4 w-4 h-4 bg-blue-500 rounded-full animate-bounce">
                      <Droplets className="h-3 w-3 text-white m-0.5" />
                    </div>
                  )}
                </div>
                
                {/* Connection point */}
                <div className="absolute -left-4 top-1 w-6 h-2 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Reading Display */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-700">
                {Number(nozzle.currentReading ?? 0).toFixed(3)}
              </div>
              <div className="text-xs text-muted-foreground font-medium">Current Reading (L)</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <div className="text-2xl font-bold text-green-700">
                {Number(nozzle.lastReading ?? 0).toFixed(3)}
              </div>
              <div className="text-xs text-muted-foreground font-medium">Last Reading (L)</div>
            </div>
          </div>

          {nozzle.flowRate && (
            <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Zap className="h-4 w-4 text-purple-600" />
                <span className="text-lg font-bold text-purple-700">
                  {nozzle.flowRate.toFixed(1)} L/min
                </span>
              </div>
              <div className="text-xs text-muted-foreground font-medium">Flow Rate</div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {onTakeReading && (
            <Button 
              onClick={() => onTakeReading(nozzle.id)}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              size="sm"
              disabled={nozzle.status === 'maintenance'}
            >
              <Activity className="h-4 w-4 mr-2" />
              Take Reading
            </Button>
          )}
          
          {onSettings && (
            <Button 
              onClick={() => onSettings(nozzle.id)}
              variant="outline"
              size="sm"
              className="hover:bg-gray-50"
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}
        </div>

        {isDispensing && (
          <div className="text-center p-2 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm font-semibold text-blue-800 flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              Currently Dispensing Fuel
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
