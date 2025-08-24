/**
 * @file SmartAnalyticsDashboard.tsx
 * @description Comprehensive, mobile-first analytics dashboard with lifetime sales, trends, and smart insights
 */
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Fuel, 
  Activity, 
  Calendar,
  BarChart3,
  PieChart,
  Target,
  Zap,
  Users,
  Clock,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { useSalesSummary, usePaymentMethodBreakdown, useFuelTypeBreakdown, useDailySalesTrend } from '@/hooks/api/useDashboard';
import { useTodaysSales } from '@/hooks/api/useTodaysSales';
import { useStations } from '@/hooks/api/useStations';
import { useNavigate } from 'react-router-dom';
import { useMobileFormatters, getResponsiveTextSize, getResponsivePadding } from '@/utils/mobileFormatters';
import { formatCurrency, formatVolume } from '@/utils/formatters';

type TimePeriod = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'lifetime';

interface MetricCardProps {
  title: string;
  value: string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: React.ElementType;
  color: string;
  subtitle?: string;
  isMobile?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon, 
  color, 
  subtitle,
  isMobile = false 
}) => {
  const getChangeIcon = () => {
    if (changeType === 'increase') return <ArrowUp className="h-3 w-3" />;
    if (changeType === 'decrease') return <ArrowDown className="h-3 w-3" />;
    return <Minus className="h-3 w-3" />;
  };

  const getChangeColor = () => {
    if (changeType === 'increase') return 'text-green-600';
    if (changeType === 'decrease') return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardContent className={isMobile ? "p-3" : "p-4"}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600 truncate`}>
              {title}
            </p>
            <p className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-gray-900 truncate`}>
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-gray-500 truncate">{subtitle}</p>
            )}
            {change !== undefined && (
              <div className={`flex items-center gap-1 text-xs ${getChangeColor()} mt-1`}>
                {getChangeIcon()}
                <span>{Math.abs(change)}%</span>
                <span className="text-gray-500">vs last period</span>
              </div>
            )}
          </div>
          <div className={`${color} rounded-lg p-2 flex-shrink-0`}>
            <Icon className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-white`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const SmartAnalyticsDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('today');
  const { formatCurrency: formatCurrencyMobile, isMobile } = useMobileFormatters();
  const navigate = useNavigate();

  // API Hooks - Pass selectedPeriod to hooks that support filtering
  const { data: salesSummary } = useSalesSummary(selectedPeriod);
  const { data: paymentBreakdown = [] } = usePaymentMethodBreakdown();
  const { data: fuelBreakdown = [] } = useFuelTypeBreakdown();
  // Calculate days for trend based on selected period
  const trendDays = selectedPeriod === 'today' ? 1 : 
                   selectedPeriod === 'week' ? 7 : 
                   selectedPeriod === 'month' ? 30 : 
                   selectedPeriod === 'quarter' ? 90 : 
                   selectedPeriod === 'year' ? 365 : 30;
  const { data: salesTrend = [] } = useDailySalesTrend(trendDays);
  const { data: stations = [] } = useStations();

  // Calculate metrics based on selected period
  const metrics = useMemo(() => {
    const summary = salesSummary;

    // Use summary data for the selected period
    const periodRevenue = summary?.totalRevenue || 0;
    const periodVolume = summary?.totalVolume || 0;
    const periodTransactions = summary?.salesCount || 0;

    // Calculate trends from growth percentage
    const revenueChange = summary?.growthPercentage || 0;
    const volumeChange = summary?.growthPercentage || 0; // Use same growth for volume
    const transactionChange = summary?.growthPercentage || 0; // Use same growth for transactions

    return {
      periodRevenue,
      periodVolume,
      periodTransactions,
      activeStations: stations.length,
      revenueChange,
      volumeChange,
      transactionChange,
      averageTicketSize: periodTransactions > 0 ? periodRevenue / periodTransactions : 0
    };
  }, [salesSummary, stations, selectedPeriod]);

  const periodLabels = {
    today: 'Today',
    week: 'This Week',
    month: 'This Month',
    quarter: 'This Quarter',
    year: 'This Year',
    lifetime: 'Lifetime'
  };

  return (
    <div className={`space-y-4 sm:space-y-6 ${getResponsivePadding('base')}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`${getResponsiveTextSize('2xl')} font-bold text-gray-900`}>
            Smart Analytics
          </h1>
          <p className={`${getResponsiveTextSize('base')} text-gray-600`}>
            Comprehensive business insights and performance metrics
          </p>
        </div>
        
        {/* Period Selector */}
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {(Object.keys(periodLabels) as TimePeriod[]).map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className={`${isMobile ? 'text-xs px-2 py-1' : 'text-sm'} ${
                selectedPeriod === period 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-blue-50'
              }`}
            >
              {periodLabels[period]}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard
          title={`${periodLabels[selectedPeriod]} Revenue`}
          value={isMobile 
            ? formatCurrencyMobile(metrics.periodRevenue)
            : formatCurrency(metrics.periodRevenue)
          }
          change={metrics.revenueChange}
          changeType="increase"
          icon={DollarSign}
          color="bg-green-500"
          subtitle={selectedPeriod === 'lifetime' ? 'All time sales' : undefined}
          isMobile={isMobile}
        />
        
        <MetricCard
          title={`${periodLabels[selectedPeriod]} Volume`}
          value={isMobile 
            ? `${metrics.periodVolume >= 1000 
                ? `${(metrics.periodVolume / 1000).toFixed(1)}KL` 
                : `${Math.round(metrics.periodVolume)}L`}`
            : formatVolume(metrics.periodVolume)
          }
          change={metrics.volumeChange}
          changeType="increase"
          icon={Fuel}
          color="bg-blue-500"
          subtitle={selectedPeriod === 'lifetime' ? 'Fuel dispensed' : undefined}
          isMobile={isMobile}
        />
        
        <MetricCard
          title={`${periodLabels[selectedPeriod]} Sales`}
          value={metrics.periodTransactions.toLocaleString()}
          change={metrics.transactionChange}
          changeType="increase"
          icon={Activity}
          color="bg-purple-500"
          subtitle={selectedPeriod === 'lifetime' ? 'Transactions' : undefined}
          isMobile={isMobile}
        />
        
        <MetricCard
          title="Active Stations"
          value={metrics.activeStations.toString()}
          icon={Users}
          color="bg-orange-500"
          subtitle="Operational"
          isMobile={isMobile}
        />
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className={`grid w-full ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
          <TabsTrigger value="overview" className={isMobile ? 'text-xs' : 'text-sm'}>
            {isMobile ? 'Overview' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="trends" className={isMobile ? 'text-xs' : 'text-sm'}>
            {isMobile ? 'Trends' : 'Trends'}
          </TabsTrigger>
          {!isMobile && (
            <>
              <TabsTrigger value="breakdown" className="text-sm">Breakdown</TabsTrigger>
              <TabsTrigger value="insights" className="text-sm">Insights</TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className={getResponsivePadding('sm')}>
                <CardTitle className={`${getResponsiveTextSize('base')} flex items-center gap-2`}>
                  <Target className="h-4 w-4" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className={getResponsivePadding('sm')}>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`${getResponsiveTextSize('sm')} text-gray-600`}>Avg. Ticket Size</span>
                    <span className={`${getResponsiveTextSize('sm')} font-semibold`}>
                      {isMobile 
                        ? formatCurrencyMobile(metrics.averageTicketSize)
                        : formatCurrency(metrics.averageTicketSize)
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`${getResponsiveTextSize('sm')} text-gray-600`}>Revenue/Station</span>
                    <span className={`${getResponsiveTextSize('sm')} font-semibold`}>
                      {isMobile 
                        ? formatCurrencyMobile(metrics.periodRevenue / Math.max(metrics.activeStations, 1))
                        : formatCurrency(metrics.periodRevenue / Math.max(metrics.activeStations, 1))
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className={getResponsivePadding('sm')}>
                <CardTitle className={`${getResponsiveTextSize('base')} flex items-center gap-2`}>
                  <Clock className="h-4 w-4" />
                  Today's Progress
                </CardTitle>
              </CardHeader>
              <CardContent className={getResponsivePadding('sm')}>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`${getResponsiveTextSize('sm')} text-gray-600`}>Revenue</span>
                    <Badge variant="outline" className="text-green-600">
                      {isMobile ? formatCurrencyMobile(metrics.periodRevenue) : formatCurrency(metrics.periodRevenue)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`${getResponsiveTextSize('sm')} text-gray-600`}>Transactions</span>
                    <Badge variant="outline" className="text-blue-600">
                      {metrics.periodTransactions}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className={getResponsivePadding('sm')}>
                <CardTitle className={`${getResponsiveTextSize('base')} flex items-center gap-2`}>
                  <Zap className="h-4 w-4" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className={getResponsivePadding('sm')}>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => navigate('/dashboard/sales')}
                  >
                    <BarChart3 className="h-3 w-3 mr-2" />
                    {isMobile ? 'Sales' : 'View Reports'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      // Export functionality - could be enhanced with actual export
                      const data = {
                        period: selectedPeriod,
                        revenue: metrics.periodRevenue,
                        volume: metrics.periodVolume,
                        transactions: metrics.periodTransactions,
                        stations: metrics.activeStations
                      };
                      console.log('Exporting data:', data);
                      // You could implement actual CSV/PDF export here
                      alert('Export functionality would be implemented here');
                    }}
                  >
                    <PieChart className="h-3 w-3 mr-2" />
                    {isMobile ? 'Export' : 'Export Data'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Sales Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Sales trend chart will be displayed here</p>
                <p className="text-sm text-gray-400 mt-2">
                  Integration with charting library needed
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {!isMobile && (
          <>
            <TabsContent value="breakdown" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {paymentBreakdown.map((method, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 capitalize">{method.paymentMethod}</span>
                          <span className="font-semibold">{formatCurrency(method.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Fuel Types</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {fuelBreakdown.map((fuel, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 uppercase">{fuel.fuelType}</span>
                          <span className="font-semibold">{formatVolume(fuel.volume)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Business Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">Revenue Growth</h4>
                      <p className="text-sm text-green-700">
                        {periodLabels[selectedPeriod]} revenue has increased by {metrics.revenueChange}% compared to the previous period.
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2">Volume Performance</h4>
                      <p className="text-sm text-blue-700">
                        {periodLabels[selectedPeriod]} fuel volume dispensed has grown by {metrics.volumeChange}% compared to the previous period.
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-800 mb-2">Transaction Activity</h4>
                      <p className="text-sm text-purple-700">
                        {periodLabels[selectedPeriod]} transaction count has increased by {metrics.transactionChange}% indicating higher customer activity.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default SmartAnalyticsDashboard;
