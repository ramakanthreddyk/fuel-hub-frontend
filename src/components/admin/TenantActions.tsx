
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye } from 'lucide-react';
import { Tenant } from '@/api/api-contract';

interface TenantActionsProps {
  tenant: Tenant;
  onUpdateStatus: (id: string, status: 'active' | 'suspended' | 'cancelled') => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

export function TenantActions({ tenant, onUpdateStatus, onDelete, onView }: TenantActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onView(tenant.id)}>
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {tenant.status !== 'active' && (
          <DropdownMenuItem onClick={() => onUpdateStatus(tenant.id, 'active')}>
            ✅ Activate
          </DropdownMenuItem>
        )}
        {tenant.status !== 'suspended' && (
          <DropdownMenuItem onClick={() => onUpdateStatus(tenant.id, 'suspended')}>
            ⏸️ Suspend
          </DropdownMenuItem>
        )}
        {tenant.status !== 'cancelled' && (
          <DropdownMenuItem onClick={() => onUpdateStatus(tenant.id, 'cancelled')}>
            ❌ Cancel Subscription
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => {
            if (confirm('Are you sure you want to delete this tenant? This will disable their access but preserve all data.')) {
              onDelete(tenant.id);
            }
          }}
          className="text-red-600"
        >
          🗑️ Delete (Soft)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
