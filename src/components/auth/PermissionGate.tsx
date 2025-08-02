/**
 * @file components/auth/PermissionGate.tsx
 * @description Component for conditional rendering based on role-based permissions
 */

import React from 'react';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Shield, Crown, Zap } from 'lucide-react';

interface PermissionGateProps {
  children: React.ReactNode;
  feature: string;
  action?: 'view' | 'create' | 'edit' | 'delete' | 'generate' | 'schedule' | 'export' | 'perform' | 'closeDay' | 'resetPassword' | 'advanced' | 'viewAll';
  fallback?: React.ReactNode;
  showUpgradePrompt?: boolean;
  requiresEnterprise?: boolean;
  requiresPro?: boolean;
}

export function PermissionGate({ 
  children, 
  feature, 
  action = 'view', 
  fallback = null,
  showUpgradePrompt = false,
  requiresEnterprise = false,
  requiresPro = false
}: PermissionGateProps) {
  const { hasAccess, getUpgradeMessage, planTier } = useRoleBasedAccess();

  const hasPermission = hasAccess(feature as any, action);

  if (hasPermission) {
    return <>{children}</>;
  }

  if (showUpgradePrompt) {
    const upgradeMessage = getUpgradeMessage(feature as any);
    
    if (upgradeMessage) {
      return (
        <UpgradePrompt 
          message={upgradeMessage}
          currentPlan={planTier}
          requiresEnterprise={requiresEnterprise}
          requiresPro={requiresPro}
          feature={feature}
        />
      );
    }
  }

  return <>{fallback}</>;
}

interface UpgradePromptProps {
  message: string;
  currentPlan: string;
  requiresEnterprise?: boolean;
  requiresPro?: boolean;
  feature: string;
}

function UpgradePrompt({ 
  message, 
  currentPlan, 
  requiresEnterprise, 
  requiresPro, 
  feature 
}: UpgradePromptProps) {
  const getUpgradeIcon = () => {
    if (requiresEnterprise) return <Crown className="h-5 w-5 text-purple-600" />;
    if (requiresPro) return <Zap className="h-5 w-5 text-blue-600" />;
    return <Shield className="h-5 w-5 text-gray-600" />;
  };

  const getUpgradeColor = () => {
    if (requiresEnterprise) return 'border-purple-200 bg-purple-50';
    if (requiresPro) return 'border-blue-200 bg-blue-50';
    return 'border-gray-200 bg-gray-50';
  };

  const getTargetPlan = () => {
    if (requiresEnterprise) return 'Enterprise';
    if (requiresPro) return 'Pro';
    return currentPlan === 'starter' ? 'Pro' : 'Enterprise';
  };

  return (
    <Alert className={`${getUpgradeColor()} border-2`}>
      <div className="flex items-start space-x-3">
        {getUpgradeIcon()}
        <div className="flex-1">
          <AlertDescription className="text-sm">
            <div className="font-medium mb-2">{message}</div>
            <div className="text-xs text-gray-600 mb-3">
              The <strong>{feature}</strong> feature requires {getTargetPlan()} plan access.
            </div>
            <Button 
              size="sm" 
              variant="outline"
              className="text-xs"
              onClick={() => {
                // This would typically open a plan upgrade modal or redirect to billing
                console.log(`Upgrade to ${getTargetPlan()} plan requested for feature: ${feature}`);
              }}
            >
              Upgrade to {getTargetPlan()}
            </Button>
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
}

// Convenience components for common permission checks
export function ViewGate({ children, feature, fallback, showUpgradePrompt }: Omit<PermissionGateProps, 'action'>) {
  return (
    <PermissionGate 
      feature={feature} 
      action="view" 
      fallback={fallback}
      showUpgradePrompt={showUpgradePrompt}
    >
      {children}
    </PermissionGate>
  );
}

export function CreateGate({ children, feature, fallback, showUpgradePrompt }: Omit<PermissionGateProps, 'action'>) {
  return (
    <PermissionGate 
      feature={feature} 
      action="create" 
      fallback={fallback}
      showUpgradePrompt={showUpgradePrompt}
    >
      {children}
    </PermissionGate>
  );
}

export function EditGate({ children, feature, fallback, showUpgradePrompt }: Omit<PermissionGateProps, 'action'>) {
  return (
    <PermissionGate 
      feature={feature} 
      action="edit" 
      fallback={fallback}
      showUpgradePrompt={showUpgradePrompt}
    >
      {children}
    </PermissionGate>
  );
}

export function DeleteGate({ children, feature, fallback, showUpgradePrompt }: Omit<PermissionGateProps, 'action'>) {
  return (
    <PermissionGate 
      feature={feature} 
      action="delete" 
      fallback={fallback}
      showUpgradePrompt={showUpgradePrompt}
    >
      {children}
    </PermissionGate>
  );
}

// Role-specific gates
interface RoleGateProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallback?: React.ReactNode;
}

