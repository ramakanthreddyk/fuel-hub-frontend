/**
 * @file ModernSidebar.tsx
 * @description Modern, collapsible sidebar with role-based navigation
 */
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  Fuel,
  Users,
  FileText,
  Settings,
  CreditCard,
  TrendingUp,
  MapPin,
  AlertTriangle,
  Clock,
  PlusCircle,
  Gauge,
  DollarSign,
  ChevronRight,
  Home,
  Calculator,
  BookOpen,
  // Enhanced professional icons
  LayoutDashboard,
  Target,
  Database,
  Building2,
  LineChart,
  Receipt,
  UserCheck,
  Cog,
  Plus,
  ClipboardList,
  BarChart2,
  Layers,
  Activity,
  Zap,
  Shield,
  Archive,
  Briefcase,
  BadgeIndianRupee
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModernSidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  onNavigate?: () => void; // Callback for when navigation occurs (to close mobile sidebar)
  className?: string;
}

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: string | number;
  children?: NavItem[];
  roles?: string[];
}

export function ModernSidebar({ collapsed = false, onCollapse, onNavigate, className }: ModernSidebarProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getNavigationItems = (): NavItem[] => {
    const baseItems: NavItem[] = [
      {
        icon: LayoutDashboard,
        label: 'Dashboard',
        href: '/dashboard',
      }
    ];

    if (user?.role === 'attendant') {
      return [
        ...baseItems,
        {
          icon: Target,
          label: 'Record Reading',
          href: '/attendant/readings/new',
        },
        {
          icon: ClipboardList,
          label: 'My Readings',
          href: '/attendant/readings',
        },
        {
          icon: Receipt,
          label: 'Cash Reports',
          href: '/attendant/cash-reports',
        },
        {
          icon: Database,
          label: 'Inventory Check',
          href: '/attendant/inventory',
        },
        {
          icon: Shield,
          label: 'Alerts',
          href: '/attendant/alerts',
          badge: 2
        }
      ];
    }

    // Owner/Manager/Superadmin navigation
    return [
      ...baseItems,
      {
        icon: Target,
        label: 'Readings',
        href: '/dashboard/readings',
        children: [
          { icon: Plus, label: 'New Reading', href: '/dashboard/readings/new' },
          { icon: ClipboardList, label: 'All Readings', href: '/dashboard/readings' }
        ]
      },
      {
        icon: Activity,
        label: 'Reconciliation',
        href: '/dashboard/reconciliation'
      },
      {
        icon: LineChart,
        label: 'Analytics',
        href: '/dashboard/analytics'
      },
      {
        icon: Building2,
        label: 'Stations',
        href: '/dashboard/stations',
        children: [
          { icon: Building2, label: 'All Stations', href: '/dashboard/stations' },
          { icon: Zap, label: 'Pumps & Nozzles', href: '/dashboard/pumps' },
          { icon: BadgeIndianRupee, label: 'Fuel Prices', href: '/dashboard/fuel-prices' },
          { icon: Database, label: 'Inventory', href: '/dashboard/inventory' }
        ]
      },
      {
        icon: BarChart2,
        label: 'Reports',
        href: '/dashboard/reports'
        // Note: Report access is enforced by backend based on plan (Pro/Enterprise only)
      },
      {
        icon: Briefcase,
        label: 'Creditors',
        href: '/dashboard/creditors',
      },
      {
        icon: UserCheck,
        label: 'Team',
        href: '/dashboard/users',
        roles: ['owner', 'manager']
      },
      {
        icon: Cog,
        label: 'Settings',
        href: '/dashboard/settings',
      }
    ];
  };

  const navigationItems = getNavigationItems().filter(item => 
    !item.roles || item.roles.includes(user?.role || '')
  );

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  const NavItemComponent = ({ item, level = 0 }: { item: NavItem; level?: number }) => {
    const active = isActive(item.href);
    const hasChildren = item.children && item.children.length > 0;
    const [expanded, setExpanded] = React.useState(active);

    const handleClick = () => {
      if (hasChildren && !collapsed && level === 0) {
        // Only expand/collapse for top-level items with children
        setExpanded(!expanded);
      } else {
        // Navigate for all other items (child items or items without children)
        navigate(item.href);
        // Close mobile sidebar after navigation
        onNavigate?.();
      }
    };

    return (
      <div>
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start h-10 px-2 sm:px-3 mb-1 transition-all duration-200',
            level > 0 && 'ml-2 sm:ml-4 w-[calc(100%-0.5rem)] sm:w-[calc(100%-1rem)]',
            active && 'bg-blue-50 text-blue-700 border-r-2 border-blue-600',
            !active && 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
            collapsed && 'justify-center px-1 sm:px-2'
          )}
          onClick={handleClick}
        >
          <item.icon className={cn(
            'h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0',
            collapsed ? '' : 'mr-2 sm:mr-3'
          )} />

          {!collapsed && (
            <>
              <span className="flex-1 text-left text-xs sm:text-sm font-medium truncate">
                {item.label}
              </span>

              {item.badge && (
                <Badge
                  variant={active ? 'default' : 'secondary'}
                  className="ml-1 sm:ml-2 h-4 sm:h-5 px-1 sm:px-2 text-xs"
                >
                  {item.badge}
                </Badge>
              )}

              {hasChildren && (
                <ChevronRight className={cn(
                  'h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2 transition-transform duration-200 flex-shrink-0',
                  expanded && 'rotate-90'
                )} />
              )}
            </>
          )}
        </Button>

        {/* Children */}
        {hasChildren && expanded && !collapsed && (
          <div className="ml-1 sm:ml-2 space-y-1 mt-1">
            {item.children?.map((child, index) => (
              <NavItemComponent key={`${item.label}-child-${index}`} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className={cn(
      'flex flex-col bg-white border-r border-gray-200 transition-all duration-300',
      collapsed ? 'w-12 sm:w-16' : 'w-56 sm:w-64',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200">
        {!collapsed && <Logo size="sm" />}
        {collapsed && <Logo size="sm" variant="icon" />}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-1 sm:space-y-2">
        {navigationItems.map((item, index) => (
          <NavItemComponent key={`nav-${item.label}-${index}`} item={item} />
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 sm:p-4 border-t border-gray-200">
        {!collapsed && (
          <div className="text-xs text-gray-500 text-center">
            <p className="font-medium">FuelSync v2.0</p>
            <p className="mt-1 text-xs">© 2024 FuelSync</p>
          </div>
        )}
        
        {/* Collapse Toggle */}
        {onCollapse && (
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'w-full mt-2',
              collapsed && 'justify-center'
            )}
            onClick={() => onCollapse(!collapsed)}
          >
            <ChevronRight className={cn(
              'h-4 w-4 transition-transform duration-200',
              collapsed ? 'rotate-180' : '',
              !collapsed && 'mr-2'
            )} />
            {!collapsed && <span className="text-xs">Collapse</span>}
          </Button>
        )}
      </div>
    </aside>
  );
}
