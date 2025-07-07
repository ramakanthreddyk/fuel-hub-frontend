
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Building2, 
  Users, 
  Home,
  Package,
  Crown,
  Menu,
  X,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

const navigation = [
  { name: 'Overview', href: '/superadmin', icon: Home, end: true },
  { name: 'Analytics', href: '/superadmin/analytics', icon: BarChart3 },
  { name: 'Tenants', href: '/superadmin/tenants', icon: Building2 },
  { name: 'Plans', href: '/superadmin/plans', icon: Package },
  { name: 'Admin Users', href: '/superadmin/users', icon: Users },
  { name: 'Settings', href: '/superadmin/settings', icon: Settings },
];

export function SuperAdminSidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const SidebarContentComponent = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 p-4 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-xl backdrop-blur-sm">
            <Crown className="h-6 w-6 text-white" />
          </div>
          <div className="text-white">
            <h1 className="text-lg font-bold">FuelSync</h1>
            <p className="text-xs text-white/80 font-medium">SuperAdmin Portal</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 p-3">
        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-500 px-2">Platform Management</p>
        </div>
        <nav className="space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.end}
              onClick={() => setIsMobileOpen(false)}
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
              <item.icon className="h-5 w-5 shrink-0 transition-colors group-hover:text-purple-700" />
              <span className="truncate text-gray-900 font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-600 font-medium">System Online</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200 shadow-lg">
        <SidebarContentComponent />
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 bg-white shadow-lg hover:shadow-xl rounded-xl">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 bg-white">
            <SidebarContentComponent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
