/**
 * @file ImprovedReconciliationPage.tsx
 * @description IMPROVED Daily Reconciliation - Simple "System vs Reality" comparison
 * 
 * FEATURES:
 * - Clear side-by-side comparison of system vs user data
 * - Support for backdated day closures
 * - Color-coded differences (Green/Yellow/Red)
 * - One-click day closure
 * - Analytics integration
 */
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calculator, 
  Banknote, 
  CreditCard, 
  Smartphone, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  TrendingUp,
  Clock,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { FuelLoader } from '@/components/ui/FuelLoader';
import { useStations } from '@/hooks/api/useStations';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/api/client';
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

// Interfaces for improved reconciliation
interface ReconciliationSummary {
  date: string;
  stationId: string;
  stationName: string;
  systemCalculated: {
    totalRevenue: number;
    cashSales: number;
    cardSales: number;
    upiSales: number;
    creditSales: number;
    totalVolume: number;
    fuelBreakdown: {
      petrol: { volume: number; revenue: number };
      diesel: { volume: number; revenue: number };
      cng?: { volume: number; revenue: number };
      lpg?: { volume: number; revenue: number };
    };
  };
  userEntered: {
    cashCollected: number;
    cardCollected: number;
    upiCollected: number;
    creditGiven?: number;
    totalCollected: number;
  };
  differences: {
    cashDifference: number;
    cardDifference: number;
    upiDifference: number;
    creditDifference?: number;
    totalDifference: number;
  };
  isReconciled: boolean;
  reconciledBy?: string;
  reconciledAt?: Date;
  canCloseBackdated?: boolean;
}

interface ReconciliationDashboard {
  today: string;
  stations: Array<{
    id: string;
    name: string;
    hasData: boolean;
    isReconciled: boolean;
    totalDifference: number;
    systemTotal: number;
    userTotal: number;
    canCloseBackdated?: boolean;
    error?: string;
  }>;
  summary: {
    totalStations: number;
    reconciledToday: number;
    pendingReconciliation: number;
    totalDifferences: number;
  };
}

