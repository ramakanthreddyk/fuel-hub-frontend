
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2 } from 'lucide-react';

interface StationMetrics {
  id: string;
  name: string;
  totalSales: number;
  totalVolume: number;
  activePumps: number;
  totalPumps: number;
  status: 'active' | 'inactive' | 'maintenance';
}

interface StationMetricsCardProps {
  station: StationMetrics;
}

// Format large numbers for better display
const formatNumber = (num: number): string => {
  if (num >= 10000000) { // 1 crore
    return `₹${(num / 10000000).toFixed(1)}Cr`;
  } else if (num >= 100000) { // 1 lakh
    return `₹${(num / 100000).toFixed(1)}L`;
  } else if (num >= 1000) { // 1 thousand
    return `₹${(num / 1000).toFixed(1)}K`;
  }
  return `₹${num.toLocaleString()}`;
};

const formatVolume = (liters: number): string => {
  if (liters >= 1000) {
    return `${(liters / 1000).toFixed(1)}K L`;
  }
  return `${liters.toFixed(0)} L`;
};

export function StationMetricsCard({ station }: StationMetricsCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-red-100 text-red-800 border-red-200';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="min-w-0 flex-1">
          <CardTitle className="text-sm font-medium truncate">{station.name}</CardTitle>
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(station.status)}`}>
            {station.status}
          </div>
        </div>
        <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <div className="text-muted-foreground text-xs">Today</div>
            <div className="font-semibold text-sm truncate">{formatNumber(station.totalSales)}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">Pumps</div>
            <div className="font-semibold text-sm">{station.activePumps}/{station.totalPumps}</div>
          </div>
        </div>
        <div className="pt-1 border-t">
          <div className="text-muted-foreground text-xs">Monthly: {formatNumber(station.totalSales * 30)}</div>
          <div className="text-muted-foreground text-xs">Volume: {formatVolume(station.totalVolume)}</div>
        </div>
      </CardContent>
    </Card>
  );
}
