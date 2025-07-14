
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href: string;
}

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
  /** Breadcrumb navigation items */
  breadcrumbs?: BreadcrumbItem[];
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
  sticky = false,
  breadcrumbs
}: PageHeaderProps) {
  return (
    <div className={cn(
      "flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      sticky && "sticky top-14 md:top-16 z-30 pt-6 -mt-6",
      className
    )}>
      <div className="space-y-2 min-w-0 flex-1">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-2">
            {breadcrumbs.map((item, index) => (
              <div key={index} className="flex items-center">
                {index > 0 && <span className="mx-1">/</span>}
                <Link 
                  to={item.href} 
                  className={`hover:text-foreground ${index === breadcrumbs.length - 1 ? 'font-medium text-foreground' : ''}`}
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </nav>
        )}
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
