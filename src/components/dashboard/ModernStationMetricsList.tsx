
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, TrendingUp, Activity, CheckCircle, AlertTriangle, Clock, Fuel } from 'lucide-react';
import { useStationMetrics } from '@/hooks/api/useDashboard';
import { formatCurrency } from '@/utils/formatters';

export function ModernStationMetricsList() {
  // Get station metrics
  const { data: stations = [], isLoading } = useStationMetrics();
  
  console.log('ModernStationMetricsList render:', { stations, isLoading }); // Debug log

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="grid grid-cols-1 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { 
          icon: CheckCircle, 
          color: 'bg-green-500', 
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          borderColor: 'border-green-200'
        };
      case 'maintenance':
        return { 
          icon: Clock, 
          color: 'bg-orange-500', 
          bgColor: 'bg-orange-50',
          textColor: 'text-orange-700',
          borderColor: 'border-orange-200'
        };
      case 'inactive':
        return { 
          icon: AlertTriangle, 
          color: 'bg-red-500', 
          bgColor: 'bg-red-50',
          textColor: 'text-red-700',
          borderColor: 'border-red-200'
        };
      default:
        return { 
          icon: Activity, 
          color: 'bg-gray-500', 
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-200'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Station Metrics</h3>
          <p className="text-sm text-gray-600">Performance overview of all stations</p>
        </div>
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <Building2 className="h-5 w-5 text-blue-600" />
        </div>
      </div>

      {/* Stations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stations.map((station) => {
          const statusConfig = getStatusConfig(station.status);
          
          return (
            <Card key={station.id} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* Station Info */}
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${statusConfig.color}`}>
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {station.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor} text-xs`}>
                          <statusConfig.icon className="h-3 w-3 mr-1" />
                          {station.status}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Fuel className="h-3 w-3" />
                          <span>{station.activePumps}/{station.totalPumps}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                      <div className="text-sm font-bold text-blue-600">
                        {station.efficiency ? `₹${(station.efficiency / 100000).toFixed(1)}L` : 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Efficiency</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className={`text-sm font-bold ${
                        station.salesGrowth > 0 ? 'text-green-600' : 
                        station.salesGrowth < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {station.salesGrowth ? `${station.salesGrowth > 0 ? '+' : ''}${station.salesGrowth.toFixed(1)}%` : 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Growth</div>
                    </div>
                    <div className="text-center p-2 bg-purple-50 rounded-lg">
                      <div className="text-sm font-bold text-purple-600">
                        {Math.round((station.activePumps / station.totalPumps) * 100)}%
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Active</div>
                    </div>
                  </div>
                  
                  {/* Sales Summary */}
                  <div className="pt-3 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-sm font-bold text-gray-900">
                          {formatCurrency(station.todaySales || 0, { maximumFractionDigits: 0 })}
                        </div>
                        <div className="text-xs text-gray-500">Today</div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">
                          {formatCurrency(station.monthlySales || 0, { maximumFractionDigits: 0 })}
                        </div>
                        <div className="text-xs text-gray-500">Monthly</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
