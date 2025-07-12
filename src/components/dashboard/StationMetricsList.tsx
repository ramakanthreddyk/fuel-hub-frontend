
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function StationMetricsList() {
  return (
    <Card className="bg-white border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-slate-900">Station Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600">Station metrics list will be displayed here</p>
      </CardContent>
    </Card>
  );
}
