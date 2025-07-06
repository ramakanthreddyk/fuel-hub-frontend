
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Building2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { CreateTenantRequest } from '@/api/api-contract';
import { superAdminApi } from '@/api/superadmin';
import { useToast } from '@/hooks/use-toast';
import { SuperAdminErrorBoundary } from '@/components/admin/SuperAdminErrorBoundary';
import { TenantForm } from '@/components/admin/TenantForm';
import { TenantCard } from '@/components/admin/TenantCard';

export default function SuperAdminTenantsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tenants, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-tenants'],
    queryFn: superAdminApi.getTenants,
    retry: 2
  });

  const { data: plans = [] } = useQuery({
    queryKey: ['admin-plans'],
    queryFn: superAdminApi.getPlans
  });

  const createTenantMutation = useMutation({
    mutationFn: superAdminApi.createTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tenants'] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Tenant created successfully",
      });
    },
    onError: (error) => {
      console.error('Error creating tenant:', error);
      toast({
        title: "Error",
        description: "Failed to create tenant",
        variant: "destructive",
      });
    }
  });

  const updateTenantStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'active' | 'suspended' | 'cancelled' }) => 
      superAdminApi.updateTenantStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tenants'] });
      toast({
        title: "Success",
        description: "Tenant status updated",
      });
    },
    onError: (error) => {
      console.error('Error updating tenant status:', error);
      toast({
        title: "Error",
        description: "Failed to update tenant status",
        variant: "destructive",
      });
    }
  });

  const deleteTenantMutation = useMutation({
    mutationFn: superAdminApi.deleteTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tenants'] });
      toast({
        title: "Success",
        description: "Tenant deleted",
      });
    },
    onError: (error) => {
      console.error('Error deleting tenant:', error);
      toast({
        title: "Error",
        description: "Failed to delete tenant",
        variant: "destructive",
      });
    }
  });

  const handleCreateTenant = (data: { name: string; planId: string; ownerName: string; ownerEmail: string; ownerPassword: string; }) => {
    console.log('Creating tenant with data:', data);
    const createRequest: CreateTenantRequest = {
      name: data.name,
      planId: data.planId,
      ownerName: data.ownerName,
      ownerEmail: data.ownerEmail,
      ownerPassword: data.ownerPassword
    };
    createTenantMutation.mutate(createRequest);
  };

  const handleUpdateStatus = (id: string, status: 'active' | 'suspended' | 'cancelled') => {
    console.log('Updating tenant status:', id, status);
    updateTenantStatusMutation.mutate({ id, status });
  };

  const handleDeleteTenant = (id: string) => {
    console.log('Deleting tenant:', id);
    deleteTenantMutation.mutate(id);
  };

  const handleViewTenant = (id: string) => {
    console.log('Navigating to tenant details page for ID:', id);
    console.log('Current location:', window.location.pathname);
    
    // Ensure we have a valid tenant ID
    if (!id) {
      console.error('No tenant ID provided for navigation');
      toast({
        title: "Error",
        description: "Invalid tenant ID",
        variant: "destructive",
      });
      return;
    }

    // Navigate to tenant details
    const targetRoute = `/superadmin/tenants/${id}`;
    console.log('Navigating to:', targetRoute);
    
    try {
      navigate(targetRoute);
      console.log('Navigation successful');
    } catch (error) {
      console.error('Navigation failed:', error);
      toast({
        title: "Error",
        description: "Failed to navigate to tenant details",
        variant: "destructive",
      });
    }
  };

  // Ensure tenants is always an array
  const tenantsArray = Array.isArray(tenants) ? tenants : [];
  console.log('Tenants data:', tenantsArray);

  return (
    <div className="space-y-6">
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
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200">
              <Plus className="mr-2 h-4 w-4" />
              Add Tenant
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Create New Tenant</DialogTitle>
              <DialogDescription>
                Add a new tenant organization to the system
              </DialogDescription>
            </DialogHeader>
            <TenantForm
              plans={Array.isArray(plans) ? plans : []}
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
                <div className="p-6 animate-pulse space-y-3">
                  <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-2/3"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4"></div>
                </div>
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
            {tenantsArray.map((tenant) => {
              console.log('Rendering tenant card for:', tenant.id, tenant.name);
              return (
                <TenantCard
                  key={tenant.id}
                  tenant={tenant}
                  onUpdateStatus={handleUpdateStatus}
                  onDelete={handleDeleteTenant}
                  onView={handleViewTenant}
                />
              );
            })}
          </div>
        )}
      </SuperAdminErrorBoundary>
    </div>
  );
}
