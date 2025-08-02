/**
 * @file hooks/useRoleBasedAccess.ts
 * @description Hook for role-based access control that syncs with backend permissions
 */

import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export type PlanTier = 'starter' | 'pro' | 'enterprise';
export type UserRole = 'superadmin' | 'owner' | 'manager' | 'attendant';

interface FeatureAccess {
  view?: boolean;
  create?: boolean;
  edit?: boolean;
  delete?: boolean;
  viewAll?: boolean;
  generate?: boolean;
  schedule?: boolean;
  export?: boolean;
  perform?: boolean;
  closeDay?: boolean;
  resetPassword?: boolean;
  advanced?: boolean;
}

interface RoleAccessMatrix {
  dashboard: FeatureAccess;
  stations: FeatureAccess;
  pumps: FeatureAccess;
  nozzles: FeatureAccess;
  readings: FeatureAccess;
  sales: FeatureAccess;
  cashReports: FeatureAccess;
  reconciliation: FeatureAccess;
  users: FeatureAccess;
  fuelPrices: FeatureAccess;
  inventory: FeatureAccess;
  creditors: FeatureAccess;
  reports: FeatureAccess;
  analytics: FeatureAccess;
  settings: FeatureAccess;
}

// Plan name to tier mapping (matches backend)
const PLAN_NAME_TO_TIER: Record<string, PlanTier> = {
  'Regular': 'starter',
  'Premium': 'pro',
  'Enterprise': 'enterprise'
};

