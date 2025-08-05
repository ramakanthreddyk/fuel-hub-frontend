import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Plus, CheckCircle, CreditCard, Smartphone, Users, MapPin } from 'lucide-react';
import { useStations } from '@/hooks/api/useStations';

export function CashReportWidget() {
  const [amounts, setAmounts] = useState({
    cash: '',
    card: '',
    upi: '',
    credit: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleAmountChange = (type: string, value: string) => {
    setAmounts(prev => ({ ...prev, [type]: value }));
  };

  const getTotalAmount = () => {
    return Object.values(amounts).reduce((sum, amount) => {
      return sum + (parseFloat(amount) || 0);
    }, 0);
  };

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
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-xs font-medium flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              Cash (₹)
            </label>
            <Input
              type="number"
              placeholder="0"
              value={amounts.cash}
              onChange={(e) => handleAmountChange('cash', e.target.value)}
              disabled={isSubmitted}
              className="text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium flex items-center gap-1">
              <CreditCard className="h-3 w-3" />
              Card (₹)
            </label>
            <Input
              type="number"
              placeholder="0"
              value={amounts.card}
              onChange={(e) => handleAmountChange('card', e.target.value)}
              disabled={isSubmitted}
              className="text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium flex items-center gap-1">
              <Smartphone className="h-3 w-3" />
              UPI (₹)
            </label>
            <Input
              type="number"
              placeholder="0"
              value={amounts.upi}
              onChange={(e) => handleAmountChange('upi', e.target.value)}
              disabled={isSubmitted}
              className="text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium flex items-center gap-1">
              <Users className="h-3 w-3" />
              Credit (₹)
            </label>
            <Input
              type="number"
              placeholder="0"
              value={amounts.credit}
              onChange={(e) => handleAmountChange('credit', e.target.value)}
              disabled={isSubmitted}
              className="text-sm"
            />
          </div>
        </div>
        
        {getTotalAmount() > 0 && (
          <div className="bg-gray-50 p-2 rounded text-center">
            <span className="text-sm font-medium">Total: ₹{getTotalAmount().toFixed(2)}</span>
          </div>
        )}
        
        <Button 
          onClick={handleSubmit}
          className="w-full"
          size="sm"
        >
          <Plus className="h-3 w-3 mr-1" />
          Create Cash Report
        </Button>
        
        <p className="text-xs text-muted-foreground">
          Report all sales: cash, card, UPI & credit given
        </p>
      </CardContent>
    </Card>
  );
}