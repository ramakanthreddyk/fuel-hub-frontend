/**
 * @file ReadingsPage.tsx
 * @description Page component for viewing and managing readings
 * @see docs/API_INTEGRATION_GUIDE.md - API integration patterns
 * @see docs/journeys/MANAGER.md - Manager journey for recording readings
 */
import { useState, useEffect, useLayoutEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Gauge, Clock, AlertTriangle, CheckCircle, Plus, FileText, Eye, TrendingUp, Activity, Zap, DollarSign } from 'lucide-react';
import { FuelLoader } from '@/components/ui/FuelLoader';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useNavigate, Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/page-header';
import { useReadings } from '@/hooks/api/useReadings';
import { usePendingReadings } from '@/hooks/api/usePendingReadings';
import { usePumps } from '@/hooks/api/usePumps';
import { useNozzles } from '@/hooks/api/useNozzles';
import { useStations } from '@/hooks/api/useStations';
import { useSalesSummary } from '@/hooks/useDashboard';
import { useTodaysSales } from '@/hooks/api/useTodaysSales';
import { useReadingsStore } from '@/store/readingsStore';
import { toast } from 'sonner';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDateTime, formatCurrency, formatVolume } from '@/utils/formatters';
import { cn } from '@/lib/utils';
import { ReadingCard } from '@/components/readings/ReadingCard';
import { useAutoLoader } from '@/hooks/useAutoLoader';
import {
  useMobileFormatters,
  getResponsiveTextSize,
  getResponsiveIconSize,
  getResponsivePadding,
  getResponsiveGap
} from '@/utils/mobileFormatters';

