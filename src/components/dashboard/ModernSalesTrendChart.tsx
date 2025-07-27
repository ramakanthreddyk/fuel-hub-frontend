
import React from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useDashboardSalesTrend } from '@/hooks/api/useDashboardSalesTrend';
import { format } from 'date-fns';
import { TrendingUp, BarChart3 } from 'lucide-react';

interface DashboardFilters {
  stationId?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface ModernSalesTrendChartProps {
  filters?: DashboardFilters;
}

export function ModernSalesTrendChart({ filters = {} }: ModernSalesTrendChartProps) {
  // Get last 7 days trend data
  const { data: trend = [], isLoading } = useDashboardSalesTrend(7);

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

  const chartData = trend.map(item => ({
    date: format(new Date(item.date), 'MMM dd'),
    amount: item.amount,
    volume: item.volume,
  }));

  const chartConfig = {
    amount: { label: 'Sales (₹)', color: '#8b5cf6' },
  };

  const formatYAxisValue = (value: number) => {
    if (value >= 10000000) {
      return `${(value / 10000000).toFixed(1)}Cr`;
    } else if (value >= 100000) {
      return `${(value / 100000).toFixed(1)}L`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Sales Trend</h3>
            <p className="text-sm text-gray-600">Last 7 days performance</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Revenue</span>
          </div>
        </div>
      </div>

      <div className="h-80">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={formatYAxisValue}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Sales']}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#8b5cf6"
                strokeWidth={3}
                fill="url(#colorAmount)"
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#8b5cf6' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
