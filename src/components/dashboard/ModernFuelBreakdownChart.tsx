
import React from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useFuelTypeBreakdown } from '@/hooks/useDashboard';
import { formatCurrency, formatVolume } from '@/utils/formatters';
import { Fuel, BarChart3 } from 'lucide-react';

interface DashboardFilters {
  stationId?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface ModernFuelBreakdownChartProps {
  filters?: DashboardFilters;
}

export function ModernFuelBreakdownChart({ filters = {} }: ModernFuelBreakdownChartProps) {
  const { data: fuelBreakdown = [], isLoading } = useFuelTypeBreakdown(filters);

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
        <div className="h-80 bg-gray-100 rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  const chartData = fuelBreakdown.map(item => ({
    fuelType: item.fuelType,
    volume: item.volume,
    amount: item.amount,
  }));

  const getFuelColor = (fuelType: string) => {
    switch (fuelType.toLowerCase()) {
      case 'petrol':
      case 'gasoline':
        return '#22c55e';
      case 'diesel':
        return '#f59e0b';
      case 'premium':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  };

  const chartConfig = {
    volume: { label: 'Volume (L)', color: '#3b82f6' },
    amount: { label: 'Amount (₹)', color: '#8b5cf6' },
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
          <Fuel className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Fuel Breakdown</h3>
          <p className="text-sm text-gray-600">Today's fuel type performance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="h-80">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis 
                  dataKey="fuelType" 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: number, name: string) => [
                    name === 'volume' ? formatVolume(value, 1) : formatCurrency(value),
                    name === 'volume' ? 'Volume' : 'Amount'
                  ]}
                />
                <Bar 
                  dataKey="volume" 
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  name="Volume (L)"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          {chartData.map((item, index) => (
            <div key={item.fuelType} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: getFuelColor(item.fuelType) }}
                />
                <div className="flex items-center gap-2">
                  <Fuel className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-900">{item.fuelType}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {formatCurrency(item.amount)}
                </div>
                <div className="text-sm text-gray-600">{formatVolume(item.volume, 1)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
