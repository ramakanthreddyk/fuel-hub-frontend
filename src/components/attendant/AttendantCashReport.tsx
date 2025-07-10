
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, DollarSign, CreditCard } from 'lucide-react';
import { useSubmitCashReport, useAttendantCashReports } from '@/hooks/api/useAttendant';
import { format } from 'date-fns';

interface AttendantCashReportProps {
  stationId?: string;
}

export function AttendantCashReport({ stationId }: AttendantCashReportProps) {
  const [cashAmount, setCashAmount] = useState<string>('');
  const [cardAmount, setCardAmount] = useState<string>('');
  const [upiAmount, setUpiAmount] = useState<string>('');
  const [shift, setShift] = useState<'morning' | 'afternoon' | 'night'>('morning');

  const submitCashReport = useSubmitCashReport();
  const { data: reports = [] } = useAttendantCashReports();

  const handleSubmit = async () => {
    if (!stationId || !cashAmount) return;

    try {
      await submitCashReport.mutateAsync({
        stationId,
        reportDate: new Date().toISOString(),
        cashAmount: parseFloat(cashAmount) || 0,
        cardAmount: parseFloat(cardAmount) || 0,
        upiAmount: parseFloat(upiAmount) || 0,
        shift,
        creditEntries: []
      });

      // Reset form
      setCashAmount('');
      setCardAmount('');
      setUpiAmount('');
      setShift('morning');
    } catch (error) {
      console.error('Failed to submit cash report:', error);
    }
  };

  const todayReport = reports.find(report => 
    format(new Date(report.reportDate), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Submit New Report */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Submit Cash Report
          </CardTitle>
          <CardDescription>
            Submit your end-of-day cash and payment totals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Cash Amount</label>
              <Input
                type="number"
                placeholder="0.00"
                value={cashAmount}
                onChange={(e) => setCashAmount(e.target.value)}
                step="0.01"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Card Amount</label>
              <Input
                type="number"
                placeholder="0.00"
                value={cardAmount}
                onChange={(e) => setCardAmount(e.target.value)}
                step="0.01"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">UPI Amount</label>
              <Input
                type="number"
                placeholder="0.00"
                value={upiAmount}
                onChange={(e) => setUpiAmount(e.target.value)}
                step="0.01"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Shift</label>
              <Select value={shift} onValueChange={(value: any) => setShift(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="afternoon">Afternoon</SelectItem>
                  <SelectItem value="night">Night</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="text-sm text-muted-foreground mb-2">
              Total: ₹{(
                (parseFloat(cashAmount) || 0) + 
                (parseFloat(cardAmount) || 0) + 
                (parseFloat(upiAmount) || 0)
              ).toFixed(2)}
            </div>
            
            <Button 
              onClick={handleSubmit} 
              disabled={!stationId || !cashAmount || submitCashReport.isPending}
              className="w-full"
            >
              {submitCashReport.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <DollarSign className="mr-2 h-4 w-4" />
                  Submit Report
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Today's Report Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Today's Status
          </CardTitle>
          <CardDescription>
            Current day report status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {todayReport ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status:</span>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  todayReport.status === 'approved' ? 'bg-green-100 text-green-700' :
                  todayReport.status === 'rejected' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {todayReport.status || 'Pending'}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Cash:</span>
                  <span>₹{todayReport.cashAmount.toFixed(2)}</span>
                </div>
                {todayReport.cardAmount && (
                  <div className="flex justify-between text-sm">
                    <span>Card:</span>
                    <span>₹{todayReport.cardAmount.toFixed(2)}</span>
                  </div>
                )}
                {todayReport.upiAmount && (
                  <div className="flex justify-between text-sm">
                    <span>UPI:</span>
                    <span>₹{todayReport.upiAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-2">
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>₹{(
                      todayReport.cashAmount + 
                      (todayReport.cardAmount || 0) + 
                      (todayReport.upiAmount || 0)
                    ).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No report submitted today</p>
              <p className="text-xs mt-1">Submit your cash report above</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
