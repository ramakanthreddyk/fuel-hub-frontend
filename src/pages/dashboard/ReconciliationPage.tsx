/**
 * @file ReconciliationPage.tsx
 * @description Clean, modern reconciliation page
 */
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useStations } from '@/hooks/api/useStations';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { useDailyReadingsSummary, useReconciliationByStationAndDate, useReconciliationSummary } from '@/hooks/useReconciliation';
import { useDiscrepancySummary } from '@/hooks/api/useReconciliationDiff';
import {
  useMobileFormatters,
  getResponsiveTextSize,
  getResponsiveIconSize,
  getResponsivePadding,
  getResponsiveGap
} from '@/utils/mobileFormatters';
import { ImprovedReconciliationCard } from '@/components/reconciliation/ImprovedReconciliationCard';
import {
  Calculator,
  CheckCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

export default function ReconciliationPage() {
  const [selectedStation, setSelectedStation] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { data: stations = [] } = useStations();
  const { formatCurrency: formatCurrencyMobile, formatVolume, isMobile } = useMobileFormatters();

  // Fetch reconciliation summary data
  const { data: reconciliationSummary, isLoading: summaryLoading } = useReconciliationSummary(
    selectedStation,
    selectedDate
  );

  const isDataLoading = summaryLoading;

  // Use reconciliation summary data directly from API with proper defaults
  const reconciliationData = {
    systemCalculated: reconciliationSummary?.systemCalculated || {
      totalRevenue: 0,
      cashSales: 0,
      cardSales: 0,
      upiSales: 0,
      creditSales: 0,
      totalVolume: 0
    },
    userEntered: reconciliationSummary?.userEntered || {
      cashCollected: 0,
      cardCollected: 0,
      upiCollected: 0,
      creditGiven: 0,
      totalCollected: 0
    },
    differences: reconciliationSummary?.differences || {
      cashDifference: 0,
      cardDifference: 0,
      upiDifference: 0,
      creditDifference: 0,
      totalDifference: 0
    }
  };

  const getDifferenceIcon = (difference: number) => {
    if (difference > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (difference < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getDifferenceColor = (difference: number, isWithinTolerance: boolean) => {
    if (difference === 0) return 'text-gray-600';
    if (isWithinTolerance) return difference > 0 ? 'text-green-600' : 'text-orange-600';
    return 'text-red-600';
  };

  const handleCloseDay = async () => {
    if (!selectedStation) {
      toast({
        title: "Station Required",
        description: "Please select a station to close the day.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Day Closed Successfully",
        description: `Reconciliation completed for ${selectedDate}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to close day. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-3 sm:p-4 lg:p-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-sm">
              <Calculator className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">Daily Reconciliation</h1>
              <p className="text-gray-600 text-xs sm:text-sm lg:text-base">Compare system calculations with actual cash collections</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Select Station and Date</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
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
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reconciliation Summary */}
        {selectedStation && (
          <ImprovedReconciliationCard
            summary={{
              date: selectedDate,
              stationName: reconciliationSummary?.stationName || stations.find(s => s.id === selectedStation)?.name || 'Unknown Station',
              systemCalculated: reconciliationData.systemCalculated,
              userEntered: reconciliationData.userEntered,
              differences: reconciliationData.differences,
              isReconciled: reconciliationSummary?.isReconciled || false
            }}
            onCloseDay={() => {
              toast({
                title: "Day Closure",
                description: "Day closure functionality will be implemented soon",
              });
            }}
            isClosing={loading}
          />
        )}
      </div>
    </div>
  );
}
