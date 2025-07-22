/**
 * @file utils/navigationHelper.ts
 * @description Helper functions for navigation between pages
 */

import { NavigateOptions } from 'react-router-dom';

/**
 * Creates navigation state for moving between related pages
 * @param fromPage The page we're navigating from
 * @param additionalState Any additional state to include
 * @returns Navigation state object for react-router
 */
export const createNavigationState = (
  fromPage: 'pumps' | 'stations' | 'nozzles' | 'readings',
  additionalState: Record<string, any> = {}
): NavigateOptions => {
  return {
    state: {
      [`from${fromPage.charAt(0).toUpperCase() + fromPage.slice(1)}Page`]: true,
      ...additionalState
    }
  };
};

/**
 * Checks if navigation came from a specific page
 * @param locationState The location.state object from useLocation
 * @param fromPage The page to check if we came from
 * @returns Boolean indicating if we came from the specified page
 */
export const isNavigationFrom = (
  locationState: any,
  fromPage: 'pumps' | 'stations' | 'nozzles' | 'readings'
): boolean => {
  const stateKey = `from${fromPage.charAt(0).toUpperCase() + fromPage.slice(1)}Page`;
  return !!locationState?.[stateKey];
};