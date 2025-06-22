
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Building2 } from 'lucide-react';
import { superAdminApi, CreateTenantRequest } from '@/api/superadmin';
import { useToast } from '@/hooks/use-toast';

export default function CreateTenantPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<CreateTenantRequest>({
    name: '',
    plan: 'basic',
    email: '',
    password: '',
    schema: ''
  });

  const createTenantMutation = useMutation({
    mutationFn: superAdminApi.createTenantWithAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast({
        title: "Success",
        description: "Tenant created successfully with admin user",
      });
      navigate('/superadmin/tenants');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create tenant",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password || !formData.schema) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createTenantMutation.mutate(formData);
  };

  const generateSchema = () => {
    const schema = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 20);
    setFormData({ ...formData, schema });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/superadmin/tenants')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tenants
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Tenant</h1>
          <p className="text-muted-foreground">Add a new tenant organization with admin user</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Tenant Information
          </CardTitle>
          <CardDescription>
            This will create a new tenant schema and admin user account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Tenant Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Shell Fuel South"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="schema">Schema Name *</Label>
              <div className="flex gap-2">
                <Input
                  id="schema"
                  value={formData.schema}
                  onChange={(e) => setFormData({ ...formData, schema: e.target.value })}
                  placeholder="e.g., shellsouth"
                  required
                />
                <Button type="button" variant="outline" onClick={generateSchema}>
                  Generate
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Lowercase letters and numbers only, no spaces
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="plan">Plan Type</Label>
              <Select value={formData.plan} onValueChange={(value) => setFormData({ ...formData, plan: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Admin Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="admin@example.com"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Admin Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter secure password"
                required
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                type="submit" 
                disabled={createTenantMutation.isPending}
                className="flex-1"
              >
                {createTenantMutation.isPending ? "Creating..." : "Create Tenant"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/superadmin/tenants')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
