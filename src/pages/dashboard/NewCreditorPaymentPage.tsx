/**
 * @file pages/dashboard/NewCreditorPaymentPage.tsx
 * @description Page for adding new creditor payments
 */
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, DollarSign, Loader2 } from 'lucide-react';
import { useCreditor } from '@/hooks/api/useCreditors';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/utils/formatters';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { creditorService } from '@/api/services/creditorService';

export default function NewCreditorPaymentPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { creditorId } = useParams<{ creditorId: string }>();
  const { data: creditor, isLoading } = useCreditor(creditorId);
  
  const [amount, setAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!creditorId) {
      toast({
        title: 'Error',
        description: 'Creditor ID is missing',
        variant: 'destructive',
      });
      return;
    }
    
    if (amount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter an amount greater than zero',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await creditorService.createPayment({
        creditorId,
        amount,
        paymentMethod,
        referenceNumber: referenceNumber || undefined,
        notes: notes || undefined,
        receivedAt: new Date().toISOString(),
      });
      
      toast({
        title: 'Payment Added',
        description: `Payment of ${formatCurrency(amount)} has been recorded successfully.`,
        variant: 'success',
      });
      
      navigate(`/dashboard/creditors/${creditorId}`);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <Button variant="outline" size="sm" onClick={() => navigate(`/dashboard/creditors/${creditorId}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Creditor
          </Button>
          <h1 className="text-2xl font-bold">Add Payment</h1>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Details for {creditor.partyName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Outstanding Amount:</span>
                <span className="text-xl font-bold text-red-600">{formatCurrency(creditor.outstandingAmount || 0)}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Payment Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  className="pl-8"
                  value={amount || ''}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger id="paymentMethod">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="referenceNumber">Reference Number (Optional)</Label>
              <Input
                id="referenceNumber"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="e.g., Check number, transaction ID"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/dashboard/creditors/${creditorId}`)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || amount <= 0}
          >
            {isSubmitting ? 'Processing...' : 'Record Payment'}
          </Button>
        </div>
      </form>
    </div>
  );
}