import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { transformNozzle } from '@/utils/dataTransformers';

interface RawNozzleDisplayProps {
  pumpId: string;
}

export function RawNozzleDisplay({ pumpId }: RawNozzleDisplayProps) {
  const [nozzles, setNozzles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNozzles = async () => {
    if (!pumpId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/v1/nozzles?pumpId=${pumpId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('fuelsync_token')}`,
          'x-tenant-id': JSON.parse(localStorage.getItem('fuelsync_user') || '{}').tenantId || ''
        }
      });
      
      const result = await response.json();
      
      // Try to extract nozzles from the response
      let nozzlesArray = [];
      
      if (result.success && result.data && result.data.nozzles) {
        nozzlesArray = result.data.nozzles;
      } else if (result.nozzles) {
        nozzlesArray = result.nozzles;
      } else if (Array.isArray(result)) {
        nozzlesArray = result;
      }
      
      // Transform the nozzles
      const transformedNozzles = nozzlesArray.map(transformNozzle);
      setNozzles(transformedNozzles);
      
    } catch (err) {
      setError(err.message || 'An error occurred');
      console.error('Error fetching nozzles:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch nozzles on mount
  useEffect(() => {
    if (pumpId) {
      fetchNozzles();
    }
  }, [pumpId]);

  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Direct Nozzle Display</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchNozzles}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="text-sm text-red-500 mb-2">Error: {error}</div>
        )}
        
        {nozzles.length === 0 ? (
          <div className="text-sm text-gray-500">No nozzles found</div>
        ) : (
          <div className="grid gap-2">
            {nozzles.map(nozzle => (
              <div key={nozzle.id} className="border p-2 rounded">
                <div className="flex justify-between items-center">
                  <div className="font-medium">Nozzle #{nozzle.nozzleNumber}</div>
                  <Badge>{nozzle.status}</Badge>
                </div>
                <div className="text-sm text-gray-500">
                  Fuel Type: {nozzle.fuelType}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}