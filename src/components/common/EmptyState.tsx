
import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  /** Icon component to display */
  icon?: ReactNode;
  /** Main heading text */
  title: string;
  /** Descriptive text explaining the empty state */
  description?: string;
  /** Primary action button */
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary';
  };
  /** Secondary action button */
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  /** Additional CSS classes */
  className?: string;
}

/**
 * Reusable empty state component for displaying when no data is available
 * 
 * Features:
 * - Accessible structure with proper heading hierarchy
 * - Optional icon, actions, and descriptions
 * - Consistent styling across the application
 * - Screen reader friendly
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className
}: EmptyStateProps) {
  return (
    <Card className={cn("border-dashed", className)}>
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        {icon && (
          <div className="mb-4 p-3 rounded-full bg-muted/50" aria-hidden="true">
            {icon}
          </div>
        )}
        
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {title}
        </h3>
        
        {description && (
          <p className="text-sm text-muted-foreground mb-6 max-w-sm">
            {description}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3">
          {action && (
            <Button
              onClick={action.onClick}
              variant={action.variant || 'default'}
              className="min-w-[120px]"
            >
              {action.label}
            </Button>
          )}
          
          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant="outline"
              className="min-w-[120px]"
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
