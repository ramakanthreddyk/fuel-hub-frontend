
/**
 * @file pages/dashboard/AttendantDashboardPage.tsx
 * @description Dashboard page for attendants
 */
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStations } from '@/hooks/api/useStations';
import { useAttendantStations } from '@/hooks/api/useAttendant';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { readingsService } from '@/api/services/readingsService';
import { fuelPricesService } from '@/api/services/fuelPricesService';
import { format } from 'date-fns';
import { Loader2, FileText, Fuel, CreditCard, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AttendantDashboardPage() {
  const { user } = useAuth();
  const isAttendant = user?.role === 'attendant';
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedStationId, setSelectedStationId] = useState<string | undefined>();
  
  // Fetch stations using role appropriate endpoint
  const {
    data: stations = [],
    isLoading: stationsLoading,
  } = isAttendant ? useAttendantStations() : useStations();
  
  // Set default station if not selected
  if (!selectedStationId && stations.length > 0 && !stationsLoading) {
    setSelectedStationId(stations[0].id);
  }
  
  // Fetch readings for today (disabled for attendants)
  const {
    data: readings = [],
    isLoading: readingsLoading,
  } = useQuery({
    queryKey: ['readings'],
    queryFn: () => readingsService.getReadings(),
    enabled: !isAttendant,
  });

  // Fetch fuel prices (owners/managers only)
  const {
    data: fuelPrices = [],
    isLoading: pricesLoading,
  } = useQuery({
    queryKey: ['fuel-prices', selectedStationId],
    queryFn: () => fuelPricesService.getFuelPrices(selectedStationId),
    enabled: !isAttendant && !!selectedStationId,
  });
  
  const isLoading = stationsLoading || readingsLoading || pricesLoading;
  
  // Calculate today's readings summary with safe property access
  const readingsSummary = readings.reduce((acc, reading) => {
    // Use volume property if available, fallback to 0
    const volume = (reading as any).volume || 0;
    const fuelType = (reading as any).fuelType || 'unknown';
    
    if (!acc[fuelType]) {
      acc[fuelType] = { litres: 0, count: 0 };
    }
    acc[fuelType].litres += volume;
    acc[fuelType].count += 1;
    return acc;
  }, {} as Record<string, { litres: number, count: number }>);
  
  // Mock cash report status for now
  const hasCashReport = false;
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Attendant Dashboard</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            {format(new Date(selectedDate), 'MMMM d, yyyy')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/dashboard/readings/new">
              <FileText className="mr-2 h-4 w-4" />
              Record Reading
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/dashboard/cash-report/new">
              <DollarSign className="mr-2 h-4 w-4" />
              Submit Cash Report
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Readings</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{readings.length}</div>
            <p className="text-xs text-muted-foreground">
              Total readings recorded today
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Petrol Dispensed</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Number(readingsSummary.petrol?.litres ?? 0).toFixed(3)}L
            </div>
            <p className="text-xs text-muted-foreground">
              From {readingsSummary.petrol?.count || 0} readings
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Diesel Dispensed</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Number(readingsSummary.diesel?.litres ?? 0).toFixed(3)}L
            </div>
            <p className="text-xs text-muted-foreground">
              From {readingsSummary.diesel?.count || 0} readings
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Report</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hasCashReport ? 'Submitted' : 'Pending'}
            </div>
            <p className="text-xs text-muted-foreground">
              {hasCashReport ? 'Cash report for today submitted' : 'Submit end of day cash report'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="readings">
        <TabsList>
          <TabsTrigger value="readings">Today's Readings</TabsTrigger>
          <TabsTrigger value="cash">Cash & Credit</TabsTrigger>
        </TabsList>
        
        <TabsContent value="readings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Readings</CardTitle>
              <CardDescription>
                Readings recorded today
              </CardDescription>
            </CardHeader>
            <CardContent>
              {readings.length === 0 ? (
                <div className="text-center py-6">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No readings recorded today</h3>
                  <p className="text-muted-foreground mb-4">
                    Start recording readings to see them here
                  </p>
                  <Button asChild>
                    <Link to="/dashboard/readings/new">
                      Record Reading
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {readings.slice(0, 5).map((reading) => {
                    const volume = (reading as any).volume || 0;
                    const fuelType = (reading as any).fuelType || 'Unknown';
                    const nozzleNumber = (reading as any).nozzleNumber || 'N/A';
                    
                    return (
                      <div key={reading.id} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <div className="font-medium">
                            {fuelType} - {Number(volume).toFixed(3)}L
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Nozzle #{nozzleNumber}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {reading.paymentMethod}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(reading.recordedAt), 'h:mm a')}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {readings.length > 5 && (
                    <Button variant="outline" asChild className="w-full">
                      <Link to="/dashboard/readings">
                        View All Readings
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cash" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cash & Credit Summary</CardTitle>
              <CardDescription>
                End of day cash and credit breakdown
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No cash report submitted</h3>
                <p className="text-muted-foreground mb-4">
                  Submit your end of day cash report
                </p>
                <Button asChild>
                  <Link to="/dashboard/cash-report/new">
                    Submit Cash Report
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
