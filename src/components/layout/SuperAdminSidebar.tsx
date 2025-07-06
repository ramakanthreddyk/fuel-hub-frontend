
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Building2, 
  Users, 
  Home,
  Package,
  Settings,
  Crown,
  ChevronLeft
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
  SidebarFooter,
  useSidebar
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Overview', href: '/superadmin', icon: Home, end: true },
  { name: 'Analytics', href: '/superadmin/analytics', icon: BarChart3 },
  { name: 'Tenants', href: '/superadmin/tenants', icon: Building2 },
  { name: 'Plans', href: '/superadmin/plans', icon: Package },
  { name: 'Admin Users', href: '/superadmin/users', icon: Users },
  { name: 'Settings', href: '/superadmin/settings', icon: Settings },
];

export function SuperAdminSidebar() {
  const { setOpenMobile, isMobile, state, toggleSidebar } = useSidebar();
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
      className="border-r border-gray-200 bg-white shadow-lg"
    >
      {/* Header */}
      <SidebarHeader className="border-b border-gray-100 p-4 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-xl backdrop-blur-sm">
              <Crown className="h-6 w-6 text-white" />
            </div>
            {!isCollapsed && (
              <div className="text-white">
                <h1 className="text-lg font-bold">FuelSync</h1>
                <p className="text-xs text-white/80 font-medium">SuperAdmin Portal</p>
              </div>
            )}
          </div>
          {!isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="text-white hover:bg-white/20 p-1.5 h-auto"
            >
              <ChevronLeft className={cn(
                "h-4 w-4 transition-transform duration-200",
                isCollapsed && "rotate-180"
              )} />
            </Button>
          )}
        </div>
      </SidebarHeader>
      
      {/* Content */}
      <SidebarContent className="p-3 bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className={cn(
            "text-xs font-semibold text-gray-500 mb-3 px-2",
            isCollapsed && "sr-only"
          )}>
            Platform Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild className="h-11 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50">
                    <NavLink
                      to={item.href}
                      end={item.end}
                      onClick={handleNavClick}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 w-full group',
                          'hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-purple-700',
                          'focus:outline-none focus:ring-2 focus:ring-purple-500/20',
                          isActive
                            ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 shadow-sm border border-purple-200/50 font-semibold'
                            : 'text-gray-900 hover:text-purple-700'
                        )
                      }
                    >
                      <item.icon className={cn(
                        "h-5 w-5 shrink-0 transition-colors",
                        "group-hover:text-purple-700"
                      )} />
                      {!isCollapsed && (
                        <span className="truncate text-gray-900 font-medium">{item.name}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-3 border-t border-gray-100 bg-gray-50">
        <div className={cn(
          "flex items-center gap-2 px-2 py-1.5",
          isCollapsed && "justify-center"
        )}>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          {!isCollapsed && (
            <span className="text-xs text-gray-600 font-medium">System Online</span>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
