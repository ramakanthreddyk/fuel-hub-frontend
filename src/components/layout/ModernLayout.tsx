/**
 * @file ModernLayout.tsx
 * @description Modern responsive layout with sidebar and header
 */
import React, { useState, useEffect } from 'react';
import { ModernHeader } from './ModernHeader';
import { ModernSidebar } from './ModernSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface ModernLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function ModernLayout({ children, className }: ModernLayoutProps) {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
        setSidebarOpen(false);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarOpen && window.innerWidth < 1024) {
        const sidebar = document.getElementById('mobile-sidebar');
        const target = event.target as Node;
        if (sidebar && !sidebar.contains(target)) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen]);

  const handleMenuToggle = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <ModernSidebar 
          collapsed={sidebarCollapsed}
          onCollapse={setSidebarCollapsed}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div id="mobile-sidebar" className="absolute left-0 top-0 h-full">
            <ModernSidebar onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <ModernHeader 
          onMenuToggle={handleMenuToggle}
          showMenuButton={true}
        />
        
        <main className={cn(
          'flex-1 overflow-y-auto bg-gray-50',
          className
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}

// Specialized layout for attendants (simplified)
export function AttendantLayout({ children, className }: ModernLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex flex-1 flex-col">
        <ModernHeader showMenuButton={false} />
        <main className={cn(
          'flex-1 overflow-y-auto bg-gray-50',
          className
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}

// Smart layout that chooses based on user role
export function SmartLayout({ children, className }: ModernLayoutProps) {
  const { user } = useAuth();

  if (user?.role === 'attendant') {
    return (
      <AttendantLayout className={className}>
        {children}
      </AttendantLayout>
    );
  }

  return (
    <ModernLayout className={className}>
      {children}
    </ModernLayout>
  );
}
