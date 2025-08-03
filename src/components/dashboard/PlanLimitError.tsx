import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Crown, AlertTriangle } from 'lucide-react';

interface PlanLimitErrorProps {
  type: 'stations' | 'users' | 'features';
  currentPlan: string;
  message?: string;
  onUpgrade?: () => void;
}

export function PlanLimitError({ type, currentPlan, message, onUpgrade }: PlanLimitErrorProps) {
  const getErrorMessage = () => {
    if (message) return message;
    
    switch (type) {
      case 'stations':
        return `Your ${currentPlan} plan has reached its station limit. Upgrade to add more stations.`;
      case 'users':
        return `Your ${currentPlan} plan has reached its user limit. Upgrade to add more users.`;
      case 'features':
        return `This feature is not available in your ${currentPlan} plan. Upgrade to unlock advanced features.`;
      default:
        return `Plan limit reached for your ${currentPlan} plan.`;
    }
  };

  const getUpgradeText = () => {
    if (currentPlan === 'Regular') return 'Upgrade to Premium';
    if (currentPlan === 'Premium') return 'Upgrade to Pro';
    return 'Contact Support';
  };

  return (
    <Alert className="border-orange-200 bg-orange-50">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-orange-800 font-medium mb-1">Plan Limit Reached</p>
          <p className="text-orange-700 text-sm">{getErrorMessage()}</p>
        </div>
        {onUpgrade && (
          <Button 
            onClick={onUpgrade}
            size="sm"
            className="ml-4 bg-orange-600 hover:bg-orange-700"
          >
            <Crown className="h-3 w-3 mr-1" />
            {getUpgradeText()}
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}