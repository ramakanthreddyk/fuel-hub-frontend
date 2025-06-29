
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  /** Main page title */
  title: string;
  /** Optional subtitle/description */
  description?: string;
  /** Action buttons or controls */
  actions?: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Consistent page header component for all dashboard pages
 * 
 * Features:
 * - Proper heading hierarchy (h1)
 * - Responsive layout for title and actions
 * - Consistent spacing and typography
 * - Screen reader friendly structure
 */
export function PageHeader({ 
  title, 
  description, 
  actions, 
  className 
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6", className)}>
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        {description && (
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            {description}
          </p>
        )}
      </div>
      
      {actions && (
        <div className="flex flex-wrap items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
