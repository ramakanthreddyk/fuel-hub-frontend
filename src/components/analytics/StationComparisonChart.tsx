
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';
import { useStationComparison } from '@/hooks/useAnalytics';
import { Building2 } from 'lucide-react';
import { formatCurrency, formatVolume } from '@/utils/formatters';

interface StationComparisonChartProps {
  stationIds: string[];
  period?: string;
}

export function StationComparisonChart({ stationIds, period = 'month' }: StationComparisonChartProps) {
  const { data: comparisonData = [], isLoading } = useStationComparison({ 
    stationIds, 
    period 
  });
  
  // Get period display text
  const getPeriodText = () => {
    switch(period) {
      case 'today': return 'Today';
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      default: return 'This Month';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            Station Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  // Process data to ensure it's in the right format for the chart
  const chartData = comparisonData.map(station => {
    // Format growth as percentage with sign
    const growthText = typeof station.growth === 'number' 
      ? (station.growth > 0 ? '+' : '') + station.growth.toFixed(1) + '%'
      : '0%';
      
    return {
      stationName: station.stationName,
      sales: typeof station.sales === 'number' ? station.sales : 0,
      volume: typeof station.volume === 'number' ? station.volume : 0,
      transactions: typeof station.transactions === 'number' ? station.transactions : 0,
      // Add growth information for tooltip
      growthText: growthText,
      growth: typeof station.growth === 'number' ? station.growth : 0
    };
  });
  
  const chartConfig = {
    sales: { label: 'Sales (₹)', color: '#3b82f6' },
    volume: { label: 'Volume (L)', color: '#22c55e' },
    transactions: { label: 'Transactions', color: '#f59e0b' },
    growth: { label: 'Growth %', color: '#ef4444' },
  };

  return (
    <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-blue-600" />
          Station Performance Comparison - {getPeriodText()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="stationName" />
              <YAxis />
              <ChartTooltip
                content={props => {
                  if (!props.active || !props.payload) return null;
                  const data = props.payload[0]?.payload;
                  if (!data) return null;
                  
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-md">
                      <div className="font-medium">{data.stationName}</div>
                      <div className="text-sm text-muted-foreground">
                        <div>Sales: {formatCurrency(data.sales, { useLakhsCrores: true })}</div>
                        <div>Volume: {formatVolume(data.volume)}</div>
                        <div>Transactions: {data.transactions}</div>
                        <div className={`font-medium ${data.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          Growth: {data.growthText}
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
              <Legend />
              <Bar dataKey="sales" fill={chartConfig.sales.color} name="Sales (₹)" />
              <Bar dataKey="volume" fill={chartConfig.volume.color} name="Volume (L)" />
              <Bar dataKey="transactions" fill={chartConfig.transactions.color} name="Transactions" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
