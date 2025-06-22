
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ReconciliationTable } from '@/components/reconciliation/ReconciliationTable';
import { ReconciliationSummary } from '@/components/reconciliation/ReconciliationSummary';
import { ReconciliationForm } from '@/components/reconciliation/ReconciliationForm';
import { useDailyReadingsSummary } from '@/hooks/useReconciliation';
import { useStations } from '@/hooks/useStations';
import { format } from 'date-fns';

export default function ReconciliationPage() {
  const [selectedStationId, setSelectedStationId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

  const { data: stations = [] } = useStations();
  const { data: readings = [], isLoading } = useDailyReadingsSummary(selectedStationId, selectedDate);

  // Auto-select first station if available
  if (stations.length > 0 && !selectedStationId) {
    setSelectedStationId(stations[0].id);
  }

  const handleReconciliationSuccess = () => {
    // Optionally navigate away or show success message
    console.log('Reconciliation completed successfully');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Daily Reconciliation</h1>
        <p className="text-muted-foreground">
          Review daily sales and reconcile cash received with expected amounts
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Select Station & Date</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="station">Station</Label>
              <Select value={selectedStationId} onValueChange={setSelectedStationId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a station" />
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

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={format(new Date(), 'yyyy-MM-dd')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {readings.length > 0 && (
        <ReconciliationSummary readings={readings} />
      )}

      {/* Readings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Readings & Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <ReconciliationTable readings={readings} isLoading={isLoading} />
        </CardContent>
      </Card>

      {/* Reconciliation Form */}
      {readings.length > 0 && selectedStationId && (
        <ReconciliationForm
          stationId={selectedStationId}
          date={selectedDate}
          readings={readings}
          onSuccess={handleReconciliationSuccess}
        />
      )}
    </div>
  );
}
