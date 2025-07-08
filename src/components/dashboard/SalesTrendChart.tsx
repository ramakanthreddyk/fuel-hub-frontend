
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useDailySalesTrend } from '@/hooks/useDashboard';
import { format } from 'date-fns';

interface DashboardFilters {
  stationId?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface SalesTrendChartProps {
  filters?: DashboardFilters;
}

export function SalesTrendChart({ filters = {} }: SalesTrendChartProps) {
  const { data: trend = [], isLoading } = useDailySalesTrend(7, filters);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm sm:text-base">Sales Trend (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[120px] sm:h-[180px] md:h-[220px] lg:h-[260px] bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  const chartData = trend.map(item => ({
    date: format(new Date(item.date), 'MM/dd'),
    amount: item.amount,
    volume: item.volume,
  }));

  const chartConfig = {
    amount: { label: 'Sales (₹)', color: '#8b5cf6' },
  };

  return (
    <Card className="bg-gradient-to-br from-white to-purple-50 border-purple-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm sm:text-base lg:text-lg text-purple-700">Daily Sales Trend</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <ChartContainer config={chartConfig} className="h-[120px] sm:h-[180px] md:h-[220px] lg:h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 8 }}
                axisLine={false}
                tickLine={false}
                interval={0}
              />
              <YAxis 
                tick={{ fontSize: 8 }}
                axisLine={false}
                tickLine={false}
                width={30}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Sales']}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke={chartConfig.amount.color}
                strokeWidth={2}
                dot={{ fill: chartConfig.amount.color, strokeWidth: 1, r: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
