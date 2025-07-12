
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function TopCreditorsTable() {
  return (
    <Card className="bg-white border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-slate-900">Top Creditors</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600">Top creditors list will be displayed here</p>
      </CardContent>
    </Card>
  );
}
