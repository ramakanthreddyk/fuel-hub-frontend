
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Building2, 
  Users, 
  Home,
  Package,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
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
  useSidebar
} from '@/components/ui/sidebar';

const navigation = [
  { name: 'Overview', href: '/superadmin', icon: Home, end: true },
  { name: 'Analytics', href: '/superadmin/analytics', icon: BarChart3 },
  { name: 'Tenants', href: '/superadmin/tenants', icon: Building2 },
  { name: 'Plans', href: '/superadmin/plans', icon: Package },
  { name: 'Admin Users', href: '/superadmin/users', icon: Users },
];

export function SuperAdminSidebar() {
  const { state, setOpenMobile, isMobile } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const handleNavClick = () => {
    // Close sidebar on mobile after navigation
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar 
      collapsible="icon" 
      className="border-r border-gray-200/60 backdrop-blur-sm bg-white/95"
    >
      <SidebarHeader className="border-b border-gray-200/60 p-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg shadow-sm">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                FuelSync
              </h1>
              <p className="text-xs text-muted-foreground font-medium">SuperAdmin</p>
            </div>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className={cn(
            "text-xs font-semibold text-gray-600 mb-2",
            isCollapsed && "sr-only"
          )}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild className="h-10">
                    <NavLink
                      to={item.href}
                      end={item.end}
                      onClick={handleNavClick}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 rounded-lg p-3 text-sm font-medium transition-all duration-200 w-full',
                          'hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-purple-700',
                          'focus:outline-none focus:ring-2 focus:ring-purple-500/20',
                          isActive
                            ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 shadow-sm border border-purple-200/50'
                            : 'text-gray-700'
                        )
                      }
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!isCollapsed && (
                        <span className="truncate">{item.name}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
