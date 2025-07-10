
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useAttendantStations, useAttendantPumps, useAttendantNozzles } from '@/hooks/api/useAttendant';
import { Plus } from 'lucide-react';

export default function AttendantReadingsPage() {
  const [selectedStationId, setSelectedStationId] = useState<string>('');
  const [selectedPumpId, setSelectedPumpId] = useState<string>('');
  
  const { data: stations = [], isLoading: stationsLoading } = useAttendantStations();
  const { data: pumps = [], isLoading: pumpsLoading } = useAttendantPumps(selectedStationId);
  const { data: nozzles = [], isLoading: nozzlesLoading } = useAttendantNozzles(selectedPumpId);

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Record Readings</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Reading
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <div>
          <Label htmlFor="station">Station</Label>
          <Select value={selectedStationId} onValueChange={setSelectedStationId} disabled={stationsLoading}>
            <SelectTrigger id="station">
              <SelectValue placeholder={stationsLoading ? "Loading..." : "Select station"} />
            </SelectTrigger>
            <SelectContent>
              {stations.map(station => (
                <SelectItem key={station.id} value={station.id}>
                  {station.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="pump">Pump</Label>
          <Select value={selectedPumpId} onValueChange={setSelectedPumpId} disabled={!selectedStationId || pumpsLoading}>
            <SelectTrigger id="pump">
              <SelectValue placeholder={pumpsLoading ? "Loading..." : "Select pump"} />
            </SelectTrigger>
            <SelectContent>
              {pumps.map(pump => (
                <SelectItem key={pump.id} value={pump.id}>
                  {pump.name || `Pump ${pump.id.slice(0, 8)}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedPumpId && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {nozzlesLoading ? (
            Array(3).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-10 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            nozzles.map((nozzle) => (
              <Card key={nozzle.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Nozzle {nozzle.nozzleNumber} - {nozzle.fuelType}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`reading-${nozzle.id}`}>Current Reading</Label>
                      <Input
                        id={`reading-${nozzle.id}`}
                        type="number"
                        placeholder="Enter reading"
                        step="0.01"
                      />
                    </div>
                    <Button className="w-full">Record Reading</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
