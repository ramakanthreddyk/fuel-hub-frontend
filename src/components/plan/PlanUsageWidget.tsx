/**
 * @file PlanUsageWidget.tsx
 * @description Widget showing tenant's current plan usage and upgrade options
 */

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Zap, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Crown,
  ArrowUp
} from 'lucide-react';
import { apiClient } from '@/api/client';

interface PlanInfo {
  currentPlan: {
    id: string;
    name: string;
    maxStations: number;
    maxPumpsPerStation: number;
    maxNozzlesPerPump: number;
    priceMonthly: number;
    priceYearly: number;
    features: string[];
  };
  currentUsage: {
    current_stations: number;
    current_pumps: number;
    current_nozzles: number;
    current_users: number;
  };
  utilization: {
    stations: { current: number; limit: number; percentage: number };
    pumps: { current: number; estimated_limit: number; percentage: number };
    nozzles: { current: number; estimated_limit: number; percentage: number };
    users: { current: number; limit: string; percentage: number };
  };
  availablePlans: Array<{
    id: string;
    name: string;
    maxStations: number;
    priceMonthly: number;
    features: string[];
    isCurrent: boolean;
    canUpgrade: boolean;
  }>;
  upgradeRecommendation: any;
  needsUpgrade: boolean;
}

export function PlanUsageWidget() {
  const { data: planInfo, isLoading, error } = useQuery({
    queryKey: ['plan-info'],
    queryFn: async () => {
      const response = await apiClient.get('/settings/plan');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Plan Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-2 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !planInfo?.success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Plan Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Unable to load plan information</p>
        </CardContent>
      </Card>
    );
  }

  const data: PlanInfo = planInfo.data;
  const { currentPlan, utilization, needsUpgrade, upgradeRecommendation } = data;

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };



  return (
    <div className="space-y-4">
      {/* Current Plan Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-purple-600" />
              Current Plan: {currentPlan.name}
            </div>
            <Badge variant={needsUpgrade ? "destructive" : "default"}>
              ₹{currentPlan.priceMonthly}/month
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Usage Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Stations Usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span className="text-sm font-medium">Stations</span>
                </div>
                <span className={`text-sm font-medium ${getUsageColor(utilization.stations.percentage)}`}>
                  {utilization.stations.current}/{utilization.stations.limit}
                </span>
              </div>
              <Progress 
                value={utilization.stations.percentage} 
                className="h-2"
              />
              <p className="text-xs text-gray-500">
                {utilization.stations.percentage}% of limit used
              </p>
            </div>

            {/* Pumps Usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span className="text-sm font-medium">Pumps</span>
                </div>
                <span className={`text-sm font-medium ${getUsageColor(utilization.pumps.percentage)}`}>
                  {utilization.pumps.current}/{utilization.pumps.estimated_limit}
                </span>
              </div>
              <Progress 
                value={utilization.pumps.percentage} 
                className="h-2"
              />
              <p className="text-xs text-gray-500">
                {utilization.pumps.percentage}% of estimated limit
              </p>
            </div>

            {/* Users */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">Users</span>
                </div>
                <span className="text-sm font-medium text-green-600">
                  {utilization.users.current}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {utilization.users.limit} users allowed
              </p>
            </div>

            {/* Plan Features Count */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Features</span>
                </div>
                <span className="text-sm font-medium text-blue-600">
                  {currentPlan.features.length} active
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Premium features included
              </p>
            </div>
          </div>

          {/* Upgrade Alert */}
          {needsUpgrade && upgradeRecommendation && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-yellow-800">
                    Upgrade Recommended
                  </h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    You're approaching your plan limits. Consider upgrading to {upgradeRecommendation.name} 
                    for ₹{upgradeRecommendation.priceMonthly}/month to get more capacity and features.
                  </p>
                  <Button size="sm" className="mt-2" variant="outline">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    View Upgrade Options
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Feature Highlights */}
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Your Plan Features:</h4>
            <div className="flex flex-wrap gap-1">
              {currentPlan.features.slice(0, 6).map((feature, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {currentPlan.features.length > 6 && (
                <Badge variant="outline" className="text-xs">
                  +{currentPlan.features.length - 6} more
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Upgrade Options */}
      {data.availablePlans.filter(p => p.canUpgrade && !p.isCurrent).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Upgrade Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.availablePlans
                .filter(p => p.canUpgrade && !p.isCurrent)
                .slice(0, 2)
                .map((plan) => (
                  <div key={plan.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{plan.name}</h4>
                      <p className="text-sm text-gray-500">
                        {plan.maxStations} stations • {plan.features.length} features
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{plan.priceMonthly}/month</p>
                      <Button size="sm" variant="outline" className="mt-1">
                        Learn More
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
