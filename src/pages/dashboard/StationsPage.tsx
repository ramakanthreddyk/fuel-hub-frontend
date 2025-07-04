
/**
 * @file pages/dashboard/StationsPage.tsx
 * @description Enhanced Stations page with realistic fuel station design
 * Updated with modern glassmorphism design – 2025-07-04
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Eye, Fuel, Building2, MapPin, Users, Zap } from 'lucide-react';
import { ColorfulCard, CardHeader as ColorfulCardHeader, CardContent as ColorfulCardContent } from '@/components/ui/colorful-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { useStations } from '@/hooks/api/useStations';

export default function StationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: stations = [], isLoading, error } = useStations();

  // Transform stations data to ensure all properties exist
  const stationsWithDefaults = stations.map(station => ({
    ...station,
    pumpCount: (station as any).pumpCount || 0,
    metrics: (station as any).metrics || { totalSales: 0, activePumps: 0, totalPumps: 0 }
  }));

  const filteredStations = stationsWithDefaults.filter(station =>
    station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    station.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center py-8 text-white">
          <h2 className="text-xl font-semibold mb-2">Error loading stations</h2>
          <p className="text-blue-200">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Background Section */}
      <div className="relative bg-gradient-to-r from-blue-900/50 to-slate-900/50 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
        
        <div className="relative space-y-6 p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
                FuelSync Stations
              </h1>
              <p className="text-blue-200 text-lg">
                Manage your fuel station network with precision
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="relative w-full md:w-auto">
                <Label htmlFor="search" className="sr-only text-white">
                  Search stations
                </Label>
                <Input
                  id="search"
                  type="search"
                  placeholder="Search stations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-80 bg-white/10 border-white/20 text-white placeholder:text-blue-200 backdrop-blur-md"
                />
              </div>
              <Button asChild className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 shadow-lg shadow-blue-500/30">
                <Link to="/dashboard/stations/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Station
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Building2 className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-blue-200 text-sm">Total Stations</p>
                  <p className="text-white text-2xl font-bold">{stations.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Zap className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="text-blue-200 text-sm">Active</p>
                  <p className="text-white text-2xl font-bold">
                    {stations.filter(s => s.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Fuel className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-blue-200 text-sm">Total Pumps</p>
                  <p className="text-white text-2xl font-bold">
                    {stations.reduce((sum, s) => sum + s.pumpCount, 0)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Users className="h-6 w-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-blue-200 text-sm">Staff</p>
                  <p className="text-white text-2xl font-bold">
                    {stations.reduce((sum, s) => sum + s.attendantCount, 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stations Grid */}
      <div className="p-6 lg:p-8">
        {stations.length === 0 ? (
          <ColorfulCard gradient="from-white/10 via-blue-500/5 to-purple-500/10" className="backdrop-blur-md border border-white/20">
            <ColorfulCardContent className="text-center py-12">
              <Building2 className="h-16 w-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Stations Added Yet</h3>
              <p className="text-blue-200 mb-6">
                Get started by adding your first fuel station to the network.
              </p>
              <Button asChild className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 shadow-lg shadow-blue-500/30">
                <Link to="/dashboard/stations/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Station
                </Link>
              </Button>
            </ColorfulCardContent>
          </ColorfulCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStations.map((station) => (
              <ColorfulCard 
                key={station.id} 
                gradient="from-white/10 via-blue-500/5 to-purple-500/10"
                className="backdrop-blur-md border border-white/20 group"
              >
                <ColorfulCardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg">
                        <Building2 className="h-6 w-6 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-white text-lg truncate group-hover:text-blue-300 transition-colors">
                          {station.name}
                        </h3>
                        <div className="flex items-center gap-1 text-blue-200 text-sm mt-1">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{station.address}</span>
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={station.status} size="sm" />
                  </div>
                </ColorfulCardHeader>
                
                <ColorfulCardContent>
                  <div className="space-y-4">
                    {/* Stats Row */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                          <Fuel className="h-4 w-4 text-blue-400" />
                          <div>
                            <p className="text-xs text-blue-200">Pumps</p>
                            <p className="font-bold text-white">{station.pumpCount}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-green-400" />
                          <div>
                            <p className="text-xs text-blue-200">Staff</p>
                            <p className="font-bold text-white">{station.attendantCount}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Revenue Display */}
                    {station.metrics && (
                      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-3 border border-green-500/30">
                        <p className="text-green-200 text-xs mb-1">Today's Revenue</p>
                        <p className="text-white font-bold text-lg">₹{station.metrics.totalSales.toLocaleString()}</p>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button asChild size="sm" className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm">
                        <Link to={`/dashboard/stations/${station.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span className="hidden sm:inline">View</span>
                        </Link>
                      </Button>
                      <Button asChild size="sm" className="flex-1 bg-gradient-to-r from-blue-500/80 to-cyan-600/80 hover:from-blue-600 hover:to-cyan-700 text-white shadow-md">
                        <Link to={`/dashboard/stations/${station.id}/pumps`}>
                          <Fuel className="mr-2 h-4 w-4" />
                          <span className="hidden sm:inline">Pumps</span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                </ColorfulCardContent>
              </ColorfulCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
