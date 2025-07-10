
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, DollarSign, Plus } from 'lucide-react';
import { useAttendantStations, useAttendantAlerts } from '@/hooks/api/useAttendant';
import { AttendantDashboardStats } from './AttendantDashboardStats';
import { AttendantReadingForm } from './AttendantReadingForm';
import { AttendantAlerts } from './AttendantAlerts';
import { AttendantCashReport } from './AttendantCashReport';

export function AttendantDashboard() {
  const [selectedStationId, setSelectedStationId] = useState<string>('');
  const [refreshKey, setRefreshKey] = useState(0);
  
  const { data: stations = [], isLoading: stationsLoading } = useAttendantStations();
  const { data: alerts = [] } = useAttendantAlerts(selectedStationId, true);

  // Set default station if not selected
  React.useEffect(() => {
    if (!selectedStationId && stations.length > 0 && !stationsLoading) {
      setSelectedStationId(stations[0].id);
    }
  }, [stations, stationsLoading, selectedStationId]);

  const handleReadingSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Mock data for stats - in real app, this would come from API
  const mockStats = {
    todayReadings: 12,
    petrolDispensed: 145.750,
    dieselDispensed: 89.250,
    alertsCount: alerts.length
  };

  if (stationsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Attendant Dashboard
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              {format(new Date(), 'MMMM d, yyyy')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <FileText className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Record Reading</span>
              <span className="sm:hidden">Reading</span>
            </Button>
            <Button size="sm" className="w-full sm:w-auto">
              <DollarSign className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Cash Report</span>
              <span className="sm:hidden">Report</span>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <AttendantDashboardStats {...mockStats} />

        {/* Alerts Section */}
        {alerts.length > 0 && (
          <AttendantAlerts stationId={selectedStationId} />
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="readings" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-3">
            <TabsTrigger value="readings" className="text-xs sm:text-sm">
              <FileText className="mr-2 h-4 w-4 hidden sm:inline" />
              Readings
            </TabsTrigger>
            <TabsTrigger value="cash" className="text-xs sm:text-sm">
              <DollarSign className="mr-2 h-4 w-4 hidden sm:inline" />
              Cash Report
            </TabsTrigger>
            <TabsTrigger value="alerts" className="text-xs sm:text-sm lg:inline hidden">
              Alerts ({alerts.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="readings" className="space-y-4">
            <div className="grid gap-6 lg:grid-cols-2">
              <AttendantReadingForm onSuccess={handleReadingSuccess} />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Recent readings will appear here</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="cash" className="space-y-4">
            <AttendantCashReport stationId={selectedStationId} />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <AttendantAlerts stationId={selectedStationId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
