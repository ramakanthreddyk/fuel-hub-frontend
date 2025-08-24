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

const ModernLayout = ({ children, className }: ModernLayoutProps) => {
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
};

export default ModernLayout;

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
  try {
    const { user, isLoading } = useAuth();

    // Show loading state while auth is initializing
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading layout...</p>
          </div>
        </div>
      );
    }

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
  } catch (error) {
    // If useAuth fails (e.g., context not available), show error fallback
    console.error('SmartLayout: Auth context error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-4">There was a problem loading the authentication context.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
}
