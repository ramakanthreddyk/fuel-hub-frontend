
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FuelBreakdownChartProps {
  filters: any;
}

export function FuelBreakdownChart({ filters }: FuelBreakdownChartProps) {
  return (
    <Card className="bg-white border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-slate-900">Fuel Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600">Fuel type breakdown will be displayed here</p>
      </CardContent>
    </Card>
  );
}
