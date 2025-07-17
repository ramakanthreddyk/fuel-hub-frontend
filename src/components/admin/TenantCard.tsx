
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Eye, Users, MapPin, Calendar, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '@/utils/formatters';
import { Tenant } from '@/api/api-contract';
import { TenantStats } from './TenantStats';

interface TenantCardProps {
  tenant: Tenant;
  onUpdateStatus: (id: string, status: 'active' | 'suspended' | 'cancelled') => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

export function TenantCard({ tenant, onUpdateStatus, onDelete, onView }: TenantCardProps) {
  const navigate = useNavigate();
  console.log('TenantCard - tenant ID:', tenant.id, 'tenant name:', tenant.name);
  
  const getPlanColor = (planName: string) => {
    if (planName.toLowerCase().includes('basic')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (planName.toLowerCase().includes('premium')) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (planName.toLowerCase().includes('enterprise')) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleViewClick = () => {
    console.log('TenantCard - View button clicked for tenant:', tenant.id);
    onView(tenant.id);
  };

  const handleSettingsClick = () => {
    console.log('TenantCard - Settings button clicked for tenant:', tenant.id);
    navigate(`/superadmin/tenants/${tenant.id}/settings`);
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white shadow-md hover:shadow-purple-100/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-lg min-w-0 flex-1">
            <div className="p-2.5 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex-shrink-0 shadow-sm">
              <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="truncate text-sm sm:text-lg font-bold text-gray-900">{tenant.name}</span>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={`${getStatusColor(tenant.status)} border text-xs px-2 py-0.5 font-medium`}>
                  {tenant.status}
                </Badge>
                {tenant.status === 'active' && (
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>
          </CardTitle>
          <Badge className={`${getPlanColor(tenant.planName)} border font-semibold text-xs px-3 py-1 flex-shrink-0`}>
            {tenant.planName}
          </Badge>
        </div>
        <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-2 flex items-center gap-1 text-gray-500">
          <Calendar className="h-3 w-3" />
          <span>Created {formatDate(tenant.createdAt)}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <TenantStats 
          stationCount={tenant.stationCount || 0}
          userCount={tenant.userCount || 0}
        />
        
        {/* Action Buttons */}
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <Button
            onClick={handleViewClick}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium shadow-sm hover:shadow-md transition-all duration-200"
            size="sm"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          <Button
            onClick={handleSettingsClick}
            variant="outline"
            className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 font-medium shadow-sm hover:shadow-md transition-all duration-200"
            size="sm"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
