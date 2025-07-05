---
title: SuperAdmin Frontend Implementation Guide
lastUpdated: 2025-07-05
category: frontend
---

# SuperAdmin Frontend Implementation Guide

## Overview

This guide outlines the frontend implementation for the SuperAdmin role in FuelSync Hub. The SuperAdmin manages tenants, plans, and admin users at the platform level.

## Pages to Implement

### 1. Dashboard Page

```tsx
// src/pages/admin/DashboardPage.tsx
export default function DashboardPage() {
  const { data: metrics, isLoading } = useDashboardMetrics();
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Platform Dashboard</h1>
      
      {isLoading ? (
        <div>Loading metrics...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricsCard
            title="Total Tenants"
            value={metrics?.tenantCount || 0}
            icon={<Building className="h-5 w-5" />}
          />
          <MetricsCard
            title="Active Tenants"
            value={metrics?.activeTenantCount || 0}
            icon={<CheckCircle className="h-5 w-5" />}
          />
          <MetricsCard
            title="Plans"
            value={metrics?.planCount || 0}
            icon={<Package className="h-5 w-5" />}
          />
          <MetricsCard
            title="Admin Users"
            value={metrics?.adminCount || 0}
            icon={<Users className="h-5 w-5" />}
          />
        </div>
      )}
      
      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <RecentActivityList />
      </div>
    </div>
  );
}
```

### 2. Tenants Page

