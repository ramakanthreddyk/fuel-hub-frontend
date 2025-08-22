
import React from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useDashboardSalesTrend } from '@/hooks/api/useDashboardSalesTrend';
import { formatCurrency, formatVolume } from '@/utils/formatters';
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
  const { data: salesTrend = [], isLoading } = useDashboardSalesTrend(7);
  
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

  if (salesTrend.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Sales Trend</h3>
            <p className="text-sm text-gray-600">7-day sales performance</p>
          </div>
        </div>
        <div className="h-80 flex items-center justify-center bg-gray-50 rounded-2xl">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No sales trend data available</p>
          </div>
        </div>
      </div>
    );
  }

  const chartData = salesTrend.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }),
    fullDate: item.date,
    amount: item.amount,
    volume: item.volume
  }));

  const maxAmount = Math.max(...chartData.map(d => d.amount));
  const maxVolume = Math.max(...chartData.map(d => d.volume));

  const chartConfig = {
    amount: {
      label: 'Sales Amount',
      color: '#3b82f6',
    },
    volume: {
      label: 'Volume',
      color: '#10b981',
    },
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <TrendingUp className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Sales Trend</h3>
          <p className="text-sm text-gray-600">7-day sales performance</p>
        </div>
      </div>

      <div className="h-80">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                yAxisId="amount"
                orientation="left"
                stroke="#3b82f6"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatCurrency(value, { maximumFractionDigits: 0 })}
              />
              <YAxis 
                yAxisId="volume"
                orientation="right"
                stroke="#10b981"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatVolume(value, 0)}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                        <div className="font-medium text-gray-900 mb-2">
                          {new Date(data.fullDate).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Sales: </span>
                            <span className="font-semibold">{formatCurrency(data.amount)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Volume: </span>
                            <span className="font-semibold">{formatVolume(data.volume)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                verticalAlign="top"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: '14px' }}
              />
              <Line
                yAxisId="amount"
                type="monotone"
                dataKey="amount"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                name="Sales Amount"
              />
              <Line
                yAxisId="volume"
                type="monotone"
                dataKey="volume"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                name="Volume (L)"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
