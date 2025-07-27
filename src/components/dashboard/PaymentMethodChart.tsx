
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTodaysSales } from '@/hooks/api/useTodaysSales';
import { formatCurrency } from '@/utils/formatters';
import { useState } from 'react';

const COLORS = {
  cash: '#10b981',
  card: '#3b82f6', 
  upi: '#8b5cf6',
  credit: '#f59e0b',
};

const HOVER_COLORS = {
  cash: '#059669',
  card: '#2563eb',
  upi: '#7c3aed', 
  credit: '#d97706',
};

interface DashboardFilters {
  stationId?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface PaymentMethodChartProps {
  filters?: DashboardFilters;
}

export function PaymentMethodChart({ filters = {} }: PaymentMethodChartProps) {
  const { data: todaysSales, isLoading } = useTodaysSales();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  // Convert payment breakdown to chart data
  const breakdown = todaysSales?.paymentBreakdown ? [
    { paymentMethod: 'cash', amount: todaysSales.paymentBreakdown.cash },
    { paymentMethod: 'card', amount: todaysSales.paymentBreakdown.card },
    { paymentMethod: 'upi', amount: todaysSales.paymentBreakdown.upi },
    { paymentMethod: 'credit', amount: todaysSales.paymentBreakdown.credit },
  ].filter(item => item.amount > 0) : [];
  
  // Calculate percentages
  const total = breakdown.reduce((sum, item) => sum + item.amount, 0);
  const chartData = breakdown.map(item => ({
    ...item,
    percentage: total > 0 ? ((item.amount / total) * 100).toFixed(1) : '0',
  }));

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }
  
  if (chartData.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            No payment data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const pieData = chartData.map(item => ({
    name: item.paymentMethod,
    value: item.amount,
    percentage: item.percentage,
  }));

  const chartConfig = {
    cash: { label: 'Cash', color: COLORS.cash },
    card: { label: 'Card', color: COLORS.card },
    upi: { label: 'UPI', color: COLORS.upi },
    credit: { label: 'Credit', color: COLORS.credit },
  };

  return (
    <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200 w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-blue-700">Payment Methods</CardTitle>
        <div className="text-sm text-gray-500">Total: {formatCurrency(total)}</div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {pieData.map((entry, index) => {
                  const isActive = activeIndex === index;
                  const baseColor = COLORS[entry.name as keyof typeof COLORS] || '#6b7280';
                  const hoverColor = HOVER_COLORS[entry.name as keyof typeof HOVER_COLORS] || '#4b5563';
                  
                  return (
                    <Cell 
                      key={`cell-${index}`}
                      fill={isActive ? hoverColor : baseColor}
                      stroke={isActive ? '#ffffff' : baseColor}
                      strokeWidth={isActive ? 3 : 1}
                      style={{
                        filter: isActive ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                        cursor: 'pointer'
                      }}
                    />
                  );
                })}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload[0]) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 rounded-lg shadow-lg border">
                        <div className="font-medium capitalize mb-1">{data.name}</div>
                        <div className="text-sm text-gray-600">
                          Amount: {formatCurrency(data.value)}
                        </div>
                        <div className="text-sm text-gray-600">
                          Share: {data.percentage}%
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                verticalAlign="bottom"
                height={36}
                formatter={(value, entry) => {
                  const data = pieData.find(d => d.name === value);
                  return `${value} (${data?.percentage}%)`;
                }}
                wrapperStyle={{ fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
