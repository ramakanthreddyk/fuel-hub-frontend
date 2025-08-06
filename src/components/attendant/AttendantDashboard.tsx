import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, DollarSign, Bell, ClipboardList, ArrowRight } from 'lucide-react';
import { useAttendantStations, useAttendantAlerts } from '@/hooks/api/useAttendant';
import { AttendantDashboardStats } from './AttendantDashboardStats';
import { AttendantAlerts } from './AttendantAlerts';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { attendantApi } from '@/api/attendant';

export function AttendantDashboard() {
  const [selectedStationId, setSelectedStationId] = useState<string>('');
  
  const { data: stations = [], isLoading: stationsLoading } = useAttendantStations();
  const { data: alerts = [] } = useAttendantAlerts(selectedStationId, true);
  
  // Fetch today's summary
  const { data: todaysSummary, isLoading: summaryLoading } = useQuery({
    queryKey: ['attendant-todays-summary'],
    queryFn: attendantApi.getTodaysSummary,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Set default station if not selected
  useEffect(() => {
    if (!selectedStationId && stations.length > 0 && !stationsLoading) {
      setSelectedStationId(stations[0].id);
    }
  }, [stations, stationsLoading, selectedStationId]);

  // Stats data from API
  const stats = {
    todayReadings: todaysSummary?.summary?.reportsCount || 0,
    petrolDispensed: 0, // This would come from readings API
    dieselDispensed: 0, // This would come from readings API
    alertsCount: alerts.length,
    totalCash: todaysSummary?.summary?.totalCash || 0,
    totalCard: todaysSummary?.summary?.totalCard || 0,
    totalUpi: todaysSummary?.summary?.totalUpi || 0,
    totalCollected: todaysSummary?.summary?.totalCollected || 0
  };

  if (stationsLoading || summaryLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">
          Welcome to Attendant Portal
        </h1>
        <p className="text-muted-foreground">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      {/* Stats Grid */}
      <AttendantDashboardStats {...stats} />
      
      {/* Today's Summary */}
      {todaysSummary && (
        <Card>
          <CardHeader>
            <CardTitle>Today's Cash Collection Summary</CardTitle>
            <CardDescription>
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">₹{stats.totalCash.toFixed(2)}</div>
                <p className="text-sm text-muted-foreground">Cash</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">₹{stats.totalCard.toFixed(2)}</div>
                <p className="text-sm text-muted-foreground">Card</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">₹{stats.totalUpi.toFixed(2)}</div>
                <p className="text-sm text-muted-foreground">UPI</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">₹{stats.totalCollected.toFixed(2)}</div>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Record Readings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Record meter readings for pumps and nozzles
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/attendant/readings">
                Go to Readings <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2 h-4 w-4" />
              Cash Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Submit daily cash reports for your shift
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/attendant/cash-reports">
                Go to Cash Reports <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-4 w-4" />
              Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              View and acknowledge system alerts
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/attendant/alerts">
                View Alerts <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ClipboardList className="mr-2 h-4 w-4" />
              Inventory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Check current fuel inventory levels
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/attendant/inventory">
                View Inventory <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <AttendantAlerts stationId={selectedStationId} />
      )}
    </div>
  );
}
