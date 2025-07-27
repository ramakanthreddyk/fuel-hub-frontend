import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EnhancedNozzleCard } from '@/components/nozzles/EnhancedNozzleCard';
import { ArrowLeft, Fuel, Activity, AlertTriangle, Plus, Gauge } from 'lucide-react';

interface Nozzle {
  id: string;
  fuelType?: string;
  fuel_type?: string;
  currentReading?: number;
  current_reading?: number;
  status: string;
  nozzleNumber?: number;
  nozzle_number?: number;
  [key: string]: any;
}

const NozzlesPage = () => {
  const { pumpId, stationId } = useParams<{ pumpId: string; stationId: string }>();
  const navigate = useNavigate();
  const [nozzles, setNozzles] = useState<Nozzle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pumpName, setPumpName] = useState('Pump');

  useEffect(() => {
    async function fetchNozzles() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/pumps/${pumpId}/nozzles`);
        if (!res.ok) throw new Error('Failed to fetch nozzles');
        const data = await res.json();
        
        if (Array.isArray(data)) {
          setNozzles(data);
        } else if (Array.isArray(data.nozzles)) {
          setNozzles(data.nozzles);
        } else {
          setNozzles([]);
        }
        
        // Try to get pump name
        if (data.pump?.name) setPumpName(data.pump.name);
      } catch (err: any) {
        setError(err.message || 'Error fetching nozzles');
        setNozzles([]);
      } finally {
        setLoading(false);
      }
    }
    if (pumpId) fetchNozzles();
  }, [pumpId]);

  const handleTakeReading = (nozzleId: string) => {
    alert(`Taking reading for nozzle ${nozzleId}`);
  };

  const activeNozzles = nozzles.filter(n => n.status === 'active').length;
  const totalNozzles = nozzles.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header with Breadcrumb */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="text-sm text-muted-foreground">
            Dashboard → Stations → Pumps → <span className="font-medium text-foreground">Nozzles</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Fuel className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{pumpName} Nozzles</h1>
            <p className="text-lg text-muted-foreground">Monitor and manage fuel nozzles</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-900">{activeNozzles}</div>
                <div className="text-sm text-green-700 font-medium">Active Nozzles</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Gauge className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-900">{totalNozzles}</div>
                <div className="text-sm text-blue-700 font-medium">Total Nozzles</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-900">{Math.round((activeNozzles/totalNozzles)*100) || 0}%</div>
                <div className="text-sm text-purple-700 font-medium">Operational</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Nozzles Grid */}
      {loading ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading nozzles...</p>
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="border-0 shadow-lg border-red-200">
          <CardContent className="p-12 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 font-medium">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline" 
              className="mt-4"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : nozzles.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <Fuel className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Nozzles Found</h3>
            <p className="text-muted-foreground mb-6">This pump doesn't have any nozzles configured yet.</p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Nozzle
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {nozzles.map((nozzle) => (
            <EnhancedNozzleCard 
              key={nozzle.id} 
              nozzle={nozzle} 
              onTakeReading={handleTakeReading}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NozzlesPage;