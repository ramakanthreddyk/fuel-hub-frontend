
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { Plan } from '@/api/superadmin';

interface PlanFormProps {
  onSubmit: (data: {
    name?: string;
    maxStations?: number;
    maxPumpsPerStation?: number;
    maxNozzlesPerPump?: number;
    priceMonthly?: number;
    priceYearly?: number;
    features?: string[];
  }) => void;
  initialData?: Plan;
  isLoading?: boolean;
}

export function PlanForm({ onSubmit, initialData, isLoading }: PlanFormProps) {
  const [features, setFeatures] = useState<string[]>(initialData?.features || []);
  const [newFeature, setNewFeature] = useState('');
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    maxStations: initialData?.maxStations || 5,
    maxPumpsPerStation: initialData?.maxPumpsPerStation || 10,
    maxNozzlesPerPump: initialData?.maxNozzlesPerPump || 4,
    priceMonthly: initialData?.priceMonthly || 0,
    priceYearly: initialData?.priceYearly || 0
  });

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      features
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Plan Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="maxStations">Max Stations</Label>
          <Input
            id="maxStations"
            type="number"
            min="1"
            value={formData.maxStations}
            onChange={(e) => setFormData({ ...formData, maxStations: parseInt(e.target.value) })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="maxPumpsPerStation">Max Pumps/Station</Label>
          <Input
            id="maxPumpsPerStation"
            type="number"
            min="1"
            value={formData.maxPumpsPerStation}
            onChange={(e) => setFormData({ ...formData, maxPumpsPerStation: parseInt(e.target.value) })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="maxNozzlesPerPump">Max Nozzles/Pump</Label>
          <Input
            id="maxNozzlesPerPump"
            type="number"
            min="1"
            value={formData.maxNozzlesPerPump}
            onChange={(e) => setFormData({ ...formData, maxNozzlesPerPump: parseInt(e.target.value) })}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="priceMonthly">Monthly Price (₹)</Label>
          <Input
            id="priceMonthly"
            type="number"
            min="0"
            step="0.01"
            value={formData.priceMonthly}
            onChange={(e) => setFormData({ ...formData, priceMonthly: parseFloat(e.target.value) })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="priceYearly">Yearly Price (₹)</Label>
          <Input
            id="priceYearly"
            type="number"
            min="0"
            step="0.01"
            value={formData.priceYearly}
            onChange={(e) => setFormData({ ...formData, priceYearly: parseFloat(e.target.value) })}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Features</Label>
        <div className="flex space-x-2">
          <Input
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            placeholder="Add feature"
          />
          <Button type="button" variant="outline" onClick={handleAddFeature}>
            Add
          </Button>
        </div>
        <ul className="mt-2 space-y-1 max-h-32 overflow-y-auto">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
              <span className="text-sm">{feature}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveFeature(index)}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </li>
          ))}
        </ul>
      </div>
      
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Saving..." : initialData ? "Update Plan" : "Create Plan"}
      </Button>
    </form>
  );
}
