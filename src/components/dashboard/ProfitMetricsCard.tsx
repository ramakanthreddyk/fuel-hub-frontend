
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProfitMetricsCardProps {
  filters: any;
}

export function ProfitMetricsCard({ filters }: ProfitMetricsCardProps) {
  return (
    <Card className="bg-white border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-slate-900">Profit Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600">Profit analysis will be displayed here</p>
      </CardContent>
    </Card>
  );
}
