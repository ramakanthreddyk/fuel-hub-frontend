/**
 * Utility to clear old localStorage data from persisted stores
 * This runs automatically when the app starts to clean up old data
 */

export const clearOldStorageData = () => {
  try {
    const keysToRemove = [
      'fuelsync-data-store',
      'fuel-store', 
      'readings-store'
    ];
    
    let clearedCount = 0;
    keysToRemove.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        clearedCount++;
        console.log(`[STORAGE-CLEANUP] Removed old persisted data: ${key}`);
      }
    });
    
    if (clearedCount > 0) {
      console.log(`[STORAGE-CLEANUP] Cleared ${clearedCount} old storage items. Stores are now in-memory only.`);
    }
  } catch (error) {
    console.warn('[STORAGE-CLEANUP] Error clearing old storage:', error);
  }
};

// Auto-run on import
clearOldStorageData();
