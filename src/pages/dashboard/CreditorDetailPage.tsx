/**
 * @file pages/dashboard/CreditorDetailPage.tsx
 * @description Page for viewing creditor details
 */
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreditor } from '@/hooks/api/useCreditors';
import { formatCurrency } from '@/utils/formatters';

export default function CreditorDetailPage() {
  const navigate = useNavigate();
  const { creditorId } = useParams<{ creditorId: string }>();
  const { data: creditor, isLoading } = useCreditor(creditorId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!creditor) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">Creditor not found</p>
        <Button onClick={() => navigate('/dashboard/creditors')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Creditors
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/creditors')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Creditors
          </Button>
          <h1 className="text-2xl font-bold">{creditor.partyName}</h1>
        </div>
        <Button onClick={() => navigate(`/dashboard/creditors/${creditorId}/payments/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Payment
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Creditor Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Party Name</p>
              <p className="font-medium">{creditor.partyName}</p>
            </div>
            {creditor.contactPerson && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contact Person</p>
                <p className="font-medium">{creditor.contactPerson}</p>
              </div>
            )}
            {creditor.phoneNumber && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                <p className="font-medium">{creditor.phoneNumber}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-muted-foreground">Credit Limit</p>
              <p className="font-medium">{formatCurrency(creditor.creditLimit || 0)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Outstanding Amount</p>
              <p className="font-medium text-red-600">{formatCurrency(creditor.outstandingAmount || 0)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <p className="font-medium capitalize">{creditor.isActive ? 'Active' : 'Inactive'}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Payment history will be displayed here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}