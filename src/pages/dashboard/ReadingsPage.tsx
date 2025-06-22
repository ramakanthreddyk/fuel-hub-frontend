
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gauge, Clock, AlertTriangle, CheckCircle, Plus } from 'lucide-react';

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
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pump Readings</h1>
          <p className="text-muted-foreground">
            Record and monitor fuel pump readings across all stations
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Reading
        </Button>
      </div>

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

      {/* Readings List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Readings</CardTitle>
          <CardDescription>
            Latest pump readings from all stations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockReadings.map((reading) => (
              <div key={reading.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{reading.pumpName}</h4>
                    <Badge 
                      variant={
                        reading.status === 'completed' ? 'default' :
                        reading.status === 'pending' ? 'secondary' : 'destructive'
                      }
                    >
                      {reading.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{reading.stationName}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span>Current: {reading.currentReading.toFixed(2)}L</span>
                    <span>Previous: {reading.previousReading.toFixed(2)}L</span>
                    <span className="font-medium text-green-600">
                      +{reading.difference.toFixed(2)}L
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Recorded by {reading.recordedBy} at {reading.timestamp}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                  <Button variant="outline" size="sm">
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
