
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Fuel, BarChart3, TrendingUp } from 'lucide-react';
import { useDashboardFuelBreakdown } from '@/hooks/api/useDashboardFuelBreakdown';
import { useTodaysSales } from '@/hooks/api/useTodaysSales';
import { formatCurrency, formatVolume } from '@/utils/formatters';

interface DashboardFilters {
  stationId?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface ModernFuelBreakdownChartProps {
  filters?: DashboardFilters;
  date?: string;
}

export function ModernFuelBreakdownChart({ filters = {}, date }: ModernFuelBreakdownChartProps) {
  // If date is provided, use today's sales data instead of dashboard endpoint
  const { data: todaysSales, isLoading: todaysLoading } = useTodaysSales(date);
  const { data: dashboardFuel = [], isLoading: dashboardLoading } = useDashboardFuelBreakdown();
  
  const isLoading = date ? todaysLoading : dashboardLoading;
  
  // Use appropriate data source based on whether date is selected
  const fuelBreakdown = date && todaysSales ? 
    todaysSales.salesByFuel.map(fuel => ({
      fuelType: fuel.fuel_type,
      amount: fuel.total_amount,
      volume: fuel.total_volume,
      percentage: ((fuel.total_amount / todaysSales.totalAmount) * 100).toFixed(1)
    })) : dashboardFuel;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const getFuelIcon = (fuelType: string | null | undefined) => {
    if (!fuelType) {
      return { icon: Fuel, color: 'bg-gray-500', textColor: 'text-gray-700' };
    }
    
    switch (fuelType.toLowerCase()) {
      case 'petrol':
      case 'gasoline':
        return { icon: Fuel, color: 'bg-green-500', textColor: 'text-green-700' };
      case 'diesel':
        return { icon: Fuel, color: 'bg-orange-500', textColor: 'text-orange-700' };
      case 'premium':
        return { icon: Fuel, color: 'bg-purple-500', textColor: 'text-purple-700' };
      default:
        return { icon: Fuel, color: 'bg-gray-500', textColor: 'text-gray-700' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Fuel Breakdown</h3>
          <p className="text-sm text-gray-600">
            {date ? `Fuel performance for ${new Date(date).toLocaleDateString()}` : "Today's fuel type performance"}
          </p>
        </div>
        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
          <BarChart3 className="h-5 w-5 text-green-600" />
        </div>
      </div>

      {/* Fuel Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {fuelBreakdown.filter(item => item.fuelType).map((item, index) => {
          const { icon: IconComponent, color, textColor } = getFuelIcon(item.fuelType);
          const total = fuelBreakdown.reduce((sum, fuel) => sum + fuel.amount, 0);
          const percentage = total > 0 ? ((item.amount / total) * 100) : 0;

          return (
            <Card key={item.fuelType} className="relative overflow-hidden border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {percentage.toFixed(0)}%
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">
                      {item.fuelType || 'Unknown'}
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {formatCurrency(item.amount, { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Volume:</span>
                    <span className="font-medium text-gray-900">
                      {formatVolume(item.volume, 0)}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${color}`}
                      style={{ width: `${percentage}%` }}
                    />
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
