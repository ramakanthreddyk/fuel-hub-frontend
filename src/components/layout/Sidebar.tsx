
/**
 * @file components/layout/Sidebar.tsx
 * @description Enhanced responsive sidebar with white background and readable text
 */
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Building2,
  Fuel,
  Droplets,
  BadgeIndianRupee,
  Users,
  Settings,
  ChevronDown,
  Menu,
  FileText,
  BarChart3,
  Calendar,
  ClipboardList,
  Factory,
  Wrench,
  Database
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
    icon: Factory,
    roles: ['owner', 'manager'],
  },
  {
    name: 'Pumps & Nozzles',
    href: '/dashboard/pumps',
    icon: Wrench,
    roles: ['owner', 'manager'],
    children: [
      { name: 'All Pumps', href: '/dashboard/pumps', icon: Fuel },
      { name: 'All Nozzles', href: '/dashboard/nozzles', icon: Droplets },
    ],
  },
  {
    name: 'Operations',
    href: '/dashboard/readings',
    icon: Database,
    children: [
      { name: 'Readings', href: '/dashboard/readings', icon: Database },
      { name: 'Fuel Prices', href: '/dashboard/fuel-prices', icon: BadgeIndianRupee, roles: ['owner', 'manager'] },
      { name: 'Inventory', href: '/dashboard/fuel-inventory', icon: ClipboardList, roles: ['owner', 'manager'] },
    ],
  },
  {
    name: 'Sales',
    href: '/dashboard/sales',
    icon: BadgeIndianRupee,
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
                'w-full flex items-center justify-between px-3 py-3 text-sm rounded-xl transition-all duration-200',
                'hover:bg-gray-100 dark:hover:bg-gray-100 hover:text-gray-900 dark:hover:text-gray-900',
                'group focus:outline-none focus:ring-2 focus:ring-blue-500/20',
                level > 0 && 'ml-4',
                active && 'bg-blue-50 text-blue-800 shadow-sm border border-blue-200'
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg transition-colors",
                  active ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25" : "bg-gray-200 text-gray-600 group-hover:bg-blue-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-500/25"
                )}>
                  <item.icon className="h-4 w-4" />
                </div>
                <span className={cn(
                  "font-medium transition-colors",
                  active ? "text-blue-800" : "text-gray-700 group-hover:text-gray-900"
                )}>{item.name}</span>
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-all duration-200',
                  isExpanded && 'rotate-180',
                  active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                )}
              />
            </button>
          ) : (
            <Link
              to={item.href}
              onClick={onItemClick}
              className={cn(
                'flex items-center gap-3 px-3 py-3 text-sm rounded-xl transition-all duration-200',
                'hover:bg-gray-100 dark:hover:bg-gray-100 hover:text-gray-900 dark:hover:text-gray-900',
                'group focus:outline-none focus:ring-2 focus:ring-blue-500/20',
                level > 0 && 'ml-4',
                active 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl shadow-blue-500/30' 
                  : 'text-gray-700 hover:text-gray-900'
              )}
            >
              <div className={cn(
                "p-2 rounded-lg transition-colors",
                active ? "bg-white/20 shadow-inner" : "bg-gray-200 text-gray-600 group-hover:bg-blue-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-500/25"
              )}>
                <item.icon className="h-4 w-4" />
              </div>
              <span className="font-medium">{item.name}</span>
            </Link>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-2 space-y-1">
            {item.children?.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-200">
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
          <Fuel className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">FuelSync</h1>
          <p className="text-xs text-gray-500 font-medium">Hub Management</p>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4 py-4">
        <nav className="space-y-2">
          {navigation.map(item => renderNavItem(item))}
        </nav>
      </ScrollArea>

      {/* User Info */}
      <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white shadow-sm">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize font-medium">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export interface SidebarProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Sidebar({ open: openProp, onOpenChange }: SidebarProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const controlled = typeof openProp === 'boolean' && onOpenChange;
  const open = controlled ? openProp : internalOpen;
  const setOpen = controlled ? onOpenChange! : setInternalOpen;
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200 shadow-lg">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 bg-white shadow-lg hover:shadow-xl rounded-xl">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 bg-white">
            <SidebarContent onItemClick={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
