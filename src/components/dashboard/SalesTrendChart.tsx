
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SalesTrendChartProps {
  filters: any;
}

export function SalesTrendChart({ filters }: SalesTrendChartProps) {
  return (
    <Card className="bg-white border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-slate-900">Sales Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600">Sales trend chart will be displayed here</p>
      </CardContent>
    </Card>
  );
}