// Role-based access matrix (matches backend exactly)
const ROLE_ACCESS_MATRIX: Record<PlanTier, Record<UserRole, RoleAccessMatrix>> = {
  starter: {
    owner: {
      dashboard: { view: true },
      stations: { view: true, create: true, edit: true, delete: false },
      pumps: { view: true, create: true, edit: true, delete: false },
      nozzles: { view: true, create: true, edit: true, delete: false },
      readings: { view: true, create: true, edit: true, delete: false, viewAll: true },
      sales: { view: true, create: true, edit: true, delete: false, viewAll: true },
      cashReports: { view: true, create: true, edit: true, viewAll: true },
      reconciliation: { view: true, perform: true, closeDay: true },
      users: { view: true, create: true, edit: true, delete: false, resetPassword: true },
      fuelPrices: { view: true, edit: true },
      inventory: { view: true, edit: true },
      creditors: { view: false, create: false, edit: false, delete: false },
      reports: { view: false, generate: false, schedule: false, export: false },
      analytics: { view: false, advanced: false },
      settings: { view: true, edit: true }
    },
    manager: {
      dashboard: { view: true },
      stations: { view: true, create: false, edit: true, delete: false },
      pumps: { view: true, create: false, edit: true, delete: false },
      nozzles: { view: true, create: false, edit: true, delete: false },
      readings: { view: true, create: true, edit: true, delete: false, viewAll: true },
      sales: { view: true, create: true, edit: true, delete: false, viewAll: true },
      cashReports: { view: true, create: true, edit: true, viewAll: true },
      reconciliation: { view: true, perform: true, closeDay: true },
      users: { view: true, create: false, edit: false, delete: false, resetPassword: false },
      fuelPrices: { view: true, edit: true },
      inventory: { view: true, edit: true },
      creditors: { view: false, create: false, edit: false, delete: false },
      reports: { view: false, generate: false, schedule: false, export: false },
      analytics: { view: false, advanced: false },
      settings: { view: true, edit: false }
    },
    attendant: {
      dashboard: { view: true },
      stations: { view: true, create: false, edit: false, delete: false },
      pumps: { view: true, create: false, edit: false, delete: false },
      nozzles: { view: true, create: false, edit: false, delete: false },
      readings: { view: true, create: true, edit: true, delete: false, viewAll: false },
      sales: { view: true, create: true, edit: false, delete: false, viewAll: false },
      cashReports: { view: true, create: true, edit: true, viewAll: false },
      reconciliation: { view: false, perform: false, closeDay: false },
      users: { view: false, create: false, edit: false, delete: false, resetPassword: false },
      fuelPrices: { view: true, edit: false },
      inventory: { view: true, edit: false },
      creditors: { view: false, create: false, edit: false, delete: false },
      reports: { view: false, generate: false, schedule: false, export: false },
      analytics: { view: false, advanced: false },
      settings: { view: false, edit: false }
    },
    superadmin: {
      dashboard: { view: true },
      stations: { view: true, create: true, edit: true, delete: true },
      pumps: { view: true, create: true, edit: true, delete: true },
      nozzles: { view: true, create: true, edit: true, delete: true },
      readings: { view: true, create: true, edit: true, delete: true, viewAll: true },
      sales: { view: true, create: true, edit: true, delete: true, viewAll: true },
      cashReports: { view: true, create: true, edit: true, viewAll: true },
      reconciliation: { view: true, perform: true, closeDay: true },
      users: { view: true, create: true, edit: true, delete: true, resetPassword: true },
      fuelPrices: { view: true, edit: true },
      inventory: { view: true, edit: true },
      creditors: { view: true, create: true, edit: true, delete: true },
      reports: { view: true, generate: true, schedule: true, export: true },
      analytics: { view: true, advanced: true },
      settings: { view: true, edit: true }
    }
  },
  pro: {
    owner: {
      dashboard: { view: true },
      stations: { view: true, create: true, edit: true, delete: true },
      pumps: { view: true, create: true, edit: true, delete: true },
      nozzles: { view: true, create: true, edit: true, delete: true },
      readings: { view: true, create: true, edit: true, delete: true, viewAll: true },
      sales: { view: true, create: true, edit: true, delete: true, viewAll: true },
      cashReports: { view: true, create: true, edit: true, viewAll: true },
      reconciliation: { view: true, perform: true, closeDay: true },
      users: { view: true, create: true, edit: true, delete: true, resetPassword: true },
      fuelPrices: { view: true, edit: true },
      inventory: { view: true, edit: true },
      creditors: { view: true, create: true, edit: true, delete: true },
      reports: { view: true, generate: true, schedule: true, export: true },
      analytics: { view: true, advanced: false },
      settings: { view: true, edit: true }
    },
    manager: {
      dashboard: { view: true },
      stations: { view: true, create: true, edit: true, delete: false },
      pumps: { view: true, create: true, edit: true, delete: false },
      nozzles: { view: true, create: true, edit: true, delete: false },
      readings: { view: true, create: true, edit: true, delete: true, viewAll: true },
      sales: { view: true, create: true, edit: true, delete: true, viewAll: true },
      cashReports: { view: true, create: true, edit: true, viewAll: true },
      reconciliation: { view: true, perform: true, closeDay: true },
      users: { view: true, create: true, edit: true, delete: false, resetPassword: false },
      fuelPrices: { view: true, edit: true },
      inventory: { view: true, edit: true },
      creditors: { view: true, create: true, edit: true, delete: false },
      reports: { view: true, generate: true, schedule: false, export: true },
      analytics: { view: true, advanced: false },
      settings: { view: true, edit: false }
    },
    attendant: {
      dashboard: { view: true },
      stations: { view: true, create: false, edit: false, delete: false },
      pumps: { view: true, create: false, edit: false, delete: false },
      nozzles: { view: true, create: false, edit: false, delete: false },
      readings: { view: true, create: true, edit: true, delete: false, viewAll: false },
      sales: { view: true, create: true, edit: false, delete: false, viewAll: false },
      cashReports: { view: true, create: true, edit: true, viewAll: false },
      reconciliation: { view: false, perform: false, closeDay: false },
      users: { view: false, create: false, edit: false, delete: false, resetPassword: false },
      fuelPrices: { view: true, edit: false },
      inventory: { view: true, edit: false },
      creditors: { view: true, create: false, edit: false, delete: false },
      reports: { view: false, generate: false, schedule: false, export: false },
      analytics: { view: false, advanced: false },
      settings: { view: false, edit: false }
    },
    superadmin: {
      dashboard: { view: true },
      stations: { view: true, create: true, edit: true, delete: true },
      pumps: { view: true, create: true, edit: true, delete: true },
      nozzles: { view: true, create: true, edit: true, delete: true },
      readings: { view: true, create: true, edit: true, delete: true, viewAll: true },
      sales: { view: true, create: true, edit: true, delete: true, viewAll: true },
      cashReports: { view: true, create: true, edit: true, viewAll: true },
      reconciliation: { view: true, perform: true, closeDay: true },
      users: { view: true, create: true, edit: true, delete: true, resetPassword: true },
      fuelPrices: { view: true, edit: true },
      inventory: { view: true, edit: true },
      creditors: { view: true, create: true, edit: true, delete: true },
      reports: { view: true, generate: true, schedule: true, export: true },
      analytics: { view: true, advanced: true },
      settings: { view: true, edit: true }
    }
  },
  enterprise: {
    owner: {
      dashboard: { view: true },
      stations: { view: true, create: true, edit: true, delete: true },
      pumps: { view: true, create: true, edit: true, delete: true },
      nozzles: { view: true, create: true, edit: true, delete: true },
      readings: { view: true, create: true, edit: true, delete: true, viewAll: true },
      sales: { view: true, create: true, edit: true, delete: true, viewAll: true },
      cashReports: { view: true, create: true, edit: true, viewAll: true },
      reconciliation: { view: true, perform: true, closeDay: true },
      users: { view: true, create: true, edit: true, delete: true, resetPassword: true },
      fuelPrices: { view: true, edit: true },
      inventory: { view: true, edit: true },
      creditors: { view: true, create: true, edit: true, delete: true },
      reports: { view: true, generate: true, schedule: true, export: true },
      analytics: { view: true, advanced: true },
      settings: { view: true, edit: true }
    },
    manager: {
      dashboard: { view: true },
      stations: { view: true, create: true, edit: true, delete: true },
      pumps: { view: true, create: true, edit: true, delete: true },
      nozzles: { view: true, create: true, edit: true, delete: true },
      readings: { view: true, create: true, edit: true, delete: true, viewAll: true },
      sales: { view: true, create: true, edit: true, delete: true, viewAll: true },
      cashReports: { view: true, create: true, edit: true, viewAll: true },
      reconciliation: { view: true, perform: true, closeDay: true },
      users: { view: true, create: true, edit: true, delete: true, resetPassword: true },
      fuelPrices: { view: true, edit: true },
      inventory: { view: true, edit: true },
      creditors: { view: true, create: true, edit: true, delete: true },
      reports: { view: true, generate: true, schedule: true, export: true },
      analytics: { view: true, advanced: true },
      settings: { view: true, edit: true }
    },
    attendant: {
      dashboard: { view: true },
      stations: { view: true, create: false, edit: false, delete: false },
      pumps: { view: true, create: false, edit: false, delete: false },
      nozzles: { view: true, create: false, edit: false, delete: false },
      readings: { view: true, create: true, edit: true, delete: false, viewAll: false },
      sales: { view: true, create: true, edit: true, delete: false, viewAll: false },
      cashReports: { view: true, create: true, edit: true, viewAll: false },
      reconciliation: { view: true, perform: false, closeDay: false },
      users: { view: false, create: false, edit: false, delete: false, resetPassword: false },
      fuelPrices: { view: true, edit: false },
      inventory: { view: true, edit: true },
      creditors: { view: true, create: true, edit: true, delete: false },
      reports: { view: true, generate: false, schedule: false, export: false },
      analytics: { view: false, advanced: false },
      settings: { view: false, edit: false }
    },
    superadmin: {
      dashboard: { view: true },
      stations: { view: true, create: true, edit: true, delete: true },
      pumps: { view: true, create: true, edit: true, delete: true },
      nozzles: { view: true, create: true, edit: true, delete: true },
      readings: { view: true, create: true, edit: true, delete: true, viewAll: true },
      sales: { view: true, create: true, edit: true, delete: true, viewAll: true },
      cashReports: { view: true, create: true, edit: true, viewAll: true },
      reconciliation: { view: true, perform: true, closeDay: true },
      users: { view: true, create: true, edit: true, delete: true, resetPassword: true },
      fuelPrices: { view: true, edit: true },
      inventory: { view: true, edit: true },
      creditors: { view: true, create: true, edit: true, delete: true },
      reports: { view: true, generate: true, schedule: true, export: true },
      analytics: { view: true, advanced: true },
      settings: { view: true, edit: true }
    }
  }
};

