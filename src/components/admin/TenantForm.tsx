
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plan } from '@/api/api-contract';

interface TenantFormProps {
  onSubmit: (data: { 
    name: string; 
    planId: string;
    ownerName?: string;
    ownerEmail?: string;
    ownerPassword?: string;
  }) => void;
  plans: Plan[];
  isLoading?: boolean;
}

export function TenantForm({ onSubmit, plans, isLoading }: TenantFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    planId: '',
    ownerName: '',
    ownerEmail: '',
    ownerPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      planId: formData.planId,
      ownerName: formData.ownerName || undefined,
      ownerEmail: formData.ownerEmail || undefined,
      ownerPassword: formData.ownerPassword || undefined
    });
  };

  // Schema generation is no longer needed with the unified schema model

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Tenant Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      
      {/* Schema name field removed as it's no longer needed with the unified schema model */}
      
      <div className="space-y-2">
        <Label htmlFor="planId">Subscription Plan *</Label>
        <Select value={formData.planId} onValueChange={(value) => setFormData({ ...formData, planId: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select a plan" />
          </SelectTrigger>
          <SelectContent>
            {plans.map((plan) => (
              <SelectItem key={plan.id} value={plan.id}>
                {plan.name} - ₹{plan.priceMonthly}/month
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">Auto-Generated Users</h4>
        <p className="text-sm text-blue-700 mb-2">
          The system will automatically create:
        </p>
        <ul className="text-sm text-blue-600 space-y-1">
          <li>• <strong>Owner:</strong> owner@{formData.name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'tenant'}.com</li>
          <li>• <strong>Manager:</strong> manager@{formData.name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'tenant'}.com</li>
          <li>• <strong>Attendant:</strong> attendant@{formData.name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'tenant'}.com</li>
        </ul>
        <p className="text-xs text-blue-500 mt-2">
          Passwords: {formData.name.split(' ')[0].toLowerCase() || 'firstname'}@123
        </p>
      </div>
      
      <Button type="submit" disabled={isLoading || !formData.name || !formData.planId}>
        {isLoading ? "Creating..." : "Create Tenant"}
      </Button>
    </form>
  );
}
