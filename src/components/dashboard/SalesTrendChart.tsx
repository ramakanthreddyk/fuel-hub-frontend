
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
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-sm sm:text-base">Sales Trend (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[300px] bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  const chartData = trend.map(item => {
    const date = new Date(item.date);
    const isValidDate = !isNaN(date.getTime());
    
    return {
      date: isValidDate ? format(date, 'MM/dd') : 'Invalid',
      amount: item.amount || 0,
      volume: item.volume || 0,
    };
  }).filter(item => item.date !== 'Invalid');

  const chartConfig = {
    amount: { label: 'Sales (₹)', color: '#8b5cf6' },
  };

  // Format Y-axis values to show in millions/lakhs
  const formatYAxisValue = (value: number) => {
    if (value >= 10000000) {
      return `${(value / 10000000).toFixed(1)} Crores`;
    } else if (value >= 100000) {
      return `${(value / 100000).toFixed(1)} Lakhs`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  return (
    <Card className="bg-gradient-to-br from-white to-purple-50 border-purple-200 w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm sm:text-base lg:text-lg text-purple-700">Daily Sales Trend</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="w-full overflow-hidden">
          <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: 50, bottom: 5 }}>
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                />
                <YAxis 
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={45}
                  tickFormatter={formatYAxisValue}
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
                  dot={{ fill: chartConfig.amount.color, strokeWidth: 1, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
