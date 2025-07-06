
/**
 * @file pages/dashboard/CashReportsListPage.tsx
 * @description Page for viewing cash reports history
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStations } from '@/hooks/api/useStations';
import { useCashReports } from '@/hooks/useAttendant';
import { format } from 'date-fns';
import { ArrowLeft, RefreshCw, Loader2, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function CashReportsListPage() {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Fetch stations
  const { data: stations = [], isLoading: stationsLoading } = useStations();
  
  // Fetch cash reports - no parameters as per API spec
  const { 
    data: cashReports = [], 
    isLoading: reportsLoading,
    refetch
  } = useCashReports();
  
  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };
  
  const isLoading = stationsLoading || reportsLoading;
  
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
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">Cash Reports</h1>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Cash Reports</CardTitle>
          <CardDescription>
            View your recent cash reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          {cashReports.length === 0 ? (
            <div className="text-center py-6">
              <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No cash reports found</h3>
              <p className="text-muted-foreground mb-4">
                You haven't submitted any cash reports yet
              </p>
              <Button 
                onClick={() => navigate('/dashboard/cash-report/new')}
              >
                Submit New Cash Report
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cashReports.map((report) => {
                const station = stations.find(s => s.id === report.stationId);
                
                return (
                  <div key={report.id} className="p-4 border rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-medium">
                          {station?.name || report.stationName || 'Unknown Station'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(report.reportDate), 'MMMM d, yyyy')} - {report.shift || 'N/A'} shift
                        </p>
                      </div>
                      <Badge className={
                        report.status === 'approved' ? 'bg-green-100 text-green-800' :
                        report.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }>
                        {report.status || 'pending'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-2">
                      <div>
                        <span className="text-sm text-muted-foreground">Cash Amount:</span>
                        <span className="ml-2 font-medium">₹{report.cashAmount.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Attendant:</span>
                        <span className="ml-2 font-medium">{report.attendantName || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Submitted:</span>
                        <span className="ml-2 font-medium">
                          {report.createdAt ? format(new Date(report.createdAt), 'h:mm a') : 'N/A'}
                        </span>
                      </div>
                    </div>
                    
                    {report.notes && (
                      <div className="mb-2">
                        <span className="text-sm text-muted-foreground">Notes:</span>
                        <span className="ml-2 text-sm">{report.notes}</span>
                      </div>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigate(`/dashboard/cash-reports/${report.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
