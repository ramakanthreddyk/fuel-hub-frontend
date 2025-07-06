
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  Fuel,
  PieChart,
  Building2,
  Users,
  Package,
  BarChart3
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

const superAdminMenuItems = [
  {
    title: "Platform Overview",
    url: "/superadmin/overview",
    icon: PieChart,
    color: "text-purple-600",
    bgColor: "bg-purple-50 border-purple-200"
  },
  {
    title: "Tenant Organizations",
    url: "/superadmin/tenants",
    icon: Building2,
    color: "text-blue-600",
    bgColor: "bg-blue-50 border-blue-200"
  },
  {
    title: "User Management",
    url: "/superadmin/users",
    icon: Users,
    color: "text-green-600",
    bgColor: "bg-green-50 border-green-200"
  },
  {
    title: "Subscription Plans",
    url: "/superadmin/plans",
    icon: Package,
    color: "text-orange-600",
    bgColor: "bg-orange-50 border-orange-200"
  },
  {
    title: "Platform Analytics",
    url: "/superadmin/analytics",
    icon: BarChart3,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50 border-indigo-200"
  }
];

export function SuperAdminSidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const { setOpenMobile, isMobile } = useSidebar();

  const handleMenuItemClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar className="border-r-0 shadow-xl bg-white">
      <SidebarHeader className="p-6 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl shadow-lg ring-2 ring-purple-400/30">
            <Fuel className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              FuelSync Hub
            </span>
            <div className="text-xs text-gray-600 font-medium">
              SuperAdmin Portal
            </div>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-3 py-4 bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3 px-3">
            Platform Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {superAdminMenuItems.map((item) => (
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
                          ? `${item.color} bg-white shadow-sm ring-1 ring-current/20` 
                          : `${item.color} bg-gray-100 group-hover:bg-gray-200 group-hover:shadow-sm`
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
      
      <SidebarFooter className="p-4 bg-white border-t border-gray-200">
        <div className="text-center space-y-2">
          <div className="text-xs text-gray-600 font-medium">
            Powered by FuelSync Hub
          </div>
          <div className="text-xs text-gray-500">
            © 2024 All rights reserved
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
