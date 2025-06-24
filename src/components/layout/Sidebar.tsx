
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  Fuel,
  Gauge,
  DollarSign,
  Users,
  Settings,
  FileText,
  Building2,
  BarChart3,
  Package,
  Calculator,
  TrendingUp,
  CreditCard,
  Truck,
  Database,
  UserPlus,
  Plus,
  Home,
  PieChart
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar
} from '@/components/ui/sidebar';

const getMenuItems = (role: string) => {
  switch (role) {
    case 'superadmin':
      return [
        {
          title: "Platform Overview",
          url: "/superadmin/overview",
          icon: PieChart,
          color: "text-purple-600",
          bgColor: "bg-purple-50"
        },
        {
          title: "Tenant Organizations",
          url: "/superadmin/tenants",
          icon: Building2,
          color: "text-blue-600",
          bgColor: "bg-blue-50"
        },
        {
          title: "User Management",
          url: "/superadmin/users",
          icon: Users,
          color: "text-green-600",
          bgColor: "bg-green-50"
        },
        {
          title: "Subscription Plans",
          url: "/superadmin/plans",
          icon: Package,
          color: "text-orange-600",
          bgColor: "bg-orange-50"
        },
        {
          title: "Platform Analytics",
          url: "/superadmin/analytics",
          icon: BarChart3,
          color: "text-indigo-600",
          bgColor: "bg-indigo-50"
        }
      ];
    
    case 'owner':
      return [
        {
          title: "Dashboard Summary",
          url: "/dashboard/summary",
          icon: Home,
          color: "text-purple-600",
          bgColor: "bg-purple-50"
        },
        {
          title: "Fuel Stations",
          url: "/dashboard/stations",
          icon: Building2,
          color: "text-blue-600",
          bgColor: "bg-blue-50"
        },
        {
          title: "Meter Readings",
          url: "/dashboard/readings", 
          icon: Gauge,
          color: "text-green-600",
          bgColor: "bg-green-50"
        },
        {
          title: "Daily Reconciliation",
          url: "/dashboard/reconciliation",
          icon: Calculator,
          color: "text-indigo-600",
          bgColor: "bg-indigo-50"
        },
        {
          title: "Sales & Revenue",
          url: "/dashboard/sales",
          icon: TrendingUp,
          color: "text-emerald-600",
          bgColor: "bg-emerald-50"
        },
        {
          title: "Credit Management",
          url: "/dashboard/creditors",
          icon: CreditCard,
          color: "text-red-600",
          bgColor: "bg-red-50"
        },
        {
          title: "Fuel Pricing",
          url: "/dashboard/fuel-prices",
          icon: Fuel,
          color: "text-amber-600",
          bgColor: "bg-amber-50"
        },
        {
          title: "Fuel Deliveries",
          url: "/dashboard/fuel-deliveries",
          icon: Truck,
          color: "text-cyan-600",
          bgColor: "bg-cyan-50"
        },
        {
          title: "Inventory Tracking",
          url: "/dashboard/inventory",
          icon: Database,
          color: "text-teal-600",
          bgColor: "bg-teal-50"
        },
        {
          title: "User Management",
          url: "/dashboard/users",
          icon: UserPlus,
          color: "text-pink-600",
          bgColor: "bg-pink-50"
        },
        {
          title: "Reports & Analytics",
          url: "/dashboard/reports",
          icon: FileText,
          color: "text-violet-600",
          bgColor: "bg-violet-50"
        },
        {
          title: "System Settings",
          url: "/dashboard/settings",
          icon: Settings,
          color: "text-gray-600",
          bgColor: "bg-gray-50"
        }
      ];
    
    case 'manager':
      return [
        {
          title: "Dashboard Summary",
          url: "/dashboard/summary",
          icon: Home,
          color: "text-purple-600",
          bgColor: "bg-purple-50"
        },
        {
          title: "Fuel Stations",
          url: "/dashboard/stations",
          icon: Building2,
          color: "text-blue-600",
          bgColor: "bg-blue-50"
        },
        {
          title: "Meter Readings",
          url: "/dashboard/readings", 
          icon: Gauge,
          color: "text-green-600",
          bgColor: "bg-green-50"
        },
        {
          title: "Daily Reconciliation",
          url: "/dashboard/reconciliation",
          icon: Calculator,
          color: "text-indigo-600",
          bgColor: "bg-indigo-50"
        },
        {
          title: "Sales & Revenue",
          url: "/dashboard/sales",
          icon: TrendingUp,
          color: "text-emerald-600",
          bgColor: "bg-emerald-50"
        },
        {
          title: "Credit Management",
          url: "/dashboard/creditors",
          icon: CreditCard,
          color: "text-red-600",
          bgColor: "bg-red-50"
        },
        {
          title: "Fuel Pricing",
          url: "/dashboard/fuel-prices",
          icon: Fuel,
          color: "text-amber-600",
          bgColor: "bg-amber-50"
        },
        {
          title: "Fuel Deliveries",
          url: "/dashboard/fuel-deliveries",
          icon: Truck,
          color: "text-cyan-600",
          bgColor: "bg-cyan-50"
        },
        {
          title: "Inventory Tracking",
          url: "/dashboard/inventory",
          icon: Database,
          color: "text-teal-600",
          bgColor: "bg-teal-50"
        },
        {
          title: "Staff Management",
          url: "/dashboard/users",
          icon: UserPlus,
          color: "text-pink-600",
          bgColor: "bg-pink-50"
        },
        {
          title: "Reports & Analytics",
          url: "/dashboard/reports",
          icon: FileText,
          color: "text-violet-600",
          bgColor: "bg-violet-50"
        },
        {
          title: "Settings",
          url: "/dashboard/settings",
          icon: Settings,
          color: "text-gray-600",
          bgColor: "bg-gray-50"
        }
      ];
    
    case 'attendant':
      return [
        {
          title: "New Reading Entry",
          url: "/dashboard/readings/new",
          icon: Plus,
          color: "text-green-600",
          bgColor: "bg-green-50"
        },
        {
          title: "Reading History",
          url: "/dashboard/readings",
          icon: Gauge,
          color: "text-blue-600",
          bgColor: "bg-blue-50"
        },
        {
          title: "Credit Sales", 
          url: "/dashboard/creditors",
          icon: CreditCard,
          color: "text-purple-600",
          bgColor: "bg-purple-50"
        }
      ];
    
    default:
      return [];
  }
};

