import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { nozzleService } from '@/services/nozzleService';

interface RawNozzleDisplayProps {
  readonly pumpId: string;
}

export function RawNozzleDisplay({ pumpId }: Readonly<RawNozzleDisplayProps>) {
  const [nozzles, setNozzles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pumpName, setPumpName] = useState<string>('Pump');

    const fetchNozzles = async () => {
      if (!pumpId) return;
      setLoading(true);
      try {
        const nozzlesArray = await nozzleService.getNozzles(pumpId);
        setNozzles(nozzlesArray);
        if (nozzlesArray.length > 0 && nozzlesArray[0].name) {
          setPumpName(nozzlesArray[0].name);
        } else {
          setPumpName('Pump');
        }
        setError(null);
      } catch (error: any) {
        setError(error?.message || 'Failed to fetch nozzles');
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
          <CardTitle className="text-sm">Direct Nozzle Display ({pumpName})</CardTitle>
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
                  <div className="font-medium">Nozzle: {nozzle.name}</div>
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