// Debug script to check what's in the store
// Run this in the browser console after creating a reading

console.log('=== DEBUGGING STORE STATE ===');

// Check localStorage for the data store
const dataStoreData = localStorage.getItem('fuelsync-data-store');
if (dataStoreData) {
  const parsed = JSON.parse(dataStoreData);
  console.log('Data Store - Latest Readings:', parsed.state?.latestReadings);
} else {
  console.log('No data store found in localStorage');
}

// Check localStorage for the readings store
const readingsStoreData = localStorage.getItem('readings-store');
if (readingsStoreData) {
  const parsed = JSON.parse(readingsStoreData);
  console.log('Readings Store - Last Created Reading:', parsed.state?.lastCreatedReading);
} else {
  console.log('No readings store found in localStorage');
}

console.log('=== END DEBUG ===');
