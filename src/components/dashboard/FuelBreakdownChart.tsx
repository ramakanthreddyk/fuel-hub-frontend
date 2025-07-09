
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useFuelTypeBreakdown } from '@/hooks/useDashboard';

interface DashboardFilters {
  stationId?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface FuelBreakdownChartProps {
  filters?: DashboardFilters;
}

export function FuelBreakdownChart({ filters = {} }: FuelBreakdownChartProps) {
  const { data: breakdown = [], isLoading } = useFuelTypeBreakdown(filters);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-sm sm:text-base">Fuel Sales Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[300px] bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  const chartData = breakdown.map(item => ({
    fuelType: item.fuelType,
    volume: item.volume,
    amount: item.amount,
  }));

  const chartConfig = {
    volume: { label: 'Volume (L)', color: '#3b82f6' },
    amount: { label: 'Revenue (₹)', color: '#22c55e' },
  };

  return (
    <Card className="bg-gradient-to-br from-white to-green-50 border-green-200 w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm sm:text-base lg:text-lg text-green-700">Fuel Sales by Type</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="w-full overflow-hidden">
          <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <XAxis 
                  dataKey="fuelType" 
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                />
                <YAxis 
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="volume" 
                  fill={chartConfig.volume.color} 
                  name="Volume (L)"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
