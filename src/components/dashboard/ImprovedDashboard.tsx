/**
 * @file ImprovedDashboard.tsx
 * @description Modern, mobile-first, role-based dashboard with better UX
 */
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp,
  TrendingDown,
  Users,
  AlertTriangle,
  Plus,
  Eye,
  BarChart3,
  Clock,
  CheckCircle,
  ArrowRight,
  Zap,
  DollarSign,
  Activity,
  Target,
  Gauge,
  MapPin,
  Calendar,
  PieChart,
  LineChart,
  BarChart2,
  Award,
  Star,
  Sparkles,
  Layers,
  Database,
  RefreshCw,
  Calculator
} from 'lucide-react';

// Hooks
import { useTodaysSales } from '@/hooks/api/useTodaysSales';
import { useStations } from '@/hooks/api/useStations';
import { useDailyReminders } from '@/hooks/useOnboarding';
import { useIsMobile } from '@/hooks/use-mobile';

// Chart Components
import { ModernSalesTrendChart } from './ModernSalesTrendChart';
import { ModernFuelBreakdownChart } from './ModernFuelBreakdownChart';
import { ModernPaymentMethodChart } from './ModernPaymentMethodChart';

interface QuickActionProps {
  icon: React.ElementType;
  title: string;
  description: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'urgent';
  badge?: string;
}

function QuickAction({ icon: Icon, title, description, onClick, variant = 'secondary', badge }: QuickActionProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700',
    secondary: 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-900',
    urgent: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
  };

  return (
    <Card className={`cursor-pointer transition-all duration-200 hover:shadow-md ${variants[variant]}`} onClick={onClick}>
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className={`p-1.5 sm:p-2 rounded-lg ${variant === 'secondary' ? 'bg-gray-100' : 'bg-white/20'} flex-shrink-0`}>
              <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${variant === 'secondary' ? 'text-gray-600' : 'text-white'}`} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-xs sm:text-sm truncate">{title}</h3>
              <p className={`text-xs ${variant === 'secondary' ? 'text-gray-500' : 'text-white/80'} truncate`}>{description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            {badge && (
              <Badge variant={variant === 'urgent' ? 'destructive' : 'secondary'} className="text-xs px-1.5 py-0.5">
                {badge}
              </Badge>
            )}
            <ArrowRight className={`h-3 w-3 sm:h-4 sm:w-4 ${variant === 'secondary' ? 'text-gray-400' : 'text-white/60'}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ElementType;
  color: string;
}

