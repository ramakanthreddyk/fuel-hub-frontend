
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Edit, Trash2, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import type { Tenant } from '@/api/api-contract';

interface TenantActionsProps {
  tenant: Tenant;
  onStatusChange: (tenantId: string, status: 'active' | 'suspended' | 'cancelled') => void;
  onDelete: (tenantId: string) => void;
}

export const TenantActions: React.FC<TenantActionsProps> = ({
  tenant,
  onStatusChange,
  onDelete,
}) => {
  const navigate = useNavigate();

  const handleViewSettings = () => {
    navigate(`/superadmin/tenants/${tenant.id}/settings`);
  };

  const handleViewDetails = () => {
    navigate(`/superadmin/tenants/${tenant.id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex items-center space-x-2">

      <Button
        variant="outline"
        size="sm"
        onClick={handleViewSettings}
        className="flex items-center space-x-1"
      >
        <Settings className="h-4 w-4" />
        <span>Settings</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleViewDetails}>
            <Edit className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {tenant.status === 'active' && (
            <DropdownMenuItem onClick={() => onStatusChange(tenant.id, 'suspended')}>
              <Pause className="mr-2 h-4 w-4" />
              Suspend
            </DropdownMenuItem>
          )}
          
          {tenant.status === 'suspended' && (
            <DropdownMenuItem onClick={() => onStatusChange(tenant.id, 'active')}>
              <Play className="mr-2 h-4 w-4" />
              Reactivate
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem 
            onClick={() => onStatusChange(tenant.id, 'cancelled')}
            className="text-orange-600"
          >
            <Pause className="mr-2 h-4 w-4" />
            Cancel
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => onDelete(tenant.id)}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
