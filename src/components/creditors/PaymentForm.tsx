
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { creditorsService } from '@/api/services/creditors.service';
import { useToast } from '@/hooks/use-toast';

interface PaymentFormProps {
  creditorId: string;
  onSuccess?: () => void;
}

export default function PaymentForm({ creditorId, onSuccess }: PaymentFormProps) {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi' | 'bank_transfer' | 'cheque'>('cash');
  const [referenceNumber, setReferenceNumber] = useState('');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createPayment = useMutation({
    mutationFn: creditorsService.createPayment,
    onSuccess: () => {
      toast({
        title: 'Payment recorded',
        description: 'Payment has been successfully recorded.',
      });
      queryClient.invalidateQueries({ queryKey: ['creditors'] });
      queryClient.invalidateQueries({ queryKey: ['creditor', creditorId] });
      setAmount('');
      setReferenceNumber('');
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to record payment',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || Number(amount) <= 0) return;

    createPayment.mutate({
      creditorId,
      amount: Number(amount),
      paymentMethod,
      referenceNumber: referenceNumber || undefined,
    });
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
