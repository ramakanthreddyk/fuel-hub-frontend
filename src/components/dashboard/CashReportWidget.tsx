import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Plus, CheckCircle } from 'lucide-react';

export function CashReportWidget() {
  const [cashAmount, setCashAmount] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    // Navigate to the full cash report page instead of submitting here
    window.location.href = '/dashboard/cash-reports/new';
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <DollarSign className="h-4 w-4 text-green-600" />
          Daily Cash Report
          {isSubmitted && <Badge variant="secondary" className="text-xs">Submitted</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">Cash in Hand (₹)</label>
          <Input
            type="number"
            placeholder="Enter cash amount"
            value={cashAmount}
            onChange={(e) => setCashAmount(e.target.value)}
            disabled={isSubmitted}
          />
        </div>
        
        <Button 
          onClick={handleSubmit}
          className="w-full"
          size="sm"
        >
          <Plus className="h-3 w-3 mr-1" />
          Create Cash Report
        </Button>
        
        <p className="text-xs text-muted-foreground">
          Required for daily reconciliation process
        </p>
      </CardContent>
    </Card>
  );
}