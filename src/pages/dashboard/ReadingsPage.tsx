
/**
 * @file ReadingsPage.tsx
 * @description Page component for viewing and managing readings
 * @see docs/API_INTEGRATION_GUIDE.md - API integration patterns
 * @see docs/journeys/MANAGER.md - Manager journey for recording readings
 */
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gauge, Clock, AlertTriangle, CheckCircle, Plus, FileText, Eye, Edit, Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useNavigate, Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/page-header';
import { useReadings } from '@/hooks/api/useReadings';
import { usePendingReadings } from '@/hooks/api/usePendingReadings';
import { usePumps } from '@/hooks/api/usePumps';
import { useNozzles } from '@/hooks/api/useNozzles';
import { useStations } from '@/hooks/api/useStations';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatReading, formatDateTime, formatCurrency } from '@/utils/formatters';
import { cn } from '@/lib/utils';
import { ReadingReceiptCard } from '@/components/readings/ReadingReceiptCard';

export default function ReadingsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'today' | 'week'>('all');
  const [selectedPumpId, setSelectedPumpId] = useState<string>('all');

  // Fetch readings using the API hook
  const { data: readings, isLoading, error } = useReadings();
  const { data: pumps = [] } = usePumps();
  const { data: nozzles = [] } = useNozzles();
  const { data: stations = [] } = useStations();
  const {
    data: pendingAlerts = [],
    acknowledge: acknowledgeAlert,
    dismiss: dismissAlert,
  } = usePendingReadings();

  // Ensure readings is always an array and enrich with related data
  const readingsArray = Array.isArray(readings) ? readings : [];
  
  // Enrich readings with nozzle, pump, and station information
  const enrichedReadings = readingsArray.map(reading => {
    const nozzle = nozzles.find(n => n.id === reading.nozzleId);
    const pump = pumps.find(p => p.id === nozzle?.pumpId);
    const station = stations.find(s => s.id === pump?.stationId);
    
    return {
      ...reading,
      nozzleNumber: nozzle?.nozzleNumber,
      fuelType: nozzle?.fuelType,
      pumpName: pump?.name,
      stationName: station?.name,
      pumpId: pump?.id,
      stationId: station?.id
    };
  });
  
  // Filter readings based on selected filter and pump
  const filteredReadings = enrichedReadings.filter(reading => {
    let dateMatch = true;
    if (filter === 'today') {
      const today = new Date().toDateString();
      dateMatch = new Date(reading.recordedAt).toDateString() === today;
    } else if (filter === 'week') {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      dateMatch = new Date(reading.recordedAt) >= weekAgo;
    }
    const pumpMatch = selectedPumpId === 'all' || reading.pumpId === selectedPumpId;
    return dateMatch && pumpMatch;
  });

  // Calculate stats
  const totalReadings = enrichedReadings.length;
  const todayReadings = enrichedReadings.filter(r => new Date(r.recordedAt).toDateString() === new Date().toDateString()).length;
  const weekReadings = enrichedReadings.filter(r => new Date(r.recordedAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length;
  const totalRevenue = enrichedReadings.reduce((sum, r) => sum + (r.amount || 0), 0);
  const pendingAlertsCount = pendingAlerts.length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Completed
        </Badge>;
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>;
      case 'discrepancy':
        return <Badge className="bg-red-100 text-red-800 border-red-200">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Discrepancy
        </Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Pump Readings"
        description="Record and monitor fuel pump readings across all stations"
        actions={
          <div className="flex gap-2">
            <Button onClick={() => navigate('/dashboard/readings/new')} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Quick Record
            </Button>
            <Button onClick={() => navigate('/dashboard/nozzles')}>
              <Plus className="mr-2 h-4 w-4" />
              Record Reading
            </Button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Readings</CardTitle>
            <Gauge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReadings}</div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? 'Loading...' : `All time`}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayReadings}</div>
            <p className="text-xs text-muted-foreground">
              Today's readings
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weekReadings}</div>
            <p className="text-xs text-muted-foreground">
              Last 7 days
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              From all readings
            </p>
          </CardContent>
        </Card>
      </div>

      {pendingAlertsCount > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-700" />
              Pending Readings
            </CardTitle>
            <CardDescription>Nozzles missing readings in the last 24h</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {pendingAlerts.map((alert) => (
                <li key={alert.id} className="flex items-center justify-between">
                  <span className="list-disc pl-1">
                    {alert.stationName || 'Station'} – Nozzle {alert.nozzleId}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => acknowledgeAlert(alert.id)}
                    >
                      Ack
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => dismissAlert(alert.id)}
                    >
                      Dismiss
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Filter Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-wrap gap-2">
          {(['all', 'today', 'week'] as const).map((timeFilter) => (
            <Button
              key={timeFilter}
              variant={filter === timeFilter ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(timeFilter)}
              className={cn(
                "capitalize transition-all duration-200",
                filter === timeFilter && "shadow-lg scale-105"
              )}
            >
              {timeFilter === 'all' ? 'All Readings' : timeFilter === 'today' ? 'Today' : 'This Week'}
            </Button>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Pump:</span>
          <Select value={selectedPumpId} onValueChange={setSelectedPumpId}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select pump" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Pumps</SelectItem>
              {pumps.map((pump) => (
                <SelectItem key={pump.id} value={pump.id}>
                  {pump.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Readings List with Receipt Cards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Daily Reading Log
          </CardTitle>
          <CardDescription>
            Latest pump readings from all stations - organized like receipt records
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-center p-8 text-red-500">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
              <p>Error loading readings: {error.message}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={() => navigate('/dashboard/readings/new')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Reading
              </Button>
            </div>
          ) : filteredReadings.length === 0 ? (
            <div className="text-center p-8">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No readings found</h3>
              <p className="text-muted-foreground mb-4">
                {filter === 'all' 
                  ? 'Get started by recording your first reading' 
                  : `No ${filter} readings found`}
              </p>
              <Button onClick={() => navigate('/dashboard/readings/new')}>
                <Plus className="mr-2 h-4 w-4" />
                Record Reading
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredReadings.map((reading) => (
                <ReadingReceiptCard
                  key={reading.id}
                  reading={reading}
                  onView={(id) => navigate(`/dashboard/readings/${id}`)}
                  onEdit={(id) => navigate(`/dashboard/readings/${id}/edit`)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
