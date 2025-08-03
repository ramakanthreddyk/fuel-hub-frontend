import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2, AlertCircle, RefreshCw, Settings } from 'lucide-react';
import { TenantHierarchy } from '@/components/admin/TenantHierarchy';
import { useTenantDetails } from '@/hooks/useTenantDetails';
import { DashboardErrorBoundary } from '@/components/dashboard/DashboardErrorBoundary';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantsApi } from '@/api/tenants';

export default function TenantDetailsPage() {
  const { tenantId } = useParams<{ tenantId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPlan, setSelectedPlan] = useState('');

  const { data: tenant, isLoading, error, refetch } = useTenantDetails(tenantId || '');

  const updatePlanMutation = useMutation({
    mutationFn: (planId: string) => tenantsApi.updateTenantPlan(tenantId!, planId),
    onSuccess: () => {
      toast({ title: 'Success', description: 'Tenant plan updated successfully' });
      queryClient.invalidateQueries({ queryKey: ['tenant-details', tenantId] });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update tenant plan', variant: 'destructive' });
    }
  });

  const handlePlanUpdate = () => {
    if (selectedPlan && selectedPlan !== tenant?.planId) {
      updatePlanMutation.mutate(selectedPlan);
    }
  };

  React.useEffect(() => {
    if (tenant?.planId) {
      setSelectedPlan(tenant.planId);
    }
  }, [tenant?.planId]);

  if (!tenantId) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/superadmin/tenants')}
            className="bg-white/80 backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tenants
          </Button>
        </div>
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2">Invalid Tenant ID</h3>
            <p className="text-muted-foreground mb-4">
              No tenant ID was provided in the URL. Please check the URL and try again.
            </p>
            <Button onClick={() => navigate('/superadmin/tenants')}>
              Return to Tenants
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/superadmin/tenants')}
            className="bg-white/80 backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tenants
          </Button>
        </div>
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
            <h3 className="text-lg font-semibold mb-2">Loading Tenant Details</h3>
            <p className="text-muted-foreground">
              Fetching organizational structure for tenant ID: {tenantId}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/superadmin/tenants')}
            className="bg-white/80 backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tenants
          </Button>
        </div>
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Tenant</h3>
            <p className="text-muted-foreground mb-4">
              {error instanceof Error ? error.message : `Failed to load tenant details for ID: ${tenantId}`}
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => refetch()} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button onClick={() => navigate('/superadmin/tenants')}>
                Return to Tenants
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/superadmin/tenants')}
            className="bg-white/80 backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tenants
          </Button>
        </div>
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-orange-500" />
            <h3 className="text-lg font-semibold mb-2">Tenant Not Found</h3>
            <p className="text-muted-foreground mb-4">
              The requested tenant (ID: {tenantId}) could not be found or you don't have permission to view it.
            </p>
            <Button onClick={() => navigate('/superadmin/tenants')}>
              Return to Tenants
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate('/superadmin/tenants')}
          className="bg-white/80 backdrop-blur-sm hover:bg-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tenants
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {tenant.name}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Complete organizational structure and hierarchy
          </p>
        </div>
      </div>

      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Plan Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-1">Current Plan</h4>
              <p className="text-sm text-blue-700">
                {tenant?.planName || 'Unknown'} - {tenant?.stationCount || 0} stations used
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Change Plan</label>
                <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select new plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="283c8155-7058-4485-a385-6bd1fdb6ae52">Regular (1 station max)</SelectItem>
                    <SelectItem value="2a35ec3e-29be-4b6f-b3a2-4b419363e7f7">Premium (3 stations max)</SelectItem>
                    <SelectItem value="00000000-0000-0000-0000-000000000002">Pro (3 stations max)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handlePlanUpdate}
                disabled={!selectedPlan || selectedPlan === tenant?.planId || updatePlanMutation.isPending}
              >
                {updatePlanMutation.isPending ? 'Updating...' : 'Update Plan'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <DashboardErrorBoundary error={null} onRetry={() => refetch()}>
        <TenantHierarchy tenant={tenant} />
      </DashboardErrorBoundary>
    </div>
  );
}