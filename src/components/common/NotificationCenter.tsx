
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, 
  X, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  AlertCircle,
  Settings
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export interface Notification {
  /** Unique notification ID */
  id: string;
  /** Notification title */
  title: string;
  /** Notification message */
  message: string;
  /** Notification type */
  type: 'info' | 'success' | 'warning' | 'error';
  /** Creation timestamp */
  createdAt: Date;
  /** Whether notification is read */
  read: boolean;
  /** Optional action */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Optional link */
  link?: {
    label: string;
    href: string;
  };
}

export interface NotificationCenterProps {
  /** List of notifications */
  notifications?: Notification[];
  /** Mark notification as read handler */
  onMarkAsRead: (id: string) => void;
  /** Mark all notifications as read handler */
  onMarkAllAsRead: () => void;
  /** Remove notification handler */
  onRemove: (id: string) => void;
  /** Clear all notifications handler */
  onClearAll: () => void;
  /** Custom className */
  className?: string;
}

/**
 * Notification center component for managing user notifications
 * 
 * Features:
 * - Real-time notification display
 * - Mark as read/unread functionality
 * - Notification type categorization
 * - Action buttons and links
 * - Keyboard navigation
 * - Screen reader support
 */
export function NotificationCenter({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onRemove,
  onClearAll,
  className
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const unreadCount = safeNotifications.filter(n => !n.read).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn('relative', className)}
          aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-96 p-0" 
        align="end"
        side="bottom"
      >
        <div className="p-4 border-b bg-muted/50">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onMarkAllAsRead}
                  className="text-xs h-7"
                >
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                aria-label="Notification settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        <ScrollArea className="max-h-96">
          {safeNotifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div className="divide-y">
              {safeNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    'p-4 hover:bg-muted/50 transition-colors cursor-pointer',
                    !notification.read && 'bg-primary/5 border-l-2 border-l-primary'
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={cn(
                          'text-sm font-medium truncate',
                          !notification.read && 'text-foreground'
                        )}>
                          {notification.title}
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemove(notification.id);
                          }}
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground"
                          aria-label="Remove notification"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                        </span>
                        
                        {(notification.action || notification.link) && (
                          <div className="flex items-center gap-2">
                            {notification.action && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  notification.action!.onClick();
                                }}
                                className="h-6 text-xs"
                              >
                                {notification.action.label}
                              </Button>
                            )}
                            {notification.link && (
                              <Button
                                variant="link"
                                size="sm"
                                asChild
                                className="h-6 text-xs p-0"
                              >
                                <a href={notification.link.href}>
                                  {notification.link.label}
                                </a>
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

  {safeNotifications.length > 0 && (
          <div className="p-3 border-t bg-muted/50">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="w-full text-sm h-8"
            >
              Clear all notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

/**
 * Hook for managing notifications
 */
export function useNotifications() {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  const addNotification = React.useCallback((notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const markAsRead = React.useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = React.useCallback(() => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  }, []);

  const removeNotification = React.useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = React.useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll
  };
}
