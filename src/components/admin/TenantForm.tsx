
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plan } from '@/api/superadmin';

interface TenantFormProps {
  onSubmit: (data: { 
    name: string; 
    schemaName?: string; 
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
    schemaName: '',
    planId: '',
    ownerName: '',
    ownerEmail: '',
    ownerPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      schemaName: formData.schemaName || undefined,
      planId: formData.planId,
      ownerName: formData.ownerName || undefined,
      ownerEmail: formData.ownerEmail || undefined,
      ownerPassword: formData.ownerPassword || undefined
    });
  };

  const generateSchema = () => {
    const schema = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .slice(0, 20);
    setFormData({ ...formData, schemaName: schema });
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
        <Label htmlFor="schemaName">Schema Name (Optional)</Label>
        <div className="flex gap-2">
          <Input
            id="schemaName"
            value={formData.schemaName}
            onChange={(e) => setFormData({ ...formData, schemaName: e.target.value })}
            placeholder="Auto-generated if empty"
          />
          <Button type="button" variant="outline" onClick={generateSchema}>
            Generate
          </Button>
        </div>
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
        <h4 className="font-medium text-blue-900 mb-2">Auto-Generated Users</h4>
        <p className="text-sm text-blue-700 mb-2">
          The system will automatically create:
        </p>
        <ul className="text-sm text-blue-600 space-y-1">
          <li>• <strong>Owner:</strong> owner@{formData.schemaName || 'tenant-name'}.com</li>
          <li>• <strong>Manager:</strong> manager@{formData.schemaName || 'tenant-name'}.com</li>
          <li>• <strong>Attendant:</strong> attendant@{formData.schemaName || 'tenant-name'}.com</li>
        </ul>
        <p className="text-xs text-blue-500 mt-2">
          Passwords: {formData.name.split(' ')[0].toLowerCase() || 'firstname'}@{formData.schemaName || 'schema'}123
        </p>
      </div>
      
      <Button type="submit" disabled={isLoading || !formData.name || !formData.planId}>
        {isLoading ? "Creating..." : "Create Tenant"}
      </Button>
    </form>
  );
}
