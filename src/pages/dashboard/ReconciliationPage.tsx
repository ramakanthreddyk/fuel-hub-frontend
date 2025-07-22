
/**
 * @file ReconciliationPage.tsx
 * @description Comprehensive reconciliation management page utilizing all backend features
 */
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, CheckCircle, AlertTriangle, Eye, Play, Loader2, TrendingUp, AlertCircle } from 'lucide-react';
import { useStations } from '@/hooks/api/useStations';
import { useReconciliationHistory, useCreateReconciliation, useDailyReadingsSummary } from '@/hooks/useReconciliation';
import { reconciliationApi } from '@/api/reconciliation';
import { useReconciliationDiffs, useDiscrepancySummary } from '@/hooks/api/useReconciliationDiff';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { ReconciliationRecord } from '@/api/api-contract';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ReconciliationPage() {
  const [selectedStation, setSelectedStation] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [processingStations, setProcessingStations] = useState<Set<string>>(new Set());
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [stationToReconcile, setStationToReconcile] = useState<{id: string, name: string} | null>(null);
  const [salesSummary, setSalesSummary] = useState<{
    readings: any[];
    totals: { volume: number; revenue: number; cashDeclared: number };
    variance: number;
    hasReadings: boolean;
  } | null>(null);
  const { toast } = useToast();

  const { data: stations = [] } = useStations();
  const { data: reconciliations = [], isLoading } = useReconciliationHistory(selectedStation !== 'all' ? selectedStation : undefined);
  const { data: discrepancySummary } = useDiscrepancySummary(
    selectedStation !== 'all' ? selectedStation : '',
    selectedDate
  );
  // Only fetch reconciliation diffs when a specific station is selected
  const { data: reconciliationDiffs = [] } = useReconciliationDiffs({
    stationId: selectedStation !== 'all' ? selectedStation : '',
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const createReconciliation = useCreateReconciliation();
  
  // Reset dialog state when component unmounts
  useEffect(() => {
    return () => {
      setConfirmDialogOpen(false);
      setSalesSummary(null);
      setStationToReconcile(null);
    };
  }, []);

  const getStatusBadge = (reconciliation: ReconciliationRecord) => {
    // Check for zero-value reconciliations which indicate missing data
    if (reconciliation.totalSales === 0 && reconciliation.finalized) {
      return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="w-3 h-3 mr-1" />Missing Data</Badge>;
    }
    
    const status = reconciliation.status || 'pending';
    
    if (status === 'matched') {
      return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Balanced</Badge>;
    } else if (status === 'variance') {
      return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="w-3 h-3 mr-1" />Discrepancy</Badge>;
    } else {
      return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" />Pending</Badge>;
    }
  };

  // Check if reconciliation exists for a station and date
  const checkExistingReconciliation = (stationId: string, date: string) => {
    console.log('Checking existing reconciliation for station:', stationId, 'date:', date);
    console.log('Available reconciliations:', reconciliations);
    
    const formattedDate = new Date(date).toISOString().split('T')[0];
    
    const existingRec = reconciliations.find(r => {
      const recDate = new Date(r.date).toISOString().split('T')[0];
      const match = r.stationId === stationId && recDate === formattedDate;
      console.log('Checking record:', r.id, 'station match:', r.stationId === stationId, 'date match:', recDate === formattedDate, 'finalized:', r.finalized);
      return match;
    });
    
    console.log('Found existing reconciliation:', existingRec);
    return existingRec;
  };

  // Function to show confirmation dialog with sales summary
  const showReconciliationConfirmation = async (station: {id: string, name: string}) => {
    console.log(`Showing confirmation dialog for station: ${station.name}`);
    
    // Show loading toast
    toast({
      title: "Loading Sales Data",
      description: `Retrieving sales data for ${station.name}...`,
    });
    
    try {
      // Check if reconciliation already exists and is finalized
      const existingReconciliation = checkExistingReconciliation(station.id, selectedDate);
      
      if (existingReconciliation) {
        toast({
          title: "Already Finalized",
          description: `Sales for ${station.name} on ${formatDate(selectedDate)} have already been finalized. You cannot finalize sales multiple times for the same day.`,
          variant: "destructive"
        });
        return;
      }

      // Prevent multiple clicks for the same station
      if (processingStations.has(station.id)) {
        toast({
          title: "Processing",
          description: "Sales finalization is already in progress for this station. Please wait.",
          variant: "default"
        });
        return;
      }

      // Get sales summary data
      console.log(`Fetching sales summary for station ${station.id} on ${selectedDate}`);
      const summary = await getDailySalesSummary(station.id, selectedDate);
      console.log('Sales summary:', summary);
      
      if (!summary || !summary.hasReadings) {
        toast({
          title: "No Sales Data",
          description: `No sales data found for ${station.name} on ${formatDate(selectedDate)}. Please ensure all nozzle readings are entered before finalizing.`,
          variant: "destructive"
        });
        return;
      }
      
      // Set the sales summary data
      setSalesSummary(summary);
      
      // Set the station to reconcile and open the confirmation dialog
      setStationToReconcile(station);
      console.log('Opening confirmation dialog');
      setConfirmDialogOpen(true);
      
    } catch (error: any) {
      console.error('Error in showReconciliationConfirmation:', error);
      toast({
        title: "Error",
        description: error.message || `Failed to retrieve sales data for ${station.name}. Please try again.`,
        variant: "destructive"
      });
    }
  };

  // Function to get daily readings summary for a station and date
  const getDailySalesSummary = async (stationId: string, date: string) => {
    try {
      if (!stationId) {
        console.error('Error: stationId is required for daily readings summary');
        toast({
          title: "Missing Station",
          description: "Please select a station to check sales data.",
          variant: "destructive"
        });
        return null;
      }
      
      if (!date) {
        console.error('Error: date is required for daily readings summary');
        toast({
          title: "Missing Date",
          description: "Please select a date to check sales data.",
          variant: "destructive"
        });
        return null;
      }
      
      console.log(`Fetching daily readings for station ${stationId} on ${date}`);
      const readings = await reconciliationApi.getDailyReadingsSummary(stationId, date);
      console.log('Readings received:', readings);
      
      if (!readings || readings.length === 0) {
        console.warn(`No readings found for station ${stationId} on ${date}`);
        return null;
      }
      
      // Calculate totals
      const totals = readings.reduce((acc, reading) => ({
        volume: acc.volume + (reading.totalVolume || reading.deltaVolume || 0),
        revenue: acc.revenue + (reading.saleValue || reading.revenue || 0),
        cashDeclared: acc.cashDeclared + (reading.cashDeclared || 0)
      }), { volume: 0, revenue: 0, cashDeclared: 0 });
      
      const variance = totals.revenue - totals.cashDeclared;
      
      return {
        readings,
        totals,
        variance,
        hasReadings: readings.length > 0
      };
    } catch (error) {
      console.error('Error getting daily sales summary:', error);
      toast({
        title: "Error Fetching Sales Data",
        description: "There was a problem retrieving sales data. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  };

  // Function to actually perform the sales finalization after confirmation
  const handleTriggerReconciliation = async (stationId: string, stationName: string, date: string = selectedDate) => {
    try {
      // Mark this station as processing
      setProcessingStations(prev => new Set(prev).add(stationId));
      
      // Check if reconciliation already exists
      const existingReconciliation = checkExistingReconciliation(stationId, date);
      if (existingReconciliation) {
        toast({
          title: "Already Finalized",
          description: `Sales for ${stationName} on ${formatDate(date)} have already been finalized. You cannot finalize sales multiple times for the same day.`,
          variant: "destructive"
        });
        return;
      }
      
      // Check if we have sales summary data
      let summary = salesSummary;
      if (!summary || !summary.hasReadings) {
        // Try to get the sales summary data if it's not already available
        summary = await getDailySalesSummary(stationId, date);
        
        if (!summary || !summary.hasReadings) {
          toast({
            title: "No Sales Data",
            description: `Cannot finalize as there are no sales records for ${stationName} on ${formatDate(date)}. Please ensure all nozzle readings are entered first.`,
            variant: "destructive"
          });
          return;
        }
      }
      
      // Verify that there are actual readings with non-zero values
      if (summary.totals.volume === 0 || summary.readings.length === 0) {
        toast({
          title: "Invalid Sales Data",
          description: `Cannot finalize with zero sales volume for ${stationName} on ${formatDate(date)}. Please ensure valid readings are entered.`,
          variant: "destructive"
        });
        return;
      }
      
      // Create the reconciliation record
      await createReconciliation.mutateAsync({ 
        stationId, 
        date,
        notes: `Sales finalization for ${date}`,
        managerConfirmation: true // Auto-confirm to simplify the process
      });

      toast({
        title: "Sales Finalized",
        description: `Daily sales for ${stationName} on ${formatDate(date)} have been successfully finalized.`,
      });
      
      // Close the dialog and clear the sales summary data
      setConfirmDialogOpen(false);
      setSalesSummary(null);
      setStationToReconcile(null);
      
    } catch (error: any) {
      console.error('Failed to finalize sales:', error);
      if (error.message?.includes('already finalized')) {
        toast({
          title: "Already Finalized",
          description: `Sales for ${stationName} on ${formatDate(date)} have already been finalized. You cannot finalize sales multiple times for the same day.`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Finalization Failed",
          description: error.message || "An error occurred while finalizing the daily sales.",
          variant: "destructive"
        });
      }
    } finally {
      // Remove this station from processing state
      setProcessingStations(prev => {
        const updated = new Set(prev);
        updated.delete(stationId);
        return updated;
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Confirmation Dialog */}
      <AlertDialog 
        open={confirmDialogOpen} 
        onOpenChange={(open) => {
          console.log('Dialog open state changed to:', open);
          setConfirmDialogOpen(open);
          if (!open) {
            // Reset state when dialog is closed
            setSalesSummary(null);
            setStationToReconcile(null);
          }
        }}
      >
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Finalize Daily Sales</AlertDialogTitle>
            <AlertDialogDescription>
              Review the sales data for <strong>{stationToReconcile?.name}</strong> on <strong>{formatDate(selectedDate)}</strong> before finalizing:
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {salesSummary && (
            <div className="my-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 p-4 rounded-md">
                  <h3 className="font-medium text-blue-800 mb-2">System Sales Data</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Total Volume:</span>
                      <span className="font-medium">{salesSummary.totals.volume.toFixed(2)}L</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Total Sales Value:</span>
                      <span className="font-medium">{formatCurrency(salesSummary.totals.revenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Number of Readings:</span>
                      <span className="font-medium">{salesSummary.readings.length}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-amber-50 p-4 rounded-md">
                  <h3 className="font-medium text-amber-800 mb-2">Reported Cash</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-amber-700">Cash Declared:</span>
                      <span className="font-medium">{formatCurrency(salesSummary.totals.cashDeclared)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-700">Discrepancy:</span>
                      <span className={`font-medium ${salesSummary.variance !== 0 ? (salesSummary.variance > 0 ? 'text-red-600' : 'text-green-600') : ''}`}>
                        {salesSummary.variance > 0 ? '+' : ''}{formatCurrency(salesSummary.variance)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-700">Status:</span>
                      <span className={`font-medium ${salesSummary.variance !== 0 ? (salesSummary.variance > 0 ? 'text-red-600' : 'text-green-600') : 'text-green-600'}`}>
                        {salesSummary.variance === 0 ? 'Balanced' : salesSummary.variance > 0 ? 'Shortfall' : 'Excess'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {salesSummary.variance !== 0 && (
                <div className={`p-3 rounded-md mb-4 ${salesSummary.variance > 0 ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                  <div className="flex items-start">
                    <AlertTriangle className={`h-5 w-5 mr-2 mt-0.5 ${salesSummary.variance > 0 ? 'text-red-500' : 'text-yellow-500'}`} />
                    <div>
                      <h4 className={`font-medium ${salesSummary.variance > 0 ? 'text-red-800' : 'text-yellow-800'}`}>
                        {salesSummary.variance > 0 ? 'Cash Shortfall Detected' : 'Cash Excess Detected'}
                      </h4>
                      <p className={`text-sm ${salesSummary.variance > 0 ? 'text-red-700' : 'text-yellow-700'}`}>
                        {salesSummary.variance > 0 
                          ? `The reported cash is ${formatCurrency(Math.abs(salesSummary.variance))} less than the system sales value.` 
                          : `The reported cash is ${formatCurrency(Math.abs(salesSummary.variance))} more than the system sales value.`
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                <strong>Important:</strong> Finalizing this data will:
                <ul className="list-disc pl-6 mt-1 text-sm">
                  <li>Lock in the sales records for {formatDate(selectedDate)}</li>
                  <li>Record any cash discrepancies for accounting purposes</li>
                  <li>Create a permanent record that cannot be modified</li>
                </ul>
              </div>
            </div>
          )}
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                console.log('Confirm button clicked');
                if (stationToReconcile) {
                  handleTriggerReconciliation(stationToReconcile.id, stationToReconcile.name);
                }
              }}
              className={salesSummary && salesSummary.variance > 0 ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              {salesSummary && salesSummary.variance !== 0 
                ? 'Finalize with Discrepancy' 
                : 'Finalize Daily Sales'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Daily Sales Finalization</h1>
          <p className="text-muted-foreground">Review and finalize daily sales data</p>
          <div className="mt-2 p-3 bg-blue-50 text-blue-800 rounded-md text-sm">
            <strong>What is Daily Sales Finalization?</strong> This process compares the cash reported by attendants with the actual sales data from the system and finalizes the day's records.
            
            <div className="grid md:grid-cols-2 gap-4 mt-2">
              <div>
                <strong className="block mb-1">Before finalizing:</strong>
                <ul className="list-disc pl-6">
                  <li>Ensure all nozzle readings are entered for the day</li>
                  <li>Verify all cash reports are submitted by attendants</li>
                  <li>Check the Daily Summary to preview sales data</li>
                </ul>
              </div>
              <div>
                <strong className="block mb-1">Important notes:</strong>
                <ul className="list-disc pl-6">
                  <li>Sales can only be finalized once per day per station</li>
                  <li>Each station must be finalized individually</li>
                  <li>Finalized records cannot be modified</li>
                  <li>Any discrepancies will be highlighted for review</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-4">
            <div>
              <Label htmlFor="date" className="text-xs mb-1 block">Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-40"
              />
            </div>
            <div>
              <Label htmlFor="station" className="text-xs mb-1 block">Station</Label>
              <Select value={selectedStation} onValueChange={setSelectedStation}>
                <SelectTrigger className="w-48" id="station">
                  <SelectValue placeholder="All Stations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stations</SelectItem>
                  {stations.map((station) => (
                    <SelectItem key={station.id} value={station.id}>
                      {station.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Discrepancy Summary Cards */}
      {discrepancySummary && selectedStation !== 'all' && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Total Discrepancies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{discrepancySummary.totalDiscrepancies}</div>
              <p className="text-xs text-muted-foreground">Active issues</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Over Reported</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(discrepancySummary.totalOverReported, { useLakhsCrores: true })}
              </div>
              <p className="text-xs text-muted-foreground">Excess cash</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Under Reported</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(discrepancySummary.totalUnderReported, { useLakhsCrores: true })}
              </div>
              <p className="text-xs text-muted-foreground">Missing cash</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Largest Issue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(discrepancySummary.largestDiscrepancy, { useLakhsCrores: true })}
              </div>
              <p className="text-xs text-muted-foreground">Single discrepancy</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="reconciliations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reconciliations">Finalized Sales</TabsTrigger>
          <TabsTrigger value="discrepancies">Discrepancies</TabsTrigger>
          <TabsTrigger value="quick-actions">Station Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="reconciliations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Sales Finalization History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Station</TableHead>
                      <TableHead>System Sales</TableHead>
                      <TableHead>Reported Cash</TableHead>
                      <TableHead>Discrepancy</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reconciliations.map((recon: ReconciliationRecord) => (
                      <TableRow key={recon.id} className={recon.totalSales === 0 && recon.finalized ? 'bg-red-50' : ''}>
                        <TableCell>{formatDate(recon.date)}</TableCell>
                        <TableCell>{recon.stationName}</TableCell>
                        <TableCell>
                          {recon.totalSales === 0 && recon.finalized ? (
                            <div className="flex items-center">
                              <span className="text-red-600 mr-1">{formatCurrency(recon.totalSales, { useLakhsCrores: true })}</span>
                              <AlertTriangle className="h-4 w-4 text-red-600" title="Zero value indicates missing data" />
                            </div>
                          ) : (
                            formatCurrency(recon.totalSales, { useLakhsCrores: true })
                          )}
                        </TableCell>
                        <TableCell>{formatCurrency(recon.expectedSales || 0, { useLakhsCrores: true })}</TableCell>
                        <TableCell className={recon.variance !== 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
                          {recon.variance > 0 ? '+' : ''}{formatCurrency(recon.variance || 0, { useLakhsCrores: true })}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(recon)}
                            {recon.finalized && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-800 text-xs">
                                Finalized
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/dashboard/reconciliation/${recon.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/dashboard/reconciliation/daily-summary?stationId=${recon.stationId}&date=${new Date(recon.date).toISOString().split('T')[0]}`}>
                                <TrendingUp className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {reconciliations.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No reconciliations found. Run your first reconciliation to get started.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discrepancies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Cash Discrepancies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Station</TableHead>
                    <TableHead>Reported Cash</TableHead>
                    <TableHead>Actual Cash</TableHead>
                    <TableHead>Difference</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reconciliationDiffs.map((diff) => (
                    <TableRow key={diff.id}>
                      <TableCell>{formatDate(diff.date)}</TableCell>
                      <TableCell>{diff.stationName}</TableCell>
                      <TableCell>{formatCurrency(diff.reportedCash, { useLakhsCrores: true })}</TableCell>
                      <TableCell>{formatCurrency(diff.actualCash, { useLakhsCrores: true })}</TableCell>
                      <TableCell className={diff.difference !== 0 ? (diff.difference > 0 ? 'text-green-600' : 'text-red-600') : ''}>
                        {diff.difference > 0 ? '+' : ''}{formatCurrency(diff.difference, { useLakhsCrores: true })}
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          diff.status === 'match' 
                            ? 'bg-green-100 text-green-800' 
                            : diff.status === 'over' 
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                        }>
                          {diff.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {selectedStation === 'all' ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Please select a specific station to view discrepancies.
                      </TableCell>
                    </TableRow>
                  ) : reconciliationDiffs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No discrepancies found for the selected station.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quick-actions" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stations.map((station) => (
              <Card key={station.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{station.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{station.address}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    {checkExistingReconciliation(station.id, selectedDate) ? (
                      <div className="w-full">
                        <div className="flex items-center justify-between bg-green-50 p-2 rounded-md mb-2">
                          <div className="flex items-center">
                            <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                            <span className="text-green-800 font-medium">Sales Finalized</span>
                          </div>
                          <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-200">
                            Completed
                          </Badge>
                        </div>
                        <Button 
                          variant="outline"
                          className="flex-1 w-full"
                          size="sm"
                          asChild
                        >
                          <Link to={`/dashboard/reconciliation/daily-summary?stationId=${station.id}&date=${selectedDate}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Sales Details
                          </Link>
                        </Button>
                      </div>
                    ) : processingStations.has(station.id) ? (
                      <Button 
                        variant="outline"
                        className="flex-1"
                        size="sm"
                        disabled
                      >
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Finalizing Sales...
                      </Button>
                    ) : (
                      <Button 
                        onClick={async (e) => {
                          e.preventDefault();
                          console.log('Finalize button clicked for station:', station.name);
                          
                          // First check if there are readings for this station and date
                          const summary = await getDailySalesSummary(station.id, selectedDate);
                          
                          if (!summary || !summary.hasReadings) {
                            toast({
                              title: "No Sales Data",
                              description: `Cannot finalize sales for ${station.name} as there are no readings for ${formatDate(selectedDate)}. Please ensure readings are entered first.`,
                              variant: "destructive"
                            });
                            return;
                          }
                          
                          // If readings exist, show the confirmation dialog
                          showReconciliationConfirmation({id: station.id, name: station.name});
                        }}
                        disabled={createReconciliation.isPending}
                        className="flex-1"
                        size="sm"
                        title="Finalize daily sales to compare reported cash with actual sales"
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Finalize Daily Sales
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1" 
                      onClick={() => {
                        window.location.href = `/dashboard/reconciliation/daily-summary?stationId=${station.id}&date=${selectedDate}`;
                      }}
                    >
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Daily Summary
                    </Button>
                  </div>
                  <div className="mt-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      onClick={async (e) => {
                        e.preventDefault();
                        console.log('Check Sales Data clicked for station:', station.name);
                        
                        // Show loading toast
                        toast({
                          title: "Checking Sales Data",
                          description: `Retrieving sales data for ${station.name}...`,
                        });
                        
                        try {
                          const summary = await getDailySalesSummary(station.id, selectedDate);
                          if (summary && summary.hasReadings) {
                            toast({
                              title: "Ready for Finalization",
                              description: `${station.name} has ${summary.readings.length} nozzle readings for ${formatDate(selectedDate)} with total sales of ${formatCurrency(summary.totals.revenue)}.`,
                            });
                          } else {
                            toast({
                              title: "Not Ready",
                              description: `No sales data found for ${station.name} on ${formatDate(selectedDate)}. Please ensure all nozzle readings are entered first.`,
                              variant: "destructive"
                            });
                          }
                        } catch (error) {
                          console.error('Error checking sales data:', error);
                          toast({
                            title: "Error",
                            description: `Failed to check sales data for ${station.name}. Please try again.`,
                            variant: "destructive"
                          });
                        }
                      }}
                    >
                      Check Sales Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
