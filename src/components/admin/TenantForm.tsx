
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
    adminEmail?: string;
    adminPassword?: string;
  }) => void;
  plans: Plan[];
  isLoading?: boolean;
}

export function TenantForm({ onSubmit, plans, isLoading }: TenantFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    schemaName: '',
    planId: '',
    adminEmail: '',
    adminPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      schemaName: formData.schemaName || undefined,
      planId: formData.planId,
      adminEmail: formData.adminEmail || undefined,
      adminPassword: formData.adminPassword || undefined
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

      <div className="space-y-2">
        <Label htmlFor="adminEmail">Admin Email (Optional)</Label>
        <Input
          id="adminEmail"
          type="email"
          value={formData.adminEmail}
          onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
          placeholder="Auto-generated if empty"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="adminPassword">Admin Password (Optional)</Label>
        <Input
          id="adminPassword"
          type="password"
          value={formData.adminPassword}
          onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
          placeholder="Default: tenant123"
        />
      </div>
      
      <Button type="submit" disabled={isLoading || !formData.name || !formData.planId}>
        {isLoading ? "Creating..." : "Create Tenant"}
      </Button>
    </form>
  );
}
