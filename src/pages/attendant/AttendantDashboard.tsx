/**
 * @file AttendantDashboard.tsx
 * @description SUPER SIMPLE attendant interface - Only what they need
 * 
 * ATTENDANT WORKFLOW:
 * 1. See today's readings (if any)
 * 2. Add new reading (big button)
 * 3. Report cash collected (big button)
 * 4. That's it!
 */
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Fuel, 
  Banknote, 
  Clock, 
  CheckCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { formatCurrency, formatVolume, formatDate } from '@/utils/formatters';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/api/client';
import { useToast } from '@/hooks/use-toast';

interface TodaysSummary {
  totalReadings: number;
  totalVolume: number;
  totalRevenue: number;
  lastReading?: {
    time: string;
    nozzleName: string;
    volume: number;
    amount: number;
  };
  cashReported: boolean;
  cashAmount?: number;
}

export default function AttendantDashboard() {
  const [summary, setSummary] = useState<TodaysSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get today's summary for attendant
  const fetchTodaysSummary = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/attendant/todays-summary');
      setSummary(response.data.data);
    } catch (error) {
      console.error('Error fetching today\'s summary:', error);
      toast({
        title: "Error",
        description: "Failed to load today's data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodaysSummary();
  }, []);

  const handleAddReading = () => {
    navigate('/attendant/readings');
  };

  const handleReportCash = () => {
    navigate('/attendant/cash-reports');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading today's data...</p>
        </div>
      </div>
    );
  }

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Good Day, {user?.name}!</h1>
        <p className="text-gray-600 mt-1">{today}</p>
      </div>

      {/* Today's Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <TrendingUp className="h-5 w-5" />
            Today's Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          {summary ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{summary.totalReadings}</div>
                <div className="text-sm text-gray-600">Readings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{formatVolume(summary.totalVolume)}</div>
                <div className="text-sm text-gray-600">Liters</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{formatCurrency(summary.totalRevenue)}</div>
                <div className="text-sm text-gray-600">Sales</div>
              </div>
              <div className="text-center">
                {summary.cashReported ? (
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      <CheckCircle className="h-6 w-6 mx-auto" />
                    </div>
                    <div className="text-sm text-green-600">Cash Reported</div>
                  </div>
                ) : (
                  <div>
                    <div className="text-2xl font-bold text-orange-600">
                      <Clock className="h-6 w-6 mx-auto" />
                    </div>
                    <div className="text-sm text-orange-600">Cash Pending</div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No data for today yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Last Reading */}
      {summary?.lastReading && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Last Reading
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{summary.lastReading.nozzleName}</p>
                <p className="text-sm text-gray-600">
                  {formatVolume(summary.lastReading.volume)} • {formatCurrency(summary.lastReading.amount)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  {new Date(summary.lastReading.time).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons - BIG and SIMPLE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Add Reading Button */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleAddReading}>
          <CardContent className="p-8 text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Add Reading</h3>
            <p className="text-gray-600 mb-4">Record fuel dispensed from nozzles</p>
            <Button size="lg" className="w-full">
              <Fuel className="h-5 w-5 mr-2" />
              Add New Reading
            </Button>
          </CardContent>
        </Card>

        {/* Report Cash Button */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleReportCash}>
          <CardContent className="p-8 text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Banknote className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Report Cash</h3>
            <p className="text-gray-600 mb-4">Report cash, card & UPI collected</p>
            <Button 
              size="lg" 
              className="w-full"
              variant={summary?.cashReported ? "outline" : "default"}
            >
              <Banknote className="h-5 w-5 mr-2" />
              {summary?.cashReported ? 'Update Cash Report' : 'Report Cash'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Status Indicators */}
      <div className="flex justify-center gap-4">
        <Badge variant={summary?.totalReadings ? "default" : "secondary"} className="px-4 py-2">
          {summary?.totalReadings ? (
            <>
              <CheckCircle className="h-4 w-4 mr-1" />
              {summary.totalReadings} Readings Added
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4 mr-1" />
              No Readings Yet
            </>
          )}
        </Badge>

        <Badge variant={summary?.cashReported ? "default" : "secondary"} className="px-4 py-2">
          {summary?.cashReported ? (
            <>
              <CheckCircle className="h-4 w-4 mr-1" />
              Cash Reported
            </>
          ) : (
            <>
              <Clock className="h-4 w-4 mr-1" />
              Cash Pending
            </>
          )}
        </Badge>
      </div>

      {/* Help Text */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <h4 className="font-medium mb-2">📝 Daily Tasks:</h4>
          <ol className="text-sm text-gray-600 space-y-1">
            <li>1. Add readings when customers fill fuel</li>
            <li>2. Report total cash collected at end of shift</li>
            <li>3. That's it! Your manager will handle the rest</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
