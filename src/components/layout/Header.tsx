
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
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useNavigationStore, getSectionFromPath } from '@/store/navigationStore';

export interface HeaderProps {
  onMobileMenuClick?: () => void;
}

export function Header({ onMobileMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get state and actions from navigation store
  const { pageTitle, setPageTitle, setActiveSection } = useNavigationStore();
  
  // Update page title when location changes
  useEffect(() => {
    updatePageTitle();
  }, [location.pathname, location.search]);
  
  // Update page title based on route
  const updatePageTitle = () => {
    const path = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    
    // Set active section based on path
    const section = getSectionFromPath(path);
    setActiveSection(section);
    
    // Set page title based on path and query parameters
    if (path === '/dashboard' || path === '/dashboard/') {
      setPageTitle('Dashboard');
      return;
    }
    
    if (path.startsWith('/dashboard/stations')) {
      if (path.includes('/new')) {
        setPageTitle('New Station');
      } else if (path.includes('/edit')) {
        setPageTitle('Edit Station');
      } else {
        setPageTitle('Stations');
      }
      return;
    }
    
    if (path.startsWith('/dashboard/pumps')) {
      // Check if we're viewing nozzles for a specific pump
      const pathParts = path.split('/');
      if (pathParts.length >= 5 && pathParts[4] === 'nozzles') {
        setPageTitle('Pump Nozzles');
      } else if (path.includes('/new')) {
        setPageTitle('New Pump');
      } else if (path.includes('/edit')) {
        setPageTitle('Edit Pump');
      } else {
        setPageTitle('Pumps');
      }
      return;
    }
    
    if (path.startsWith('/dashboard/nozzles')) {
      if (path.includes('/new')) {
        setPageTitle('New Nozzle');
      } else if (path.includes('/edit')) {
        setPageTitle('Edit Nozzle');
      } else {
        const pumpId = searchParams.get('pumpId');
        if (pumpId) {
          setPageTitle('Pump Nozzles');
        } else {
          setPageTitle('Nozzles');
        }
      }
      return;
    }
    
    if (path.startsWith('/dashboard/readings')) {
      if (path.includes('/new')) {
        setPageTitle('New Reading');
      } else if (path.includes('/edit')) {
        setPageTitle('Edit Reading');
      } else {
        setPageTitle('Readings');
      }
      return;
    }
    
    if (path.startsWith('/dashboard/cash-report')) {
      setPageTitle('Cash Report');
      return;
    }
    
    if (path.startsWith('/dashboard/cash-reports')) {
      setPageTitle('Cash Reports');
      return;
    }
    
    if (path.startsWith('/dashboard/fuel-prices')) {
      setPageTitle('Fuel Prices');
      return;
    }
    
    if (path.startsWith('/dashboard/fuel-inventory')) {
      setPageTitle('Fuel Inventory');
      return;
    }
    
    if (path.startsWith('/dashboard/sales')) {
      setPageTitle('Sales');
      return;
    }
    
    if (path.startsWith('/dashboard/attendance')) {
      setPageTitle('Attendance');
      return;
    }
    
    if (path.startsWith('/dashboard/users')) {
      setPageTitle('Users');
      return;
    }
    
    if (path.startsWith('/dashboard/reconciliation')) {
      setPageTitle('Reconciliation');
      return;
    }
    
    if (path.startsWith('/dashboard/reports')) {
      setPageTitle('Reports');
      return;
    }
    
    if (path.startsWith('/dashboard/analytics')) {
      setPageTitle('Analytics');
      return;
    }
    
    if (path.startsWith('/dashboard/settings')) {
      setPageTitle('Settings');
      return;
    }
    
    if (path.startsWith('/superadmin')) {
      setPageTitle('Platform Management');
      return;
    }
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
      // No settings page for superadmin yet
      return;
    } else {
      navigate('/dashboard/settings');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 shadow-sm dark:bg-gray-950/95 dark:border-gray-800">
      <div className="flex h-14 md:h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2 md:gap-4 flex-1">
          {/* Mobile hamburger menu */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden"
            onClick={onMobileMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          {/* Page Title - Better mobile visibility */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:block h-6 w-px bg-border" />
            <span className="text-sm md:text-base font-medium text-muted-foreground truncate">
              {pageTitle}
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
              <Button variant="ghost" className="relative h-8 w-8 md:h-10 md:w-10 rounded-full ring-2 ring-transparent hover:ring-purple-200 dark:hover:ring-purple-800 transition-all">
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
              <DropdownMenuItem onClick={logout} className="text-red-600 dark:text-red-400">
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
