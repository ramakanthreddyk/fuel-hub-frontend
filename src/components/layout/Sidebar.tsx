
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
  BarChart3,
  Package,
  Calculator
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
  switch (role) {
    case 'superadmin':
      return [
        {
          title: "Overview",
          url: "/superadmin/overview",
          icon: BarChart3,
        },
        {
          title: "Tenants",
          url: "/superadmin/tenants",
          icon: Building2,
        },
        {
          title: "Users",
          url: "/superadmin/users",
          icon: Users,
        },
        {
          title: "Plans",
          url: "/superadmin/plans",
          icon: Package,
        },
        {
          title: "Analytics",
          url: "/superadmin/analytics",
          icon: BarChart3,
        }
      ];
    
    case 'owner':
      return [
        {
          title: "Summary",
          url: "/dashboard/summary",
          icon: BarChart3,
        },
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
          title: "Reconciliation",
          url: "/dashboard/reconciliation",
          icon: Calculator,
        },
        {
          title: "Sales",
          url: "/dashboard/sales",
          icon: DollarSign,
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
          icon: Package,
        },
        {
          title: "Users",
          url: "/dashboard/users",
          icon: Users,
        },
        {
          title: "Reports",
          url: "/dashboard/reports",
          icon: FileText,
        },
        {
          title: "Settings",
          url: "/dashboard/settings",
          icon: Settings,
        }
      ];
    
    case 'manager':
      return [
        {
          title: "Summary",
          url: "/dashboard/summary",
          icon: BarChart3,
        },
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
          title: "Reconciliation",
          url: "/dashboard/reconciliation",
          icon: Calculator,
        },
        {
          title: "Sales",
          url: "/dashboard/sales",
          icon: DollarSign,
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
          icon: Package,
        },
        {
          title: "Users",
          url: "/dashboard/users",
          icon: Users,
        },
        {
          title: "Reports",
          url: "/dashboard/reports",
          icon: FileText,
        },
        {
          title: "Settings",
          url: "/dashboard/settings",
          icon: Settings,
        }
      ];
    
    case 'attendant':
      return [
        {
          title: "New Reading",
          url: "/dashboard/readings/new",
          icon: Gauge,
        },
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
      return [];
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
          <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
            <Fuel className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            FuelSync Hub
          </span>
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
                <SidebarMenuItem key={`${item.title}-${item.url}`}>
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
          Role: <span className="font-medium text-purple-600">{user?.role}</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
