
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StationMetricsCard } from './StationMetricsCard';
import { useStationMetrics } from '@/hooks/api/useDashboard';

export function StationMetricsList() {
  const { data: stationMetrics = [], isLoading, error } = useStationMetrics();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Station Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !Array.isArray(stationMetrics) || stationMetrics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Station Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No station metrics available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Station Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {stationMetrics.slice(0, 6).map((station) => (
            <StationMetricsCard
              key={station.id}
              station={station}
              onClick={() => {
                // TODO: Navigate to station details
                console.log('Navigate to station:', station.id);
              }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
