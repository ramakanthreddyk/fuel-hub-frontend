
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreatePayment } from '@/hooks/useCreditors';

interface PaymentFormProps {
  creditorId: string;
  onSuccess?: () => void;
}

export default function PaymentForm({ creditorId, onSuccess }: PaymentFormProps) {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi' | 'bank_transfer' | 'cheque'>('cash');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');

  const createPayment = useCreatePayment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || Number(amount) <= 0) return;

    createPayment.mutate({
      creditorId,
      amount: Number(amount),
      paymentDate: new Date().toISOString(),
      paymentMethod,
      referenceNumber: referenceNumber || undefined,
      notes: notes || undefined,
    });

    // Reset form on success
    setAmount('');
    setReferenceNumber('');
    setNotes('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record New Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount (₹) *</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter payment amount"
              min="0"
              step="0.01"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="paymentMethod">Payment Method *</Label>
            <Select value={paymentMethod} onValueChange={(value: 'cash' | 'card' | 'upi' | 'bank_transfer' | 'cheque') => setPaymentMethod(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="referenceNumber">Reference Number</Label>
            <Input
              id="referenceNumber"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="Transaction ID, etc."
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes (optional)"
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            disabled={createPayment.isPending || !amount || Number(amount) <= 0}
            className="w-full"
          >
            {createPayment.isPending ? 'Recording...' : 'Record Payment'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
