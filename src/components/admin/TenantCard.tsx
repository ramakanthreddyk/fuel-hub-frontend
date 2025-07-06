
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Eye, Users, MapPin } from 'lucide-react';
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

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white/95 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-lg min-w-0 flex-1">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex-shrink-0">
              <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <span className="truncate text-sm sm:text-lg">{tenant.name}</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            {tenant.status === 'active' && (
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            )}
            <Badge className={`${getPlanColor(tenant.planName)} border font-medium text-xs px-2 py-1 flex-shrink-0`}>
              <span className="hidden sm:inline">{tenant.planName}</span>
              <span className="sm:hidden">{tenant.planName.slice(0, 3)}</span>
            </Badge>
          </div>
        </div>
        <CardDescription className="text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center justify-between">
            <span className="font-medium">{tenant.name}</span>
            <Badge className={`${getStatusColor(tenant.status)} text-xs px-2 py-1`}>
              {tenant.status}
            </Badge>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        <TenantStats 
          stationCount={tenant.stationCount || 0}
          userCount={tenant.userCount || 0}
        />
        
        {/* Action Button */}
        <div className="pt-2 border-t">
          <Button
            onClick={() => onView(tenant.id)}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            size="sm"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          <span className="hidden sm:inline">Created: </span>
          {formatDate(tenant.createdAt)}
        </div>
      </CardContent>
    </Card>
  );
}