export function RoleGate({ children, allowedRoles, fallback = null }: RoleGateProps) {
  const { role } = useRoleBasedAccess();
  
  if (allowedRoles.includes(role)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
}

// Plan-specific gates
interface PlanGateProps {
  children: React.ReactNode;
  requiredPlan: 'starter' | 'pro' | 'enterprise';
  fallback?: React.ReactNode;
  showUpgradePrompt?: boolean;
}

export function PlanGate({ children, requiredPlan, fallback = null, showUpgradePrompt = false }: PlanGateProps) {
  const { planTier } = useRoleBasedAccess();
  
  const planHierarchy = { starter: 0, pro: 1, enterprise: 2 };
  const hasAccess = planHierarchy[planTier] >= planHierarchy[requiredPlan];
  
  if (hasAccess) {
    return <>{children}</>;
  }
  
  if (showUpgradePrompt) {
    return (
      <UpgradePrompt 
        message={`This feature requires ${requiredPlan} plan or higher`}
        currentPlan={planTier}
        requiresEnterprise={requiredPlan === 'enterprise'}
        requiresPro={requiredPlan === 'pro'}
        feature="plan-restricted"
      />
    );
  }
  
  return <>{fallback}</>;
}

// Combined permission and role gate
interface PermissionRoleGateProps {
  children: React.ReactNode;
  feature: string;
  action?: string;
  allowedRoles: string[];
  fallback?: React.ReactNode;
  showUpgradePrompt?: boolean;
}

export function PermissionRoleGate({ 
  children, 
  feature, 
  action = 'view', 
  allowedRoles, 
  fallback = null,
  showUpgradePrompt = false
}: PermissionRoleGateProps) {
  const { hasAccess, role } = useRoleBasedAccess();
  
  const hasRoleAccess = allowedRoles.includes(role);
  const hasFeatureAccess = hasAccess(feature as any, action as any);
  
  if (hasRoleAccess && hasFeatureAccess) {
    return <>{children}</>;
  }
  
  if (!hasFeatureAccess && showUpgradePrompt) {
    return (
      <PermissionGate 
        feature={feature} 
        action={action as any} 
        showUpgradePrompt={true}
      >
        {children}
      </PermissionGate>
    );
  }
  
  return <>{fallback}</>;
}

// Hook for checking multiple permissions at once
export function useMultiplePermissions(checks: Array<{ feature: string; action?: string }>) {
  const { hasAccess } = useRoleBasedAccess();
  
  return checks.map(({ feature, action = 'view' }) => ({
    feature,
    action,
    hasAccess: hasAccess(feature as any, action as any)
  }));
}

// Component for displaying permission summary
export function PermissionSummary() {
  const { permissions, getRestrictedFeatures } = useRoleBasedAccess();
  
  if (!permissions) return null;
  
  const restrictedFeatures = getRestrictedFeatures();
  
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="font-medium text-sm mb-2">Access Summary</h3>
      <div className="text-xs text-gray-600 space-y-1">
        <div>Plan: <span className="font-medium">{permissions.planName}</span></div>
        <div>Role: <span className="font-medium">{permissions.role}</span></div>
        {restrictedFeatures.length > 0 && (
          <div>
            Restricted: <span className="font-medium">{restrictedFeatures.join(', ')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
