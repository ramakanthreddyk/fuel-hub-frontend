
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
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon" className="border-r border-gray-200">
      <SidebarHeader className="border-b border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                FuelSync
              </h1>
              <p className="text-xs text-muted-foreground">SuperAdmin</p>
            </div>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? 'sr-only' : ''}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.href}
                      end={item.end}
                      className={({ isActive }) =>
                        cn(
                          'flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 transition-colors w-full',
                          isActive
                            ? 'bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 border border-purple-200'
                            : 'text-gray-700 hover:text-purple-700 hover:bg-gray-50'
                        )
                      }
                    >
                      <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                      {!isCollapsed && item.name}
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
