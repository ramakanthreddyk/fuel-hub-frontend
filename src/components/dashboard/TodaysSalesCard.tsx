import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Fuel, TrendingUp, Users, CreditCard, Loader2 } from 'lucide-react';
import { formatCurrency, formatVolume } from '@/utils/formatters';
import { useTodaysSales } from '@/hooks/api/useTodaysSales';

interface TodaysSalesCardProps {
  date?: string;
}

export function TodaysSalesCard({ date }: TodaysSalesCardProps) {
  const { data: todaysSales, isLoading, error } = useTodaysSales(date);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Today's Sales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Today's Sales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-600">
            Error loading today's sales data
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!todaysSales) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Today's Sales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500">
            No sales data available for today
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Today's Sales - {todaysSales.date}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{todaysSales.totalEntries}</div>
            <div className="text-sm text-blue-800">Total Entries</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{formatVolume(todaysSales.totalVolume, 0)}</div>
            <div className="text-sm text-green-800">Total Volume</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(todaysSales.totalAmount, { maximumFractionDigits: 0, useLakhsCrores: true })}</div>
            <div className="text-sm text-purple-800">Total Amount</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {todaysSales.totalEntries > 0 ? formatCurrency(todaysSales.totalAmount / todaysSales.totalEntries, { maximumFractionDigits: 0 }) : '₹0'}
            </div>
            <div className="text-sm text-orange-800">Avg. Ticket</div>
          </div>
        </div>

        {/* Payment Breakdown - Only show if data exists */}
        {todaysSales.paymentBreakdown && (todaysSales.paymentBreakdown.cash > 0 || todaysSales.paymentBreakdown.card > 0 || todaysSales.paymentBreakdown.upi > 0 || todaysSales.paymentBreakdown.credit > 0) && (
          <div className="mb-6">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payment Breakdown
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm">Cash:</span>
                <span className="font-medium">{formatCurrency(todaysSales.paymentBreakdown.cash, { maximumFractionDigits: 0, useLakhsCrores: true })}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm">Card:</span>
                <span className="font-medium">{formatCurrency(todaysSales.paymentBreakdown.card, { maximumFractionDigits: 0, useLakhsCrores: true })}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm">UPI:</span>
                <span className="font-medium">{formatCurrency(todaysSales.paymentBreakdown.upi, { maximumFractionDigits: 0, useLakhsCrores: true })}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm">Credit:</span>
                <span className="font-medium">{formatCurrency(todaysSales.paymentBreakdown.credit, { maximumFractionDigits: 0, useLakhsCrores: true })}</span>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Tabs */}
        <Tabs defaultValue="nozzles" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="nozzles">Nozzles ({(todaysSales?.nozzleEntries || []).length})</TabsTrigger>
            <TabsTrigger value="fuel">By Fuel ({(todaysSales?.salesByFuel || []).length})</TabsTrigger>
            <TabsTrigger value="stations">By Station ({(todaysSales?.salesByStation || []).length})</TabsTrigger>
            <TabsTrigger value="credits">Credits ({(todaysSales?.creditSales || []).length})</TabsTrigger>
          </TabsList>

          <TabsContent value="nozzles" className="mt-4">
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Fuel className="h-4 w-4" />
                Nozzle-wise Entries
              </h4>
              {todaysSales.nozzleEntries?.length > 0 ? (
                <div className="max-h-64 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nozzle</TableHead>
                        <TableHead>Station</TableHead>
                        <TableHead>Fuel</TableHead>
                        <TableHead>Entries</TableHead>
                        <TableHead>Volume</TableHead>
                        <TableHead>Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(todaysSales.nozzleEntries || []).map((entry, index) => (
                        <TableRow key={entry.nozzleId || entry.nozzle_id || index}>
                          <TableCell>#{entry.nozzleNumber || entry.nozzle_number}</TableCell>
                          <TableCell className="text-sm">{entry.stationName || entry.station_name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{entry.fuelType || entry.fuel_type}</Badge>
                          </TableCell>
                          <TableCell>{entry.entriesCount || entry.entries_count}</TableCell>
                          <TableCell>{formatVolume(entry.totalVolume || entry.total_volume, 0)}</TableCell>
                          <TableCell>{formatCurrency(entry.totalAmount || entry.total_amount, { maximumFractionDigits: 0 })}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">No nozzle entries today</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="fuel" className="mt-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Sales by Fuel Type</h4>
              {todaysSales.salesByFuel?.length > 0 ? (
                <div className="grid gap-3">
                  {(todaysSales.salesByFuel || []).map((fuel, index) => (
                    <div key={fuel.fuelType || fuel.fuel_type || index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{(fuel.fuelType || fuel.fuel_type || '').toUpperCase()}</div>
                        <div className="text-sm text-gray-600">
                          {fuel.entriesCount || fuel.entries_count} entries • {fuel.stationsCount || fuel.stations_count} stations
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(fuel.totalAmount || fuel.total_amount, { maximumFractionDigits: 0, useLakhsCrores: true })}</div>
                        <div className="text-sm text-gray-600">{formatVolume(fuel.totalVolume || fuel.total_volume, 0)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">No fuel sales today</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="stations" className="mt-4">
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Users className="h-4 w-4" />
                Sales by Station
              </h4>
              {todaysSales.salesByStation?.length > 0 ? (
                <div className="grid gap-3">
                  {(todaysSales.salesByStation || []).map((station, index) => (
                    <div key={station.stationId || station.station_id || index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium">{station.stationName || station.station_name}</div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(station.totalAmount || station.total_amount, { maximumFractionDigits: 0, useLakhsCrores: true })}</div>
                          <div className="text-sm text-gray-600">{formatVolume(station.totalVolume || station.total_volume, 0)}</div>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{station.entriesCount || station.entries_count} entries • {station.nozzlesActive || station.nozzles_active} nozzles active</span>
                        <span>Fuels: {(station.fuelTypes || station.fuel_types || []).join(', ')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">No station sales today</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="credits" className="mt-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Credit Sales</h4>
              {todaysSales.creditSales?.length > 0 ? (
                <div className="grid gap-3">
                  {(todaysSales.creditSales || []).map((credit, index) => (
                    <div key={`${credit.creditorId}-${credit.stationId}` || index} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <div>
                        <div className="font-medium">{credit.creditorName || credit.creditor_name}</div>
                        <div className="text-sm text-gray-600">
                          {credit.stationName || credit.station_name} • {credit.entriesCount || credit.entries_count} entries
                        </div>
                      </div>
                      <div className="font-medium text-red-600">
                        {formatCurrency(credit.totalAmount || credit.total_amount, { maximumFractionDigits: 0, useLakhsCrores: true })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">No credit sales today</div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}