/**
 * @file components/layout/Sidebar.tsx
 * @description Main sidebar navigation component with role-based items
 */
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  Fuel,
  LayoutDashboard,
  Building2,
  Gauge,
  BarChart3,
  Users,
  Settings,
  FileText,
  DollarSign,
  Package,
  FileSpreadsheet,
  CreditCard
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
  const baseItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950"
    }
  ];

  const attendantItems = [
    {
      title: "Record Reading",
      url: "/dashboard/readings/new",
      icon: FileText,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-950"
    },
    {
      title: "Cash Report",
      url: "/dashboard/cash-report/new",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950"
    },
    {
      title: "Cash History",
      url: "/dashboard/cash-reports",
      icon: CreditCard,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950"
    },
    {
      title: "Readings",
      url: "/dashboard/readings",
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950"
    }
  ];

  const managerItems = [
    {
      title: "Stations",
      url: "/dashboard/stations",
      icon: Building2,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950"
    },
    {
      title: "Pumps",
      url: "/dashboard/pumps",
      icon: Gauge,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950"
    },
    {
      title: "Nozzles",
      url: "/dashboard/nozzles",
      icon: Gauge,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-950"
    },
    {
      title: "Readings",
      url: "/dashboard/readings",
      icon: FileText,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-950"
    },
    {
      title: "Cash Reports",
      url: "/dashboard/cash-reports",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950"
    },
    {
      title: "Fuel Inventory",
      url: "/dashboard/fuel-inventory",
      icon: Package,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950"
    },
    {
      title: "Reports",
      url: "/dashboard/reports",
      icon: FileSpreadsheet,
      color: "text-teal-600",
      bgColor: "bg-teal-50 dark:bg-teal-950"
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: BarChart3,
      color: "text-pink-600",
      bgColor: "bg-pink-50 dark:bg-pink-950"
    }
  ];

  const ownerItems = [
    {
      title: "Stations",
      url: "/dashboard/stations",
      icon: Building2,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950"
    },
    {
      title: "Pumps",
      url: "/dashboard/pumps",
      icon: Gauge,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950"
    },
    {
      title: "Nozzles",
      url: "/dashboard/nozzles",
      icon: Gauge,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-950"
    },
    {
      title: "Fuel Prices",
      url: "/dashboard/fuel-prices",
      icon: DollarSign,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-950"
    },
    {
      title: "Readings",
      url: "/dashboard/readings",
      icon: FileText,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-950"
    },
    {
      title: "Cash Reports",
      url: "/dashboard/cash-reports",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950"
    },
    {
      title: "Fuel Inventory",
      url: "/dashboard/fuel-inventory",
      icon: Package,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950"
    },
    {
      title: "Reports",
      url: "/dashboard/reports",
      icon: FileSpreadsheet,
      color: "text-teal-600",
      bgColor: "bg-teal-50 dark:bg-teal-950"
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: BarChart3,
      color: "text-pink-600",
      bgColor: "bg-pink-50 dark:bg-pink-950"
    },
    {
      title: "User Management",
      url: "/dashboard/users",
      icon: Users,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50 dark:bg-cyan-950"
    }
  ];

  const roleSpecificItems = {
    owner: ownerItems,
    manager: managerItems,
    attendant: attendantItems
  };

  const settingsItem = {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
    color: "text-gray-600",
    bgColor: "bg-gray-50 dark:bg-gray-950"
  };

  return [
    ...baseItems,
    ...(roleSpecificItems[role as keyof typeof roleSpecificItems] || []),
    settingsItem
  ];
};

export function AppSidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const { setOpenMobile, isMobile } = useSidebar();

  const menuItems = getMenuItems(user?.role || 'attendant');

  const handleMenuItemClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar className="border-r-0 shadow-xl bg-white dark:bg-gray-950">
      <SidebarHeader className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
            <Fuel className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FuelSync Hub
            </span>
            <div className="text-xs text-muted-foreground font-medium">
              {user?.tenantName || 'Dashboard'}
            </div>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
            Navigation
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
                          : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                      )}
                    >
                      <div className={cn(
                        "p-2 rounded-lg transition-all duration-200",
                        location.pathname === item.url 
                          ? `${item.color} bg-white/80 dark:bg-gray-900/80 shadow-sm` 
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
      
      <SidebarFooter className="p-4 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 border-t border-gray-100 dark:border-gray-800">
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