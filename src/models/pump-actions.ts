/**
 * @file models/pump-actions.ts
 * @description Pump action definitions and handlers
 */
import React from 'react';
import { Edit, Settings, Power, Trash2 } from 'lucide-react';

/**
 * Pump card action handlers interface
 */
export interface PumpCardActions {
  readonly onViewNozzles?: (pumpId: string) => void;
  readonly onEdit?: (pumpId: string) => void;
  readonly onDelete?: (pumpId: string) => void;
  readonly onSettings?: (pumpId: string) => void;
  readonly onPowerToggle?: (pumpId: string) => void;
}

/**
 * Action item for rendering in dropdown menus
 */
export interface PumpActionItem {
  readonly key: string;
  readonly label: string;
  readonly icon: React.ComponentType<{ className?: string }>;
  readonly handler: () => void;
  readonly variant?: 'default' | 'destructive';
  readonly separator?: boolean;
}

/**
 * Create action items from pump actions
 */
export const createPumpActionItems = (
  actions: PumpCardActions,
  pumpId: string,
  pumpStatus: string
): PumpActionItem[] => {
  const items: PumpActionItem[] = [];

  if (actions.onEdit) {
    items.push({
      key: 'edit',
      label: 'Edit',
      icon: Edit,
      handler: () => actions.onEdit!(pumpId),
    });
  }

  if (actions.onSettings) {
    items.push({
      key: 'settings',
      label: 'Settings',
      icon: Settings,
      handler: () => actions.onSettings!(pumpId),
    });
  }

  if (actions.onPowerToggle) {
    items.push({
      key: 'power',
      label: pumpStatus === 'active' ? 'Deactivate' : 'Activate',
      icon: Power,
      handler: () => actions.onPowerToggle!(pumpId),
      separator: true,
    });
  }

  if (actions.onDelete) {
    items.push({
      key: 'delete',
      label: 'Delete',
      icon: Trash2,
      handler: () => actions.onDelete!(pumpId),
      variant: 'destructive',
    });
  }

  return items;
};