function MetricCard({ title, value, change, changeType, icon: Icon, color }: MetricCardProps) {
  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-500'
  };

  return (
    <Card className="bg-white border-0 shadow-sm">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{title}</p>
            <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1 truncate">{value}</p>
            {change && (
              <p className={`text-xs mt-1 ${changeColors[changeType || 'neutral']} truncate`}>
                {change}
              </p>
            )}
          </div>
          <div className={`p-2 sm:p-3 rounded-xl ${color} flex-shrink-0 ml-2`}>
            <Icon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ImprovedDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const isMobile = useIsMobile();

  // Data hooks
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const { data: todaysSales, isLoading: salesLoading } = useTodaysSales(today);
  const { data: yesterdaysSales, isLoading: yesterdayLoading } = useTodaysSales(yesterday);
  const { data: stations, isLoading: stationsLoading } = useStations();
  const { data: reminders } = useDailyReminders();

  // Calculate metrics
  const totalRevenue = todaysSales?.totalAmount || 0;
  const totalVolume = todaysSales?.totalVolume || 0;
  const totalTransactions = todaysSales?.totalEntries || 0;
  const activeStations = stations?.filter(s => s.status === 'active').length || 0;
  const urgentReminders = reminders?.filter(r => r.priority === 'urgent' && !r.completed).length || 0;

  // Calculate percentage changes
  const calculateChange = (today: number, yesterday: number): { change: string; type: 'positive' | 'negative' | 'neutral' } => {
    if (yesterday === 0) {
      return today > 0 ? { change: 'New data', type: 'positive' } : { change: 'No data', type: 'neutral' };
    }
    const percentage = ((today - yesterday) / yesterday) * 100;
    const sign = percentage >= 0 ? '+' : '';
    return {
      change: `${sign}${percentage.toFixed(1)}% from yesterday`,
      type: percentage > 0 ? 'positive' : percentage < 0 ? 'negative' : 'neutral'
    };
  };

  const revenueChange = calculateChange(totalRevenue, yesterdaysSales?.totalAmount || 0);
  const volumeChange = calculateChange(totalVolume, yesterdaysSales?.totalVolume || 0);
  const transactionChange = calculateChange(totalTransactions, yesterdaysSales?.totalEntries || 0);

  // Role-based quick actions
  const getQuickActions = () => {
    const baseActions = [
      {
        icon: Gauge,
        title: 'Record Reading',
        description: 'Add new nozzle reading',
        onClick: () => window.location.href = '/dashboard/readings/new',
        variant: 'primary' as const
      }
    ];

    if (user?.role === 'owner' || user?.role === 'manager') {
      return [
        ...baseActions,
        {
          icon: Calculator,
          title: 'Daily Reconciliation',
          description: 'Review sales vs cash collected',
          onClick: () => window.location.href = '/dashboard/reconciliation',
          variant: 'primary' as const
        },
        {
          icon: LineChart,
          title: 'View Reports',
          description: 'Sales & performance reports',
          onClick: () => window.location.href = '/dashboard/reports',
          variant: 'secondary' as const
        },
        {
          icon: MapPin,
          title: 'Manage Stations',
          description: 'Station & pump management',
          onClick: () => window.location.href = '/dashboard/stations',
          variant: 'secondary' as const
        }
      ];
    }

    return baseActions;
  };

  const quickActions = getQuickActions();

  if (salesLoading || stationsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-3 sm:p-4 space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {['revenue', 'volume', 'transactions', 'stations'].map((metric) => (
            <Card key={`loading-${metric}`} className="animate-pulse">
              <CardContent className="p-3 sm:p-4">
                <div className="h-12 sm:h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="space-y-3">
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {['action1', 'action2', 'action3'].map((action) => (
              <Card key={`loading-action-${action}`} className="animate-pulse">
                <CardContent className="p-3 sm:p-4">
                  <div className="h-16 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.name}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Here's what's happening with your fuel stations today</p>
        </div>
        {urgentReminders > 0 && (
          <Badge variant="destructive" className="flex items-center space-x-1 self-start sm:self-center">
            <AlertTriangle className="h-3 w-3" />
            <span className="text-xs sm:text-sm">{urgentReminders} urgent alert{urgentReminders > 1 ? 's' : ''}</span>
          </Badge>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard
          title="Today's Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          change={revenueChange.change}
          changeType={revenueChange.type}
          icon={Target}
          color="bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600"
        />
        <MetricCard
          title="Fuel Sold"
          value={`${totalVolume.toLocaleString()}L`}
          change={volumeChange.change}
          changeType={volumeChange.type}
          icon={Gauge}
          color="bg-gradient-to-br from-blue-500 via-cyan-500 to-indigo-600"
        />
        <MetricCard
          title="Transactions"
          value={totalTransactions.toString()}
          change={transactionChange.change}
          changeType={transactionChange.type}
          icon={BarChart2}
          color="bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-600"
        />
        <MetricCard
          title="Active Stations"
          value={activeStations.toString()}
          icon={MapPin}
          color="bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-600"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {quickActions.map((action, index) => (
            <QuickAction key={`action-${index}`} {...action} />
          ))}
          {urgentReminders > 0 && (
            <QuickAction
              icon={AlertTriangle}
              title="View Alerts"
              description="Check urgent notifications"
              onClick={() => window.location.href = '/dashboard/alerts'}
              variant="urgent"
              badge={urgentReminders.toString()}
            />
          )}
        </div>
      </div>

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 mt-6">
          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Fuel Breakdown Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5 text-blue-600" />
                  <span>Fuel Sales Breakdown</span>
                  <Badge variant="outline" className="ml-auto">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Live
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ModernFuelBreakdownChart date={today} />
              </CardContent>
            </Card>

            {/* Sales Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <LineChart className="h-5 w-5 text-purple-600" />
                  <span>Sales Trend</span>
                  <Badge variant="outline" className="ml-auto">
                    <Calendar className="h-3 w-3 mr-1" />
                    7 Days
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ModernSalesTrendChart />
              </CardContent>
            </Card>
          </div>

          {/* Payment Methods Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                <span>Payment Methods</span>
                <Badge variant="outline" className="ml-auto">
                  <Target className="h-3 w-3 mr-1" />
                  Today
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ModernPaymentMethodChart />
            </CardContent>
          </Card>

          {/* Station Performance Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-orange-600" />
                <span>Station Performance</span>
                <Badge variant="outline" className="ml-auto">
                  <Star className="h-3 w-3 mr-1" />
                  Top Performers
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todaysSales?.salesByStation && todaysSales.salesByStation.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {todaysSales.salesByStation.slice(0, 6).map((station: any, index: number) => (
                    <div key={station.stationId || index} className="p-3 sm:p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center justify-center w-6 h-6 bg-orange-600 text-white rounded-full text-xs font-bold">
                            {index + 1}
                          </div>
                          <h3 className="font-semibold text-orange-900 text-sm truncate">{station.stationName}</h3>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {station.entriesCount} txns
                        </Badge>
                      </div>
                      <p className="text-lg font-bold text-orange-900 mb-1">
                        ₹{(station.totalAmount || 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-orange-600">
                        {station.nozzlesActive} active nozzles
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No station performance data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4 mt-6">
          {/* Performance Metrics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <LineChart className="h-5 w-5 text-purple-600" />
                  <span>Revenue Comparison</span>
                  <Badge variant="outline" className="ml-auto">
                    <Calendar className="h-3 w-3 mr-1" />
                    Daily
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                    <div>
                      <p className="text-sm text-purple-600">Today</p>
                      <p className="text-xl font-bold text-purple-900">₹{totalRevenue.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-purple-600">Yesterday</p>
                      <p className="text-xl font-bold text-purple-900">₹{(yesterdaysSales?.totalAmount || 0).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center p-4">
                    <div className={`flex items-center space-x-2 px-3 py-2 rounded-full ${
                      revenueChange.type === 'positive' ? 'bg-green-100 text-green-800' :
                      revenueChange.type === 'negative' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {revenueChange.type === 'positive' ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : revenueChange.type === 'negative' ? (
                        <TrendingDown className="h-4 w-4" />
                      ) : (
                        <Activity className="h-4 w-4" />
                      )}
                      <span className="text-sm font-medium">{revenueChange.change}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Volume Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  <span>Volume Analysis</span>
                  <Badge variant="outline" className="ml-auto">
                    <Layers className="h-3 w-3 mr-1" />
                    Liters
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                    <div>
                      <p className="text-sm text-blue-600">Today</p>
                      <p className="text-xl font-bold text-blue-900">{totalVolume.toLocaleString()}L</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-blue-600">Yesterday</p>
                      <p className="text-xl font-bold text-blue-900">{(yesterdaysSales?.totalVolume || 0).toLocaleString()}L</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center p-4">
                    <div className={`flex items-center space-x-2 px-3 py-2 rounded-full ${
                      volumeChange.type === 'positive' ? 'bg-green-100 text-green-800' :
                      volumeChange.type === 'negative' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {volumeChange.type === 'positive' ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : volumeChange.type === 'negative' ? (
                        <TrendingDown className="h-4 w-4" />
                      ) : (
                        <Activity className="h-4 w-4" />
                      )}
                      <span className="text-sm font-medium">{volumeChange.change}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-orange-600" />
                <span>Performance Insights</span>
                <Badge variant="outline" className="ml-auto">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Real-time
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200 hover:shadow-md transition-shadow">
                  <BarChart2 className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-orange-900">{totalTransactions}</p>
                  <p className="text-sm text-orange-600">Total Transactions</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200 hover:shadow-md transition-shadow">
                  <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-900">
                    ₹{totalTransactions > 0 ? Math.round(totalRevenue / totalTransactions) : 0}
                  </p>
                  <p className="text-sm text-green-600">Avg. Transaction</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:shadow-md transition-shadow">
                  <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-900">{activeStations}</p>
                  <p className="text-sm text-blue-600">Active Stations</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200 hover:shadow-md transition-shadow">
                  <Gauge className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-900">
                    {totalVolume > 0 ? (totalRevenue / totalVolume).toFixed(2) : '0.00'}
                  </p>
                  <p className="text-sm text-purple-600">₹ per Liter</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>System Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reminders && reminders.length > 0 ? (
                <div className="space-y-3">
                  {reminders.slice(0, 5).map((reminder, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          reminder.priority === 'urgent' ? 'bg-red-500' : 
                          reminder.priority === 'high' ? 'bg-orange-500' : 'bg-blue-500'
                        }`} />
                        <div>
                          <p className="font-medium text-sm">{reminder.title}</p>
                          <p className="text-xs text-gray-500">{reminder.message}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-500">No alerts at the moment</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
