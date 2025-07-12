
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SalesSummaryCardProps {
  filters: any;
}

export function SalesSummaryCard({ filters }: SalesSummaryCardProps) {
  return (
    <Card className="bg-white border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-slate-900">Sales Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600">Sales data will be displayed here</p>
      </CardContent>
    </Card>
  );
}
