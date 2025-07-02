
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
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut, Settings, Crown, Building2, UserCheck, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const { user, logout } = useAuth();
  const { isMobile } = useSidebar();
  const navigate = useNavigate();

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
          <SidebarTrigger className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800" />
          
          {/* Page Title - Hidden on mobile */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="h-6 w-px bg-border" />
            <span className="text-sm font-medium text-muted-foreground">
              {user?.role === 'superadmin' ? 'Platform Management' : 'Dashboard'}
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