export default function ImprovedReconciliationPage() {
  const [selectedStation, setSelectedStation] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [reconciliationSummary, setReconciliationSummary] = useState<ReconciliationSummary | null>(null);
  const [dashboard, setDashboard] = useState<ReconciliationDashboard | null>(null);
  const [loading, setLoading] = useState(false);
  const [closingDay, setClosingDay] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const { data: stations = [] } = useStations();

  // API functions for improved reconciliation
  const fetchReconciliationSummary = async (stationId: string, date: string) => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/reconciliation/summary?stationId=${stationId}&date=${date}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching reconciliation summary:', error);
      toast({
        title: "Error",
        description: "Failed to load reconciliation data",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchReconciliationDashboard = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/reconciliation/dashboard');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching reconciliation dashboard:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const closeDayReconciliation = async (stationId: string, date: string, notes?: string) => {
    try {
      setClosingDay(true);
      const response = await apiClient.post('/reconciliation/close-day', {
        stationId,
        date,
        notes
      });

      toast({
        title: "Success",
        description: response.data.message || "Day closed successfully"
      });

      return response.data.data.summary;
    } catch (error: any) {
      console.error('Error closing day:', error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to close day";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw error;
    } finally {
      setClosingDay(false);
    }
  };

  // Load data when component mounts or date changes
  useEffect(() => {
    if (selectedDate) {
      fetchReconciliationDashboard().then(setDashboard);
    }
  }, [selectedDate]);

  // Load specific station summary when station is selected
  useEffect(() => {
    if (selectedStation && selectedDate) {
      fetchReconciliationSummary(selectedStation, selectedDate).then(setReconciliationSummary);
    } else {
      setReconciliationSummary(null);
    }
  }, [selectedStation, selectedDate]);

  // Helper functions for UI
  const getDifferenceColor = (amount: number) => {
    if (Math.abs(amount) < 1) return 'text-green-600';
    if (Math.abs(amount) < 100) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDifferenceIcon = (amount: number) => {
    if (Math.abs(amount) < 1) return <CheckCircle className="h-4 w-4 text-green-600" />;
    return <AlertCircle className="h-4 w-4 text-yellow-600" />;
  };

  const handleCloseDay = () => {
    setConfirmDialogOpen(true);
  };

  const confirmCloseDay = async () => {
    if (!reconciliationSummary) return;
    
    try {
      const updatedSummary = await closeDayReconciliation(
        reconciliationSummary.stationId,
        reconciliationSummary.date,
        notes
      );
      
      setReconciliationSummary(updatedSummary);
      setConfirmDialogOpen(false);
      setNotes('');
      
      // Refresh dashboard
      const updatedDashboard = await fetchReconciliationDashboard();
      setDashboard(updatedDashboard);
    } catch (error) {
      // Error already handled in closeDayReconciliation
    }
  };

  if (loading && !dashboard && !reconciliationSummary) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FuelLoader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Daily Reconciliation</h1>
          <p className="text-muted-foreground">
            Compare system calculations with actual cash collected
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            if (selectedStation) {
              fetchReconciliationSummary(selectedStation, selectedDate).then(setReconciliationSummary);
            }
            fetchReconciliationDashboard().then(setDashboard);
          }}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Date and Station Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Select Date & Station
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="station">Station</Label>
            <Select value={selectedStation} onValueChange={setSelectedStation}>
              <SelectTrigger>
                <SelectValue placeholder="Select a station" />
              </SelectTrigger>
              <SelectContent>
                {stations.map((station) => (
                  <SelectItem key={station.id} value={station.id}>
                    {station.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Overview */}
      {dashboard && !selectedStation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Today's Overview - {formatDate(dashboard.today)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{dashboard.summary.totalStations}</div>
                <div className="text-sm text-muted-foreground">Total Stations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{dashboard.summary.reconciledToday}</div>
                <div className="text-sm text-muted-foreground">Reconciled Today</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{dashboard.summary.pendingReconciliation}</div>
                <div className="text-sm text-muted-foreground">Pending Review</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{formatCurrency(dashboard.summary.totalDifferences)}</div>
                <div className="text-sm text-muted-foreground">Total Differences</div>
              </div>
            </div>

            <div className="space-y-3">
              {dashboard.stations.map((station) => (
                <div
                  key={station.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedStation(station.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="font-medium">{station.name}</div>
                    {station.isReconciled ? (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Closed
                      </Badge>
                    ) : station.hasData ? (
                      <Badge variant="outline" className="text-orange-600 border-orange-600">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    ) : (
                      <Badge variant="secondary">No Data</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div>System: {formatCurrency(station.systemTotal)}</div>
                    <div>Collected: {formatCurrency(station.userTotal)}</div>
                    <div className={getDifferenceColor(station.totalDifference)}>
                      Diff: {station.totalDifference >= 0 ? '+' : ''}{formatCurrency(station.totalDifference)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Reconciliation Summary */}
      {reconciliationSummary && (
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Daily Review - {reconciliationSummary.stationName}
              </CardTitle>
              {reconciliationSummary.isReconciled ? (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Day Closed
                </Badge>
              ) : (
                <Badge variant="outline">
                  Pending Review
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Date: {formatDate(reconciliationSummary.date)} • Compare system calculations with actual cash collected
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* System vs User Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* System Calculated */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-blue-700 flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  System Calculated
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      <Banknote className="h-3 w-3" />
                      Cash Sales:
                    </span>
                    <span className="font-mono">{formatCurrency(reconciliationSummary.systemCalculated.cashSales)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      <CreditCard className="h-3 w-3" />
                      Card Sales:
                    </span>
                    <span className="font-mono">{formatCurrency(reconciliationSummary.systemCalculated.cardSales)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      <Smartphone className="h-3 w-3" />
                      UPI Sales:
                    </span>
                    <span className="font-mono">{formatCurrency(reconciliationSummary.systemCalculated.upiSales)}</span>
                  </div>
                  <Separator />
                  {reconciliationSummary.systemCalculated.creditSales > 0 && (
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1">
                        <CreditCard className="h-3 w-3" />
                        Credit Sales:
                      </span>
                      <span className="font-mono">{formatCurrency(reconciliationSummary.systemCalculated.creditSales)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total Revenue:</span>
                    <span className="font-mono">
                      {formatCurrency(reconciliationSummary.systemCalculated.totalRevenue)}
                    </span>
                  </div>
                </div>
              </div>

              {/* User Entered */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-green-700 flex items-center gap-2">
                  <Banknote className="h-4 w-4" />
                  Cash Collected
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      <Banknote className="h-3 w-3" />
                      Cash:
                    </span>
                    <span className="font-mono">{formatCurrency(reconciliationSummary.userEntered.cashCollected)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      <CreditCard className="h-3 w-3" />
                      Card:
                    </span>
                    <span className="font-mono">{formatCurrency(reconciliationSummary.userEntered.cardCollected)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      <Smartphone className="h-3 w-3" />
                      UPI:
                    </span>
                    <span className="font-mono">{formatCurrency(reconciliationSummary.userEntered.upiCollected)}</span>
                  </div>
                  {(reconciliationSummary.userEntered.creditGiven || 0) > 0 && (
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1">
                        <CreditCard className="h-3 w-3" />
                        Credit Given:
                      </span>
                      <span className="font-mono">{formatCurrency(reconciliationSummary.userEntered.creditGiven || 0)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total Collected:</span>
                    <span className="font-mono">{formatCurrency(reconciliationSummary.userEntered.totalCollected)}</span>
                  </div>
                </div>
              </div>

              {/* Differences */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-orange-700 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Differences
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      {getDifferenceIcon(reconciliationSummary.differences.cashDifference)}
                      Cash:
                    </span>
                    <span className={`font-mono ${getDifferenceColor(reconciliationSummary.differences.cashDifference)}`}>
                      {reconciliationSummary.differences.cashDifference >= 0 ? '+' : ''}{formatCurrency(reconciliationSummary.differences.cashDifference)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      {getDifferenceIcon(reconciliationSummary.differences.cardDifference)}
                      Card:
                    </span>
                    <span className={`font-mono ${getDifferenceColor(reconciliationSummary.differences.cardDifference)}`}>
                      {reconciliationSummary.differences.cardDifference >= 0 ? '+' : ''}{formatCurrency(reconciliationSummary.differences.cardDifference)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      {getDifferenceIcon(reconciliationSummary.differences.upiDifference)}
                      UPI:
                    </span>
                    <span className={`font-mono ${getDifferenceColor(reconciliationSummary.differences.upiDifference)}`}>
                      {reconciliationSummary.differences.upiDifference >= 0 ? '+' : ''}{formatCurrency(reconciliationSummary.differences.upiDifference)}
                    </span>
                  </div>
                  {reconciliationSummary.differences.creditDifference !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1">
                        {getDifferenceIcon(reconciliationSummary.differences.creditDifference)}
                        Credit:
                      </span>
                      <span className={`font-mono ${getDifferenceColor(reconciliationSummary.differences.creditDifference)}`}>
                        {reconciliationSummary.differences.creditDifference >= 0 ? '+' : ''}{formatCurrency(reconciliationSummary.differences.creditDifference)}
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between items-center font-semibold">
                    <span className="flex items-center gap-1">
                      {getDifferenceIcon(reconciliationSummary.differences.totalDifference)}
                      Total:
                    </span>
                    <span className={`font-mono ${getDifferenceColor(reconciliationSummary.differences.totalDifference)}`}>
                      {reconciliationSummary.differences.totalDifference >= 0 ? '+' : ''}{formatCurrency(reconciliationSummary.differences.totalDifference)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Explanation */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-sm text-blue-800 mb-2">How to Read This:</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• <strong>System Calculated:</strong> Sales amounts from nozzle readings and fuel prices (includes credit sales)</li>
                <li>• <strong>Cash Collected:</strong> Actual amounts reported by attendants (includes credit given)</li>
                <li>• <strong>Credit:</strong> Fuel given on credit to customers - included in total reconciliation</li>
                <li>• <strong>Differences:</strong> Collected - System (positive = excess, negative = shortage)</li>
                <li>• <strong>Green:</strong> Perfect match (±₹1), <strong>Yellow:</strong> Small difference (±₹100), <strong>Red:</strong> Large difference</li>
              </ul>
            </div>

            {/* Backdated Warning */}
            {reconciliationSummary.canCloseBackdated === false && !reconciliationSummary.isReconciled && (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-semibold">Backdated Closure Not Allowed</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  This date is more than 7 days old. Backdated closures are only allowed within 7 days.
                </p>
              </div>
            )}

            {/* Action Button */}
            {!reconciliationSummary.isReconciled && (reconciliationSummary.canCloseBackdated !== false) && (
              <div className="flex justify-end">
                <Button
                  onClick={handleCloseDay}
                  disabled={closingDay}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {closingDay ? 'Closing Day...' : 'Accept Differences & Close Day'}
                </Button>
              </div>
            )}

            {/* Already Closed Info */}
            {reconciliationSummary.isReconciled && (
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-semibold">Day Already Closed</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Closed by {reconciliationSummary.reconciledBy} on {reconciliationSummary.reconciledAt ? formatDate(reconciliationSummary.reconciledAt.toString()) : 'Unknown'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Close Day Reconciliation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to close the day for {reconciliationSummary?.stationName} on {reconciliationSummary?.date}?
              {reconciliationSummary && Math.abs(reconciliationSummary.differences.totalDifference) > 0 && (
                <div className="mt-2 p-2 bg-yellow-50 rounded text-yellow-800">
                  <strong>Total Difference: {formatCurrency(reconciliationSummary.differences.totalDifference)}</strong>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about the differences..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCloseDay} disabled={closingDay}>
              {closingDay ? 'Closing...' : 'Close Day'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
