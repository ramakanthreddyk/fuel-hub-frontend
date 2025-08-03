
import React from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { useDashboardPaymentMethods } from '@/hooks/api/useDashboardPaymentMethods';
import { useTodaysSales } from '@/hooks/api/useTodaysSales';
import { formatCurrency } from '@/utils/formatters';
import { CreditCard, Banknote, Smartphone, Users } from 'lucide-react';

const COLORS = {
  cash: '#22c55e',
  card: '#3b82f6',
  upi: '#8b5cf6',
  credit: '#f59e0b',
};

interface DashboardFilters {
  stationId?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface ModernPaymentMethodChartProps {
  filters?: DashboardFilters;
  date?: string;
}

export function ModernPaymentMethodChart({ filters = {}, date }: ModernPaymentMethodChartProps) {
  // If date is provided, use today's sales data instead of dashboard endpoint
  const { data: todaysSales, isLoading: todaysLoading } = useTodaysSales(date);
  const { data: dashboardPayments = [], isLoading: dashboardLoading } = useDashboardPaymentMethods();
  
  const isLoading = date ? todaysLoading : dashboardLoading;
  
  // Use appropriate data source based on whether date is selected
  const paymentMethods = date && todaysSales ? [
    {
      paymentMethod: 'cash',
      amount: todaysSales.paymentBreakdown.cash,
      percentage: todaysSales.totalAmount > 0 ? parseFloat(((todaysSales.paymentBreakdown.cash / todaysSales.totalAmount) * 100).toFixed(1)) : 0
    },
    {
      paymentMethod: 'card',
      amount: todaysSales.paymentBreakdown.card,
      percentage: todaysSales.totalAmount > 0 ? parseFloat(((todaysSales.paymentBreakdown.card / todaysSales.totalAmount) * 100).toFixed(1)) : 0
    },
    {
      paymentMethod: 'upi',
      amount: todaysSales.paymentBreakdown.upi,
      percentage: todaysSales.totalAmount > 0 ? parseFloat(((todaysSales.paymentBreakdown.upi / todaysSales.totalAmount) * 100).toFixed(1)) : 0
    },
    {
      paymentMethod: 'credit',
      amount: todaysSales.paymentBreakdown.credit,
      percentage: todaysSales.totalAmount > 0 ? parseFloat(((todaysSales.paymentBreakdown.credit / todaysSales.totalAmount) * 100).toFixed(1)) : 0
    }
  ].filter(item => item.amount > 0) : dashboardPayments;
  
  // Data is already formatted from the dashboard endpoint
  const chartData = paymentMethods;

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

  const pieData = chartData.map(item => ({
    name: item.paymentMethod,
    value: item.amount,
    percentage: item.percentage,
  }));

  const getIcon = (method: string) => {
    switch (method) {
      case 'cash': return <Banknote className="h-4 w-4" />;
      case 'card': return <CreditCard className="h-4 w-4" />;
      case 'upi': return <Smartphone className="h-4 w-4" />;
      case 'credit': return <Users className="h-4 w-4" />;
      default: return <CreditCard className="h-4 w-4" />;
    }
  };

  const chartConfig = {
    cash: { label: 'Cash', color: COLORS.cash },
    card: { label: 'Card', color: COLORS.card },
    upi: { label: 'UPI', color: COLORS.upi },
    credit: { label: 'Credit', color: COLORS.credit },
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <CreditCard className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Today's Payment Methods</h3>
          <p className="text-sm text-gray-600">
            {date ? `Payment breakdown for ${new Date(date).toLocaleDateString()}` : "Today's payment breakdown (not lifetime totals)"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="h-80">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius="70%"
                  innerRadius="30%"
                  dataKey="value"
                  strokeWidth={2}
                  stroke="#fff"
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[entry.name as keyof typeof COLORS] || '#gray'} 
                    />
                  ))}
                </Pie>
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => [formatCurrency(value), 'Amount']}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Legend/Details */}
        <div className="space-y-4">
          {chartData.map((item, index) => (
            <div key={item.paymentMethod} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: COLORS[item.paymentMethod as keyof typeof COLORS] }}
                />
                <div className="flex items-center gap-2">
                  {getIcon(item.paymentMethod)}
                  <span className="font-medium text-gray-900 capitalize">{item.paymentMethod}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {formatCurrency(item.amount)}
                </div>
                <div className="text-sm text-gray-600">{item.percentage}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
