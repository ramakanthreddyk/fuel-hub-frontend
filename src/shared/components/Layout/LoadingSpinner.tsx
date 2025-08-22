/**
 * @file shared/components/Layout/LoadingSpinner.tsx
 * @description Reusable loading spinner component
 */

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'white' | 'gray';
  className?: string;
  message?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

const colorClasses = {
  primary: 'text-blue-600',
  white: 'text-white',
  gray: 'text-gray-400',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className = '',
  message,
}) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg
        className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {message && (
        <p className="mt-2 text-sm text-gray-600">{message}</p>
      )}
    </div>
  );
};

// Centered full-page loading component
export const FullPageLoader: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
      <LoadingSpinner size="xl" message={message} />
    </div>
  );
};

// Inline loading component for smaller areas
export const InlineLoader: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div className="flex items-center justify-center py-8">
      <LoadingSpinner size="lg" message={message} />
    </div>
  );
};

// Button loading state
export const ButtonLoader: React.FC = () => {
  return <LoadingSpinner size="sm" color="white" className="mr-2" />;
};

// Usage examples:
/*
// Basic spinner
<LoadingSpinner />

// Large spinner with message
<LoadingSpinner size="lg" message="Loading stations..." />

// Full page loader
<FullPageLoader message="Initializing application..." />

// In a button
<button disabled>
  <ButtonLoader />
  Saving...
</button>

// Inline in content
<div className="min-h-[200px]">
  <InlineLoader message="Loading data..." />
</div>
*/
