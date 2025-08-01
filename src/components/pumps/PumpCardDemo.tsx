/**
 * @file components/pumps/PumpCardDemo.tsx
 * @description Demo page to showcase all pump card variants
 */
import React, { useState } from 'react';
import { UnifiedPumpCard, PumpData, PumpCardVariant, PumpCardActions } from './UnifiedPumpCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// Sample pump data
const samplePumps: PumpData[] = [
  {
    id: 'pump-001',
    name: 'Pump Alpha',
    serialNumber: 'SN-2024-001',
    status: 'active',
    nozzleCount: 4,
    stationName: 'Main Station'
  },
  {
    id: 'pump-002',
    name: 'Pump Beta',
    serialNumber: 'SN-2024-002',
    status: 'maintenance',
    nozzleCount: 2,
    stationName: 'North Station'
  },
  {
    id: 'pump-003',
    name: 'Pump Gamma',
    serialNumber: 'SN-2024-003',
    status: 'inactive',
    nozzleCount: 0,
    stationName: 'South Station'
  }
];

const variants: { value: PumpCardVariant; label: string; description: string }[] = [
  { value: 'compact', label: 'Compact', description: 'Space-efficient with dropdown actions' },
  { value: 'standard', label: 'Standard', description: 'Balanced layout with clear information' },
  { value: 'enhanced', label: 'Enhanced', description: 'Rich metrics and visual indicators' },
  { value: 'realistic', label: 'Realistic', description: 'Fuel station themed design' },
  { value: 'creative', label: 'Creative', description: 'Animated with gradients and effects' }
];

export function PumpCardDemo() {
  const [selectedVariant, setSelectedVariant] = useState<PumpCardVariant>('standard');
  const [showStationName, setShowStationName] = useState(true);
  const { toast } = useToast();

  // Demo action handlers
  const actions: PumpCardActions = {
    onViewNozzles: (pumpId: string) => {
      toast({
        title: "View Nozzles",
        description: `Opening nozzles view for pump ${pumpId}`,
      });
    },
    onEdit: (pumpId: string) => {
      toast({
        title: "Edit Pump",
        description: `Opening edit dialog for pump ${pumpId}`,
      });
    },
    onDelete: (pumpId: string) => {
      toast({
        title: "Delete Pump",
        description: `Delete confirmation for pump ${pumpId}`,
        variant: "destructive",
      });
    },
    onSettings: (pumpId: string) => {
      toast({
        title: "Pump Settings",
        description: `Opening settings for pump ${pumpId}`,
      });
    },
    onPowerToggle: (pumpId: string) => {
      toast({
        title: "Power Toggle",
        description: `Toggling power for pump ${pumpId}`,
      });
    },
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Unified Pump Card Demo</h1>
        <p className="text-gray-600">
          Showcasing all pump card variants in a single, configurable component
        </p>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Demo Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Card Variant
            </label>
            <div className="flex flex-wrap gap-2">
              {variants.map((variant) => (
                <Button
                  key={variant.value}
                  variant={selectedVariant === variant.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedVariant(variant.value)}
                  className="flex flex-col h-auto p-3"
                >
                  <span className="font-medium">{variant.label}</span>
                  <span className="text-xs opacity-70">{variant.description}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showStationName}
                onChange={(e) => setShowStationName(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium">Show Station Name</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline">Current Variant:</Badge>
            <Badge>{selectedVariant}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Pump Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {variants.find(v => v.value === selectedVariant)?.label} Variant
        </h2>
        
        <div className={`grid gap-6 ${
          selectedVariant === 'compact' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : selectedVariant === 'creative'
            ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'
            : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'
        }`}>
          {samplePumps.map((pump) => (
            <UnifiedPumpCard
              key={pump.id}
              pump={pump}
              variant={selectedVariant}
              actions={actions}
              needsAttention={pump.nozzleCount === 0 || pump.status === 'maintenance'}
              showStationName={showStationName}
            />
          ))}
        </div>
      </div>

      {/* Feature Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Feature</th>
                  {variants.map(variant => (
                    <th key={variant.value} className="text-center p-2">{variant.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2 font-medium">Space Efficiency</td>
                  <td className="text-center p-2">⭐⭐⭐⭐⭐</td>
                  <td className="text-center p-2">⭐⭐⭐</td>
                  <td className="text-center p-2">⭐⭐</td>
                  <td className="text-center p-2">⭐⭐⭐</td>
                  <td className="text-center p-2">⭐⭐</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Visual Appeal</td>
                  <td className="text-center p-2">⭐⭐</td>
                  <td className="text-center p-2">⭐⭐⭐</td>
                  <td className="text-center p-2">⭐⭐⭐⭐</td>
                  <td className="text-center p-2">⭐⭐⭐⭐</td>
                  <td className="text-center p-2">⭐⭐⭐⭐⭐</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Information Density</td>
                  <td className="text-center p-2">⭐⭐⭐</td>
                  <td className="text-center p-2">⭐⭐⭐⭐</td>
                  <td className="text-center p-2">⭐⭐⭐⭐⭐</td>
                  <td className="text-center p-2">⭐⭐⭐⭐</td>
                  <td className="text-center p-2">⭐⭐⭐</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Action Accessibility</td>
                  <td className="text-center p-2">⭐⭐⭐⭐</td>
                  <td className="text-center p-2">⭐⭐⭐⭐⭐</td>
                  <td className="text-center p-2">⭐⭐⭐⭐⭐</td>
                  <td className="text-center p-2">⭐⭐⭐⭐⭐</td>
                  <td className="text-center p-2">⭐⭐⭐⭐</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
