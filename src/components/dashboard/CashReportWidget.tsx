import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Plus, MapPin } from 'lucide-react';
import { useStations } from '@/hooks/api/useStations';

export function CashReportWidget() {
  const [selectedStationId, setSelectedStationId] = useState('');
  const { data: stations = [] } = useStations();

  const handleSubmit = () => {
    if (!selectedStationId) return;
    window.location.href = `/dashboard/cash-reports/new?stationId=${selectedStationId}`;
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
          <label className="text-xs font-medium flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            Station
          </label>
          <Select value={selectedStationId} onValueChange={setSelectedStationId} disabled={isSubmitted || stationsLoading}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder={stationsLoading ? "Loading..." : "Select station"} />
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
        
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-xs font-medium flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              Cash (₹)
            </label>
            <Input
              type="number"
              placeholder="0"
              value={amounts.cashAmount}
              onChange={(e) => handleAmountChange('cashAmount', e.target.value)}
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
              value={amounts.cardAmount}
              onChange={(e) => handleAmountChange('cardAmount', e.target.value)}
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
              value={amounts.upiAmount}
              onChange={(e) => handleAmountChange('upiAmount', e.target.value)}
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
              value={amounts.creditAmount}
              onChange={(e) => handleAmountChange('creditAmount', e.target.value)}
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