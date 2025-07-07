
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
      className="hover:shadow-lg transition-all duration-200 cursor-pointer bg-white border border-gray-200 rounded-xl"
      onClick={onClick}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <Building2 className="h-5 w-5 text-purple-600" />
            </div>
            <CardTitle className="text-lg font-semibold text-gray-900">
              {station.name}
            </CardTitle>
          </div>
          <Badge className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(station.status)}`}>
            {station.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Today</div>
            <div className="text-2xl font-bold text-green-600">
              ₹{station.todaySales.toLocaleString()}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Pumps</div>
            <div className="text-2xl font-bold text-blue-600">
              {station.activePumps}/{station.totalPumps}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="text-sm text-gray-600">
            Monthly: ₹{station.monthlySales.toLocaleString()}
          </div>
          <div className={`flex items-center gap-1 text-sm font-medium ${
            station.salesGrowth >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {station.salesGrowth >= 0 ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            {Math.abs(station.salesGrowth)}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
