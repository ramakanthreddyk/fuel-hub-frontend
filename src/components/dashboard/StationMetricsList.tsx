
import { SafeText, SafeHtml } from '@/components/ui/SafeHtml';
import { secureLog } from '@/utils/security';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StationMetricsCard } from './StationMetricsCard';
import { useStationMetrics } from '@/hooks/api/useDashboard';
import { Building2 } from 'lucide-react';
import { FuelLoader } from '@/components/ui/FuelLoader';

export function StationMetricsList() {
  const { data: stationMetrics = [], isLoading, error, refetch } = useStationMetrics();
  
  secureLog.debug('StationMetricsList render:', { 
    stationMetrics, 
    isLoading, 
    error,
    hasData: stationMetrics?.length > 0
  }); // Debug log
  
  // Force refetch on mount
  React.useEffect(() => {
    secureLog.debug('StationMetricsList mounted, forcing refetch');
    refetch();
  }, [refetch]);

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
            <FuelLoader size="md" text="Loading station metrics..." />
            <span className="ml-3 text-gray-600">Loading station metrics...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  secureLog.debug('Station metrics data:', stationMetrics, 'Error:', error); // Debug log
  
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
            secureLog.debug('Station metric data:', stationMetric); // Debug log
            // Map StationMetric to StationMetrics interface
            const mappedStation = {
              id: stationMetric.id,
              name: stationMetric.name,
              totalSales: Number(stationMetric.todaySales) || 0,
              monthlySales: Number(stationMetric.monthlySales) || 0,
              activePumps: Number(stationMetric.activePumps) || 0,
              totalPumps: Number(stationMetric.totalPumps) || 0,
              status: stationMetric.status as 'active' | 'inactive' | 'maintenance',
              lastActivity: stationMetric.lastActivity,
              efficiency: Number(stationMetric.efficiency) || 0,
              salesGrowth: stationMetric.salesGrowth ? Number(stationMetric.salesGrowth) : undefined
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
