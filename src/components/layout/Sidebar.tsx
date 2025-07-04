/**
 * Enhanced Sidebar Component
 * 
 * Comprehensive navigation with all available features
 */

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  Building2, 
  Fuel, 
  FileText, 
  Users, 
  CreditCard, 
  DollarSign, 
  BarChart3, 
  Settings, 
  Bell,
  Download,
  AlertTriangle,
  TrendingUp,
  Calculator,
  UserCheck,
  Clock,
  Shield,
  Database,
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, Link } from "react-router-dom";
import { useState } from "react";

interface SidebarProps {
  className?: string;
}

interface NavItem {
  title: string;
  href: string;
  icon: any;
  badge?: string | number;
  children?: NavItem[];
  roles?: string[];
}

export function Sidebar({ className }: SidebarProps) {
  try {
    const { user } = useAuth();
    const location = useLocation();
    const [expandedSections, setExpandedSections] = useState<string[]>(['dashboard']);

    const toggleSection = (title: string) => {
      setExpandedSections(prev => 
        prev.includes(title) 
          ? prev.filter(s => s !== title)
          : [...prev, title]
      );
    };

    const isOwnerOrManager = user?.role === 'owner' || user?.role === 'manager';
    const isOwner = user?.role === 'owner';
    const isSuperAdmin = user?.role === 'superadmin';
    const isAttendant = user?.role === 'attendant';

    const navItems: NavItem[] = [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Operations",
        href: "#",
        icon: Building2,
        children: [
          {
            title: "Stations",
            href: "/dashboard/stations",
            icon: Building2,
            roles: ['owner', 'manager']
          },
          {
            title: "Pumps",
            href: "/dashboard/pumps",
            icon: Fuel,
            roles: ['owner', 'manager']
          },
          {
            title: "Nozzles",
            href: "/dashboard/nozzles",
            icon: Settings,
            roles: ['owner', 'manager']
          },
          {
            title: "Readings",
            href: "/dashboard/readings",
            icon: FileText,
            badge: "New"
          }
        ]
      },
      {
        title: "Sales & Finance",
        href: "#",
        icon: DollarSign,
        children: [
          {
            title: "Sales Overview",
            href: "/dashboard/sales",
            icon: TrendingUp
          },
          {
            title: "Fuel Prices",
            href: "/dashboard/fuel-prices",
            icon: Calculator,
            roles: ['owner', 'manager']
          },
          {
            title: "Credit Management",
            href: "/dashboard/creditors",
            icon: CreditCard,
            roles: ['owner', 'manager']
          },
          {
            title: "Financial Reports",
            href: "/dashboard/reports/financial",
            icon: BarChart3,
            roles: ['owner', 'manager']
          }
        ]
      },
      {
        title: "People",
        href: "#",
        icon: Users,
        roles: ['owner', 'manager'],
        children: [
          {
            title: "User Management",
            href: "/dashboard/users",
            icon: Users,
            roles: ['owner']
          },
          {
            title: "Attendance",
            href: "/dashboard/attendance",
            icon: UserCheck,
            roles: ['owner', 'manager']
          },
          {
            title: "Shifts & Schedules",
            href: "/dashboard/shifts",
            icon: Clock,
            roles: ['owner', 'manager']
          }
        ]
      },
      {
        title: "Reports & Analytics",
        href: "#",
        icon: BarChart3,
        roles: ['owner', 'manager'],
        children: [
          {
            title: "Sales Reports",
            href: "/dashboard/reports/sales",
            icon: TrendingUp
          },
          {
            title: "Inventory Reports",
            href: "/dashboard/reports/inventory",
            icon: Database
          },
          {
            title: "Export Data",
            href: "/dashboard/reports/export",
            icon: Download
          }
        ]
      },
      {
        title: "Attendant Tools",
        href: "#",
        icon: UserCheck,
        roles: ['attendant'],
        children: [
          {
            title: "My Stations",
            href: "/dashboard/attendant/stations",
            icon: Building2
          },
          {
            title: "Record Reading",
            href: "/dashboard/readings/new",
            icon: FileText
          },
          {
            title: "Cash Reports",
            href: "/dashboard/attendant/cash-reports",
            icon: DollarSign
          }
        ]
      }
    ];

    // Add SuperAdmin section
    if (isSuperAdmin) {
      navItems.push({
        title: "Super Admin",
        href: "#",
        icon: Shield,
        children: [
          {
            title: "Tenant Management",
            href: "/superadmin/tenants",
            icon: Building2
          },
          {
            title: "Plans & Billing",
            href: "/superadmin/plans",
            icon: CreditCard
          },
          {
            title: "System Analytics",
            href: "/superadmin/analytics",
            icon: BarChart3
          },
          {
            title: "System Health",
            href: "/superadmin/health",
            icon: AlertTriangle
          }
        ]
      });
    }

    // Add universal items
    navItems.push(
      {
        title: "Alerts",
        href: "/dashboard/alerts",
        icon: Bell,
        badge: 3 // This should come from API
      },
      {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings
      }
    );

    const isActiveLink = (href: string) => {
      if (href === '/dashboard') {
        return location.pathname === '/dashboard';
      }
      return location.pathname.startsWith(href);
    };

    const hasAccess = (item: NavItem) => {
      if (!item.roles) return true;
      return item.roles.includes(user?.role || '');
    };

    const renderNavItem = (item: NavItem, level: number = 0) => {
      if (!hasAccess(item)) return null;

      const isExpanded = expandedSections.includes(item.title);
      const hasChildren = item.children && item.children.length > 0;
      const isActive = isActiveLink(item.href);

      if (hasChildren) {
        return (
          <div key={item.title}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2 mb-1",
                level > 0 && "ml-4",
                isActive && "bg-accent"
              )}
              onClick={() => toggleSection(item.title)}
            >
              <item.icon className="h-4 w-4" />
              <span className="flex-1 text-left">{item.title}</span>
              {item.badge && (
                <Badge variant="secondary" className="ml-auto">
                  {item.badge}
                </Badge>
              )}
              <ChevronRight 
                className={cn(
                  "h-4 w-4 transition-transform",
                  isExpanded && "rotate-90"
                )}
              />
            </Button>
            {isExpanded && (
              <div className="mb-2">
                {item.children?.map(child => renderNavItem(child, level + 1))}
              </div>
            )}
          </div>
        );
      }

      return (
        <Button
          key={item.title}
          variant="ghost"
          className={cn(
            "w-full justify-start gap-2 mb-1",
            level > 0 && "ml-4",
            isActive && "bg-accent"
          )}
          asChild
        >
          <Link to={item.href}>
            <item.icon className="h-4 w-4" />
            {item.title}
            {item.badge && (
              <Badge variant="secondary" className="ml-auto">
                {item.badge}
              </Badge>
            )}
          </Link>
        </Button>
      );
    };

    return (
      <div className={cn("pb-12 hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col", className)}>
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 shadow-lg border-r">
          <div className="flex h-16 shrink-0 items-center">
            <h2 className="text-lg font-semibold tracking-tight">
              FuelSync Hub
            </h2>
          </div>
          <div className="text-sm text-muted-foreground">
            {user?.role === 'superadmin' ? 'Super Administrator' : user?.tenantName}
          </div>
          <ScrollArea className="flex-1">
            <div className="space-y-1">
              {navItems.map(item => renderNavItem(item))}
            </div>
          </ScrollArea>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Sidebar error:', error);
    return (
      <div className={cn("pb-12 hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col", className)}>
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 shadow-lg border-r">
          <div className="flex h-16 shrink-0 items-center">
            <h2 className="text-lg font-semibold tracking-tight">
              FuelSync Hub
            </h2>
          </div>
          <div className="text-sm text-red-500">
            Navigation unavailable
          </div>
        </div>
      </div>
    );
  }
}
