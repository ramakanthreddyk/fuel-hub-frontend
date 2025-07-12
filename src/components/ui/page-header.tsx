
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  /** Main page title */
  title: string;
  /** Optional subtitle/description */
  description?: string | ReactNode;
  /** Action buttons or controls */
  actions?: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Whether the header should be sticky */
  sticky?: boolean;
}

/**
 * Consistent page header component for all dashboard pages
 * 
 * Features:
 * - Proper heading hierarchy (h1)
 * - Responsive layout for title and actions
 * - Consistent spacing and typography
 * - Screen reader friendly structure
 * - Optional sticky positioning
 */
export function PageHeader({ 
  title, 
  description, 
  actions, 
  className,
  sticky = false
}: PageHeaderProps) {
  return (
    <div className={cn(
      "flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      sticky && "sticky top-14 md:top-16 z-30 pt-6 -mt-6",
      className
    )}>
      <div className="space-y-2 min-w-0 flex-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-tight">
          {title}
        </h1>
        {description && (
          <div className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            {typeof description === 'string' ? (
              <p>{description}</p>
            ) : (
              description
            )}
          </div>
        )}
      </div>
      
      {actions && (
        <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
