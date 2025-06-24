
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Building2, Fuel, DollarSign } from 'lucide-react';

interface StationMetric {
  id: string;
  name: string;
  todaySales: number;
  monthlySales: number;
  salesGrowth: number;
  activePumps: number;
  totalPumps: number;
  status: 'active' | 'maintenance' | 'inactive';
}

interface StationMetricsCardProps {
  station: StationMetric;
  onClick?: () => void;
}

export function StationMetricsCard({ station, onClick }: StationMetricsCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card 
      className="hover:shadow-lg transition-all duration-300 cursor-pointer bg-gradient-to-br from-white to-purple-50 border-purple-100"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5 text-purple-600" />
            {station.name}
          </CardTitle>
          <Badge className={getStatusColor(station.status)}>
            {station.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-center gap-1 mb-1">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Today</span>
            </div>
            <div className="text-xl font-bold text-green-700">
              ₹{station.todaySales.toLocaleString()}
            </div>
          </div>
          
          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Fuel className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Pumps</span>
            </div>
            <div className="text-xl font-bold text-blue-700">
              {station.activePumps}/{station.totalPumps}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-sm text-muted-foreground">
            Monthly: ₹{station.monthlySales.toLocaleString()}
          </div>
          <div className={`flex items-center gap-1 text-sm ${
            station.salesGrowth >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {station.salesGrowth >= 0 ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {Math.abs(station.salesGrowth)}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
