/**
 * @file EmptyState.tsx
 * @description Component to show when there's no data available
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Database, TrendingUp, FileText, Users } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: 'database' | 'chart' | 'file' | 'users' | 'default';
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  showRefresh?: boolean;
  onRefresh?: () => void;
  className?: string;
}

const iconMap = {
  database: Database,
  chart: TrendingUp,
  file: FileText,
  users: Users,
  default: Database
};

export function EmptyState({
  title = 'No Data Available',
  description = 'There is no data to display at the moment.',
  icon = 'default',
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  showRefresh = true,
  onRefresh,
  className = ''
}: EmptyStateProps) {
  const IconComponent = iconMap[icon];

  return (
    <Card className={`border-dashed ${className}`}>
      <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className="mb-4 p-3 rounded-full bg-gray-100 dark:bg-gray-800">
          <IconComponent className="h-8 w-8 text-gray-400" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {title}
        </h3>
        
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
          {description}
        </p>
        
        <div className="flex items-center space-x-3">
          {showRefresh && onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
          )}
          
          {actionLabel && onAction && (
            <Button
              size="sm"
              onClick={onAction}
              className="flex items-center space-x-2"
            >
              <span>{actionLabel}</span>
            </Button>
          )}

          {secondaryActionLabel && onSecondaryAction && (
            <Button
              size="sm"
              variant="outline"
              onClick={onSecondaryAction}
              className="flex items-center space-x-2"
            >
              <span>{secondaryActionLabel}</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Specialized empty state components for common scenarios
export function SalesEmptyState({ onRefresh }: { onRefresh?: () => void }) {
  return (
    <EmptyState
      title="No Sales Data"
      description="No sales transactions found for the selected period. This could mean no sales have been recorded yet or the data is still being processed."
      icon="chart"
      actionLabel="Record New Sale"
      onAction={() => {/* Navigate to sales entry */}}
      onRefresh={onRefresh}
    />
  );
}

export function ReadingsEmptyState({ onRefresh }: { onRefresh?: () => void }) {
  return (
    <EmptyState
      title="No Readings Available"
      description="No nozzle readings have been recorded yet. Start by entering your daily fuel readings to track sales and inventory."
      icon="database"
      actionLabel="Add Reading"
      onAction={() => {/* Navigate to readings entry */}}
      onRefresh={onRefresh}
    />
  );
}

export function ReportsEmptyState({ onRefresh }: { onRefresh?: () => void }) {
  return (
    <EmptyState
      title="No Report Data"
      description="No data available for the selected report criteria. Try adjusting your filters or date range."
      icon="file"
      onRefresh={onRefresh}
    />
  );
}

export default EmptyState;
