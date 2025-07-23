
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FuelInventory } from '@/api/api-contract';
import { Fuel, AlertTriangle, CheckCircle } from 'lucide-react';

interface InventoryStatusCardProps {
  inventory: FuelInventory;
}

export const InventoryStatusCard: React.FC<InventoryStatusCardProps> = ({ inventory }) => {
  const capacity = inventory.capacity || 1000; // Default capacity if not provided
  const currentVolume = inventory.currentVolume || 0;
  const percentage = (currentVolume / capacity) * 100;
  
  const getStatusColor = () => {
    if (percentage < 20) return 'text-red-500';
    if (percentage < 50) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStatusIcon = () => {
    if (percentage < 20) return <AlertTriangle className="h-4 w-4 text-red-500" />;
    if (percentage < 50) return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  const getStatusText = () => {
    if (percentage < 20) return 'Critical';
    if (percentage < 50) return 'Low';
    return 'Normal';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Fuel className="h-4 w-4" />
          {inventory.fuelType?.charAt(0).toUpperCase() + inventory.fuelType?.slice(1) || 'Unknown'}
        </CardTitle>
        <Badge variant="outline" className="flex items-center gap-1">
          {getStatusIcon()}
          {getStatusText()}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{currentVolume.toLocaleString()} L</div>
        <p className="text-xs text-muted-foreground">
          of {capacity.toLocaleString()} L capacity
        </p>
        <div className="mt-4">
          <Progress value={percentage} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {percentage.toFixed(1)}% full
          </p>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          Station: {inventory.stationName || 'Unknown'}
        </div>
      </CardContent>
    </Card>
  );
};
