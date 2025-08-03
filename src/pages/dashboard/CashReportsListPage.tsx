import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCashReports } from '@/hooks/api/useCashReports';
import { ArrowLeft, Plus, DollarSign, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';

export default function CashReportsListPage() {
  const { data: reports = [], isLoading, error } = useCashReports();

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading cash reports...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load cash reports</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Cash Reports</h1>
        </div>
        <Link to="/dashboard/cash-reports/simple">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Submit New Report
          </Button>
        </Link>
      </div>

      {reports.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Cash Reports</h3>
            <p className="text-gray-600 mb-4">You haven't submitted any cash reports yet.</p>
            <Link to="/dashboard/cash-reports/simple">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Submit Your First Report
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {report.stationName || 'Station'} - {report.shift} Shift
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(report.date), 'MMM dd, yyyy')}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {report.userName || 'User'}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge 
                    variant={
                      report.status === 'approved' ? 'default' :
                      report.status === 'rejected' ? 'destructive' : 'secondary'
                    }
                  >
                    {report.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Cash</p>
                    <p className="font-semibold">₹{report.cashAmount.toFixed(2)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Card</p>
                    <p className="font-semibold">₹{report.cardAmount.toFixed(2)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">UPI</p>
                    <p className="font-semibold">₹{report.upiAmount.toFixed(2)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Credit</p>
                    <p className="font-semibold">₹{report.creditAmount.toFixed(2)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="font-bold text-lg">₹{report.totalAmount.toFixed(2)}</p>
                  </div>
                </div>

                {report.notes && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Notes:</p>
                    <p className="text-sm">{report.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}