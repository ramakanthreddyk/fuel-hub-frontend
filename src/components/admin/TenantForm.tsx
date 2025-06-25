
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

      <div className="space-y-2">
        <Label htmlFor="ownerName">Owner Name (Optional)</Label>
        <Input
          id="ownerName"
          value={formData.ownerName}
          onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
          placeholder="Auto-generated from tenant name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ownerEmail">Owner Email (Optional)</Label>
        <Input
          id="ownerEmail"
          type="email"
          value={formData.ownerEmail}
          onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
          placeholder="owner@tenant-schema.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ownerPassword">Owner Password (Optional)</Label>
        <Input
          id="ownerPassword"
          type="password"
          value={formData.ownerPassword}
          onChange={(e) => setFormData({ ...formData, ownerPassword: e.target.value })}
          placeholder="firstname@schema123"
        />
      </div>
      
      <Button type="submit" disabled={isLoading || !formData.name || !formData.planId}>
        {isLoading ? "Creating..." : "Create Tenant"}
      </Button>
    </form>
  );
}