export function AppSidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const { setOpenMobile, isMobile } = useSidebar();
  
  const menuItems = getMenuItems(user?.role || '');

  // Close mobile sidebar when a menu item is clicked
  const handleMenuItemClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar className="border-r-0 shadow-xl">
      <SidebarHeader className="p-6 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl shadow-lg">
            <Fuel className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              FuelSync Hub
            </span>
            <div className="text-xs text-muted-foreground font-medium">
              Fuel Station ERP
            </div>
          </div>
        </div>
        
        {/* Tenant info moved to smaller section */}
        {user?.tenantName && user.role !== 'superadmin' && (
          <div className="p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-white/20 shadow-sm">
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
              Organization
            </div>
            <div className="font-semibold text-sm text-gray-800 truncate">
              {user.tenantName}
            </div>
          </div>
        )}
      </SidebarHeader>
      
      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
            {user?.role === 'superadmin' ? 'Platform Management' : 'Navigation'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={`${item.title}-${item.url}`}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.url}
                      onClick={handleMenuItemClick}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group hover:shadow-md",
                        location.pathname === item.url 
                          ? `${item.bgColor} ${item.color} font-semibold shadow-sm border border-current/20` 
                          : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                      )}
                    >
                      <div className={cn(
                        "p-2 rounded-lg transition-all duration-200",
                        location.pathname === item.url 
                          ? `${item.color} bg-white/80 shadow-sm` 
                          : `${item.color} ${item.bgColor} group-hover:shadow-sm`
                      )}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      <span className="font-medium text-sm truncate flex-1">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 bg-gradient-to-br from-slate-50 to-blue-50 border-t border-gray-100">
        <div className="text-center space-y-2">
          <div className="text-xs text-muted-foreground font-medium">
            Powered by FuelSync Hub
          </div>
          <div className="text-xs text-muted-foreground">
            © 2024 All rights reserved
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
