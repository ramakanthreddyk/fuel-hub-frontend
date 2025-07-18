
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, TrendingUp, Gauge, TrendingDown, ArrowRight } from 'lucide-react';
import { formatCurrency, formatVolume } from '@/utils/formatters';

interface StationMetrics {
  id: string;
  name: string;
  totalSales: number;
  monthlySales: number;
  activePumps: number;
  totalPumps: number;
  status: 'active' | 'inactive' | 'maintenance';
  lastActivity?: string;
  efficiency?: number;
  salesGrowth?: number;
}

interface StationMetricsCardProps {
  station: StationMetrics;
}

// Using imported formatters instead of local functions

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
      case 'maintenance': return 'from-orange-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-0 bg-white overflow-hidden w-full max-w-sm mx-auto">
      <div className={`h-1 bg-gradient-to-r ${getStatusGradient(station.status)}`} />
      <CardHeader className="pb-3 px-4 pt-4">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-sm font-bold text-gray-900 truncate mb-2">
              {station.name}
            </CardTitle>
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(station.status)}`}>
              <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${station.status === 'active' ? 'bg-green-500' : station.status === 'inactive' ? 'bg-red-500' : 'bg-yellow-500'}`} />
              {station.status.charAt(0).toUpperCase() + station.status.slice(1)}
            </div>
          </div>
          <div className="flex-shrink-0 ml-2">
            <div className="p-1.5 rounded-lg bg-blue-100">
              <Building2 className="h-4 w-4 text-blue-600" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-4 pb-4">
        <div className="space-y-3">
          {/* Today's Sales - Prominent Display */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-2.5 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-blue-600 mb-1">Today's Sales</div>
                <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {formatCurrency(station.totalSales, { useLakhsCrores: true })}
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-blue-500 flex-shrink-0" />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-green-50 rounded-lg p-2.5 border border-green-100">
              <div className="text-xs font-medium text-green-600 mb-1">Monthly Sales</div>
              <div className="text-sm font-bold text-green-700">
                {formatCurrency(station.monthlySales, { useLakhsCrores: true })}
              </div>
            </div>
            <div className="bg-orange-50 rounded-lg p-2.5 border border-orange-100" title="Revenue per pump ratio (Monthly sales / number of pumps)">
              <div className="text-xs font-medium text-orange-600 mb-1">Efficiency</div>
              <div className="text-sm font-bold text-orange-700">
                {station.efficiency ? (station.efficiency / 1000000).toFixed(2) + 'M' : 'N/A'}
              </div>
            </div>
          </div>

          {/* Pumps Status */}
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2.5 border border-gray-100">
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-gray-600 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-700">Pumps Active</span>
            </div>
            <div className="text-sm font-bold text-gray-900">
              {station.activePumps}/{station.totalPumps}
            </div>
          </div>
          
          {/* Last Activity Display */}
          
          {/* Last Activity */}
          {station.lastActivity && (
            <div className="text-xs text-gray-500 mt-2 text-right">
              Last activity: {new Date(station.lastActivity).toLocaleDateString()} {new Date(station.lastActivity).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
          )}

          {/* Sales Growth */}
          {station.salesGrowth !== undefined && (
            <div className={`flex items-center justify-between mt-2 text-xs ${station.salesGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              <div className="flex items-center">
                {station.salesGrowth >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                <span>Sales Growth</span>
              </div>
              <span>{station.salesGrowth.toFixed(2)}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
