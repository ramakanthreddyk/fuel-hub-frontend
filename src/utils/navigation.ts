
/**
 * @file utils/navigation.ts
 * @description Navigation utilities for consistent routing behavior
 */
import { NavigateFunction } from 'react-router-dom';

export interface NavigationOptions {
  fallback?: string;
  replace?: boolean;
}

/**
 * Navigate back with fallback option
 * @param navigate - React Router navigate function
 * @param fallback - Fallback route if no history
 * @param options - Navigation options
 */
export const navigateBack = (
  navigate: NavigateFunction, 
  fallback: string = '/dashboard',
  options: NavigationOptions = {}
) => {
  try {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallback, { replace: options.replace });
    }
  } catch (error) {
    // Fallback to the specified route
    navigate(fallback, { replace: options.replace });
  }
};

/**
 * Get breadcrumb items for current route
 * @param pathname - Current pathname
 * @returns Array of breadcrumb items
 */
export const getBreadcrumbItems = (pathname: string) => {
  const segments = pathname.split('/').filter(Boolean);
  const items = [];
  
  let currentPath = '';
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += `/${segment}`;
    
    // Skip dynamic segments (IDs)
    if (segment.match(/^[a-f0-9-]{36}$/)) {
      continue;
    }
    
    let label = segment.charAt(0).toUpperCase() + segment.slice(1);
    
    // Special cases for better labels
    switch (segment) {
      case 'dashboard':
        label = 'Dashboard';
        break;
      case 'stations':
        label = 'Stations';
        break;
      case 'pumps':
        label = 'Pumps';
        break;
      case 'nozzles':
        label = 'Nozzles';
        break;
      case 'readings':
        label = 'Readings';
        break;
      case 'new':
        label = 'New';
        break;
      case 'edit':
        label = 'Edit';
        break;
    }
    
    items.push({
      label,
      path: currentPath,
      isActive: i === segments.length - 1
    });
  }
  
  return items;
};
