
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTodaysSales } from '@/hooks/api/useTodaysSales';
import { formatCurrency } from '@/utils/formatters';
import { useState } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';

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
  const { selectedDate } = useDashboardStore();
  const { data: todaysSales, isLoading } = useTodaysSales(selectedDate || undefined);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  // Convert payment breakdown to chart data
  const breakdown = todaysSales?.paymentBreakdown ? [
    { 
      name: 'Cash', 
      paymentMethod: 'cash', 
      amount: todaysSales.paymentBreakdown.cash || 0,
      value: todaysSales.paymentBreakdown.cash || 0
    },
    { 
      name: 'Card', 
      paymentMethod: 'card', 
      amount: todaysSales.paymentBreakdown.card || 0,
      value: todaysSales.paymentBreakdown.card || 0
    },
    { 
      name: 'UPI', 
      paymentMethod: 'upi', 
      amount: todaysSales.paymentBreakdown.upi || 0,
      value: todaysSales.paymentBreakdown.upi || 0
    },
    { 
      name: 'Credit', 
      paymentMethod: 'credit', 
      amount: todaysSales.paymentBreakdown.credit || 0,
      value: todaysSales.paymentBreakdown.credit || 0
    },
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
          <div className="h-[400px] bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }
  
  if (chartData.length === 0 || total === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center text-gray-500">
            No payment data available for {selectedDate ? new Date(selectedDate).toLocaleDateString() : 'today'}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200 w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-blue-700">Payment Methods</CardTitle>
        <div className="text-sm text-gray-500">
          Total: {formatCurrency(total)} • {selectedDate ? new Date(selectedDate).toLocaleDateString() : 'Today'}
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                animationBegin={0}
                animationDuration={800}
              >
                {chartData.map((entry, index) => {
                  const isActive = activeIndex === index;
                  const baseColor = COLORS[entry.paymentMethod as keyof typeof COLORS] || '#6b7280';
                  const hoverColor = HOVER_COLORS[entry.paymentMethod as keyof typeof HOVER_COLORS] || '#4b5563';
                  
                  return (
                    <Cell 
                      key={`cell-${index}`}
                      fill={isActive ? hoverColor : baseColor}
                      stroke={isActive ? '#ffffff' : baseColor}
                      strokeWidth={isActive ? 3 : 1}
                      style={{
                        filter: isActive ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                        cursor: 'pointer',
                        transform: isActive ? 'scale(1.05)' : 'scale(1)',
                        transformOrigin: 'center',
                        transition: 'all 0.2s ease-in-out'
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
                      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                        <div className="font-medium capitalize mb-2 text-gray-900">{data.name}</div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>Amount: <span className="font-semibold">{formatCurrency(data.value)}</span></div>
                          <div>Share: <span className="font-semibold">{data.percentage}%</span></div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                verticalAlign="bottom"
                height={60}
                formatter={(value, entry) => {
                  const data = chartData.find(d => d.name === value);
                  return (
                    <span className="text-sm text-gray-700">
                      {value} ({data?.percentage}%)
                    </span>
                  );
                }}
                wrapperStyle={{ 
                  fontSize: '14px',
                  paddingTop: '20px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
