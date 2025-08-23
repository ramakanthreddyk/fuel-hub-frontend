
import { SafeText, SafeHtml } from '@/components/ui/SafeHtml';
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
import { Tenant, User as TenantUser, Station, Pump, Nozzle } from '@/api/api-contract';

interface TenantHierarchyProps {
  tenant: Tenant;
}

export function TenantHierarchy({ tenant }: TenantHierarchyProps) {
  const [expandedStations, setExpandedStations] = useState<Set<string>>(new Set());
  const [expandedPumps, setExpandedPumps] = useState<Set<string>>(new Set());

  if (!tenant) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Tenant Data</h3>
          <p className="text-muted-foreground">
            Unable to load tenant information.
          </p>
        </CardContent>
      </Card>
    );
  }

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

  // Handle both array and number types for backward compatibility
  const users = Array.isArray(tenant.users) ? tenant.users : [];
  const stations = Array.isArray(tenant.stations) ? tenant.stations : [];
  const userCount = tenant.userCount || (Array.isArray(tenant.users) ? tenant.users.length : 0);
  const stationCount = tenant.stationCount || (Array.isArray(tenant.stations) ? tenant.stations.length : 0);
  const totalPumps = Array.isArray(tenant.stations) 
    ? tenant.stations.reduce((sum, s) => sum + (s.pumpCount || 0), 0)
    : 0;

  return (
    <div className="space-y-6">
      {/* Tenant Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-purple-600" />
            {<SafeText text={tenant.name} />}
            <Badge className={getStatusColor(tenant.status)}>
              {<SafeText text={tenant.status} />}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{<SafeText text={userCount} />}</div>
              <div className="text-sm text-muted-foreground">Users</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{<SafeText text={stationCount} />}</div>
              <div className="text-sm text-muted-foreground">Stations</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{<SafeText text={totalPumps} />}</div>
              <div className="text-sm text-muted-foreground">Pumps</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Section */}
      {users.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Users ({<SafeText text={users.length} />})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {users.map((user) => (
                <div key={<SafeText text={user.id} />} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getRoleIcon(user.role)}
                    <div>
                      <div className="font-medium">{<SafeText text={user.name} />}</div>
                      <div className="text-sm text-muted-foreground">{<SafeText text={user.email} />}</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {<SafeText text={user.role} />}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stations Hierarchy */}
      {stations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-green-600" />
              Stations ({<SafeText text={stations.length} />})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stations.map((station) => (
                <div key={<SafeText text={station.id} />} className="border rounded-lg">
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
                            <div className="font-medium">{<SafeText text={station.name} />}</div>
                            <div className="text-sm text-muted-foreground">
                              {station.pumpCount || 0} pumps • {station.address || 'No address'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(station.status)}>
                            {<SafeText text={station.status} />}
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
                            <div key={<SafeText text={pump.id} />} className="ml-6 border-l-2 border-gray-200 pl-4">
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
                                        <div className="font-medium">{<SafeText text={pump.name} />}</div>
                                        <div className="text-sm text-muted-foreground">
                                          {pump.nozzleCount || 0} nozzles
                                          {pump.serialNumber && ` • SN: ${<SafeText text={pump.serialNumber} />}`}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge className={getStatusColor(pump.status)}>
                                        {<SafeText text={pump.status} />}
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
                                    {(pump as any).nozzles && (pump as any).nozzles.length > 0 ? (
                                      (pump as any).nozzles.map((nozzle: any) => (
                                        <div
                                          key={<SafeText text={nozzle.id} />}
                                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                        >
                                          <div className="flex items-center gap-2">
                                            <Zap className="h-3 w-3 text-orange-600" />
                                            <span className="text-sm font-medium">
                                              Nozzle {<SafeText text={nozzle.nozzleNumber} />}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                              {<SafeText text={nozzle.fuelType} />}
                                            </span>
                                          </div>
                                          <Badge className={getStatusColor(nozzle.status)}>
                                            {<SafeText text={nozzle.status} />}
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
      {stations.length === 0 && users.length === 0 && (
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
