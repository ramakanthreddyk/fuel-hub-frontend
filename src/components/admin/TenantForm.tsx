
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plan } from '@/api/superadmin';

interface TenantFormProps {
  onSubmit: (data: { name: string; schema: string; planType: 'basic' | 'premium' | 'enterprise' }) => void;
  plans: Plan[];
  isLoading?: boolean;
}

export function TenantForm({ onSubmit, plans, isLoading }: TenantFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    schema: '',
    planType: 'basic' as 'basic' | 'premium' | 'enterprise'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Tenant Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="schema">Schema Name</Label>
        <Input
          id="schema"
          value={formData.schema}
          onChange={(e) => setFormData({ ...formData, schema: e.target.value })}
          placeholder="Enter schema name (lowercase, no spaces)"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="planType">Subscription Plan</Label>
        <Select value={formData.planType} onValueChange={(value: 'basic' | 'premium' | 'enterprise') => setFormData({ ...formData, planType: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select a plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="basic">Basic</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Tenant"}
      </Button>
    </form>
  );
}
