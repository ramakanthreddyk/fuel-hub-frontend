import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Building2, 
  Users, 
  Fuel, 
  Zap, 
  ChevronDown, 
  ChevronRight,
  User,
  Crown,
  Shield,
  Wrench
} from 'lucide-react';
import { Tenant, User as TenantUser, Station, Pump, Nozzle } from '@/api/tenants';

interface TenantHierarchyProps {
  tenant: Tenant;
}

export function TenantHierarchy({ tenant }: TenantHierarchyProps) {
  const [expandedStations, setExpandedStations] = useState<Set<string>>(new Set());
  const [expandedPumps, setExpandedPumps] = useState<Set<string>>(new Set());

  const toggleStation = (stationId: string) => {
    const newExpanded = new Set(expandedStations);
    if (newExpanded.has(stationId)) {
      newExpanded.delete(stationId);
    } else {
      newExpanded.add(stationId);
    }
    setExpandedStations(newExpanded);
  };

  const togglePump = (pumpId: string) => {
    const newExpanded = new Set(expandedPumps);
    if (newExpanded.has(pumpId)) {
      newExpanded.delete(pumpId);
    } else {
      newExpanded.add(pumpId);
    }
    setExpandedPumps(newExpanded);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="h-4 w-4 text-yellow-600" />;
      case 'manager': return <Shield className="h-4 w-4 text-blue-600" />;
      case 'attendant': return <Wrench className="h-4 w-4 text-green-600" />;
      default: return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Tenant Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-purple-600" />
            {tenant.name}
            <Badge className={getStatusColor(tenant.status)}>
              {tenant.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{tenant.userCount || 0}</div>
              <div className="text-sm text-muted-foreground">Users</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{tenant.stationCount || 0}</div>
              <div className="text-sm text-muted-foreground">Stations</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {tenant.stations?.reduce((sum, s) => sum + (s.pumpCount || 0), 0) || 0}
              </div>
              <div className="text-sm text-muted-foreground">Pumps</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Section */}
      {tenant.users && tenant.users.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Users ({tenant.users.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tenant.users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getRoleIcon(user.role)}
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {user.role}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stations Hierarchy */}
      {tenant.stations && tenant.stations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-green-600" />
              Stations ({tenant.stations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tenant.stations.map((station) => (
                <div key={station.id} className="border rounded-lg">
                  <Collapsible
                    open={expandedStations.has(station.id)}
                    onOpenChange={() => toggleStation(station.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-between p-4 h-auto"
                      >
                        <div className="flex items-center gap-3">
                          <Building2 className="h-4 w-4 text-green-600" />
                          <div className="text-left">
                            <div className="font-medium">{station.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {station.pumpCount} pumps • {station.address || 'No address'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(station.status)}>
                            {station.status}
                          </Badge>
                          {expandedStations.has(station.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </div>
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-4 pb-4 space-y-3">
                        {station.pumps && station.pumps.length > 0 ? (
                          station.pumps.map((pump) => (
                            <div key={pump.id} className="ml-6 border-l-2 border-gray-200 pl-4">
                              <Collapsible
                                open={expandedPumps.has(pump.id)}
                                onOpenChange={() => togglePump(pump.id)}
                              >
                                <CollapsibleTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="w-full justify-between p-2 h-auto"
                                  >
                                    <div className="flex items-center gap-2">
                                      <Fuel className="h-4 w-4 text-blue-600" />
                                      <div className="text-left">
                                        <div className="font-medium">{pump.label}</div>
                                        <div className="text-sm text-muted-foreground">
                                          {pump.nozzleCount} nozzles
                                          {pump.serialNumber && ` • SN: ${pump.serialNumber}`}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge className={getStatusColor(pump.status)} size="sm">
                                        {pump.status}
                                      </Badge>
                                      {expandedPumps.has(pump.id) ? (
                                        <ChevronDown className="h-3 w-3" />
                                      ) : (
                                        <ChevronRight className="h-3 w-3" />
                                      )}
                                    </div>
                                  </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                  <div className="ml-6 mt-2 space-y-2">
                                    {pump.nozzles && pump.nozzles.length > 0 ? (
                                      pump.nozzles.map((nozzle) => (
                                        <div
                                          key={nozzle.id}
                                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                        >
                                          <div className="flex items-center gap-2">
                                            <Zap className="h-3 w-3 text-orange-600" />
                                            <span className="text-sm font-medium">
                                              Nozzle {nozzle.nozzleNumber}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                              {nozzle.fuelType}
                                            </span>
                                          </div>
                                          <Badge className={getStatusColor(nozzle.status)} size="sm">
                                            {nozzle.status}
                                          </Badge>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="text-sm text-muted-foreground p-2">
                                        No nozzles configured
                                      </div>
                                    )}
                                  </div>
                                </CollapsibleContent>
                              </Collapsible>
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-muted-foreground ml-6 p-2">
                            No pumps configured
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {(!tenant.stations || tenant.stations.length === 0) && (!tenant.users || tenant.users.length === 0) && (
        <Card>
          <CardContent className="p-12 text-center">
            <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
            <p className="text-muted-foreground">
              This tenant hasn't set up any stations or users yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}