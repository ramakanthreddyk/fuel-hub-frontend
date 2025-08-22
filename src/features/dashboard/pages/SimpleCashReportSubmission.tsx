import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useStations } from '@/hooks/api/useStations';
import { useCreateCashReport } from '@/hooks/api/useCashReports';
import { useCreditors } from '@/hooks/api/useCreditors';
import { ArrowLeft, DollarSign, CreditCard, Smartphone, Users } from 'lucide-react';

export default function SimpleCashReportSubmission() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: stations = [], isLoading: stationsLoading } = useStations();
  const submitCashReport = useCreateCashReport();

  const [selectedStationId, setSelectedStationId] = useState<string>('');
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [cardAmount, setCardAmount] = useState<number>(0);
  const [upiAmount, setUpiAmount] = useState<number>(0);
  const [creditAmount, setCreditAmount] = useState<number>(0);
  const [selectedCreditorId, setSelectedCreditorId] = useState<string>('');
  const [shift, setShift] = useState<'morning' | 'afternoon' | 'night'>('morning');
  const [notes, setNotes] = useState<string>('');

  const { data: creditors = [], isLoading: creditorsLoading } = useCreditors(selectedStationId);

  const totalAmount = cashAmount + cardAmount + upiAmount + creditAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedStationId) {
      toast({
        title: 'Missing Station',
        description: 'Please select a station',
        variant: 'destructive'
      });
      return;
    }

    if (totalAmount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter at least one payment amount greater than zero',
        variant: 'destructive'
      });
      return;
    }

    if (creditAmount > 0 && !selectedCreditorId) {
      toast({
        title: 'Creditor Required',
        description: 'Please select a creditor when entering credit amount',
        variant: 'destructive'
      });
      return;
    }

    try {
      await submitCashReport.mutateAsync({
        stationId: selectedStationId,
        cashAmount,
        cardAmount,
        upiAmount,
        creditAmount,
        creditorId: creditAmount > 0 ? selectedCreditorId : undefined,
        shift,
        notes: notes.trim() || undefined,
        date: new Date().toISOString().split('T')[0]
      });

      toast({
        title: 'Cash Report Submitted',
        description: `Successfully submitted ${shift} shift report for ₹${totalAmount.toFixed(2)}`,
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Submission Failed',
        description: error.message || 'Failed to submit cash report. Please try again.',
        variant: 'destructive'
      });
    }
  };

  if (stationsLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">Submit Cash Report</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Cash Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Station Selection */}
            <div className="space-y-2">
              <Label htmlFor="station">Station</Label>
              <Select value={selectedStationId} onValueChange={setSelectedStationId}>
                <SelectTrigger id="station">
                  <SelectValue placeholder="Select station" />
                </SelectTrigger>
                <SelectContent>
                  {stations.map((station) => (
                    <SelectItem key={station.id} value={station.id}>
                      {station.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Shift */}
            <div className="space-y-2">
              <Label htmlFor="shift">Shift</Label>
              <Select value={shift} onValueChange={(value: 'morning' | 'afternoon' | 'night') => setShift(value)}>
                <SelectTrigger id="shift">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="afternoon">Afternoon</SelectItem>
                  <SelectItem value="night">Night</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Method Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cashAmount">Cash Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="cashAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    className="pl-8"
                    value={cashAmount || ''}
                    onChange={(e) => setCashAmount(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardAmount">Card Amount</Label>
                <div className="relative">
                  <CreditCard className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="cardAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    className="pl-8"
                    value={cardAmount || ''}
                    onChange={(e) => setCardAmount(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="upiAmount">UPI Amount</Label>
                <div className="relative">
                  <Smartphone className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="upiAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    className="pl-8"
                    value={upiAmount || ''}
                    onChange={(e) => setUpiAmount(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="creditAmount">Credit Amount</Label>
                <div className="relative">
                  <Users className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="creditAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    className="pl-8"
                    value={creditAmount || ''}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      setCreditAmount(value);
                      if (value === 0) setSelectedCreditorId('');
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Creditor Selection - Only show when credit amount > 0 */}
            {creditAmount > 0 && (
              <div className="space-y-2">
                <Label htmlFor="creditor">Select Creditor *</Label>
                <Select value={selectedCreditorId} onValueChange={setSelectedCreditorId}>
                  <SelectTrigger id="creditor">
                    <SelectValue placeholder="Select creditor for credit transaction" />
                  </SelectTrigger>
                  <SelectContent>
                    {creditorsLoading ? (
                      <SelectItem value="loading" disabled>Loading creditors...</SelectItem>
                    ) : creditors.length === 0 ? (
                      <SelectItem value="none" disabled>No creditors available</SelectItem>
                    ) : (
                      creditors.map((creditor) => (
                        <SelectItem key={creditor.id} value={creditor.id}>
                          {creditor.partyName} - ₹{creditor.creditLimit} limit
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {creditAmount > 0 && !selectedCreditorId && (
                  <p className="text-sm text-red-600">Creditor selection is required for credit transactions</p>
                )}
              </div>
            )}

            {/* Total Amount Display */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Amount:</span>
                <span className="text-xl font-bold">₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                <div className="grid grid-cols-2 gap-2">
                  <div>Cash: ₹{cashAmount.toFixed(2)}</div>
                  <div>Card: ₹{cardAmount.toFixed(2)}</div>
                  <div>UPI: ₹{upiAmount.toFixed(2)}</div>
                  <div>Credit: ₹{creditAmount.toFixed(2)}</div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes..."
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitCashReport.isPending || !selectedStationId}
          >
            {submitCashReport.isPending ? 'Submitting...' : 'Submit Cash Report'}
          </Button>
        </div>
      </form>
    </div>
  );
}