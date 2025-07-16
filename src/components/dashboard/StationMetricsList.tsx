
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StationMetricsCard } from './StationMetricsCard';
import { useStationMetrics } from '@/hooks/api/useDashboard';
import { Building2, Loader2 } from 'lucide-react';

export function StationMetricsList() {
  const { data: stationMetrics = [], isLoading, error } = useStationMetrics();

  if (isLoading) {
    return (
      <Card className="bg-white border border-gray-200 rounded-xl w-full">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
            <div className="p-2 rounded-lg bg-blue-100">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            Station Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Loading station metrics...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !stationMetrics || !Array.isArray(stationMetrics) || stationMetrics.length === 0) {
    return (
      <Card className="bg-white border border-gray-200 rounded-xl w-full">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
            <div className="p-2 rounded-lg bg-blue-100">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            Station Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No station metrics available</p>
            <p className="text-sm text-gray-500 mt-2">
              Station data will appear here once your stations are configured
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border border-gray-200 rounded-xl w-full">
      <CardHeader className="pb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
          <div className="p-2 rounded-lg bg-white/20">
            <Building2 className="h-5 w-5" />
          </div>
          Station Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {/* Updated grid to show maximum 2 cards per row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {stationMetrics.slice(0, 10).map((stationMetric) => {
            // Map StationMetric to StationMetrics interface
            const mappedStation = {
              id: stationMetric.id,
              name: stationMetric.name,
              totalSales: stationMetric.todaySales || 0,
              monthlySales: stationMetric.monthlySales || 0,
              activePumps: stationMetric.activePumps,
              totalPumps: stationMetric.totalPumps,
              status: stationMetric.status,
              lastActivity: stationMetric.lastActivity,
              efficiency: stationMetric.efficiency,
              salesGrowth: stationMetric.salesGrowth
            };

            return (
              <StationMetricsCard
                key={stationMetric.id}
                station={mappedStation}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
