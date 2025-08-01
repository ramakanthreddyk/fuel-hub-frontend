/**
 * @file QuickReadingModal.tsx
 * @description Quick modal for entering readings without navigation
 */

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useStations } from '@/hooks/api/useStations';
import { usePumps } from '@/hooks/api/usePumps';
import { useNozzles } from '@/hooks/api/useNozzles';
import { useCreateReading, useReadings } from '@/hooks/api/useReadings';
import { Fuel, Gauge, MapPin, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface QuickReadingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselected?: {
    stationId?: string;
    pumpId?: string;
    nozzleId?: string;
  };
}

export function QuickReadingModal({ open, onOpenChange, preselected }: QuickReadingModalProps) {
  const [stationId, setStationId] = useState(preselected?.stationId || '');
  const [pumpId, setPumpId] = useState(preselected?.pumpId || '');
  const [nozzleId, setNozzleId] = useState(preselected?.nozzleId || '');
  const [reading, setReading] = useState('');
  const [notes, setNotes] = useState('');

  // Fetch data
  const { data: stations = [], isLoading: stationsLoading, error: stationsError } = useStations();
  const { data: pumps = [], isLoading: pumpsLoading } = usePumps(stationId || undefined);
  const { data: nozzles = [], isLoading: nozzlesLoading } = useNozzles(pumpId || undefined);
  const createReadingMutation = useCreateReading();

  // Fetch last reading for the selected nozzle
  const { data: readings = [] } = useReadings({
    nozzleId: nozzleId || undefined,
    limit: 1,
    sortBy: 'recordedAt',
    sortOrder: 'desc'
  });

  // Update preselected values when they change
  useEffect(() => {
    if (preselected?.stationId) setStationId(preselected.stationId);
    if (preselected?.pumpId) setPumpId(preselected.pumpId);
    if (preselected?.nozzleId) setNozzleId(preselected.nozzleId);
  }, [preselected]);

  // Reset dependent selections when parent changes
  useEffect(() => {
    if (stationId) {
      // Keep pump and nozzle if they belong to the selected station
      const stationPumps = pumps.filter(p => p.stationId === stationId);
      if (pumpId && !stationPumps.find(p => p.id === pumpId)) {
        setPumpId('');
        setNozzleId('');
      }
    } else {
      setPumpId('');
      setNozzleId('');
    }
  }, [stationId, pumps]);

  useEffect(() => {
    if (pumpId) {
      // Keep nozzle if it belongs to the selected pump
      const pumpNozzles = nozzles.filter(n => n.pumpId === pumpId);
      if (nozzleId && !pumpNozzles.find(n => n.id === nozzleId)) {
        setNozzleId('');
      }
    } else {
      setNozzleId('');
    }
  }, [pumpId, nozzles]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setReading('');
      setNotes('');
      if (!preselected?.stationId) setStationId('');
      if (!preselected?.pumpId) setPumpId('');
      if (!preselected?.nozzleId) setNozzleId('');
    }
  }, [open, preselected]);

  // Get selected items for display
  const selectedStation = stations.find(s => s.id === stationId);
  const selectedPump = pumps.find(p => p.id === pumpId);
  const selectedNozzle = nozzles.find(n => n.id === nozzleId);

  // Get last reading
  const lastReading = readings.length > 0 ? readings[0] : null;

  // Debug logging
  console.log('[QUICK-READING] State:', { stationId, pumpId, nozzleId, stations: stations.length, pumps: pumps.length, nozzles: nozzles.length });

  // Handlers for selection changes
  const handleStationChange = (value: string) => {
    console.log('[QUICK-READING] Station changed to:', value);
    setStationId(value);
  };

  const handlePumpChange = (value: string) => {
    console.log('[QUICK-READING] Pump changed to:', value);
    setPumpId(value);
  };

  const handleNozzleChange = (value: string) => {
    console.log('[QUICK-READING] Nozzle changed to:', value);
    setNozzleId(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stationId || !pumpId || !nozzleId || !reading) {
      toast.error('Please fill in all required fields');
      return;
    }

    const readingValue = parseFloat(reading);
    if (isNaN(readingValue) || readingValue < 0) {
      toast.error('Please enter a valid reading value');
      return;
    }

    // Validate against previous reading
    if (lastReading && readingValue < lastReading.reading) {
      toast.error(`Current reading (${readingValue}L) cannot be less than previous reading (${lastReading.reading}L)`);
      return;
    }

    // Warn if reading seems too high (more than 10,000L increase)
    if (lastReading && (readingValue - lastReading.reading) > 10000) {
      const confirmed = window.confirm(
        `The reading increase is ${(readingValue - lastReading.reading).toLocaleString()}L. This seems unusually high. Are you sure this is correct?`
      );
      if (!confirmed) return;
    }

    try {
      await createReadingMutation.mutateAsync({
        nozzleId,
        reading: readingValue,
        notes: notes.trim() || undefined,
        recordedAt: new Date().toISOString()
      });

      toast.success('Reading recorded successfully!');
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating reading:', error);
      toast.error('Failed to record reading. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-blue-600" />
            Quick Reading Entry
          </DialogTitle>
        </DialogHeader>

        {/* Error handling */}
        {stationsError && (
          <div className="text-red-600 text-sm p-3 bg-red-50 rounded-lg border border-red-200">
            Failed to load stations. Please refresh and try again.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Station Selection */}
          <div className="space-y-2">
            <Label htmlFor="station">Station *</Label>
            <Select value={stationId} onValueChange={handleStationChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select station" />
              </SelectTrigger>
              <SelectContent>
                {stations.map((station) => (
                  <SelectItem key={station.id} value={station.id}>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {station.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {stations.length === 0 && (
              <div className="text-sm text-gray-500">No stations available</div>
            )}
          </div>

          {/* Pump Selection */}
          <div className="space-y-2">
            <Label htmlFor="pump">Pump *</Label>
            <Select value={pumpId} onValueChange={handlePumpChange} disabled={!stationId}>
              <SelectTrigger>
                <SelectValue placeholder={!stationId ? "Select station first" : "Select pump"} />
              </SelectTrigger>
              <SelectContent>
                {pumps.map((pump) => (
                  <SelectItem key={pump.id} value={pump.id}>
                    <div className="flex items-center gap-2">
                      <Fuel className="h-4 w-4" />
                      {pump.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {stationId && pumps.length === 0 && (
              <div className="text-sm text-gray-500">No pumps available for this station</div>
            )}
          </div>

          {/* Nozzle Selection */}
          <div className="space-y-2">
            <Label htmlFor="nozzle">Nozzle *</Label>
            <Select value={nozzleId} onValueChange={handleNozzleChange} disabled={!pumpId}>
              <SelectTrigger>
                <SelectValue placeholder={!pumpId ? "Select pump first" : "Select nozzle"} />
              </SelectTrigger>
              <SelectContent>
                {nozzles.map((nozzle) => (
                  <SelectItem key={nozzle.id} value={nozzle.id}>
                    <div className="flex items-center gap-2">
                      <Gauge className="h-4 w-4" />
                      Nozzle {nozzle.nozzleNumber} ({nozzle.fuelType})
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {pumpId && nozzles.length === 0 && (
              <div className="text-sm text-gray-500">No nozzles available for this pump</div>
            )}
          </div>

          {/* Current Selection Summary */}
          {selectedStation && selectedPump && selectedNozzle && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <div className="font-medium text-blue-900 mb-1">Recording for:</div>
                    <div className="text-blue-700 font-medium">
                      {selectedStation.name} → {selectedPump.name} → Nozzle {selectedNozzle.nozzleNumber}
                    </div>
                    <div className="text-blue-600 text-sm">
                      Fuel Type: {selectedNozzle.fuelType}
                    </div>
                  </div>

                  {/* Previous Reading Display */}
                  <div className="border-t border-blue-200 pt-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-blue-900 text-sm">Previous Reading:</div>
                        {lastReading ? (
                          <div className="text-lg font-bold text-blue-800">
                            {lastReading.reading.toLocaleString()} L
                          </div>
                        ) : (
                          <div className="text-blue-600 text-sm">No previous reading found</div>
                        )}
                      </div>
                      {lastReading && (
                        <div className="text-right">
                          <div className="text-xs text-blue-600">Recorded:</div>
                          <div className="text-xs text-blue-700">
                            {new Date(lastReading.recordedAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-blue-700">
                            {new Date(lastReading.recordedAt).toLocaleTimeString()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reading Input */}
          <div className="space-y-2">
            <Label htmlFor="reading">Current Reading (Liters) *</Label>
            <div className="space-y-2">
              <Input
                id="reading"
                type="number"
                step="0.01"
                min={lastReading ? lastReading.reading : 0}
                value={reading}
                onChange={(e) => setReading(e.target.value)}
                placeholder={lastReading ? `Enter reading (min: ${lastReading.reading}L)` : "Enter current meter reading"}
                className="text-lg font-mono"
              />

              {/* Show difference from previous reading */}
              {reading && lastReading && !isNaN(parseFloat(reading)) && (
                <div className="text-sm">
                  {parseFloat(reading) >= lastReading.reading ? (
                    <div className="text-green-600 flex items-center gap-1">
                      <span>↗</span>
                      <span>
                        Increase: {(parseFloat(reading) - lastReading.reading).toLocaleString()}L
                      </span>
                    </div>
                  ) : (
                    <div className="text-red-600 flex items-center gap-1">
                      <span>⚠</span>
                      <span>
                        Reading cannot be less than previous ({lastReading.reading}L)
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createReadingMutation.isLoading || !stationId || !pumpId || !nozzleId || !reading}
            >
              {createReadingMutation.isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Record Reading
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default QuickReadingModal;
