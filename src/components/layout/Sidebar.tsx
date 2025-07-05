
/**
 * @file components/layout/Sidebar.tsx
 * @description Enhanced responsive sidebar with improved mobile experience
 */
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Building2,
  Fuel,
  Gauge,
  FileText,
  BarChart3,
  Users,
  Settings,
  ChevronDown,
  Menu,
  X,
  DollarSign,
  Calendar,
  ClipboardList
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];
  children?: NavItem[];
}

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Stations',
    href: '/dashboard/stations',
    icon: Building2,
    roles: ['owner', 'manager'],
  },
  {
    name: 'Pumps & Nozzles',
    href: '/dashboard/pumps',
    icon: Fuel,
    roles: ['owner', 'manager'],
    children: [
      { name: 'All Pumps', href: '/dashboard/pumps', icon: Fuel },
      { name: 'All Nozzles', href: '/dashboard/nozzles', icon: Gauge },
    ],
  },
  {
    name: 'Operations',
    href: '/dashboard/readings',
    icon: Gauge,
    children: [
      { name: 'Readings', href: '/dashboard/readings', icon: Gauge },
      { name: 'Fuel Prices', href: '/dashboard/fuel-prices', icon: DollarSign, roles: ['owner', 'manager'] },
      { name: 'Inventory', href: '/dashboard/fuel-inventory', icon: ClipboardList, roles: ['owner', 'manager'] },
    ],
  },
  {
    name: 'Sales',
    href: '/dashboard/sales',
    icon: DollarSign,
    children: [
      { name: 'Sales Overview', href: '/dashboard/sales/overview', icon: BarChart3 },
      { name: 'Cash Reports', href: '/dashboard/cash-reports', icon: FileText },
    ],
  },
  {
    name: 'Staff',
    href: '/dashboard/attendance',
    icon: Users,
    roles: ['owner', 'manager'],
    children: [
      { name: 'Attendance', href: '/dashboard/attendance', icon: Calendar },
      { name: 'Users', href: '/dashboard/users', icon: Users },
    ],
  },
  {
    name: 'Reports',
    href: '/dashboard/reports',
    icon: FileText,
    roles: ['owner', 'manager'],
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    roles: ['owner', 'manager'],
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

interface SidebarContentProps {
  onItemClick?: () => void;
}

function SidebarContent({ onItemClick }: SidebarContentProps) {
  const location = useLocation();
  const { user } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (name: string) => {
    setExpandedItems(prev =>
      prev.includes(name)
        ? prev.filter(item => item !== name)
        : [...prev, name]
    );
  };

  useEffect(() => {
    navigation.forEach(item => {
      if (item.children?.some(child => isActive(child.href))) {
        setExpandedItems(prev =>
          prev.includes(item.name) ? prev : [...prev, item.name]
        );
      }
    });
  }, [location.pathname]);

  const isItemVisible = (item: NavItem) => {
    if (!item.roles) return true;
    return user?.role && item.roles.includes(user.role);
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  const renderNavItem = (item: NavItem, level = 0) => {
    if (!isItemVisible(item)) return null;

    const hasChildren = item.children && item.children.length > 0;
    const childActive = item.children?.some(child => isActive(child.href));
    const active = isActive(item.href) || childActive;
    const isExpanded =
      expandedItems.includes(item.name) ||
      (hasChildren && childActive);

    return (
      <div key={item.name}>
        <div className="relative">
          {hasChildren ? (
            <button
              onClick={() => toggleExpanded(item.name)}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors',
                'hover:bg-gray-100 dark:hover:bg-gray-800',
                level > 0 && 'ml-4',
                active && 'bg-gray-100 dark:bg-gray-800'
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-4 w-4" />
                <span className="font-medium">{item.name}</span>
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  isExpanded && 'rotate-180'
                )}
              />
            </button>
          ) : (
            <Link
              to={item.href}
              onClick={onItemClick}
              className={cn(
                'flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors',
                'hover:bg-gray-100 dark:hover:bg-gray-800',
                level > 0 && 'ml-4',
                active && 'bg-primary text-primary-foreground hover:bg-primary/90'
              )}
            >
              <item.icon className="h-4 w-4" />
              <span className="font-medium">{item.name}</span>
            </Link>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children?.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-6">
        <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
          <Fuel className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-bold text-lg">FuelSync</h1>
          <p className="text-xs text-muted-foreground">Hub Management</p>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3">
        <nav className="space-y-1 pb-4">
          {navigation.map(item => renderNavItem(item))}
        </nav>
      </ScrollArea>

      {/* User Info */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <Users className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white dark:bg-gray-900 border-r">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent onItemClick={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
