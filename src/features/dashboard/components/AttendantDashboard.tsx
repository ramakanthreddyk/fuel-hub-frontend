/**
 * @file AttendantDashboard.tsx
 * @description Simple, mobile-first dashboard for attendants focused on daily tasks
 */
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Fuel, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  MapPin,
  Gauge,
  DollarSign,
  ArrowRight
} from 'lucide-react';

// Hooks
import { useAttendantStations } from '@/hooks/api/useAttendant';
import { useAttendantReadings } from '@/hooks/api/useAttendantReadings';

interface TaskCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  status: 'pending' | 'completed' | 'urgent';
  onClick: () => void;
  time?: string;
}

function TaskCard({ icon: Icon, title, description, status, onClick, time }: TaskCardProps) {
  const statusStyles = {
    pending: 'border-l-4 border-l-blue-500 bg-blue-50',
    completed: 'border-l-4 border-l-green-500 bg-green-50',
    urgent: 'border-l-4 border-l-red-500 bg-red-50'
  };

  const statusIcons = {
    pending: Clock,
    completed: CheckCircle,
    urgent: AlertTriangle
  };

  const StatusIcon = statusIcons[status];

  return (
    <Card className={`cursor-pointer transition-all duration-200 hover:shadow-md ${statusStyles[status]}`} onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Icon className="h-5 w-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-sm text-gray-900">{title}</h3>
                <StatusIcon className={`h-4 w-4 ${
                  status === 'completed' ? 'text-green-500' : 
                  status === 'urgent' ? 'text-red-500' : 'text-blue-500'
                }`} />
              </div>
              <p className="text-xs text-gray-600 mt-1">{description}</p>
              {time && <p className="text-xs text-gray-400 mt-1">{time}</p>}
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400" />
        </div>
      </CardContent>
    </Card>
  );
}

interface StationCardProps {
  station: any;
  onSelect: (stationId: string) => void;
}

function StationCard({ station, onSelect }: StationCardProps) {
  return (
    <Card className="cursor-pointer transition-all duration-200 hover:shadow-md" onClick={() => onSelect(station.id)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-900">{station.name}</h3>
              <p className="text-xs text-gray-600">{station.address}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant={station.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                  {station.status}
                </Badge>
                <span className="text-xs text-gray-500">{station.pumpCount || 0} pumps</span>
              </div>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400" />
        </div>
      </CardContent>
    </Card>
  );
}

export function AttendantDashboard() {
  const { user } = useAuth();
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  
  // Data hooks
  const { data: stations, isLoading: stationsLoading } = useAttendantStations();
  const { data: recentReadings } = useAttendantReadings();

  // Get today's date for display
  const today = new Date().toLocaleDateString('en-IN', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Mock tasks for demonstration
  const todaysTasks = [
    {
      icon: Fuel,
      title: 'Record Morning Readings',
      description: 'Take nozzle readings for all pumps',
      status: 'pending' as const,
      time: '9:00 AM',
      onClick: () => window.location.href = '/attendant/readings/new'
    },
    {
      icon: DollarSign,
      title: 'Submit Cash Report',
      description: 'Daily cash collection report',
      status: 'pending' as const,
      time: '6:00 PM',
      onClick: () => window.location.href = '/attendant/cash-report'
    },
    {
      icon: Gauge,
      title: 'Check Fuel Levels',
      description: 'Monitor tank levels and report low stock',
      status: 'completed' as const,
      time: '8:00 AM',
      onClick: () => window.location.href = '/attendant/inventory'
    }
  ];

  if (stationsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Hello, {user?.name?.split(' ')[0] || 'Attendant'}
            </h1>
            <p className="text-sm text-gray-600">{today}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {new Date().toLocaleTimeString('en-IN', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
            <p className="text-xs text-gray-500">Current Time</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Quick Action Button */}
        <Button 
          className="w-full h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
          onClick={() => window.location.href = '/attendant/readings/new'}
        >
          <Plus className="h-5 w-5 mr-2" />
          Record New Reading
        </Button>

        {/* Today's Tasks */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Tasks</h2>
          <div className="space-y-3">
            {todaysTasks.map((task, index) => (
              <TaskCard key={index} {...task} />
            ))}
          </div>
        </div>

        {/* My Stations */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">My Stations</h2>
          {stations && stations.length > 0 ? (
            <div className="space-y-3">
              {stations.map((station) => (
                <StationCard 
                  key={station.id} 
                  station={station} 
                  onSelect={setSelectedStation}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No stations assigned</p>
                <p className="text-sm text-gray-400 mt-1">Contact your manager to get station access</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <Card>
            <CardContent className="p-4">
              {recentReadings && recentReadings.length > 0 ? (
                <div className="space-y-3">
                  {recentReadings.slice(0, 3).map((reading, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium">Reading recorded</p>
                          <p className="text-xs text-gray-500">
                            Nozzle #{reading.nozzleNumber} - {reading.reading}L
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400">
                        {new Date(reading.recordedAt).toLocaleTimeString('en-IN', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No recent activity</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-blue-900">Need Help?</h3>
                <p className="text-xs text-blue-700">Contact your manager or check the help guide</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
