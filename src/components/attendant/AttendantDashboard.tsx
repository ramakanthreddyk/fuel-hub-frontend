import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, DollarSign, Bell, ClipboardList, ArrowRight } from 'lucide-react';
import { useAttendantStations, useAttendantAlerts } from '@/hooks/api/useAttendant';
import { AttendantDashboardStats } from './AttendantDashboardStats';
import { AttendantAlerts } from './AttendantAlerts';
import { Link } from 'react-router-dom';

export function AttendantDashboard() {
  const [selectedStationId, setSelectedStationId] = useState<string>('');
  
  const { data: stations = [], isLoading: stationsLoading } = useAttendantStations();
  const { data: alerts = [] } = useAttendantAlerts(selectedStationId, true);

  // Set default station if not selected
  useEffect(() => {
    if (!selectedStationId && stations.length > 0 && !stationsLoading) {
      setSelectedStationId(stations[0].id);
    }
  }, [stations, stationsLoading, selectedStationId]);

  // Stats data
  const stats = {
    todayReadings: 0, // This would come from API in a real app
    petrolDispensed: 0,
    dieselDispensed: 0,
    alertsCount: alerts.length
  };

  if (stationsLoading) {
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
