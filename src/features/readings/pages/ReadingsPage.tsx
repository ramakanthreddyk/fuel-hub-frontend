
/**
 * @file ReadingsPage.tsx
 * @description Page component for viewing and managing readings
 * @see docs/API_INTEGRATION_GUIDE.md - API integration patterns
 * @see docs/journeys/MANAGER.md - Manager journey for recording readings
 */
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gauge, Plus, FileText, TrendingUp, Activity } from 'lucide-react';
import { FuelLoader } from '@/components/ui/FuelLoader';
import { useNavigate } from 'react-router-dom';
import { useReadings } from '@/hooks/api/useReadings';
import { usePumps } from '@/hooks/api/usePumps';
import { formatDateTime, formatCurrency, formatVolume } from '@/utils/formatters';
import { useMobileFormatters, getResponsiveTextSize, getResponsiveIconSize, getResponsivePadding } from '@/utils/mobileFormatters';
import type { Reading } from '@/shared/types/reading';

export default function ReadingsPage() {
  const navigate = useNavigate();
  const { formatCurrency: formatCurrencyMobile, isMobile } = useMobileFormatters();
  
  const { data: readings = [], isLoading } = useReadings();
  const { data: pumps = [] } = usePumps();

  // Type assertion for readings array
  const typedReadings = (readings || []) as Reading[];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <FuelLoader size="lg" text="Loading readings..." />
      </div>
    );
  }

  const stats = {
    totalReadings: typedReadings.length,
    todayReadings: typedReadings.filter(r => {
      const recordedDate = r.recordedAt || r.createdAt;
      return recordedDate && new Date(recordedDate).toDateString() === new Date().toDateString();
    }).length,
    totalVolume: typedReadings.reduce((sum, r) => sum + (r.reading || 0), 0),
    revenue: typedReadings.reduce((sum, r) => sum + (r.totalAmount || 0), 0),
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-3 sm:p-4 lg:p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-sm">
                <Gauge className={`${getResponsiveIconSize('base')} text-white`} />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className={`${getResponsiveTextSize('3xl')} font-bold text-gray-900 truncate`}>Readings Management</h1>
                <p className={`${getResponsiveTextSize('base')} text-gray-600`}>Monitor fuel readings and transactions</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button 
                onClick={() => navigate('/dashboard/readings/new')} 
                className={`${getResponsiveTextSize('sm')} w-full sm:w-auto`}
              >
                <Plus className={`${getResponsiveIconSize('xs')} mr-2`} />
                Record Reading
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Readings</p>
                  <p className="text-2xl font-bold">{stats.totalReadings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Activity className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Today's Readings</p>
                  <p className="text-2xl font-bold">{stats.todayReadings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Gauge className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Volume</p>
                  <p className="text-2xl font-bold">{formatVolume(stats.totalVolume)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.revenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Readings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              Recent Readings
            </CardTitle>
            <CardDescription>Latest fuel readings recorded</CardDescription>
          </CardHeader>
          <CardContent>
            {typedReadings.length === 0 ? (
              <div className="text-center py-8">
                <Gauge className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">No readings yet</h3>
                <p className="text-muted-foreground mb-4">Start recording readings to track fuel dispensing</p>
                <Button onClick={() => navigate('/dashboard/readings/new')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Record First Reading
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {typedReadings.slice(0, 10).map((reading) => (
                  <div key={reading.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <span className="font-medium">Nozzle #{reading.nozzleNumber || 'N/A'}</span>
                        <span className="text-sm text-muted-foreground">
                          {reading.fuelType} - {formatVolume(reading.reading || 0)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(reading.totalAmount || 0)}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDateTime(reading.recordedAt || reading.createdAt)}
                        </p>
                      </div>
                      <Badge variant="default">
                        Recorded
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
