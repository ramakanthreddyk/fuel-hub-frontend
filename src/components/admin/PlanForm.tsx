
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Plus } from 'lucide-react';
import { Plan } from '@/api/api-contract';

// Standardized features available for plans
const AVAILABLE_FEATURES = {
  basic: [
    'Basic Dashboard',
    'Single Station Support',
    'User Management (up to 5 users)',
    'Basic Reports',
    'Email Support',
    'Mobile App Access'
  ],
  advanced: [
    'Advanced Dashboard',
    'Multi-Station Support',
    'Unlimited Users',
    'Advanced Analytics',
    'Comprehensive Reports',
    'Real-time Monitoring',
    'API Access',
    'Priority Support',
    'Custom Branding',
    'Data Export (CSV/PDF)',
    'Automated Alerts',
    'Custom Integrations',
    'White Label Solution',
    'Dedicated Account Manager'
  ]
};

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
  // Ensure features is always an array, even if initialData.features is undefined
  const [features, setFeatures] = useState<string[]>(
    Array.isArray(initialData?.features) ? initialData.features : []
  );
  const [customFeature, setCustomFeature] = useState('');
  const [showCustomFeatures, setShowCustomFeatures] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    maxStations: initialData?.maxStations || 5,
    maxPumpsPerStation: initialData?.maxPumpsPerStation || 10,
    maxNozzlesPerPump: initialData?.maxNozzlesPerPump || 4,
    priceMonthly: initialData?.priceMonthly || 0,
    priceYearly: initialData?.priceYearly || 0
  });

  // Get all available features
  const allAvailableFeatures = [...AVAILABLE_FEATURES.basic, ...AVAILABLE_FEATURES.advanced];

  const handleFeatureToggle = (feature: string, checked: boolean) => {
    if (checked) {
      setFeatures([...features, feature]);
    } else {
      setFeatures(features.filter(f => f !== feature));
    }
  };

  const handleAddCustomFeature = () => {
    if (customFeature.trim() && !features.includes(customFeature.trim())) {
      setFeatures([...features, customFeature.trim()]);
      setCustomFeature('');
    }
  };

  const handleRemoveFeature = (featureToRemove: string) => {
    setFeatures(features.filter(f => f !== featureToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      features
    });
  };

  console.log('PlanForm render:', { initialData, features });

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
      
      <div className="space-y-4">
        <div>
          <Label className="text-base font-semibold">Plan Features</Label>
          <p className="text-sm text-gray-600 mt-1">Select features to include in this plan</p>
        </div>

        {/* Standard Features Selection */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <h4 className="font-medium text-blue-900">Basic Features</h4>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full ml-auto">
                {AVAILABLE_FEATURES.basic.filter(f => features.includes(f)).length}/{AVAILABLE_FEATURES.basic.length}
              </span>
            </div>
            <div className="space-y-2 pl-2">
              {AVAILABLE_FEATURES.basic.map((feature) => (
                <div key={feature} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                  <Checkbox
                    id={`basic-${feature}`}
                    checked={features.includes(feature)}
                    onCheckedChange={(checked) => handleFeatureToggle(feature, !!checked)}
                  />
                  <Label htmlFor={`basic-${feature}`} className="text-sm cursor-pointer flex-1">{feature}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <h4 className="font-medium text-purple-900">Advanced Features</h4>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full ml-auto">
                {AVAILABLE_FEATURES.advanced.filter(f => features.includes(f)).length}/{AVAILABLE_FEATURES.advanced.length}
              </span>
            </div>
            <div className="space-y-2 pl-2">
              {AVAILABLE_FEATURES.advanced.map((feature) => (
                <div key={feature} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                  <Checkbox
                    id={`advanced-${feature}`}
                    checked={features.includes(feature)}
                    onCheckedChange={(checked) => handleFeatureToggle(feature, !!checked)}
                  />
                  <Label htmlFor={`advanced-${feature}`} className="text-sm cursor-pointer flex-1">{feature}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Custom Features */}
        <div className="border-t pt-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowCustomFeatures(!showCustomFeatures)}
            className="mb-2"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Custom Feature
          </Button>

          {showCustomFeatures && (
            <div className="flex space-x-2">
              <Input
                value={customFeature}
                onChange={(e) => setCustomFeature(e.target.value)}
                placeholder="Enter custom feature"
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={handleAddCustomFeature}>
                Add
              </Button>
            </div>
          )}
        </div>

        {/* Selected Features Display */}
        {features.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Selected Features ({features.length})</h4>
            <div className="flex flex-wrap gap-1">
              {features.map((feature) => (
                <span
                  key={feature}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
                >
                  {feature}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFeature(feature)}
                    className="h-3 w-3 p-0 hover:bg-blue-200"
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Saving..." : (initialData ? "Update Plan" : "Create Plan")}
      </Button>
    </form>
  );
}
