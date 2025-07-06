
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Edit, Trash2, Pause, Play, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Tenant } from '@/api/api-contract';

interface TenantActionsProps {
  tenant: Tenant;
  onStatusChange: (tenantId: string, status: 'active' | 'suspended' | 'cancelled') => void;
  onDelete: (tenantId: string) => void;
  onView?: (tenantId: string) => void;
}

export const TenantActions: React.FC<TenantActionsProps> = ({
  tenant,
  onStatusChange,
  onDelete,
  onView,
}) => {
  const navigate = useNavigate();

  const handleViewSettings = () => {
    navigate(`/superadmin/tenants/${tenant.id}/settings`);
  };

  const handleViewDetails = () => {
    if (onView) {
      onView(tenant.id);
    } else {
      navigate(`/superadmin/tenants/${tenant.id}`);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {/* Desktop: Show both buttons */}
      <div className="hidden sm:flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewSettings}
                className="flex items-center gap-1"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden md:inline">Settings</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Tenant Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <span className="hidden md:inline">Actions</span>
              <MoreHorizontal className="h-4 w-4 md:hidden" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-white border shadow-lg">
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

      {/* Mobile: Single dropdown with all options */}
      <div className="sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-white border shadow-lg">
            <DropdownMenuItem onClick={handleViewSettings}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            
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
    </div>
  );
};
