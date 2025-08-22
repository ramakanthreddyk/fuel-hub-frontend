/**
 * @file shared/components/Layout/EmptyState.tsx
 * @description Reusable empty state component for when data is not available
 */

import React from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  className = '',
}) => {
  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      {icon && (
        <div className="flex justify-center mb-4 text-gray-400">
          {icon}
        </div>
      )}
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
          {description}
        </p>
      )}
      
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

// Preset empty states for common scenarios
export const NoDataFound: React.FC<{ type?: string; onRefresh?: () => void }> = ({ 
  type = 'data', 
  onRefresh 
}) => (
  <EmptyState
    title={`No ${type} found`}
    description={`No ${type} available at the moment. Try refreshing or check back later.`}
    icon={
      <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    }
    action={onRefresh ? { label: 'Refresh', onClick: onRefresh } : undefined}
  />
);

export const NoSearchResults: React.FC<{ query: string; onClear: () => void }> = ({ 
  query, 
  onClear 
}) => (
  <EmptyState
    title="No results found"
    description={`No results found for "${query}". Try adjusting your search terms.`}
    icon={
      <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    }
    action={{ label: 'Clear search', onClick: onClear }}
  />
);

export const ErrorState: React.FC<{ message?: string; onRetry?: () => void }> = ({ 
  message = 'Something went wrong', 
  onRetry 
}) => (
  <EmptyState
    title="Error"
    description={message}
    icon={
      <svg className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    }
    action={onRetry ? { label: 'Try again', onClick: onRetry } : undefined}
  />
);

// Usage examples:
/*
// Basic empty state
<EmptyState
  title="No stations found"
  description="You haven't added any stations yet."
  action={{
    label: "Add Station",
    onClick: () => navigate('/stations/new')
  }}
/>

// No search results
<NoSearchResults 
  query={searchQuery} 
  onClear={() => setSearchQuery('')} 
/>

// Error state
<ErrorState 
  message="Failed to load stations" 
  onRetry={() => refetch()} 
/>

// No data with refresh
<NoDataFound 
  type="stations" 
  onRefresh={() => refetch()} 
/>
*/
