import React from 'react';
import { useStationComparison } from '@/hooks/useAnalytics';
import { StationComparisonChart } from './StationComparisonChart';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface StationComparisonChartContainerProps {
  stationIds: string[];
  period?: string;
}

export function StationComparisonChartContainer({ 
  stationIds,
  period = 'month'
}: StationComparisonChartContainerProps) {
  const { data, isLoading, error } = useStationComparison({ 
    stationIds, 
    period 
  });

  if (isLoading) {
    return <Skeleton className="w-full h-[400px]" />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load station comparison data. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  // Ensure data is an array to prevent map errors
  const safeData = data || [];
  
  return <StationComparisonChart data={safeData} />;
}