function getPlanTierFromName(planName: string): PlanTier {
  return PLAN_NAME_TO_TIER[planName] || 'starter';
}

export function useRoleBasedAccess() {
  const { user } = useAuth();

  const permissions = useMemo(() => {
    if (!user) {
      return null;
    }

    // Get plan tier from user's plan name (this should come from the backend)
    const planName = user.planName || 'Regular';
    const planTier = getPlanTierFromName(planName);

    // Get role access matrix
    const roleAccess = ROLE_ACCESS_MATRIX[planTier]?.[user.role];

    if (!roleAccess) {
      console.warn(`No access matrix found for plan: ${planTier}, role: ${user.role}`);
      return null;
    }

    return {
      planTier,
      planName,
      role: user.role,
      access: roleAccess
    };
  }, [user]);

  const hasAccess = (feature: keyof RoleAccessMatrix, action: keyof FeatureAccess = 'view'): boolean => {
    if (!permissions) return false;

    const featureAccess = permissions.access[feature];
    if (!featureAccess) return false;

    return featureAccess[action] === true;
  };

  const canView = (feature: keyof RoleAccessMatrix): boolean => hasAccess(feature, 'view');
  const canCreate = (feature: keyof RoleAccessMatrix): boolean => hasAccess(feature, 'create');
  const canEdit = (feature: keyof RoleAccessMatrix): boolean => hasAccess(feature, 'edit');
  const canDelete = (feature: keyof RoleAccessMatrix): boolean => hasAccess(feature, 'delete');

  const getUpgradeMessage = (feature: keyof RoleAccessMatrix): string | null => {
    if (!permissions) return null;

    if (permissions.planTier === 'starter') {
      return 'Upgrade to Pro or Enterprise to access this feature';
    }

    if (permissions.planTier === 'pro' && !hasAccess(feature)) {
      return 'Upgrade to Enterprise to access this feature';
    }

    return null;
  };

  const isFeatureAvailable = (feature: keyof RoleAccessMatrix): boolean => {
    return hasAccess(feature, 'view');
  };

  const getRestrictedFeatures = (): string[] => {
    if (!permissions) return [];

    const restrictedFeatures: string[] = [];
    const features: (keyof RoleAccessMatrix)[] = [
      'reports', 'analytics', 'creditors', 'users', 'settings'
    ];

    features.forEach(feature => {
      if (!hasAccess(feature, 'view')) {
        restrictedFeatures.push(feature);
      }
    });

    return restrictedFeatures;
  };

  return {
    permissions,
    hasAccess,
    canView,
    canCreate,
    canEdit,
    canDelete,
    getUpgradeMessage,
    isFeatureAvailable,
    getRestrictedFeatures,
    planTier: permissions?.planTier || 'starter',
    role: permissions?.role || 'attendant'
  };
}
