
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
  UserCheck,
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
  SidebarFooter
} from '@/components/ui/sidebar';

const getMenuItems = (role: string) => {
  const commonItems = [
    {
      title: "Stations",
      url: "/dashboard/stations",
      icon: Building2,
    },
    {
      title: "Readings",
      url: "/dashboard/readings", 
      icon: Gauge,
    },
    {
      title: "Sales",
      url: "/dashboard/sales",
      icon: BarChart3,
    },
    {
      title: "Creditors",
      url: "/dashboard/creditors",
      icon: DollarSign,
    },
    {
      title: "Fuel Prices",
      url: "/dashboard/fuel-prices",
      icon: Fuel,
    },
    {
      title: "Deliveries",
      url: "/dashboard/fuel-deliveries",
      icon: Fuel,
    },
    {
      title: "Inventory",
      url: "/dashboard/inventory",
      icon: Fuel,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    }
  ];

  const adminItems = [
    {
      title: "Tenants",
      url: "/superadmin/tenants",
      icon: Building2,
    },
    {
      title: "Users",
      url: "/superadmin/users",
      icon: Users,
    }
  ];

  const managerItems = [
    {
      title: "Employees",
      url: "/dashboard/employees",
      icon: UserCheck,
    },
    {
      title: "Reports",
      url: "/dashboard/reports",
      icon: BarChart3,
    }
  ];

  switch (role) {
    case 'superadmin':
      return [...adminItems, ...commonItems];
    case 'owner':
    case 'manager':
      return [...commonItems, ...managerItems];
    case 'attendant':
      return [
        {
          title: "Readings",
          url: "/dashboard/readings",
          icon: Gauge,
        },
        {
          title: "Creditors", 
          url: "/dashboard/creditors",
          icon: DollarSign,
        }
      ];
    default:
      return commonItems;
  }
};

export function AppSidebar() {
  const { user } = useAuth();
  const location = useLocation();
  
  const menuItems = getMenuItems(user?.role || '');

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <Fuel className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-lg">FuelSync Hub</span>
        </div>
        {user?.tenantName && (
          <div className="text-xs text-muted-foreground">
            {user.tenantName}
          </div>
        )}
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.url}
                      className={cn(
                        location.pathname === item.url && "bg-sidebar-accent"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <div className="text-xs text-muted-foreground">
          Role: {user?.role}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
