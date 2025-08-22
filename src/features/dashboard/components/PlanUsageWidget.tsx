import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Crown, Building2, Users, AlertTriangle } from 'lucide-react';

interface PlanUsageWidgetProps {
  planName?: string;
  currentStations: number;
  maxStations: number;
  currentUsers: number;
  maxUsers?: number;
  className?: string;
}

export function PlanUsageWidget({ 
  planName = 'Unknown', 
  currentStations = 0, 
  maxStations = 1,
  currentUsers = 0,
  maxUsers = 10,
  className = ''
}: PlanUsageWidgetProps) {
  const stationUsagePercent = (currentStations / maxStations) * 100;
  const userUsagePercent = (currentUsers / maxUsers) * 100;
  
  const isStationLimitReached = currentStations >= maxStations;
  const isUserLimitReached = currentUsers >= maxUsers;

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Crown className="h-4 w-4 text-yellow-600" />
          Plan: {planName}
          <Badge variant={isStationLimitReached || isUserLimitReached ? "destructive" : "secondary"} className="text-xs">
            {planName}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {/* Stations Usage */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Building2 className="h-3 w-3 text-blue-600" />
              <span className="text-xs font-medium">Stations</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {currentStations} / {maxStations === 999 ? '∞' : maxStations}
            </span>
          </div>
          <Progress value={Math.min(stationUsagePercent, 100)} className="h-1" />
          {isStationLimitReached && (
            <div className="flex items-center gap-1 text-xs text-red-600">
              <AlertTriangle className="h-2 w-2" />
              Limit reached!
            </div>
          )}
        </div>

        {/* Users Usage */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3 text-green-600" />
              <span className="text-xs font-medium">Users</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {currentUsers} / {maxUsers === 999 ? '∞' : maxUsers}
            </span>
          </div>
          <Progress value={Math.min(userUsagePercent, 100)} className="h-1" />
          {isUserLimitReached && (
            <div className="flex items-center gap-1 text-xs text-red-600">
              <AlertTriangle className="h-2 w-2" />
              Limit reached!
            </div>
          )}
        </div>

        {/* Plan Features */}
        <div className="pt-1 border-t">
          <p className="text-xs text-muted-foreground">
            {planName === 'Regular' && '1 station • Limited users'}
            {planName === 'Premium' && '3 stations • Reports'}
            {planName === 'Pro' && '3 stations • Analytics'}
            {!['Regular', 'Premium', 'Pro'].includes(planName) && 'Contact support'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}