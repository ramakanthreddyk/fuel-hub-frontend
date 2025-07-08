
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, TrendingUp, Gauge } from 'lucide-react';

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

// Enhanced number formatting for better display
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
  if (liters >= 1000000) {
    return `${(liters / 1000000).toFixed(1)}M L`;
  } else if (liters >= 1000) {
    return `${(liters / 1000).toFixed(1)}K L`;
  }
  return `${liters.toFixed(0)} L`;
};

export function StationMetricsCard({ station }: StationMetricsCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-300';
      case 'inactive': return 'bg-red-100 text-red-800 border-red-300';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusGradient = (status: string) => {
    switch (status) {
      case 'active': return 'from-green-500 to-emerald-600';
      case 'inactive': return 'from-red-500 to-red-600';
      case 'maintenance': return 'from-yellow-500 to-orange-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-0 bg-white overflow-hidden">
      <div className={`h-1 bg-gradient-to-r ${getStatusGradient(station.status)}`} />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base font-bold text-gray-900 truncate mb-2">
              {station.name}
            </CardTitle>
            <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(station.status)}`}>
              <div className={`w-2 h-2 rounded-full mr-1.5 ${status === 'active' ? 'bg-green-500' : status === 'inactive' ? 'bg-red-500' : 'bg-yellow-500'}`} />
              {station.status.charAt(0).toUpperCase() + station.status.slice(1)}
            </div>
          </div>
          <div className="flex-shrink-0 ml-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Today's Sales - Prominent Display */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-blue-600 mb-1">Today's Sales</div>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {formatNumber(station.totalSales)}
                </div>
              </div>
              <TrendingUp className="h-6 w-6 text-blue-500" />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 rounded-lg p-3 border border-green-100">
              <div className="text-xs font-medium text-green-600 mb-1">Monthly Est.</div>
              <div className="text-sm font-bold text-green-700">
                {formatNumber(station.totalSales * 30)}
              </div>
            </div>
            <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
              <div className="text-xs font-medium text-orange-600 mb-1">Volume</div>
              <div className="text-sm font-bold text-orange-700">
                {formatVolume(station.totalVolume)}
              </div>
            </div>
          </div>

          {/* Pumps Status */}
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-100">
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Pumps Active</span>
            </div>
            <div className="text-sm font-bold text-gray-900">
              {station.activePumps}/{station.totalPumps}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
