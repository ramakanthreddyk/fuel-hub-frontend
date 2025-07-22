
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Nozzle {
  id: string;
  fuelType: string;
  currentReading: number;
  [key: string]: any;
}

const NozzlesPage = () => {
  const { pumpId } = useParams<{ pumpId: string }>();
  const [nozzles, setNozzles] = useState<Nozzle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rawData, setRawData] = useState<any>(null);

  useEffect(() => {
    async function fetchNozzles() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/pumps/${pumpId}/nozzles`);
        if (!res.ok) throw new Error('Failed to fetch nozzles');
        const data = await res.json();
        setRawData(data);
        // Handle possible response shapes
        if (Array.isArray(data)) {
          setNozzles(data);
        } else if (Array.isArray(data.nozzles)) {
          setNozzles(data.nozzles);
        } else {
          setNozzles([]);
        }
      } catch (err: any) {
        setError(err.message || 'Error fetching nozzles');
        setNozzles([]);
      } finally {
        setLoading(false);
      }
    }
    if (pumpId) fetchNozzles();
  }, [pumpId]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Nozzles</h1>
        <p className="text-muted-foreground">Monitor fuel nozzles and readings</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Nozzle Management</CardTitle>
          <CardDescription>View and manage fuel nozzles and their readings</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading nozzles...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : nozzles.length === 0 ? (
            <p className="text-muted-foreground">No nozzles found for this pump.</p>
          ) : (
            <>
              <table className="min-w-full border mt-4">
                <thead>
                  <tr>
                    <th className="border px-2 py-1">Nozzle ID</th>
                    <th className="border px-2 py-1">Fuel Type</th>
                    <th className="border px-2 py-1">Current Reading</th>
                  </tr>
                </thead>
                <tbody>
                  {nozzles.map((nozzle) => (
                    <tr key={nozzle.id}>
                      <td className="border px-2 py-1">{nozzle.id}</td>
                      <td className="border px-2 py-1">{nozzle.fuelType}</td>
                      <td className="border px-2 py-1">{nozzle.currentReading}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Debug: show raw nozzle data for troubleshooting */}
              <details className="mt-4 text-xs text-muted-foreground">
                <summary>Debug: Raw Nozzle Data</summary>
                <pre>{JSON.stringify(rawData, null, 2)}</pre>
              </details>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NozzlesPage;
