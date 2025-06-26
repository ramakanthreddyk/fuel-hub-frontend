
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
        <h4 className="font-medium text-blue-900 mb-2">Auto-Generated Admin User</h4>
        <p className="text-sm text-blue-700 mb-2">
          The system will automatically create an admin user for this tenant:
        </p>
        <ul className="text-sm text-blue-600 space-y-1">
          <li>• <strong>Email:</strong> admin@{formData.name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'tenant'}.com</li>
          <li>• <strong>Role:</strong> Owner (Full access to tenant resources)</li>
          <li>• <strong>Password:</strong> Will be auto-generated and provided after creation</li>
        </ul>
        <p className="text-xs text-blue-500 mt-2">
          All tenant data is isolated by tenant_id (UUID) for security.
        </p>
      </div>
      
      <Button type="submit" disabled={isLoading || !formData.name || !formData.planId}>
        {isLoading ? "Creating..." : "Create Tenant"}
      </Button>
    </form>
  );
}
