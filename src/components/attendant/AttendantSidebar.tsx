
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Fuel,
  Droplets,
  FileText,
  Bell,
  ClipboardList,
  Factory,
  Database,
  Users,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ScrollArea } from '@/components/ui/scroll-area';

const navigation = [
  {
    name: 'Dashboard',
    href: '/attendant',
    icon: Factory,
  },
  {
    name: 'Record Readings',
    href: '/attendant/readings',
    icon: Database,
  },
  {
    name: 'Cash Reports',
    href: '/attendant/cash-reports',
    icon: FileText,
  },
  {
    name: 'Alerts',
    href: '/attendant/alerts',
    icon: Bell,
  },
  {
    name: 'Inventory',
    href: '/attendant/inventory',
    icon: ClipboardList,
  }
];

export function AttendantSidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const isActive = (href: string) => {
    if (href === '/attendant') {
      return location.pathname === '/attendant' || location.pathname === '/attendant/' || location.pathname === '/attendant/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
          <Fuel className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">FuelSync</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Attendant Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-3 text-sm rounded-xl transition-all duration-200',
                'hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100',
                'group focus:outline-none focus:ring-2 focus:ring-blue-500/20',
                isActive(item.href) 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl shadow-blue-500/30' 
                  : 'text-gray-900 dark:text-gray-100 hover:text-gray-900 dark:hover:text-gray-100'
              )}
            >
              <div className={cn(
                "p-2 rounded-lg transition-colors",
                isActive(item.href) 
                  ? "bg-white/20 shadow-inner" 
                  : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 group-hover:bg-blue-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-500/25"
              )}>
                <item.icon className="h-4 w-4" />
              </div>
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
      </ScrollArea>

      {/* User Info */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize font-medium">Attendant</p>
          </div>
          <button 
            onClick={logout}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
