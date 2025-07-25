
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { useTodaysSales } from '@/hooks/api/useTodaysSales';
import { formatCurrency } from '@/utils/formatters';

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

interface PaymentMethodChartProps {
  filters?: DashboardFilters;
}

export function PaymentMethodChart({ filters = {} }: PaymentMethodChartProps) {
  const { data: todaysSales, isLoading } = useTodaysSales();
  
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
          <CardTitle className="text-sm sm:text-base">Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[300px] bg-muted animate-pulse rounded" />
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
        <CardTitle className="text-sm sm:text-base lg:text-lg text-blue-700">Payment Methods</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="w-full overflow-hidden">
          <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius="60%"
                  dataKey="value"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
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
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  wrapperStyle={{ fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
