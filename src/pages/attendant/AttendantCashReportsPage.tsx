
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAttendantStations, useCashReports, useCreateCashReport } from '@/hooks/api/useAttendant';
import { Plus, DollarSign } from 'lucide-react';

export default function AttendantCashReportsPage() {
  const [selectedStationId, setSelectedStationId] = useState<string>('');
  const [showNewReport, setShowNewReport] = useState(false);
  
  const { data: stations = [] } = useAttendantStations();
  const { data: reports = [] } = useCashReports(selectedStationId);
  const createReport = useCreateCashReport();

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    setShowNewReport(false);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cash Reports</h1>
        <Button onClick={() => setShowNewReport(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Cash Report
        </Button>
      </div>

      <div className="mb-6">
        <Label htmlFor="station">Filter by Station</Label>
        <Select value={selectedStationId} onValueChange={setSelectedStationId}>
          <SelectTrigger id="station" className="w-full md:w-[300px]">
            <SelectValue placeholder="All stations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All stations</SelectItem>
            {stations.map(station => (
              <SelectItem key={station.id} value={station.id}>
                {station.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showNewReport && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>New Cash Report</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReport} className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="cash">Cash Amount</Label>
                <Input id="cash" type="number" step="0.01" placeholder="0.00" />
              </div>
              <div>
                <Label htmlFor="card">Card Amount</Label>
                <Input id="card" type="number" step="0.01" placeholder="0.00" />
              </div>
              <div>
                <Label htmlFor="upi">UPI Amount</Label>
                <Input id="upi" type="number" step="0.01" placeholder="0.00" />
              </div>
              <div>
                <Label htmlFor="shift">Shift</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning</SelectItem>
                    <SelectItem value="afternoon">Afternoon</SelectItem>
                    <SelectItem value="night">Night</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 flex gap-2">
                <Button type="submit">Submit Report</Button>
                <Button type="button" variant="outline" onClick={() => setShowNewReport(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {reports.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No cash reports found</p>
            </CardContent>
          </Card>
        ) : (
          reports.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span>Report #{report.id?.slice(0, 8)}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(report.reportDate).toLocaleDateString()}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Cash</p>
                    <p className="font-medium">${report.cashAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Card</p>
                    <p className="font-medium">${(report.cardAmount || 0).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">UPI</p>
                    <p className="font-medium">${(report.upiAmount || 0).toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
