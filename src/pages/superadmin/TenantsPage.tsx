
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Building2, Plus, MoreHorizontal, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { tenantsApi } from '@/api/tenants';
import { CreateTenantRequest } from '@/api/api-contract';
import { superAdminApi } from '@/api/superadmin';
import { useToast } from '@/hooks/use-toast';
import { SuperAdminErrorBoundary } from '@/components/admin/SuperAdminErrorBoundary';
import { TenantForm } from '@/components/admin/TenantForm';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatDate } from '@/utils/formatters';

export default function SuperAdminTenantsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tenants, isLoading, error, refetch } = useQuery({
    queryKey: ['tenants'],
    queryFn: tenantsApi.getTenants,
    retry: 2
  });

  const { data: plans } = useQuery({
    queryKey: ['admin-plans'],
    queryFn: superAdminApi.getPlans
  });

  const createTenantMutation = useMutation({
    mutationFn: tenantsApi.createTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Tenant created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create tenant",
        variant: "destructive",
      });
    }
  });

  const updateTenantStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'active' | 'suspended' | 'cancelled' }) => 
      tenantsApi.updateTenantStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast({
        title: "Success",
        description: "Tenant status updated",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update tenant status",
        variant: "destructive",
      });
    }
  });

  const deleteTenantMutation = useMutation({
    mutationFn: tenantsApi.deleteTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast({
        title: "Success",
        description: "Tenant deleted",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete tenant",
        variant: "destructive",
      });
    }
  });

  const handleCreateTenant = (data: CreateTenantRequest) => {
    createTenantMutation.mutate(data);
  };

  const getPlanColor = (planName: string) => {
    if (planName.toLowerCase().includes('basic')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (planName.toLowerCase().includes('premium')) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (planName.toLowerCase().includes('enterprise')) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Ensure tenants is always an array
  const tenantsArray = Array.isArray(tenants) ? tenants : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Tenant Management
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Manage all tenant organizations across the platform
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg">
                <Plus className="mr-2 h-4 w-4" />
                Add Tenant
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">Create New Tenant</DialogTitle>
                <DialogDescription>
                  Add a new tenant organization to the system
                </DialogDescription>
              </DialogHeader>
              <TenantForm
                plans={plans || []}
                isLoading={createTenantMutation.isPending}
                onSubmit={handleCreateTenant}
              />
            </DialogContent>
          </Dialog>
        </div>

        <SuperAdminErrorBoundary error={error} onRetry={() => refetch()}>
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="animate-pulse space-y-3">
                    <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-2/3"></div>
                  </CardHeader>
                  <CardContent className="animate-pulse space-y-3">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : tenantsArray.length === 0 ? (
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Tenants Found</h3>
                <p className="text-muted-foreground mb-4">
                  Get started by creating your first tenant organization.
                </p>
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Tenant
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tenantsArray.map((tenant) => (
                <Card key={tenant.id} className="hover:shadow-2xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm hover:scale-105">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-3 text-lg">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
                          <Building2 className="h-5 w-5 text-white" />
                        </div>
                        <span className="truncate">{tenant.name}</span>
                      </CardTitle>
                      <Badge className={`${getPlanColor(tenant.planName)} border font-medium`}>
                        {tenant.planName}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm">
                      Tenant ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">{tenant.id}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{tenant.stationCount || 0}</div>
                        <div className="text-xs text-muted-foreground font-medium">Stations</div>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{tenant.userCount || 0}</div>
                        <div className="text-xs text-muted-foreground font-medium">Users</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <StatusBadge status={tenant.status} />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => navigate(`/superadmin/tenants/${tenant.id}`)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {tenant.status !== 'active' && (
                            <DropdownMenuItem onClick={() => updateTenantStatusMutation.mutate({ id: tenant.id, status: 'active' })}>
                              ✅ Activate
                            </DropdownMenuItem>
                          )}
                          {tenant.status !== 'suspended' && (
                            <DropdownMenuItem onClick={() => updateTenantStatusMutation.mutate({ id: tenant.id, status: 'suspended' })}>
                              ⏸️ Suspend
                            </DropdownMenuItem>
                          )}
                          {tenant.status !== 'cancelled' && (
                            <DropdownMenuItem onClick={() => updateTenantStatusMutation.mutate({ id: tenant.id, status: 'cancelled' })}>
                              ❌ Cancel Subscription
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this tenant? This will disable their access but preserve all data.')) {
                                deleteTenantMutation.mutate(tenant.id);
                              }
                            }}
                            className="text-red-600"
                          >
                            🗑️ Delete (Soft)
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="text-xs text-muted-foreground text-center">
                      Created: {formatDate(tenant.createdAt)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </SuperAdminErrorBoundary>
      </div>
    </div>
  );
}
