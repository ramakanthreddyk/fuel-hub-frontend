
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useHourlySales, usePeakHours, useFuelPerformance } from '@/hooks/useAnalytics';
import { Clock, TrendingUp, Fuel } from 'lucide-react';

interface AdvancedAnalyticsProps {
  stationId?: string;
  dateRange?: { from: Date; to: Date };
}

export function AdvancedAnalytics({ stationId, dateRange }: AdvancedAnalyticsProps) {
  const { data: hourlySales = [], isLoading: hourlyLoading } = useHourlySales(stationId, dateRange);
  const { data: peakHours = [], isLoading: peakLoading } = usePeakHours(stationId);
  const { data: fuelPerformance = [], isLoading: fuelLoading } = useFuelPerformance(stationId, dateRange);

  return (
    <Tabs defaultValue="hourly" className="space-y-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="hourly">Hourly Patterns</TabsTrigger>
        <TabsTrigger value="peak">Peak Analysis</TabsTrigger>
        <TabsTrigger value="fuel">Fuel Performance</TabsTrigger>
      </TabsList>

      <TabsContent value="hourly">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              Hourly Sales Pattern
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hourlyLoading ? (
              <div className="h-[300px] bg-muted animate-pulse rounded" />
            ) : (
              <ChartContainer config={{ sales: { label: 'Sales', color: '#8b5cf6' } }} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={hourlySales}>
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="peak">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Peak Hours Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            {peakLoading ? (
              <div className="h-[300px] bg-muted animate-pulse rounded" />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {peakHours.map((peak, index) => (
                  <div key={index} className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800">Peak {index + 1}</h4>
                    <p className="text-green-600">{peak.timeRange || `${peak.hour}:00`}</p>
                    <p className="text-sm text-muted-foreground">
                      Avg Sales: ₹{(peak.avgSales || peak.averageRevenue || 0).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="fuel">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fuel className="h-5 w-5 text-orange-600" />
              Fuel Type Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {fuelLoading ? (
              <div className="h-[300px] bg-muted animate-pulse rounded" />
            ) : (
              <ChartContainer config={{ 
                margin: { label: 'Margin %', color: '#f97316' },
                volume: { label: 'Volume', color: '#3b82f6' }
              }} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={fuelPerformance}>
                    <XAxis dataKey="fuelType" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="margin" fill="#f97316" name="Margin %" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
