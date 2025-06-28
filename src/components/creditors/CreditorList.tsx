
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCreditors } from '@/hooks/useCreditors';
import { useNavigate } from 'react-router-dom';
import { Eye, CreditCard } from 'lucide-react';

export function CreditorList() {
  const { data: creditors, isLoading } = useCreditors();
  const navigate = useNavigate();

  if (isLoading) {
    return <div>Loading creditors...</div>;
  }

  if (!creditors || creditors.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">No creditors found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {creditors.map((creditor) => (
        <Card key={creditor.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{creditor.partyName}</CardTitle>
              <Badge variant="default">Active</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Credit Limit:</span>
                <span className="font-medium">
                  {creditor.creditLimit ? `₹${creditor.creditLimit.toLocaleString()}` : 'Not set'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Outstanding:</span>
                <span className="font-medium text-red-600">
                  ₹{(creditor.outstandingAmount || 0).toLocaleString()}
                </span>
              </div>
              {creditor.phoneNumber && (
                <div className="flex justify-between text-sm">
                  <span>Contact:</span>
                  <span>{creditor.phoneNumber}</span>
                </div>
              )}
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/dashboard/creditors/${creditor.id}/payments`)}
                className="flex-1"
              >
                <Eye className="mr-2 h-4 w-4" />
                View Payments
              </Button>
              <Button
                size="sm"
                onClick={() => navigate(`/dashboard/creditors/${creditor.id}/payments`)}
                className="flex-1"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Add Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
