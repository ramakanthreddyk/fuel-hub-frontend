
/**
 * @file AttendancePage.tsx
 * @description Page for managing staff attendance and shifts
 */
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/page-header';
import { useQuery } from '@tanstack/react-query';
import { attendantApi } from '@/api/attendant';
import { formatDateTime, formatDate } from '@/utils/formatters';

export default function AttendancePage() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Fetch attendance data
  const { data: attendance = [], isLoading } = useQuery({
    queryKey: ['attendance', selectedDate],
    queryFn: () => attendantApi.getAttendance(selectedDate),
    retry: 1,
  });

  // Fetch shifts data
  const { data: shifts = [] } = useQuery({
    queryKey: ['shifts', selectedDate],
    queryFn: () => attendantApi.getShifts(selectedDate),
    retry: 1,
  });

  const presentCount = attendance.filter(a => a.status === 'present').length;
  const absentCount = attendance.filter(a => a.status === 'absent').length;
  const lateCount = attendance.filter(a => a.status === 'late').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Present
        </Badge>;
      case 'absent':
        return <Badge className="bg-red-100 text-red-800 border-red-200">
          <AlertCircle className="w-3 h-3 mr-1" />
          Absent
        </Badge>;
      case 'late':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
          <Clock className="w-3 h-3 mr-1" />
          Late
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance Management"
        description="Track staff attendance and manage shifts"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/dashboard/attendance/shifts')}>
              <Calendar className="mr-2 h-4 w-4" />
              Manage Shifts
            </Button>
            <Button onClick={() => navigate('/dashboard/attendance/mark')}>
              <Plus className="mr-2 h-4 w-4" />
              Mark Attendance
            </Button>
          </div>
        }
      />

      {/* Date Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Date</CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border rounded-md"
          />
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendance.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{presentCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lateCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{absentCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance List */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance for {formatDate(selectedDate)}</CardTitle>
          <CardDescription>Staff attendance status</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading attendance data...</div>
          ) : attendance.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No attendance records</h3>
              <p className="text-muted-foreground mb-4">
                No attendance data found for {formatDate(selectedDate)}
              </p>
              <Button onClick={() => navigate('/dashboard/attendance/mark')}>
                <Plus className="mr-2 h-4 w-4" />
                Mark Attendance
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {attendance.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{record.employeeName}</h4>
                    <p className="text-sm text-muted-foreground">{record.position}</p>
                    <p className="text-xs text-muted-foreground">
                      {record.checkIn ? `Check-in: ${formatDateTime(record.checkIn)}` : 'Not checked in'}
                      {record.checkOut && ` | Check-out: ${formatDateTime(record.checkOut)}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(record.status)}
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shifts Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Shift Schedule</CardTitle>
          <CardDescription>Active shifts for {formatDate(selectedDate)}</CardDescription>
        </CardHeader>
        <CardContent>
          {shifts.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No shifts scheduled</h3>
              <p className="text-muted-foreground mb-4">
                No shifts found for {formatDate(selectedDate)}
              </p>
              <Button onClick={() => navigate('/dashboard/attendance/shifts')}>
                <Plus className="mr-2 h-4 w-4" />
                Schedule Shifts
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {shifts.map((shift) => (
                <div key={shift.id} className="p-4 border rounded-lg">
                  <h4 className="font-medium">{shift.shiftName}</h4>
                  <p className="text-sm text-muted-foreground">
                    {shift.startTime} - {shift.endTime}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {shift.assignedCount || 0} staff assigned
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
