
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PaymentMethodChartProps {
  filters: any;
}

export function PaymentMethodChart({ filters }: PaymentMethodChartProps) {
  return (
    <Card className="bg-white border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-slate-900">Payment Methods</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600">Payment method breakdown will be displayed here</p>
      </CardContent>
    </Card>
  );
}
