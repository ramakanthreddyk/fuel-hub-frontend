
import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  /** Breadcrumb label */
  label: string;
  /** Link URL (optional for current page) */
  href?: string;
  /** Icon component */
  icon?: ReactNode;
}

export interface BreadcrumbNavProps {
  /** Breadcrumb items */
  items: BreadcrumbItem[];
  /** Custom separator */
  separator?: ReactNode;
  /** Show home icon */
  showHomeIcon?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Accessible breadcrumb navigation component
 * 
 * Features:
 * - Semantic HTML with proper ARIA attributes
 * - Keyboard navigation support
 * - Customizable separators and icons
 * - Responsive design
 * - Active state management
 */
export function BreadcrumbNav({
  items,
  separator = <ChevronRight className="h-4 w-4" />,
  showHomeIcon = true,
  className
}: BreadcrumbNavProps) {
  const location = useLocation();
  
  if (!items.length) return null;

  return (
    <nav 
      aria-label="Breadcrumb navigation"
      className={cn('flex items-center space-x-1 text-sm', className)}
    >
      <ol className="flex items-center space-x-1 list-none">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isActive = item.href === location.pathname;
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span 
                  className="mx-2 text-muted-foreground" 
                  aria-hidden="true"
                >
                  {separator}
                </span>
              )}
              
              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center gap-1.5 hover:text-foreground transition-colors',
                    isActive ? 'text-foreground font-medium' : 'text-muted-foreground'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {showHomeIcon && index === 0 && !item.icon && (
                    <Home className="h-4 w-4" />
                  )}
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span 
                  className={cn(
                    'flex items-center gap-1.5',
                    isLast ? 'text-foreground font-medium' : 'text-muted-foreground'
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {showHomeIcon && index === 0 && !item.icon && (
                    <Home className="h-4 w-4" />
                  )}
                  {item.icon}
                  <span>{item.label}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
