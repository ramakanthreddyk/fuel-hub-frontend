/**
 * @file ModernHeader.tsx
 * @description Modern, responsive header with role-based navigation
 */
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import {
  Bell,
  Menu,
  Settings,
  User,
  LogOut,
  Plus,
  BarChart3,
  Fuel,
  Users,
  FileText,
  HelpCircle,
  Moon,
  Sun,
  ChevronDown,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  X
} from 'lucide-react';

interface ModernHeaderProps {
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export function ModernHeader({ onMenuToggle, showMenuButton = true }: ModernHeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Mock notifications - replace with real data from API
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Daily Reconciliation Required',
      message: 'Station Alpha needs reconciliation for today',
      type: 'warning',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      read: false,
      actionUrl: '/dashboard/reconciliation'
    },
    {
      id: '2',
      title: 'Low Fuel Alert',
      message: 'Diesel tank at Station Beta is below 20%',
      type: 'error',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: false,
      actionUrl: '/dashboard/inventory'
    },
    {
      id: '3',
      title: 'Sales Report Generated',
      message: 'Weekly sales report is ready for download',
      type: 'success',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      read: true,
      actionUrl: '/dashboard/reports'
    },
    {
      id: '4',
      title: 'New User Added',
      message: 'John Doe has been added as an attendant',
      type: 'info',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      read: true,
      actionUrl: '/dashboard/users'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'info': return <Bell className="h-4 w-4 text-blue-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getQuickActions = () => {
    if (user?.role === 'attendant') {
      return [
        {
          icon: Fuel,
          label: 'Record Reading',
          onClick: () => navigate('/attendant/readings/new'),
          variant: 'primary' as const,
          tooltip: 'Record new fuel readings'
        }
      ];
    }

    if (user?.role === 'superadmin') {
      return [
        {
          icon: Zap,
          label: 'Quick Actions',
          onClick: () => navigate('/dashboard'),
          variant: 'primary' as const,
          tooltip: 'Access quick actions'
        },
        {
          icon: TrendingUp,
          label: 'Analytics',
          onClick: () => navigate('/dashboard/reports'),
          variant: 'secondary' as const,
          tooltip: 'View analytics and reports'
        },
        {
          icon: Users,
          label: 'Manage',
          onClick: () => navigate('/dashboard/users'),
          variant: 'outline' as const,
          tooltip: 'Manage users and stations'
        }
      ];
    }

    // Owner/Manager actions
    return [
      {
        icon: Fuel,
        label: 'New Reading',
        onClick: () => navigate('/dashboard/readings/new'),
        variant: 'primary' as const,
        tooltip: 'Record new fuel readings'
      },
      {
        icon: TrendingUp,
        label: 'Reports',
        onClick: () => navigate('/dashboard/reports'),
        variant: 'secondary' as const,
        tooltip: 'View business reports'
      }
    ];
  };

  const quickActions = getQuickActions();

  // Helper function to check if a button should be highlighted
  const isActionActive = (action: any) => {
    const currentPath = location.pathname;

    // Check for New Reading button
    if (action.label === 'New Reading' || action.label === 'Record Reading') {
      return currentPath.includes('/readings/new') || currentPath.includes('/readings/edit');
    }

    // Check for Reports button
    if (action.label === 'Reports') {
      return currentPath.includes('/reports') || currentPath.includes('/analytics');
    }

    // Check for other actions
    if (action.label === 'Analytics') {
      return currentPath.includes('/analytics') || currentPath.includes('/reports');
    }

    if (action.label === 'Manage') {
      return currentPath.includes('/users') || currentPath.includes('/stations') || currentPath.includes('/settings');
    }

    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {showMenuButton && (
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={onMenuToggle}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          
          {/* Empty space - Logo is handled by sidebar */}
        </div>

        {/* Center Section - Spacer */}
        <div className="flex-1"></div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Quick Actions */}
          <div className="hidden sm:flex items-center space-x-2">
            {quickActions.map((action, index) => {
              const isActive = isActionActive(action);
              return (
                <Button
                  key={index}
                  size="sm"
                  variant={isActive ? 'default' : action.variant}
                  onClick={action.onClick}
                  className={cn(
                    // Primary button styling
                    action.variant === 'primary' && !isActive &&
                    'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-sm',

                    // Active state styling
                    isActive &&
                    'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md ring-2 ring-blue-300 ring-opacity-50',

                    // Secondary button active state
                    isActive && action.variant === 'secondary' &&
                    'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md ring-2 ring-green-300 ring-opacity-50',

                    // Outline button active state
                    isActive && action.variant === 'outline' &&
                    'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md ring-2 ring-purple-300 ring-opacity-50'
                  )}
                >
                  <action.icon className="h-4 w-4 mr-2" />
                  <span className="hidden lg:inline">{action.label}</span>
                </Button>
              );
            })}
          </div>

          {/* Notifications */}
          <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center animate-pulse"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between p-3 border-b">
                <h3 className="font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs h-auto p-1"
                  >
                    Mark all read
                  </Button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b last:border-b-0 hover:bg-muted/50 cursor-pointer group ${
                        !notification.read ? 'bg-blue-50/50' : ''
                      }`}
                      onClick={() => {
                        if (!notification.read) markAsRead(notification.id);
                        if (notification.actionUrl) {
                          navigate(notification.actionUrl);
                          setNotificationsOpen(false);
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium truncate ${
                              !notification.read ? 'text-foreground' : 'text-muted-foreground'
                            }`}>
                              {notification.title}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="h-auto p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatTimestamp(notification.timestamp)}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {notifications.length > 0 && (
                <div className="p-2 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => {
                      navigate('/dashboard/notifications');
                      setNotificationsOpen(false);
                    }}
                  >
                    View all notifications
                  </Button>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                  <Badge variant="secondary" className="w-fit text-xs mt-1">
                    {user?.role?.charAt(0)?.toUpperCase() + user?.role?.slice(1)}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => navigate('/help')}>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help & Support</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
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
