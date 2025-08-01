/**
 * @file SetupCompleteBanner.tsx
 * @description Success banner shown when setup is complete
 */

import React from 'react';
import { CheckCircle, X } from 'lucide-react';
import { useOnboardingStatus } from '@/hooks/useOnboarding';

interface SetupCompleteBannerProps {
  onDismiss?: () => void;
  className?: string;
}

export function SetupCompleteBanner({ onDismiss, className = '' }: SetupCompleteBannerProps) {
  const { data: status, isLoading } = useOnboardingStatus();
  const [dismissed, setDismissed] = React.useState(false);

  // Don't show if loading, not complete, or dismissed
  if (isLoading || !status?.completed || dismissed) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <div className={`bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-green-900">
              🎉 Setup Complete!
            </h3>
            <p className="text-sm text-green-700">
              Your fuel station management system is ready. You can now manage operations, track sales, and monitor performance.
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-green-400 hover:text-green-600 transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

export default SetupCompleteBanner;
