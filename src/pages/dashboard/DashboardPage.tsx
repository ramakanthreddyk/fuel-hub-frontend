/**
 * @file DashboardPage.tsx
 * @description Dashboard page showing key metrics and stats
 */
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, TrendingUp, Users, Fuel, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useStations } from '@/hooks/api/useStations';
import { usePumps } from '@/hooks/api/usePumps';
import { useFuelPrices } from '@/hooks/api/useFuelPrices';
import { useReadings } from '@/hooks/api/useReadings';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { user } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Fetch data
  const { data: stations = [], isLoading: stationsLoading, refetch: refetchStations } = useStations();
  const { data: pumps = [], isLoading: pumpsLoading, refetch: refetchPumps } = usePumps();
  const { data: fuelPrices = [], isLoading: pricesLoading, refetch: refetchPrices } = useFuelPrices();
  const { data: readings = [], isLoading: readingsLoading, refetch: refetchReadings } = useReadings();
  
  // Calculate metrics
  const totalRevenue = readings.reduce((sum, reading) => sum + (reading.amount || 0), 0);
  const totalVolume = readings.reduce((sum, reading) => sum + (reading.volume || 0), 0);
  const activeStations = stations.filter(s => s.status === 'active').length;
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      refetchStations(),
      refetchPumps(),
      refetchPrices(),
      refetchReadings()
    ]);
    setIsRefreshing(false);
  };
  
  const isLoading = stationsLoading || pumpsLoading || pricesLoading || readingsLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {user?.name || 'User'}! Here's your business overview.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            {isRefreshing || isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Revenue</p>
                <p className="text-2xl font-bold text-blue-700">₹{totalRevenue.toFixed(2)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Volume</p>
                <p className="text-2xl font-bold text-green-700">{totalVolume.toFixed(2)}L</p>
              </div>
              <Fuel className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-purple-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Active Stations</p>
                <p className="text-2xl font-bold text-purple-700">{activeStations}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-orange-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Total Stations</p>
                <p className="text-2xl font-bold text-orange-700">{stations.length}</p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Welcome Card */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Welcome to FuelSync Hub! Start by setting up your first station and configuring your fuel management system.
          </p>
          <div className="flex gap-2">
            <Button asChild>
              <Link to="/dashboard/stations">Manage Stations</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/dashboard/fuel-prices">Set Fuel Prices</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}