
import { useParams } from 'react-router-dom';
import { useCreditor } from '@/hooks/useCreditors';
import { PaymentHistory } from '@/components/creditors/PaymentHistory';
import { PaymentForm } from '@/components/creditors/PaymentForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function CreditorPaymentsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: creditor, isLoading } = useCreditor(id!);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!creditor) {
    return <div>Creditor not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard/creditors')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Creditors
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{creditor.partyName || creditor.name}</h1>
          <p className="text-muted-foreground">Payment history and management</p>
        </div>
      </div>

      {/* Creditor Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Account Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Credit Limit</p>
              <p className="text-lg font-semibold">
                {creditor.creditLimit ? `₹${creditor.creditLimit.toLocaleString()}` : 'Not set'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Outstanding</p>
              <p className="text-lg font-semibold text-red-600">
                ₹{(creditor.currentOutstanding || 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available Credit</p>
              <p className="text-lg font-semibold text-green-600">
                ₹{((creditor.creditLimit || 0) - (creditor.currentOutstanding || 0)).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Form */}
        <PaymentForm creditorId={creditor.id} />
        
        {/* Payment History */}
        <PaymentHistory creditorId={creditor.id} />
      </div>
    </div>
  );
}
