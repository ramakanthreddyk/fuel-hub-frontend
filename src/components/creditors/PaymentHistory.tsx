
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePayments } from '@/hooks/useCreditors';
import { format } from 'date-fns';

interface PaymentHistoryProps {
  creditorId: string;
}

export function PaymentHistory({ creditorId }: PaymentHistoryProps) {
  const { data: payments, isLoading } = usePayments(creditorId);

  if (isLoading) {
    return <div>Loading payment history...</div>;
  }

  if (!payments || payments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center">No payments recorded</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">₹{payment.amount.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(payment.createdAt), 'MMM dd, yyyy')}
                </div>
                {payment.referenceNumber && (
                  <div className="text-xs text-muted-foreground">
                    Ref: {payment.referenceNumber}
                  </div>
                )}
                {payment.notes && (
                  <div className="text-xs text-muted-foreground">
                    {payment.notes}
                  </div>
                )}
              </div>
              <Badge variant="outline">
                {payment.paymentMethod.replace('_', ' ')}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
