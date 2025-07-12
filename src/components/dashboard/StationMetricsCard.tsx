
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StationMetricsCardProps {
  station: any;
}

export function StationMetricsCard({ station }: StationMetricsCardProps) {
  return (
    <Card className="bg-white border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-slate-900">{station.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600">Station metrics will be displayed here</p>
      </CardContent>
    </Card>
  );
}
