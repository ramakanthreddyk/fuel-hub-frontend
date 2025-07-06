
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
    ownerName: string;
    ownerEmail: string;
    ownerPassword: string;
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
      ownerName: formData.ownerName,
      ownerEmail: formData.ownerEmail,
      ownerPassword: formData.ownerPassword
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

      <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
        <h4 className="font-medium text-gray-900">Owner Account Details</h4>
        
        <div className="space-y-2">
          <Label htmlFor="ownerName">Owner Name *</Label>
          <Input
            id="ownerName"
            value={formData.ownerName}
            onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
            placeholder="Enter owner's full name"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="ownerEmail">Owner Email *</Label>
          <Input
            id="ownerEmail"
            type="email"
            value={formData.ownerEmail}
            onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
            placeholder="owner@company.com"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="ownerPassword">Initial Password *</Label>
          <Input
            id="ownerPassword"
            type="password"
            value={formData.ownerPassword}
            onChange={(e) => setFormData({ ...formData, ownerPassword: e.target.value })}
            placeholder="Enter initial password"
            required
            minLength={8}
          />
          <p className="text-xs text-gray-500">
            Password must be at least 8 characters long
          </p>
        </div>
      </div>
      
      <Button 
        type="submit" 
        disabled={isLoading || !formData.name || !formData.planId || !formData.ownerName || !formData.ownerEmail || !formData.ownerPassword}
        className="w-full"
      >
        {isLoading ? "Creating..." : "Create Tenant"}
      </Button>
    </form>
  );
}
