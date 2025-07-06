
import React from 'react';
import { Settings, Edit, Trash2, Pause, Play, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import type { Tenant } from '@/api/api-contract';

interface TenantCardActionsProps {
  tenant: Tenant;
  onStatusChange: (tenantId: string, status: 'active' | 'suspended' | 'cancelled') => void;
  onDelete: (tenantId: string) => void;
  onView: (tenantId: string) => void;
  onSettings: (tenantId: string) => void;
}

export const TenantCardActions: React.FC<TenantCardActionsProps> = ({
  tenant,
  onStatusChange,
  onDelete,
  onView,
  onSettings,
}) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onView(tenant.id)}
        className="flex-1"
      >
        <Edit className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">View Details</span>
        <span className="sm:hidden">View</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-white border shadow-lg">
          <DropdownMenuItem onClick={() => onSettings(tenant.id)}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
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
