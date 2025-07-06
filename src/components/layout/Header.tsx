
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut, Settings, Crown, Building2, UserCheck, Zap, Menu } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import { useNavigate, useLocation } from 'react-router-dom';

export interface HeaderProps {
  onMobileMenuClick?: () => void;
}

export function Header({ onMobileMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  let sidebarToggle: (() => void) | undefined;
  try {
    sidebarToggle = useSidebar().toggleSidebar;
  } catch {
    sidebarToggle = undefined;
  }
  const handleMobileMenuClick = onMobileMenuClick ?? sidebarToggle;

  // Get current page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/dashboard' || path === '/dashboard/') {
      return 'Dashboard';
    }
    
    if (path.startsWith('/dashboard/stations')) {
      if (path.includes('/new')) return 'New Station';
      if (path.includes('/edit')) return 'Edit Station';
      return 'Stations';
    }
    
    if (path.startsWith('/dashboard/pumps')) {
      if (path.includes('/new')) return 'New Pump';
      if (path.includes('/edit')) return 'Edit Pump';
      return 'Pumps';
    }
    
    if (path.startsWith('/dashboard/nozzles')) {
      if (path.includes('/new')) return 'New Nozzle';
      if (path.includes('/edit')) return 'Edit Nozzle';
      return 'Nozzles';
    }
    
    if (path.startsWith('/dashboard/readings')) {
      if (path.includes('/new')) return 'New Reading';
      if (path.includes('/edit')) return 'Edit Reading';
      return 'Readings';
    }
    
    if (path.startsWith('/dashboard/cash-report')) {
      return 'Cash Report';
    }
    
    if (path.startsWith('/superadmin')) {
      return 'Platform Management';
    }
    
    return 'Dashboard';
  };

  const getRoleDetails = (role: string) => {
    switch (role) {
      case 'superadmin':
        return { 
          label: 'Super Administrator', 
          color: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white',
          icon: Crown
        };
      case 'owner':
        return { 
          label: 'Business Owner', 
          color: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white',
          icon: Building2
        };
      case 'manager':
        return { 
          label: 'Station Manager', 
          color: 'bg-gradient-to-r from-green-600 to-emerald-600 text-white',
          icon: UserCheck
        };
      case 'attendant':
        return { 
          label: 'Fuel Attendant', 
          color: 'bg-gradient-to-r from-orange-600 to-red-600 text-white',
          icon: Zap
        };
      default:
        return { 
          label: 'User', 
          color: 'bg-gradient-to-r from-gray-600 to-slate-600 text-white',
          icon: User
        };
    }
  };

  const roleDetails = getRoleDetails(user?.role || '');
  const RoleIcon = roleDetails.icon;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSettingsClick = () => {
    if (user?.role === 'superadmin') {
      navigate('/superadmin/settings');
    } else {
      navigate('/dashboard/settings');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 shadow-sm dark:bg-gray-950/95 dark:border-gray-800">
      <div className="flex h-14 md:h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 lg:hidden"
            onClick={handleMobileMenuClick}
          >
            <Menu className="h-4 w-4" />
          </Button>
          
          {/* Page Title - Show current page context */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="h-6 w-px bg-border" />
            <span className="text-sm font-medium text-muted-foreground">
              {getPageTitle()}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Role Badge - responsive sizing */}
          {user?.role && (
            <Badge className={`${roleDetails.color} border-0 flex items-center gap-1 px-2 py-1 text-xs font-medium shadow-sm hidden sm:flex`}>
              <RoleIcon className="h-3 w-3" />
              <span className="hidden md:inline">{roleDetails.label}</span>
              <span className="md:hidden">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
            </Badge>
          )}

          {/* Tenant Info - for non-superadmin users */}
          {user?.tenantName && user.role !== 'superadmin' && (
            <div className="hidden lg:flex items-center gap-2 px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg border text-xs">
              <Building2 className="h-3 w-3 text-slate-600 dark:text-slate-400" />
              <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-24">
                {user.tenantName}
              </span>
            </div>
          )}
          
          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 md:h-10 md:w-10 rounded-full ring-2 ring-transparent hover:ring-purple-200 transition-all">
                <Avatar className="h-7 w-7 md:h-9 md:w-9">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} alt={user?.name} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white text-xs md:text-sm font-semibold">
                    {user?.name ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 md:w-64" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={`${roleDetails.color} border-0 text-xs px-2 py-0.5`}>
                      <RoleIcon className="h-3 w-3 mr-1" />
                      {user?.role}
                    </Badge>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSettingsClick}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
