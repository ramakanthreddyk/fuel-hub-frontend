import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateCashReport } from '@/hooks/api/useCashReports';
import { useToast } from '@/hooks/use-toast';

export function CashReportTest() {
  const { toast } = useToast();
  const submitCashReport = useCreateCashReport();
  
  const [formData, setFormData] = useState({
    stationId: 'b4f2399d-8bdb-42d0-9c18-591351f2fc66', // Sample station ID
    cashAmount: 1000,
    cardAmount: 500,
    upiAmount: 300,
    creditAmount: 200,
    shift: 'morning' as const,
    notes: 'Test submission'
  });

  const handleSubmit = async () => {
    try {
      const result = await submitCashReport.mutateAsync(formData);
      toast({
        title: 'Success!',
        description: `Cash report submitted: ₹${result.totalAmount}`,
      });
      console.log('Cash report result:', result);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
      console.error('Cash report error:', error);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>🧪 Cash Report Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Station ID</label>
          <Input 
            value={formData.stationId}
            onChange={(e) => setFormData({...formData, stationId: e.target.value})}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-sm font-medium">Cash</label>
            <Input 
              type="number"
              value={formData.cashAmount}
              onChange={(e) => setFormData({...formData, cashAmount: Number(e.target.value)})}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Card</label>
            <Input 
              type="number"
              value={formData.cardAmount}
              onChange={(e) => setFormData({...formData, cardAmount: Number(e.target.value)})}
            />
          </div>
          <div>
            <label className="text-sm font-medium">UPI</label>
            <Input 
              type="number"
              value={formData.upiAmount}
              onChange={(e) => setFormData({...formData, upiAmount: Number(e.target.value)})}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Credit</label>
            <Input 
              type="number"
              value={formData.creditAmount}
              onChange={(e) => setFormData({...formData, creditAmount: Number(e.target.value)})}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Notes</label>
          <Input 
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
          />
        </div>

        <div className="text-center">
          <p className="text-lg font-bold">
            Total: ₹{(formData.cashAmount + formData.cardAmount + formData.upiAmount + formData.creditAmount).toFixed(2)}
          </p>
        </div>

        <Button 
          onClick={handleSubmit}
          disabled={submitCashReport.isPending}
          className="w-full"
        >
          {submitCashReport.isPending ? 'Submitting...' : 'Test Submit'}
        </Button>
      </CardContent>
    </Card>
  );
}