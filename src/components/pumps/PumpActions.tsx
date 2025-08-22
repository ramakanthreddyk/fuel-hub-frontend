/**
 * @file components/pumps/PumpActions.tsx
 * @description Reusable pump action components
 */
import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Eye, MoreVertical, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PumpCardActions } from '@/models/pump-actions';
import type { PumpCardVariant } from '@/models/pump';
import { createPumpActionItems } from '@/models/pump-actions';

interface PumpActionsProps {
  readonly actions: PumpCardActions;
  readonly variant: PumpCardVariant;
  readonly pumpId: string;
  readonly pumpStatus: string;
}

/**
 * Compact actions - primary button + dropdown menu
 */
export const CompactPumpActions = memo(function CompactPumpActions({
  actions,
  pumpId,
  pumpStatus,
}: Omit<PumpActionsProps, 'variant'>) {
  const actionItems = createPumpActionItems(actions, pumpId, pumpStatus);

  return (
    <div className="flex items-center justify-between gap-2">
      {actions.onViewNozzles && (
        <Button
          onClick={() => actions.onViewNozzles!(pumpId)}
          size="sm"
          className="flex-1 h-8"
        >
          <Eye className="h-3 w-3 mr-1" />
          View Nozzles
        </Button>
      )}

      {actionItems.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            {actionItems.map((item, index) => (
              <React.Fragment key={item.key}>
                {item.separator && index > 0 && <DropdownMenuSeparator />}
                <DropdownMenuItem
                  onClick={item.handler}
                  className={cn(
                    item.variant === 'destructive' && "text-red-600 focus:text-red-600"
                  )}
                >
                  <item.icon className="h-3 w-3 mr-2" />
                  {item.label}
                </DropdownMenuItem>
              </React.Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
});

/**
 * Standard actions - side-by-side buttons
 */
export const StandardPumpActions = memo(function StandardPumpActions({
  actions,
  variant,
  pumpId,
}: Omit<PumpActionsProps, 'pumpStatus'>) {
  return (
    <div className="flex gap-2">
      {actions.onViewNozzles && (
        <Button
          onClick={() => actions.onViewNozzles!(pumpId)}
          size="sm"
          className={cn(
            "flex-1",
            variant === 'enhanced'
              ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg"
              : "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 shadow-md"
          )}
        >
          <Eye className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">View Nozzles</span>
          <span className="sm:hidden">Nozzles</span>
        </Button>
      )}

      {actions.onSettings && (
        <Button
          onClick={() => actions.onSettings!(pumpId)}
          size="sm"
          variant="outline"
          className="hover:bg-gray-50 border-gray-200 hover:border-gray-300"
        >
          <Settings className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
});
