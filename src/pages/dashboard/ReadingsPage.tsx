
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gauge, Clock, AlertTriangle, CheckCircle, Plus, FileText, Eye, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/page-header';

const mockReadings = [
  {
    id: '1',
    pumpId: 'P001',
    pumpName: 'Pump 1 - Petrol',
    stationName: 'Downtown Station',
    currentReading: 125834.50,
    previousReading: 125712.25,
    difference: 122.25,
    timestamp: '2024-01-15 14:30:00',
    status: 'completed',
    recordedBy: 'John Doe'
  },
  {
    id: '2',
    pumpId: 'P002', 
    pumpName: 'Pump 2 - Diesel',
    stationName: 'Downtown Station',
    currentReading: 98765.75,
    previousReading: 98642.50,
    difference: 123.25,
    timestamp: '2024-01-15 14:25:00',
    status: 'pending',
    recordedBy: 'Jane Smith'
  },
  {
    id: '3',
    pumpId: 'P003',
    pumpName: 'Pump 3 - Premium',
    stationName: 'Highway Station',
    currentReading: 67890.25,
    previousReading: 67811.75,
    difference: 78.50,
    timestamp: '2024-01-15 14:20:00',
    status: 'discrepancy',
    recordedBy: 'Mike Johnson'
  }
];

export default function ReadingsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'discrepancy'>('all');

  const filteredReadings = mockReadings.filter(reading => 
    filter === 'all' || reading.status === filter
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Completed
        </Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>;
      case 'discrepancy':
        return <Badge className="bg-red-100 text-red-800 border-red-200">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Discrepancy
        </Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pump Readings"
        description="Record and monitor fuel pump readings across all stations"
        actions={
          <Button onClick={() => navigate('/dashboard/readings/new')}>
            <Plus className="mr-2 h-4 w-4" />
            New Reading
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Readings</CardTitle>
            <Gauge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              Out of 26 pumps
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Discrepancies</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              Requires review
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">21</div>
            <p className="text-xs text-muted-foreground">
              Successfully recorded
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'pending', 'completed', 'discrepancy'] as const).map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(status)}
            className="capitalize"
          >
            {status === 'all' ? 'All Readings' : status}
          </Button>
        ))}
      </div>

      {/* Readings List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Readings
          </CardTitle>
          <CardDescription>
            Latest pump readings from all stations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReadings.map((reading) => (
              <div key={reading.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <h4 className="font-medium">{reading.pumpName}</h4>
                    {getStatusBadge(reading.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">{reading.stationName}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                    <span>Current: <span className="font-mono">{reading.currentReading.toFixed(2)}L</span></span>
                    <span>Previous: <span className="font-mono">{reading.previousReading.toFixed(2)}L</span></span>
                    <span className="font-medium text-green-600">
                      Difference: +{reading.difference.toFixed(2)}L
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Recorded by {reading.recordedBy} at {reading.timestamp}
                  </p>
                </div>
                <div className="flex gap-2 mt-3 md:mt-0">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
