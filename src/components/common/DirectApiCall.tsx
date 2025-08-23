import { SafeText, SafeHtml } from '@/components/ui/SafeHtml';
import { secureLog } from '@/utils/security';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DirectApiCallProps {
  endpoint: string;
  title?: string;
}

export function DirectApiCall({ endpoint, title = 'Direct API Call' }: DirectApiCallProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('fuelsync_token')}`,
          'x-tenant-id': JSON.parse(localStorage.getItem('fuelsync_user') || '{}').tenantId || ''
        }
      });
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message || 'An error occurred');
      secureLog.error('Direct API call error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-4 border-dashed border-blue-300">
      <CardHeader className="py-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm text-blue-500">{<SafeText text={title} />}</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchData}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Fetch Data'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="text-xs text-red-500 mb-2">Error: {<SafeText text={error} />}</div>
        )}
        {data && (
          <pre className="text-xs overflow-auto bg-gray-50 p-2 rounded max-h-60">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </CardContent>
    </Card>
  );
}