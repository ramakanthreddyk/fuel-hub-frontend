
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useDailySalesTrend } from '@/hooks/useDashboard';
import { format } from 'date-fns';

export function SalesTrendChart() {
  const { data: trend = [], isLoading } = useDailySalesTrend(7);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sales Trend (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-muted animate-pulse rounded" />
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
    amount: { label: 'Sales (₹)', color: '#3b82f6' },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Sales Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Sales']}
              />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke={chartConfig.amount.color} 
                strokeWidth={2}
                dot={{ fill: chartConfig.amount.color, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