export default function ReadingsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'today' | 'week'>('all');
  const [selectedPumpId, setSelectedPumpId] = useState<string>('all');

  const { formatCurrency: formatCurrencyMobile, isMobile } = useMobileFormatters();
  
  // Get last created reading from store
  const { lastCreatedReading, resetLastCreatedReading } = useReadingsStore();

  // Fetch readings using the API hook
  const { data: readings, isLoading, error } = useReadings();
  const { data: pumps = [], isLoading: pumpsLoading } = usePumps();
  const { data: nozzles = [], isLoading: nozzlesLoading } = useNozzles();
  const { data: stations = [], isLoading: stationsLoading } = useStations();
  
  useAutoLoader(isLoading, 'Loading readings...');
  useAutoLoader(pumpsLoading, 'Loading pumps...');
  useAutoLoader(nozzlesLoading, 'Loading nozzles...');
  useAutoLoader(stationsLoading, 'Loading stations...');
  
  // Calculate today string for API calls
  const today = new Date().toDateString();
  
  // Use sales summary API instead of calculating from readings
  const { data: salesSummary } = useSalesSummary('all');
  const { data: todaysSalesData } = useTodaysSales(today);
  console.log('[READINGS-PAGE] Sales summary data:', salesSummary);
  console.log('[READINGS-PAGE] Todays sales data:', todaysSalesData);
  const totalRevenue = salesSummary?.totalRevenue || 0;
  
  // Debug log to check readings data
  useEffect(() => {
    if (readings && readings.length > 0) {
      console.log('[READINGS-PAGE] Readings with missing amounts:', 
        readings.filter(r => r.amount === undefined || r.amount === null)
          .map(r => ({
            id: r.id,
            nozzleId: r.nozzleId,
            reading: r.reading,
            previousReading: r.previousReading,
            pricePerLitre: r.pricePerLitre,
            fuelType: r.fuelType
          }))
      );
    }
  }, [readings]);
  
  const {
    data: pendingAlerts = [],
    acknowledge: acknowledgeAlert,
    dismiss: dismissAlert,
  } = usePendingReadings();

  // Show success toast if we have a last created reading
  useEffect(() => {
    if (lastCreatedReading.id) {
      toast.success('Reading Recorded Successfully!', {
        description: (lastCreatedReading.nozzleNumber ? 'Nozzle #' + lastCreatedReading.nozzleNumber : 'Nozzle') +
          ' reading of ' + formatVolume(lastCreatedReading.reading, 2, true, '') + ' was recorded.',
        duration: 4000,
      });

      const timer = setTimeout(() => {
        resetLastCreatedReading();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [lastCreatedReading, resetLastCreatedReading]);
  
  // Force re-render when readings data changes
  useLayoutEffect(() => {
    console.log('[READINGS-PAGE] Readings data changed, forcing re-render');
    // This empty dependency array ensures this effect runs only once
  }, []);
  
  // Ensure readings is always an array and enrich with related data
  const readingsArray = Array.isArray(readings) ? readings : [];
  
  // Handle errors from API hooks
  useEffect(() => {
    if (error) {
      toast.error('Failed to load readings. Please try again later.', {
        duration: 5000,
      });
      console.error('[READINGS-PAGE] Error loading readings:', error);
    }
  }, [error]);
  
  // Validate readings data
  const validatedReadings = readingsArray.filter(reading => {
    if (!reading.nozzleId || !reading.reading || !reading.recordedAt) {
      console.warn('[READINGS-PAGE] Invalid reading data:', reading);
      return false;
    }
    return true;
  });
  
  // Enrich validated readings with nozzle, pump, and station information
  const enrichedReadings = validatedReadings.map(reading => {
    const nozzle = nozzles.find(n => n.id === reading.nozzleId);
    const pump = pumps.find(p => p.id === nozzle?.pumpId);
    const station = stations.find(s => s.id === pump?.stationId);
    
    return {
      ...reading,
      nozzleNumber: nozzle?.nozzleNumber || 'Unknown',
      pumpName: pump?.name || 'Unknown Pump',
      stationName: station?.name || 'Unknown Station',
    };
  });
  
  // Calculate amount for readings that don't have it
  const readingsWithAmount = enrichedReadings.map(reading => {
    if (reading.amount === undefined || reading.amount === null) {
      // Calculate amount if we have the necessary data
      if (reading.volume !== undefined && reading.pricePerLitre !== undefined) {
        const calculatedAmount = reading.volume * reading.pricePerLitre;
        return {
          ...reading,
          amount: calculatedAmount
        };
      }
      
      // If we have reading and previousReading, calculate volume
      if (reading.reading !== undefined && reading.previousReading !== undefined && reading.pricePerLitre !== undefined) {
        const volume = reading.reading - reading.previousReading;
        const calculatedAmount = volume * reading.pricePerLitre;
        return {
          ...reading,
          volume: volume,
          amount: calculatedAmount
        };
      }
    }
    return reading;
  });
  
  // Filter readings based on selected filter and pump
  const filteredReadings = readingsWithAmount.filter(reading => {
    let dateMatch = true;
    
    // Skip readings with null dates
    if (!reading.recordedAt || reading.recordedAt === null) {
      dateMatch = false;
    } else if (filter === 'today') {
      dateMatch = new Date(reading.recordedAt).toDateString() === today;
    } else if (filter === 'week') {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      dateMatch = new Date(reading.recordedAt) >= weekAgo;
    }
    
    const pumpMatch = selectedPumpId === 'all' || reading.pumpId === selectedPumpId;
    return dateMatch && pumpMatch;
  });

  // Get last reading for each nozzle for card display
  const nozzleLastReadings = new Map();
  const otherReadings = [];
  
  filteredReadings.forEach(reading => {
    const nozzleKey = reading.nozzleId;
    if (!nozzleLastReadings.has(nozzleKey)) {
      nozzleLastReadings.set(nozzleKey, reading);
    } else {
      const existing = nozzleLastReadings.get(nozzleKey);
      if (new Date(reading.recordedAt) > new Date(existing.recordedAt)) {
        otherReadings.push(existing);
        nozzleLastReadings.set(nozzleKey, reading);
      } else {
        otherReadings.push(reading);
      }
    }
  });

  const lastReadings = Array.from(nozzleLastReadings.values());

  // Calculate stats
  const totalReadings = enrichedReadings.length;
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  
  console.log('[READINGS-PAGE] Debug info:');
  console.log('[READINGS-PAGE] Today string:', today);
  console.log('[READINGS-PAGE] Sample readings recordedAt:', enrichedReadings.slice(0, 3).map(r => ({ id: r.id, recordedAt: r.recordedAt, type: typeof r.recordedAt })));
  
  // Use today's sales data for accurate counts instead of filtering invalid dates
  const todayReadings = todaysSalesData?.totalEntries || 0;
  const weekReadings = enrichedReadings.filter(r => {
    if (!r.recordedAt || r.recordedAt === null) {
      return false;
    }
    return new Date(r.recordedAt) >= weekAgo;
  }).length;
  
  console.log('[READINGS-PAGE] Final counts - Total:', totalReadings, 'Today:', todayReadings, 'Week:', weekReadings);
  
  // Debug the revenue calculation
  console.log('[READINGS-PAGE] Revenue calculation debug:');
  
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

  // Fix for stationName error by deriving stationName from pump and station data
  const enrichedAlerts = pendingAlerts.map(alert => {
    // Find the nozzle, pump, and station for this alert
    const nozzle = nozzles.find(n => n.id === alert.nozzleId);
    const pump = pumps.find(p => p.id === nozzle?.pumpId);
    const station = stations.find(s => s.id === pump?.stationId);
    return {
      ...alert,
      stationName: station?.name || 'Station',
    };
  });

  return (
    <div className="min-h-screen bg-gray-50/50 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-3 sm:p-4 lg:p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                <Gauge className={`${getResponsiveIconSize('base')} text-white`} />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className={`${getResponsiveTextSize('3xl')} font-bold text-gray-900 truncate`}>Pump Readings</h1>
                <p className={`${getResponsiveTextSize('base')} text-gray-600`}>Record and monitor fuel pump readings</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                onClick={() => navigate('/dashboard/readings/new')}
                className={`${getResponsiveTextSize('sm')} bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-sm w-full sm:w-auto`}
              >
                <Plus className={`${getResponsiveIconSize('xs')} mr-2`} />
                <span className="hidden xs:inline">New Reading</span>
                <span className="xs:hidden">Add Reading</span>
              </Button>
            </div>
          </div>
        </div>
      


      {/* Stats Cards - Dashboard Style */}
      <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-2 lg:grid-cols-4">
        {/* Total Readings Card */}
        <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-blue-200 hover:shadow-lg transition-all duration-200">
          <CardHeader className={`flex flex-row items-center justify-between space-y-0 ${getResponsivePadding('sm')}`}>
            <CardTitle className={`${getResponsiveTextSize('sm')} font-medium text-blue-700 truncate`}>
              <span className="hidden sm:inline">Total Readings</span>
              <span className="sm:hidden">Total</span>
            </CardTitle>
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
              <Gauge className={getResponsiveIconSize('sm')} />
            </div>
          </CardHeader>
          <CardContent className={getResponsivePadding('sm')}>
            <div className={`${getResponsiveTextSize('2xl')} font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent`}>
              {isMobile ? totalReadings.toLocaleString() : totalReadings.toLocaleString()}
            </div>
            <p className={`${getResponsiveTextSize('xs')} text-blue-600 mt-1`}>
              {isLoading ? 'Loading...' : `All time records`}
            </p>
          </CardContent>
        </Card>

        {/* Today's Readings */}
        <Card className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-green-200 hover:shadow-lg transition-all duration-200">
          <CardHeader className={`flex flex-row items-center justify-between space-y-0 ${getResponsivePadding('sm')}`}>
            <CardTitle className={`${getResponsiveTextSize('sm')} font-medium text-green-700 truncate`}>
              <span className="hidden sm:inline">Today's Readings</span>
              <span className="sm:hidden">Today</span>
            </CardTitle>
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-lg">
              <Activity className={getResponsiveIconSize('sm')} />
            </div>
          </CardHeader>
          <CardContent className={getResponsivePadding('sm')}>
            <div className={`${getResponsiveTextSize('2xl')} font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent`}>
              {todayReadings.toLocaleString()}
            </div>
            <p className={`${getResponsiveTextSize('xs')} text-green-600 mt-1`}>
              Recorded today
            </p>
          </CardContent>
        </Card>

        {/* Weekly Activity */}
        <Card className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-orange-200 hover:shadow-lg transition-all duration-200">
          <CardHeader className={`flex flex-row items-center justify-between space-y-0 ${getResponsivePadding('sm')}`}>
            <CardTitle className={`${getResponsiveTextSize('sm')} font-medium text-orange-700 truncate`}>
              <span className="hidden sm:inline">This Week</span>
              <span className="sm:hidden">Week</span>
            </CardTitle>
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-lg">
              <TrendingUp className={getResponsiveIconSize('sm')} />
            </div>
          </CardHeader>
          <CardContent className={getResponsivePadding('sm')}>
            <div className={`${getResponsiveTextSize('2xl')} font-bold bg-gradient-to-r from-orange-700 to-amber-700 bg-clip-text text-transparent`}>
              {weekReadings.toLocaleString()}
            </div>
            <p className={`${getResponsiveTextSize('xs')} text-orange-600 mt-1`}>
              Last 7 days
            </p>
          </CardContent>
        </Card>

        {/* Revenue Card */}
        <Card className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 border-purple-200 hover:shadow-lg transition-all duration-200">
          <CardHeader className={`flex flex-row items-center justify-between space-y-0 ${getResponsivePadding('sm')}`}>
            <CardTitle className={`${getResponsiveTextSize('sm')} font-medium text-purple-700 truncate`}>
              <span className="hidden sm:inline">Total Revenue</span>
              <span className="sm:hidden">Revenue</span>
            </CardTitle>
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-lg">
              <DollarSign className={getResponsiveIconSize('sm')} />
            </div>
          </CardHeader>
          <CardContent className={getResponsivePadding('sm')}>
            <div className={`${getResponsiveTextSize('2xl')} font-bold bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent`}>
              {(() => {
                console.log('[READINGS-PAGE] Total revenue before formatting:', totalRevenue);
                return isMobile ? formatCurrencyMobile(totalRevenue) : formatCurrency(totalRevenue, { maximumFractionDigits: 0 });
              })()}
            </div>
            <p className={`${getResponsiveTextSize('xs')} text-purple-600 mt-1`}>
              From all readings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Alerts */}
      {pendingAlertsCount > 0 && (
        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white">
                <AlertTriangle className="h-4 w-4" />
              </div>
              Pending Readings
            </CardTitle>
            <CardDescription className="text-orange-700">Nozzles missing readings in the last 24h</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {enrichedAlerts.map((alert) => (
                <li key={alert.id} className="flex items-center justify-between bg-white/70 rounded-lg p-3 border border-orange-100">
                  <span className="font-medium text-orange-800">
                    {alert.stationName} – Nozzle {alert.id}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="text-orange-700 border-orange-300 hover:bg-orange-100"
                    >
                      Acknowledge
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => dismissAlert(alert.id)}
                      className="text-orange-600 hover:text-orange-800"
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

      {/* Compact Filters */}
      <Card className="bg-white shadow-sm border">
        <CardContent className={`${getResponsivePadding('sm')} space-y-3`}>
          {isMobile ? (
            // Mobile: Stacked layout with compact design
            <div className="space-y-3">
              {/* Time Filter Pills */}
              <div className="flex gap-1">
                {(['all', 'today', 'week'] as const).map((timeFilter) => (
                  <Button
                    key={timeFilter}
                    variant={filter === timeFilter ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(timeFilter)}
                    className={cn(
                      "flex-1 text-xs py-2 px-3 transition-all duration-200",
                      filter === timeFilter
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                        : "hover:bg-gray-50"
                    )}
                  >
                    {timeFilter === 'all' ? 'All' : timeFilter === 'today' ? 'Today' : 'Week'}
                  </Button>
                ))}
              </div>

              {/* Pump Filter */}
              <Select value={selectedPumpId} onValueChange={setSelectedPumpId}>
                <SelectTrigger className="w-full text-sm">
                  <SelectValue placeholder="All Pumps" />
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
          ) : (
            // Desktop: Horizontal layout
            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-2">
                {(['all', 'today', 'week'] as const).map((timeFilter) => (
                  <Button
                    key={timeFilter}
                    variant={filter === timeFilter ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(timeFilter)}
                    className={cn(
                      "capitalize transition-all duration-200",
                      filter === timeFilter && "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    )}
                  >
                    {timeFilter === 'all' ? 'All Readings' : timeFilter === 'today' ? 'Today' : 'This Week'}
                  </Button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Pump:</span>
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
          )}
        </CardContent>
      </Card>

      {/* Latest Readings Cards */}
      <Card className="bg-white shadow-sm border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
              <Zap className="h-4 w-4" />
            </div>
            Latest Nozzle Readings
          </CardTitle>
          <CardDescription className="text-gray-600">
            Most recent reading from each nozzle
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <FuelLoader size="md" text="Loading readings..." />
              <span className="ml-2 text-gray-600">Loading readings...</span>
            </div>
          ) : error ? (
            <div className="text-center p-12 bg-red-50 rounded-lg border border-red-200">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error loading readings</h3>
              <p className="text-red-600">{error.message}</p>
            </div>
          ) : lastReadings.length === 0 ? (
            <div className="text-center p-12 bg-gray-50 rounded-lg border border-gray-200">
              <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No readings found</h3>
              <p className="text-gray-600 mb-6">
                Navigate through Stations → Pumps → Nozzles to record readings
              </p>
              <Button 
                onClick={() => navigate('/dashboard/stations')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
              >
                <Plus className="mr-2 h-4 w-4" />
                Go to Stations
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {lastReadings.map((reading) => (
                <ReadingCard
                  key={reading.id}
                  reading={reading}
                  onView={(id) => navigate(`/dashboard/readings/${id}`)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Historical Readings */}
      {otherReadings.length > 0 && (
        <Card className="bg-white shadow-sm border">
          <CardHeader className={getResponsivePadding('base')}>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-gray-500 to-slate-600 flex items-center justify-center text-white">
                <FileText className="h-4 w-4" />
              </div>
              <span className={getResponsiveTextSize('lg')}>Historical Readings</span>
            </CardTitle>
            <CardDescription className={`${getResponsiveTextSize('base')} text-gray-600`}>
              Complete history of all readings
            </CardDescription>
          </CardHeader>
          <CardContent className={getResponsivePadding('base')}>
            {isMobile ? (
              // Mobile: Card layout
              <div className="space-y-3">
                {otherReadings.map((reading) => (
                  <Card key={reading.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Gauge className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-sm text-gray-900 truncate">
                                {reading.stationName || 'Unknown Station'}
                              </h3>
                              <p className="text-xs text-gray-600">
                                {reading.pumpName || 'Unknown Pump'} • Nozzle #{reading.nozzleNumber || 'N/A'}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div>
                              <p className="text-xs text-gray-500">Fuel Type</p>
                              {reading.fuelType ? (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                                  {reading.fuelType}
                                </Badge>
                              ) : (
                                <span className="text-xs text-gray-400">N/A</span>
                              )}
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Reading</p>
                              <p className="font-mono text-sm font-semibold text-gray-900">
                                {reading.reading.toLocaleString()}L
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Amount</p>
                              <p className="font-mono text-sm font-bold text-green-700">
                                {reading.amount !== undefined && reading.amount !== null ? formatCurrencyMobile(reading.amount) :
                                 reading.volume !== undefined && reading.pricePerLitre !== undefined ?
                                 formatCurrencyMobile(reading.volume * reading.pricePerLitre) : 'N/A'}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Date</p>
                              <p className="text-xs text-gray-700">
                                {new Date(reading.recordedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate(`/dashboard/readings/${reading.id}`)}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 ml-2"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              // Desktop: Table layout
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="font-semibold text-gray-700">Station</TableHead>
                      <TableHead className="font-semibold text-gray-700">Pump</TableHead>
                      <TableHead className="font-semibold text-gray-700">Nozzle</TableHead>
                      <TableHead className="font-semibold text-gray-700">Fuel Type</TableHead>
                      <TableHead className="font-semibold text-gray-700">Reading</TableHead>
                      <TableHead className="font-semibold text-gray-700">Amount</TableHead>
                      <TableHead className="font-semibold text-gray-700">Date</TableHead>
                      <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {otherReadings.map((reading) => (
                      <TableRow key={reading.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="font-medium text-gray-900">{reading.stationName || 'N/A'}</TableCell>
                        <TableCell className="text-gray-700">{reading.pumpName || 'N/A'}</TableCell>
                        <TableCell className="text-gray-700">#{reading.nozzleNumber || 'N/A'}</TableCell>
                        <TableCell>
                          {reading.fuelType ? (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {reading.fuelType}
                            </Badge>
                          ) : 'N/A'}
                        </TableCell>
                        <TableCell className="font-mono text-gray-900">{reading.reading.toLocaleString()}</TableCell>
                        <TableCell className="font-mono text-green-700 font-semibold">
                          {reading.amount !== undefined && reading.amount !== null ? formatCurrency(reading.amount) :
                           reading.volume !== undefined && reading.pricePerLitre !== undefined ?
                           formatCurrency(reading.volume * reading.pricePerLitre) : 'N/A'}
                        </TableCell>
                        <TableCell className="text-gray-600">{formatDateTime(reading.recordedAt)}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => navigate(`/dashboard/readings/${reading.id}`)}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  );
}