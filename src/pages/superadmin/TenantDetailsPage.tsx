
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { TenantHierarchy } from '@/components/admin/TenantHierarchy';
import { useTenantDetails } from '@/hooks/useTenantDetails';
import { DashboardErrorBoundary } from '@/components/dashboard/DashboardErrorBoundary';

export default function TenantDetailsPage() {
  const { tenantId } = useParams<{ tenantId: string }>();
  const navigate = useNavigate();
  
  if (!tenantId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <h3 className="text-lg font-semibold mb-2">Invalid Tenant ID</h3>
              <p className="text-muted-foreground mb-4">
                No tenant ID was provided in the URL.
              </p>
              <Button onClick={() => navigate('/superadmin/tenants')}>
                Return to Tenants
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: tenant, isLoading, error, refetch } = useTenantDetails(tenantId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Loading Tenant Details</h3>
              <p className="text-muted-foreground">
                Fetching organizational structure...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
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

          {/* Error State */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Tenant</h3>
              <p className="text-muted-foreground mb-4">
                {error instanceof Error ? error.message : 'Failed to load tenant details'}
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
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
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
              <h3 className="text-lg font-semibold mb-2">Tenant Not Found</h3>
              <p className="text-muted-foreground mb-4">
                The requested tenant could not be found or you don't have permission to view it.
              </p>
              <Button onClick={() => navigate('/superadmin/tenants')}>
                Return to Tenants
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/superadmin/tenants')}
            className="bg-white/80 backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tenants
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {tenant.name}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Complete organizational structure and hierarchy
            </p>
          </div>
        </div>

        {/* Content */}
        <DashboardErrorBoundary error={null} onRetry={() => refetch()}>
          <TenantHierarchy tenant={tenant} />
        </DashboardErrorBoundary>
      </div>
    </div>
  );
}
