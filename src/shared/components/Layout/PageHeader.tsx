/**
 * @file shared/components/Layout/PageHeader.tsx
 * @description Reusable page header component with breadcrumbs and actions
 */

import React from 'react';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs = [],
  actions,
  showBackButton = false,
  onBack,
  className = '',
}) => {
  return (
    <div className={`bg-white border-b border-gray-200 px-6 py-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          {/* Back button */}
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="mb-2 p-1 h-auto"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          )}

          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <nav className="flex mb-2" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm">
                {breadcrumbs.map((item, index) => (
                  <li key={index} className="flex items-center">
                    {index > 0 && (
                      <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
                    )}
                    {item.href || item.onClick ? (
                      <button
                        onClick={item.onClick || (() => window.location.href = item.href!)}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {item.label}
                      </button>
                    ) : (
                      <span className="text-gray-900 font-medium">
                        {item.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* Title and subtitle */}
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1 text-sm text-gray-500 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        {actions && (
          <div className="ml-4 flex-shrink-0 flex items-center space-x-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

// Usage examples:
/*
// Basic usage
<PageHeader title="Stations" subtitle="Manage fuel stations" />

// With breadcrumbs and actions
<PageHeader
  title="Station Details"
  subtitle="View and edit station information"
  breadcrumbs={[
    { label: 'Dashboard', href: '/' },
    { label: 'Stations', href: '/stations' },
    { label: 'Station XYZ' }
  ]}
  actions={
    <>
      <Button variant="outline">Edit</Button>
      <Button>Save Changes</Button>
    </>
  }
  showBackButton
  onBack={() => navigate('/stations')}
/>
*/
