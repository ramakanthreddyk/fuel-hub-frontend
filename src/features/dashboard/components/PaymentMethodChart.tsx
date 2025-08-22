
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTodaysSales } from '@/hooks/api/useTodaysSales';
import { formatCurrency } from '@/utils/formatters';
import { useState } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { CreditCard, Wallet, Smartphone, Building } from 'lucide-react';

const COLORS = {
  cash: '#10b981',
  card: '#3b82f6', 
  upi: '#8b5cf6',
  credit: '#f59e0b',
};

const PAYMENT_ICONS = {
  cash: Wallet,
  card: CreditCard,
  upi: Smartphone,
  credit: Building,
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
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  
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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload;
      const IconComponent = PAYMENT_ICONS[data.paymentMethod as keyof typeof PAYMENT_ICONS];
      
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-gray-200/50 min-w-[180px]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: COLORS[data.paymentMethod as keyof typeof COLORS] }}>
              <IconComponent className="w-4 h-4 text-white" />
            </div>
            <div className="font-semibold text-gray-900">{data.name}</div>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-bold text-gray-900">{formatCurrency(data.value)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Share:</span>
              <span className="font-bold text-gray-900">{data.percentage}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    if (!payload) return null;
    
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => {
          const IconComponent = PAYMENT_ICONS[entry.payload.paymentMethod as keyof typeof PAYMENT_ICONS];
          const isActive = activeIndex === index;
          
          return (
            <div
              key={index}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                isActive ? 'bg-gray-100 scale-105' : 'hover:bg-gray-50'
              }`}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(-1)}
            >
              <div 
                className="w-3 h-3 rounded-full flex items-center justify-center"
                style={{ backgroundColor: entry.color }}
              >
                <IconComponent className="w-2 h-2 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {entry.value} ({entry.payload.percentage}%)
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
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
    <Card className="w-full bg-gradient-to-br from-white to-blue-50/30 border-blue-200/50 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">Payment Methods</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Total: {formatCurrency(total)} • {selectedDate ? new Date(selectedDate).toLocaleDateString() : 'Today'}
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="45%"
                innerRadius={50}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(-1)}
                animationBegin={0}
                animationDuration={800}
                animationEasing="ease-out"
              >
                {chartData.map((entry, index) => {
                  const isActive = activeIndex === index;
                  const baseColor = COLORS[entry.paymentMethod as keyof typeof COLORS] || '#6b7280';
                  
                  return (
                    <Cell 
                      key={`cell-${index}`}
                      fill={baseColor}
                      stroke={isActive ? '#ffffff' : 'none'}
                      strokeWidth={isActive ? 2 : 0}
                      style={{
                        filter: isActive ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))' : 'none',
                        transform: isActive ? 'scale(1.02)' : 'scale(1)',
                        transformOrigin: 'center',
                        transition: 'all 0.2s ease-out'
                      }}
                    />
                  );
                })}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
