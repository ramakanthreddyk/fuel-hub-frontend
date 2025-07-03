/**
 * @file useQueryConfig.ts
 * @description Centralized React Query configuration
 * @see docs/API_INTEGRATION_GUIDE.md - API integration patterns
 */

/**
 * Default stale time for queries (5 minutes)
 * This determines how long data is considered fresh
 */
export const DEFAULT_STALE_TIME = 5 * 60 * 1000;

/**
 * Default cache time for queries (30 minutes)
 * This determines how long unused data remains in the cache
 */
export const DEFAULT_CACHE_TIME = 30 * 60 * 1000;

/**
 * Default retry configuration
 * Retry failed queries 2 times with exponential backoff
 */
export const DEFAULT_RETRY_CONFIG = {
  retries: 2,
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
};

/**
 * Get optimized query options for specific query types
 */
export const queryOptions = {
  /**
   * Options for reference data that rarely changes
   */
  referenceData: {
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
  
  /**
   * Options for frequently changing data
   */
  frequentData: {
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  },
  
  /**
   * Options for real-time data
   */
  realTimeData: {
    staleTime: 0, // Always stale
    gcTime: 60 * 1000, // 1 minute
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  },
};