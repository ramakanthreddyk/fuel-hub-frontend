import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Plus, MapPin } from 'lucide-react';
import { useStations } from '@/hooks/api/useStations';
import { useCashReports } from '@/hooks/api/useCashReports';
import { Station } from '@/shared/types/station';

export function CashReportWidget() {
  const [selectedStationId, setSelectedStationId] = useState('');
  const { data: stations = [], isLoading: stationsLoading } = useStations();
  const { data: cashReports = [] } = useCashReports(selectedStationId);

  // Check if there's already a cash report submitted today for the selected station
  const isSubmitted = useMemo(() => {
    if (!selectedStationId || !cashReports.length) return false;
    
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    return cashReports.some(report => 
      report.stationId === selectedStationId && 
      report.date === today && 
      report.status === 'submitted'
    );
  }, [selectedStationId, cashReports]);

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
              {(stations as Station[]).map((station) => (
                <SelectItem key={station.id} value={station.id}>
                  {station.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={handleSubmit} 
          disabled={!selectedStationId || isSubmitted}
          className="w-full"
          size="sm"
        >
          <Plus className="h-3 w-3 mr-1" />
          {isSubmitted ? 'Already Submitted' : 'Create Cash Report'}
        </Button>
        
        <p className="text-xs text-muted-foreground">
          Report all sales: cash, card, UPI & credit given
        </p>
      </CardContent>
    </Card>
  );
}