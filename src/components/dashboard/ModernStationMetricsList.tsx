
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Building2, TrendingUp, Activity, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { useStationMetrics } from '@/hooks/useDashboard';
import { formatCurrency } from '@/utils/formatters';

export function ModernStationMetricsList() {
  const { data: stations = [], isLoading } = useStationMetrics();

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gray-100 rounded-xl animate-pulse"></div>
          <div>
            <div className="h-6 w-32 bg-gray-100 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-24 bg-gray-100 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'maintenance':
        return <Clock className="h-4 w-4 text-orange-600" />;
      case 'inactive':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
          <Building2 className="h-5 w-5 text-gray-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Station Metrics</h3>
          <p className="text-sm text-gray-600">Performance overview of all stations</p>
        </div>
      </div>

      <div className="space-y-4">
        {stations.map((station) => (
          <div key={station.id} className="group bg-gradient-to-r from-white to-gray-50 rounded-xl p-4 border border-gray-200/50 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-gray-900 truncate">{station.name}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <Badge variant="outline" className={`${getStatusColor(station.status)} border text-xs`}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(station.status)}
                        {station.status}
                      </span>
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {station.activePumps}/{station.totalPumps} pumps
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 flex-shrink-0 ml-4">
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatCurrency(station.todaySales || 0, { useLakhsCrores: true })}
                  </div>
                  <div className="text-xs text-gray-500">Today</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatCurrency(station.monthlySales || 0, { useLakhsCrores: true })}
                  </div>
                  <div className="text-xs text-gray-500">Monthly</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-sm font-semibold text-green-600">
                      {station.salesGrowth || 0}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">Growth</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
