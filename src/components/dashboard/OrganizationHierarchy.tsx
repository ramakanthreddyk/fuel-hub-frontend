
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Building2, 
  Fuel, 
  Zap, 
  ChevronDown, 
  ChevronRight,
  Plus
} from 'lucide-react';
import { useStationsWithMetrics } from '@/hooks/useStations';
import { Link } from 'react-router-dom';

export function OrganizationHierarchy() {
  const { data: stations = [], isLoading } = useStationsWithMetrics();
  const [expandedStations, setExpandedStations] = useState<Set<string>>(new Set());

  const toggleStation = (stationId: string) => {
    const newExpanded = new Set(expandedStations);
    if (newExpanded.has(stationId)) {
      newExpanded.delete(stationId);
    } else {
      newExpanded.add(stationId);
    }
    setExpandedStations(newExpanded);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-green-600" />
            Organization Structure
          </CardTitle>
          <Button asChild size="sm">
            <Link to="/dashboard/stations">
              <Plus className="h-4 w-4 mr-2" />
              Manage
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {stations.length === 0 ? (
          <div className="text-center py-8">
            <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Stations Yet</h3>
            <p className="text-muted-foreground mb-4">
              Get started by adding your first fuel station.
            </p>
            <Button asChild>
              <Link to="/dashboard/stations">
                <Plus className="h-4 w-4 mr-2" />
                Add Station
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {stations.map((station) => (
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
                            {station.pumpCount} pumps • {station.attendantCount} attendants
                            {station.metrics && (
                              <span> • ₹{station.metrics.totalSales.toLocaleString()} today</span>
                            )}
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
                    <div className="px-4 pb-4">
                      <div className="ml-6 border-l-2 border-gray-200 pl-4 space-y-2">
                        {/* Placeholder for pumps - would need pump API */}
                        <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                          <Fuel className="h-4 w-4 text-blue-600" />
                          <span className="text-sm">
                            {station.pumpCount} pumps configured
                          </span>
                          <Button asChild variant="outline" size="sm" className="ml-auto">
                            <Link to={`/dashboard/stations/${station.id}/pumps`}>
                              View Pumps
                            </Link>
                          </Button>
                        </div>
                        
                        {/* Metrics if available */}
                        {station.metrics && (
                          <div className="grid grid-cols-3 gap-2 mt-3">
                            <div className="text-center p-2 bg-green-50 rounded">
                              <div className="text-lg font-bold text-green-600">
                                ₹{station.metrics.totalSales.toLocaleString()}
                              </div>
                              <div className="text-xs text-muted-foreground">Sales</div>
                            </div>
                            <div className="text-center p-2 bg-blue-50 rounded">
                              <div className="text-lg font-bold text-blue-600">
                                {station.metrics.totalVolume ? `${station.metrics.totalVolume.toLocaleString()}L` : 'N/A'}
                              </div>
                              <div className="text-xs text-muted-foreground">Volume</div>
                            </div>
                            <div className="text-center p-2 bg-purple-50 rounded">
                              <div className="text-lg font-bold text-purple-600">
                                {station.metrics.transactionCount || 0}
                              </div>
                              <div className="text-xs text-muted-foreground">Transactions</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
