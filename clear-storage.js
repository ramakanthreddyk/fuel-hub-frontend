// Emergency script to clear localStorage and fix quota exceeded error
// Run this in the browser console

console.log('🧹 Clearing localStorage to fix quota exceeded error...');

// Check current storage usage
let totalSize = 0;
for (let key in localStorage) {
  if (localStorage.hasOwnProperty(key)) {
    const size = localStorage[key].length;
    totalSize += size;
    console.log(`${key}: ${(size / 1024).toFixed(2)} KB`);
  }
}
console.log(`Total localStorage size: ${(totalSize / 1024).toFixed(2)} KB`);

// Clear the problematic stores
const storesToClear = [
  'fuelsync-data-store',
  'fuel-store',
  'readings-store'
];

storesToClear.forEach(store => {
  if (localStorage.getItem(store)) {
    const size = localStorage.getItem(store).length;
    console.log(`Clearing ${store} (${(size / 1024).toFixed(2)} KB)`);
    localStorage.removeItem(store);
  }
});

// Clear all fuelsync related items
Object.keys(localStorage).forEach(key => {
  if (key.includes('fuelsync') || key.includes('fuel-') || key.includes('readings')) {
    console.log(`Clearing ${key}`);
    localStorage.removeItem(key);
  }
});

console.log('✅ localStorage cleared successfully!');
console.log('🔄 Please refresh the page to reinitialize the stores.');

// Check storage after cleanup
let newTotalSize = 0;
for (let key in localStorage) {
  if (localStorage.hasOwnProperty(key)) {
    newTotalSize += localStorage[key].length;
  }
}
console.log(`New total localStorage size: ${(newTotalSize / 1024).toFixed(2)} KB`);
console.log(`Freed up: ${((totalSize - newTotalSize) / 1024).toFixed(2)} KB`);
