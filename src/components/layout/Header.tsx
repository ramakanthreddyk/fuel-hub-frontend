
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
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut, Settings, Crown, Building2, UserCheck, Zap } from 'lucide-react';

export function Header() {
  const { user, logout } = useAuth();
  const { isMobile } = useSidebar();

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

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="h-8 w-8" />
          
          {/* Breadcrumb or Page Title */}
          <div className="hidden md:flex items-center gap-2">
            <div className="h-6 w-px bg-border" />
            <span className="text-sm font-medium text-muted-foreground">
              {user?.role === 'superadmin' ? 'Platform Management' : 'Dashboard'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Role Badge - shown on larger screens */}
          {user?.role && (
            <Badge className={`${roleDetails.color} border-0 hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium shadow-sm`}>
              <RoleIcon className="h-3 w-3" />
              <span className="hidden lg:inline">{roleDetails.label}</span>
              <span className="lg:hidden">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
            </Badge>
          )}

          {/* Tenant Info - for non-superadmin users */}
          {user?.tenantName && user.role !== 'superadmin' && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border">
              <Building2 className="h-3 w-3 text-slate-600" />
              <span className="text-xs font-medium text-slate-700 truncate max-w-32">
                {user.tenantName}
              </span>
            </div>
          )}
          
          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-transparent hover:ring-purple-200 transition-all">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} alt={user?.name} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white text-sm font-semibold">
                    {user?.name ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} alt={user?.name} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white text-xs font-semibold">
                        {user?.name ? getInitials(user.name) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground mt-1">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={`${roleDetails.color} border-0 flex items-center gap-1 px-2 py-0.5 text-xs font-medium`}>
                      <RoleIcon className="h-3 w-3" />
                      {roleDetails.label}
                    </Badge>
                  </div>

                  {user?.tenantName && user.role !== 'superadmin' && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Building2 className="h-3 w-3" />
                      <span className="truncate">{user.tenantName}</span>
                    </div>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Account Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
