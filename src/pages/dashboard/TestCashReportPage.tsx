import React from 'react';
import { CashReportTest } from '@/components/test/CashReportTest';

export default function TestCashReportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Cash Report Testing</h1>
        <p className="text-gray-600">Test the cash report submission functionality</p>
      </div>
      
      <div className="flex justify-center">
        <CashReportTest />
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Testing Instructions:</h3>
        <ol className="text-sm text-blue-800 space-y-1">
          <li>1. Make sure you're logged in</li>
          <li>2. Update the Station ID if needed</li>
          <li>3. Enter payment amounts</li>
          <li>4. Click "Test Submit"</li>
          <li>5. Check browser console for detailed logs</li>
        </ol>
      </div>
    </div>
  );
}