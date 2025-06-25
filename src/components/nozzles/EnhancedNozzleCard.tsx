
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Activity, AlertTriangle, Plus } from 'lucide-react';
import { Nozzle } from '@/api/nozzles';

interface EnhancedNozzleCardProps {
  nozzle: Nozzle;
  onTakeReading: (nozzleId: string) => void;
}

export function EnhancedNozzleCard({ nozzle, onTakeReading }: EnhancedNozzleCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFuelTypeColor = (fuelType: string) => {
    switch (fuelType) {
      case 'petrol': return 'text-blue-600';
      case 'diesel': return 'text-green-600';
      case 'premium': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const getFuelTypeIcon = (fuelType: string) => {
    switch (fuelType) {
      case 'petrol': return '⛽';
      case 'diesel': return '🚛';
      case 'premium': return '✨';
      default: return '⛽';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-2xl">{getFuelTypeIcon(nozzle.fuelType)}</span>
            Nozzle #{nozzle.nozzleNumber}
          </CardTitle>
          <Badge className={getStatusColor(nozzle.status)}>
            {nozzle.status}
          </Badge>
        </div>
        <CardDescription className={`capitalize font-medium ${getFuelTypeColor(nozzle.fuelType)}`}>
          {nozzle.fuelType}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Activity className="h-4 w-4" />
            <span>Status: {nozzle.status}</span>
          </div>
          
          <div className="flex gap-2">
            {nozzle.status === 'active' ? (
              <Button 
                onClick={() => onTakeReading(nozzle.id)} 
                size="sm" 
                className="flex-1"
              >
                <Plus className="mr-1 h-3 w-3" />
                Take Reading
              </Button>
            ) : (
              <Button 
                disabled 
                size="sm" 
                className="flex-1" 
                variant="secondary"
              >
                <AlertTriangle className="mr-1 h-3 w-3" />
                Unavailable
              </Button>
            )}
            <Button variant="outline" size="sm">
              <Settings className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
