
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
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card 
      className="hover:shadow-lg transition-all duration-200 cursor-pointer bg-white border border-gray-200 rounded-xl w-full"
      onClick={onClick}
    >
      <CardHeader className="pb-3 px-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="p-1.5 rounded-lg bg-purple-100 flex-shrink-0">
              <Building2 className="h-4 w-4 text-purple-600" />
            </div>
            <CardTitle className="text-base font-semibold text-gray-900 truncate">
              {station.name}
            </CardTitle>
          </div>
          <Badge className={`px-2 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${getStatusColor(station.status)}`}>
            {station.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="px-4 pb-4">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-2 bg-green-50 rounded-lg">
              <div className="text-xs text-gray-600 mb-1">Today</div>
              <div className="text-lg font-bold text-green-600 truncate">
                ₹{station.todaySales.toLocaleString()}
              </div>
            </div>
            
            <div className="text-center p-2 bg-blue-50 rounded-lg">
              <div className="text-xs text-gray-600 mb-1">Pumps</div>
              <div className="text-lg font-bold text-blue-600">
                {station.activePumps}/{station.totalPumps}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="text-xs text-gray-600 truncate">
              Monthly: ₹{station.monthlySales.toLocaleString()}
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium flex-shrink-0 ${
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
        </div>
      </CardContent>
    </Card>
  );
}
