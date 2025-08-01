/**
 * @file App.test.tsx
 * @description Test version of App.tsx to identify import issues
 */
import { Routes, Route, Navigate } from 'react-router-dom';

// Test basic routing first
function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={
          <div className="p-8">
            <h1 className="text-3xl font-bold">🚀 FuelSync Hub - Real App Loading...</h1>
            <p className="text-gray-600 mt-4">Basic routing is working!</p>
          </div>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