```tsx
// src/pages/admin/TenantsPage.tsx
export default function TenantsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { data: tenants, isLoading, refetch } = useTenants();
  const { data: plans } = usePlans();
  
  const createTenantMutation = useMutation({
    mutationFn: adminApi.createTenant,
    onSuccess: () => {
      refetch();
      setIsCreateDialogOpen(false);
      toast({ title: "Tenant created successfully" });
    }
  });
  
  const updateTenantStatusMutation = useMutation({
    mutationFn: adminApi.updateTenantStatus,
    onSuccess: () => {
      refetch();
      toast({ title: "Tenant status updated" });
    }
  });
  
  const deleteTenantMutation = useMutation({
    mutationFn: adminApi.deleteTenant,
    onSuccess: () => {
      refetch();
      toast({ title: "Tenant deleted" });
    }
  });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tenants</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Tenant
        </Button>
      </div>
      
      {isLoading ? (
        <div>Loading tenants...</div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants?.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell>{tenant.name}</TableCell>
                  <TableCell>{tenant.planName}</TableCell>
                  <TableCell>
                    <StatusBadge status={tenant.status} />
                  </TableCell>
                  <TableCell>{formatDate(tenant.createdAt)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => updateTenantStatusMutation.mutate({ id: tenant.id, status: 'active' })}>
                          Activate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateTenantStatusMutation.mutate({ id: tenant.id, status: 'suspended' })}>
                          Suspend
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => deleteTenantMutation.mutate(tenant.id)}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Tenant</DialogTitle>
            <DialogDescription>
              Create a new tenant organization with its own schema.
            </DialogDescription>
          </DialogHeader>
          <TenantForm
            plans={plans || []}
            isLoading={createTenantMutation.isPending}
            onSubmit={(data) => createTenantMutation.mutate(data)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

### 3. Plans Page

```tsx
// src/pages/admin/PlansPage.tsx
export default function PlansPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const { data: plans, isLoading, refetch } = usePlans();
  
  const createPlanMutation = useMutation({
    mutationFn: adminApi.createPlan,
    onSuccess: () => {
      refetch();
      setIsCreateDialogOpen(false);
      toast({ title: "Plan created successfully" });
    }
  });
  
  const updatePlanMutation = useMutation({
    mutationFn: adminApi.updatePlan,
    onSuccess: () => {
      refetch();
      setEditingPlan(null);
      toast({ title: "Plan updated" });
    }
  });
  
  const deletePlanMutation = useMutation({
    mutationFn: adminApi.deletePlan,
    onSuccess: () => {
      refetch();
      toast({ title: "Plan deleted" });
    }
  });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Subscription Plans</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Plan
        </Button>
      </div>
      
      {isLoading ? (
        <div>Loading plans...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans?.map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>${plan.priceMonthly}/month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Max Stations</span>
                    <span>{plan.maxStations}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Pumps/Station</span>
                    <span>{plan.maxPumpsPerStation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Nozzles/Pump</span>
                    <span>{plan.maxNozzlesPerPump}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium">Features</h4>
                  <ul className="mt-2 space-y-1">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="text-sm flex items-center">
                        <Check className="mr-2 h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => setEditingPlan(plan)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => deletePlanMutation.mutate(plan.id)}>
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Plan</DialogTitle>
            <DialogDescription>
              Create a new subscription plan for tenants.
            </DialogDescription>
          </DialogHeader>
          <PlanForm
            isLoading={createPlanMutation.isPending}
            onSubmit={(data) => createPlanMutation.mutate(data)}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={!!editingPlan} onOpenChange={() => setEditingPlan(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Plan</DialogTitle>
            <DialogDescription>
              Update subscription plan details.
            </DialogDescription>
          </DialogHeader>
          {editingPlan && (
            <PlanForm
              initialData={editingPlan}
              isLoading={updatePlanMutation.isPending}
              onSubmit={(data) => updatePlanMutation.mutate({ id: editingPlan.id, ...data })}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

### 4. Admin Users Page

```tsx
// src/pages/admin/AdminUsersPage.tsx
export default function AdminUsersPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState<AdminUser | null>(null);
  const { data: adminUsers, isLoading, refetch } = useAdminUsers();
  
  const createAdminUserMutation = useMutation({
    mutationFn: adminApi.createAdminUser,
    onSuccess: () => {
      refetch();
      setIsCreateDialogOpen(false);
      toast({ title: "Admin user created successfully" });
    }
  });
  
  const resetPasswordMutation = useMutation({
    mutationFn: adminApi.resetAdminPassword,
    onSuccess: () => {
      setResetPasswordUser(null);
      toast({ title: "Password reset successfully" });
    }
  });
  
  const deleteAdminUserMutation = useMutation({
    mutationFn: adminApi.deleteAdminUser,
    onSuccess: () => {
      refetch();
      toast({ title: "Admin user deleted" });
    }
  });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Users</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Admin User
        </Button>
      </div>
      
      {isLoading ? (
        <div>Loading admin users...</div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminUsers?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setResetPasswordUser(user)}>
                          Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => deleteAdminUserMutation.mutate(user.id)}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Admin User</DialogTitle>
            <DialogDescription>
              Create a new SuperAdmin user for platform management.
            </DialogDescription>
          </DialogHeader>
          <AdminUserForm
            isLoading={createAdminUserMutation.isPending}
            onSubmit={(data) => createAdminUserMutation.mutate(data)}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={!!resetPasswordUser} onOpenChange={() => setResetPasswordUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Reset password for {resetPasswordUser?.email}
            </DialogDescription>
          </DialogHeader>
          <Form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            resetPasswordMutation.mutate({
              id: resetPasswordUser!.id,
              password: formData.get('password') as string
            });
          }}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button type="submit" disabled={resetPasswordMutation.isPending}>
                {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

## Components to Implement

### 1. TenantForm

```tsx
// src/components/admin/TenantForm.tsx
interface TenantFormProps {
  onSubmit: (data: { name: string; planId: string }) => void;
  plans: Plan[];
  isLoading?: boolean;
}

export function TenantForm({ onSubmit, plans, isLoading }: TenantFormProps) {
  return (
    <Form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      onSubmit({
        name: formData.get('name') as string,
        planId: formData.get('planId') as string
      });
    }}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Tenant Name</Label>
          <Input id="name" name="name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="planId">Subscription Plan</Label>
          <Select name="planId" required>
            <SelectTrigger>
              <SelectValue placeholder="Select a plan" />
            </SelectTrigger>
            <SelectContent>
              {plans.map((plan) => (
                <SelectItem key={plan.id} value={plan.id}>
                  {plan.name} (${plan.priceMonthly}/month)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Tenant"}
        </Button>
      </div>
    </Form>
  );
}
```

### 2. PlanForm

```tsx
// src/components/admin/PlanForm.tsx
interface PlanFormProps {
  onSubmit: (data: {
    name: string;
    maxStations?: number;
    maxPumpsPerStation?: number;
    maxNozzlesPerPump?: number;
    priceMonthly?: number;
    features?: string[];
  }) => void;
  initialData?: Plan;
  isLoading?: boolean;
}

export function PlanForm({ onSubmit, initialData, isLoading }: PlanFormProps) {
  const [features, setFeatures] = useState<string[]>(initialData?.features || []);
  const [newFeature, setNewFeature] = useState('');
  
  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };
  
  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };
  
  return (
    <Form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      onSubmit({
        name: formData.get('name') as string,
        maxStations: parseInt(formData.get('maxStations') as string),
        maxPumpsPerStation: parseInt(formData.get('maxPumpsPerStation') as string),
        maxNozzlesPerPump: parseInt(formData.get('maxNozzlesPerPump') as string),
        priceMonthly: parseFloat(formData.get('priceMonthly') as string),
        features
      });
    }}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Plan Name</Label>
          <Input id="name" name="name" defaultValue={initialData?.name} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="maxStations">Max Stations</Label>
            <Input
              id="maxStations"
              name="maxStations"
              type="number"
              min="1"
              defaultValue={initialData?.maxStations || 5}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priceMonthly">Monthly Price ($)</Label>
            <Input
              id="priceMonthly"
              name="priceMonthly"
              type="number"
              min="0"
              step="0.01"
              defaultValue={initialData?.priceMonthly || 0}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="maxPumpsPerStation">Max Pumps/Station</Label>
            <Input
              id="maxPumpsPerStation"
              name="maxPumpsPerStation"
              type="number"
              min="1"
              defaultValue={initialData?.maxPumpsPerStation || 10}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxNozzlesPerPump">Max Nozzles/Pump</Label>
            <Input
              id="maxNozzlesPerPump"
              name="maxNozzlesPerPump"
              type="number"
              min="1"
              defaultValue={initialData?.maxNozzlesPerPump || 4}
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
          <ul className="mt-2 space-y-1">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                <span>{feature}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveFeature(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : initialData ? "Update Plan" : "Create Plan"}
        </Button>
      </div>
    </Form>
  );
}
```

### 3. AdminUserForm

```tsx
// src/components/admin/AdminUserForm.tsx
interface AdminUserFormProps {
  onSubmit: (data: { email: string; password?: string; role?: string }) => void;
  initialData?: AdminUser;
  isLoading?: boolean;
}

export function AdminUserForm({ onSubmit, initialData, isLoading }: AdminUserFormProps) {
  return (
    <Form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      onSubmit({
        email: formData.get('email') as string,
        password: formData.get('password') as string || undefined,
        role: formData.get('role') as string
      });
    }}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={initialData?.email}
            required
          />
        </div>
        {!initialData && (
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required={!initialData}
            />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select name="role" defaultValue={initialData?.role || 'superadmin'}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="superadmin">SuperAdmin</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : initialData ? "Update User" : "Create User"}
        </Button>
      </div>
    </Form>
  );
}
```

### 4. StatusBadge

```tsx
// src/components/ui/status-badge.tsx
interface StatusBadgeProps {
  status: 'active' | 'suspended' | 'cancelled';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variants = {
    active: "bg-green-100 text-green-800 border-green-200",
    suspended: "bg-amber-100 text-amber-800 border-amber-200",
    cancelled: "bg-red-100 text-red-800 border-red-200"
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
```

### 5. MetricsCard

```tsx
// src/components/ui/metrics-card.tsx
interface MetricsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description?: string;
}

export function MetricsCard({ title, value, icon, description }: MetricsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
```

## API Client

```tsx
// src/api/admin.ts
export const adminApi = {
  // Dashboard
  getDashboardMetrics: async () => {
    const response = await apiClient.get('/admin/dashboard');
    return response.data;
  },
  
  // Tenant Management
  createTenant: async (data: { name: string; planId: string }) => {
    const response = await apiClient.post('/admin/tenants', data);
    return response.data;
  },
  
  listTenants: async () => {
    const response = await apiClient.get('/admin/tenants');
    return response.data;
  },
  
  getTenant: async (id: string) => {
    const response = await apiClient.get(`/admin/tenants/${id}`);
    return response.data;
  },
  
  updateTenantStatus: async ({ id, status }: { id: string; status: string }) => {
    const response = await apiClient.put(`/admin/tenants/${id}/status`, { status });
    return response.data;
  },
  
  deleteTenant: async (id: string) => {
    const response = await apiClient.delete(`/admin/tenants/${id}`);
    return response.data;
  },
  
  // Plan Management
  createPlan: async (data: {
    name: string;
    maxStations?: number;
    maxPumpsPerStation?: number;
    maxNozzlesPerPump?: number;
    priceMonthly?: number;
    features?: string[];
  }) => {
    const response = await apiClient.post('/admin/plans', data);
    return response.data;
  },
  
  listPlans: async () => {
    const response = await apiClient.get('/admin/plans');
    return response.data;
  },
  
  getPlan: async (id: string) => {
    const response = await apiClient.get(`/admin/plans/${id}`);
    return response.data;
  },
  
  updatePlan: async ({ id, ...data }: { id: string; [key: string]: any }) => {
    const response = await apiClient.put(`/admin/plans/${id}`, data);
    return response.data;
  },
  
  deletePlan: async (id: string) => {
    const response = await apiClient.delete(`/admin/plans/${id}`);
    return response.data;
  },
  
  // Admin User Management
  createAdminUser: async (data: { email: string; password?: string; role?: string }) => {
    const response = await apiClient.post('/admin/users', data);
    return response.data;
  },
  
  listAdminUsers: async () => {
    const response = await apiClient.get('/admin/users');
    return response.data;
  },
  
  getAdminUser: async (id: string) => {
    const response = await apiClient.get(`/admin/users/${id}`);
    return response.data;
  },
  
  updateAdminUser: async ({ id, ...data }: { id: string; [key: string]: any }) => {
    const response = await apiClient.put(`/admin/users/${id}`, data);
    return response.data;
  },
  
  deleteAdminUser: async (id: string) => {
    const response = await apiClient.delete(`/admin/users/${id}`);
    return response.data;
  },
  
  resetAdminPassword: async ({ id, password }: { id: string; password: string }) => {
    const response = await apiClient.post(`/admin/users/${id}/reset-password`, { password });
    return response.data;
  }
};
```

## React Query Hooks

```tsx
// src/hooks/useAdmin.ts
export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: adminApi.getDashboardMetrics
  });
}

export function useTenants() {
  return useQuery({
    queryKey: ['admin', 'tenants'],
    queryFn: adminApi.listTenants
  });
}

export function useTenant(id: string) {
  return useQuery({
    queryKey: ['admin', 'tenants', id],
    queryFn: () => adminApi.getTenant(id),
    enabled: !!id
  });
}

export function usePlans() {
  return useQuery({
    queryKey: ['admin', 'plans'],
    queryFn: adminApi.listPlans
  });
}

export function usePlan(id: string) {
  return useQuery({
    queryKey: ['admin', 'plans', id],
    queryFn: () => adminApi.getPlan(id),
    enabled: !!id
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: adminApi.listAdminUsers
  });
}

export function useAdminUser(id: string) {
  return useQuery({
    queryKey: ['admin', 'users', id],
    queryFn: () => adminApi.getAdminUser(id),
    enabled: !!id
  });
}
```

## Navigation

```tsx
// src/components/layout/sidebar.tsx
function AdminNavigation() {
  return (
    <>
      <SidebarItem href="/admin/dashboard" icon={<LayoutDashboard />}>
        Dashboard
      </SidebarItem>
      <SidebarItem href="/admin/tenants" icon={<Building />}>
        Tenants
      </SidebarItem>
      <SidebarItem href="/admin/plans" icon={<Package />}>
        Plans
      </SidebarItem>
      <SidebarItem href="/admin/users" icon={<Users />}>
        Admin Users
      </SidebarItem>
    </>
  );
}

// In the Sidebar component
{user?.role === 'superadmin' && <AdminNavigation />}
```

## Implementation Steps

1. Create API client for admin endpoints
2. Create React Query hooks
3. Implement UI components
4. Create pages for SuperAdmin
5. Add navigation for SuperAdmin role
6. Test all functionality