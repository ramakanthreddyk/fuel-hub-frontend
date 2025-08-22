/**
 * @file QuickReadingModal.tsx
 * @description Quick modal for entering readings without navigation
 */

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useStations } from '@/hooks/api/useStations';
import { usePumps } from '@/hooks/api/usePumps';
import { useNozzles } from '@/hooks/api/useNozzles';
import { useCreateReading, useLatestReading } from '@/hooks/api/useReadings';
import { Fuel, Gauge, MapPin, Loader2 } from 'lucide-react';
import {
  useMobileFormatters,
  getResponsiveTextSize,
  getResponsiveIconSize,
  getResponsivePadding
} from '@/utils/mobileFormatters';
import { toast } from 'sonner';
import { ReusableSelect } from './ReadingEntryForm';

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
  const { formatCurrency: formatCurrencyMobile, isMobile } = useMobileFormatters();

  // Fetch data
  const { data: stations = [], isLoading: stationsLoading, error: stationsError } = useStations();
  const { data: pumps = [], isLoading: pumpsLoading } = usePumps(stationId || undefined);
  const { data: nozzles = [], isLoading: nozzlesLoading } = useNozzles(pumpId || undefined);
  const createReadingMutation = useCreateReading();

  // Fetch last reading for the selected nozzle
  const { data: lastReading, isLoading: lastReadingLoading } = useLatestReading(nozzleId || '');

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

  // Debug logging
  console.log('[QUICK-READING] State:', { stationId, pumpId, nozzleId, stations: stations.length, pumps: pumps.length, nozzles: nozzles.length });
  console.log('[QUICK-READING] Last reading for nozzle', nozzleId, ':', lastReading);
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

      // Toast notification is handled by the mutation hook to avoid duplicates
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating reading:', error);
      // Error toast is handled by the mutation hook to avoid duplicates
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[95vh] overflow-y-auto p-0">
        {/* Compact Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-lg">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Gauge className="h-4 w-4" />
            </div>
            <div>
              <h2 className={`${getResponsiveTextSize('lg')} font-bold`}>
                <span className="hidden sm:inline">Quick Reading Entry</span>
                <span className="sm:hidden">Add Reading</span>
              </h2>
              <p className="text-xs text-white/80">Record fuel pump reading</p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-4 space-y-4">
          {/* Error handling */}
          {stationsError && (
            <div className="text-red-600 text-xs p-2 bg-red-50 rounded border border-red-200">
              Failed to load stations. Please refresh and try again.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Compact Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Station Selection */}
              <div className="space-y-1">
                <Label htmlFor="station" className="text-xs font-medium text-gray-700">Station *</Label>
                <ReusableSelect
                  value={stationId}
                  onValueChange={handleStationChange}
                  placeholder="Select station"
                  options={stations.map(station => ({
                    value: station.id,
                    label: (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{station.name}</span>
                      </div>
                    )
                  }))}
                  isLoading={stationsLoading}
                  isError={!!stationsError}
                  noOptionsMessage="No stations available"
                />
              </div>

              {/* Pump Selection */}
              <div className="space-y-1">
                <Label htmlFor="pump" className="text-xs font-medium text-gray-700">Pump *</Label>
                <ReusableSelect
                  value={pumpId}
                  onValueChange={handlePumpChange}
                  placeholder={!stationId ? "Select station first" : "Select pump"}
                  options={pumps.map(pump => ({
                    value: pump.id,
                    label: (
                      <div className="flex items-center gap-2">
                        <Fuel className="h-3 w-3" />
                        <span className="truncate">{pump.name}</span>
                      </div>
                    )
                  }))}
                  isLoading={pumpsLoading}
                  isError={false}
                  noOptionsMessage="No pumps available for this station"
                  isDisabled={!stationId}
                />
              </div>
            </div>

            {/* Nozzle Selection - Full Width */}
            <div className="space-y-1">
              <Label htmlFor="nozzle" className="text-xs font-medium text-gray-700">Nozzle *</Label>
              <ReusableSelect
                value={nozzleId}
                onValueChange={handleNozzleChange}
                placeholder={!pumpId ? "Select pump first" : "Select nozzle"}
                options={nozzles.map(nozzle => ({
                  value: nozzle.id,
                  label: (
                    <div className="flex items-center gap-2">
                      <Gauge className="h-3 w-3" />
                      <span className="truncate">Nozzle {nozzle.nozzleNumber} ({nozzle.fuelType})</span>
                    </div>
                  )
                }))}
                isLoading={nozzlesLoading}
                isError={false}
                noOptionsMessage="No nozzles available for this pump"
                isDisabled={!pumpId}
              />
            </div>

            {/* Compact Selection Summary */}
            {selectedStation && selectedPump && selectedNozzle && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-blue-900">Recording for:</div>
                      <div className="text-sm font-semibold text-blue-700 truncate">
                        {selectedStation.name} • {selectedPump.name} • N{selectedNozzle.nozzleNumber}
                      </div>
                      <div className="text-xs text-blue-600">
                        {selectedNozzle.fuelType}
                      </div>
                    </div>
                    {lastReading && (
                      <div className="text-right">
                        <div className="text-xs text-blue-600">Last:</div>
                        <div className="text-sm font-bold text-blue-800">
                          {isMobile ? formatCurrencyMobile(lastReading.reading) : lastReading.reading.toLocaleString()}L
                        </div>
                        <div className="text-xs text-blue-600">
                          {new Date(lastReading.recordedAt).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                  </div>
                  {!lastReading && (
                    <div className="text-xs text-blue-600 text-center">No previous reading found</div>
                  )}
                </div>
              </div>
            )}

            {/* Reading Input */}
            <div className="space-y-2">
              <Label htmlFor="reading" className="text-xs font-medium text-gray-700">Current Reading (Liters) *</Label>
              <div className="space-y-2">
                <Input
                  id="reading"
                  type="number"
                  step="0.01"
                  min={lastReading ? lastReading.reading : 0}
                  value={reading}
                  onChange={(e) => setReading(e.target.value)}
                  placeholder={lastReading ? `Min: ${lastReading.reading}L` : "Enter reading"}
                  className="text-base font-mono h-10"
                />

                {/* Show difference from previous reading */}
                {reading && lastReading && !isNaN(parseFloat(reading)) && (
                  <div className="text-xs">
                    {parseFloat(reading) >= lastReading.reading ? (
                      <div className="text-green-600 flex items-center gap-1">
                        <span>↗</span>
                        <span>
                          +{(parseFloat(reading) - lastReading.reading).toLocaleString()}L
                      </span>
                    </div>
                    ) : (
                      <div className="text-red-600 flex items-center gap-1">
                        <span>⚠</span>
                        <span>
                          Cannot be less than {lastReading.reading}L
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <Label htmlFor="notes" className="text-xs font-medium text-gray-700">Notes (Optional)</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional notes..."
                className="text-sm h-9"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 text-sm h-9"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createReadingMutation.isPending || !stationId || !pumpId || !nozzleId || !reading}
                className="flex-1 text-sm h-9"
              >
                {createReadingMutation.isPending && (
                  <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                )}
                <span className="hidden sm:inline">Record Reading</span>
                <span className="sm:hidden">Record</span>
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default QuickReadingModal;
