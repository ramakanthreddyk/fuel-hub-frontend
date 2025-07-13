
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useHourlySales, usePeakHours, useFuelPerformance } from '@/hooks/useAnalytics';
import { Clock, TrendingUp, Fuel } from 'lucide-react';
import { formatCurrency, formatVolume } from '@/utils/formatters';

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
                    <XAxis 
                      dataKey="hour" 
                      tickFormatter={(hour) => `${hour}:00`}
                      label={{ value: 'Hour of Day', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis />
                    <ChartTooltip 
                      content={(props) => {
                        if (!props.active || !props.payload) return null;
                        const data = props.payload[0]?.payload;
                        if (!data) return null;
                        
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-md">
                            <div className="font-medium">Hour: {data.hour}:00</div>
                            <div className="text-sm text-muted-foreground">
                              <div>Sales: {formatCurrency(data.revenue, { useLakhsCrores: true })}</div>
                              <div>Volume: {formatVolume(data.volume)}</div>
                              <div>Transactions: {data.salesCount || 0}</div>
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} name="Sales" />
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
                  <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800">Peak {index + 1}</h4>
                    <p className="text-green-600 font-medium">{peak.timeRange || `${peak.hour}:00`}</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm flex justify-between">
                        <span className="text-muted-foreground">Avg Sales:</span>
                        <span className="font-medium">{formatCurrency(peak.avgSales || peak.averageRevenue || 0, { useLakhsCrores: true })}</span>
                      </p>
                      <p className="text-sm flex justify-between">
                        <span className="text-muted-foreground">Avg Volume:</span>
                        <span className="font-medium">{formatVolume(peak.avgVolume || peak.averageVolume || 0)}</span>
                      </p>
                      <p className="text-sm flex justify-between">
                        <span className="text-muted-foreground">Avg Transactions:</span>
                        <span className="font-medium">{peak.averageSalesCount || 0}</span>
                      </p>
                    </div>
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
                sales: { label: 'Sales', color: '#3b82f6' },
                volume: { label: 'Volume', color: '#22c55e' },
                margin: { label: 'Margin %', color: '#f97316' },
                growth: { label: 'Growth %', color: '#ef4444' }
              }} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={fuelPerformance}>
                    <XAxis dataKey="fuelType" />
                    <YAxis />
                    <ChartTooltip
                      content={(props) => {
                        if (!props.active || !props.payload) return null;
                        const data = props.payload[0]?.payload;
                        if (!data) return null;
                        
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-md">
                            <div className="font-medium">{data.fuelType}</div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <div>Sales: {formatCurrency(data.sales || data.revenue || 0, { useLakhsCrores: true })}</div>
                              <div>Volume: {formatVolume(data.volume || 0)}</div>
                              <div>Avg Price: {formatCurrency(data.averagePrice || 0)}/L</div>
                              <div className={`${data.growth >= 0 ? 'text-green-600' : 'text-red-600'} font-medium`}>
                                Growth: {data.growth >= 0 ? '+' : ''}{data.growth}%
                              </div>
                              <div>Margin: {data.margin}%</div>
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Bar dataKey="sales" fill="#3b82f6" name="Sales" />
                    <Bar dataKey="volume" fill="#22c55e" name="Volume" />
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
