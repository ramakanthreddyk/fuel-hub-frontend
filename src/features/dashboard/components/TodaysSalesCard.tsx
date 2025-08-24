
import React from 'react';
// Removed import of TodaysSalesSummary and related types since API response uses snake_case
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Fuel, TrendingUp, Users, CreditCard } from 'lucide-react';
import { FuelLoader } from '@/components/ui/FuelLoader';
import { formatCurrency, formatVolume } from '@/utils/formatters';
import { useTodaysSales } from '@/hooks/api/useTodaysSales';

export interface TodaysSalesCardProps {
  date?: string;
}

export const TodaysSalesCard: React.FC<TodaysSalesCardProps> = ({ date }) => {
  const { data: todaysSalesRaw, error, isLoading } = useTodaysSales(date);
  const todaysSales = todaysSalesRaw as any;

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <FuelLoader size="md" text="Loading today's sales..." />
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
          <div className="text-center text-gray-500 py-4">No sales data available</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          {`Today's Sales - ${todaysSales.date}`}
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
            <TabsTrigger value="nozzles">Nozzles ({todaysSales.nozzle_entries?.length ?? 0})</TabsTrigger>
            <TabsTrigger value="fuel">By Fuel ({todaysSales.sales_by_fuel?.length ?? 0})</TabsTrigger>
            <TabsTrigger value="stations">By Station ({todaysSales.sales_by_station?.length ?? 0})</TabsTrigger>
            <TabsTrigger value="credits">Credits ({todaysSales.credit_sales?.length ?? 0})</TabsTrigger>
          </TabsList>

          <TabsContent value="nozzles" className="mt-4">
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Fuel className="h-4 w-4" />
                Nozzle-wise Entries
              </h4>
              {todaysSales.nozzle_entries && todaysSales.nozzle_entries.length > 0 ? (
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
                      {todaysSales.nozzle_entries.map((entry, index) => (
                        <TableRow key={entry.nozzle_number || index}>
                          <TableCell>#{entry.nozzle_number}</TableCell>
                          <TableCell className="text-sm">{entry.station_name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{entry.fuel_type}</Badge>
                          </TableCell>
                          <TableCell>{entry.entries_count}</TableCell>
                          <TableCell>{formatVolume(entry.total_volume, 0)}</TableCell>
                          <TableCell>{formatCurrency(entry.total_amount, { maximumFractionDigits: 0 })}</TableCell>
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
              {todaysSales.sales_by_fuel && todaysSales.sales_by_fuel.length > 0 ? (
                <div className="grid gap-3">
                  {(todaysSales.sales_by_fuel as any[]).map((fuel, index) => (
                    <div key={fuel.fuel_type || index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{fuel.fuel_type ? fuel.fuel_type.toUpperCase() : 'N/A'}</div>
                        <div className="text-sm text-gray-600">
                          {fuel.entries_count !== undefined ? fuel.entries_count : 'N/A'} entries • {fuel.stations_count !== undefined ? fuel.stations_count : 'N/A'} stations
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(fuel.total_amount ?? 0, { maximumFractionDigits: 0, useLakhsCrores: true })}</div>
                        <div className="text-sm text-gray-600">{formatVolume(fuel.total_volume ?? 0, 0)}</div>
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
              {todaysSales.sales_by_station && todaysSales.sales_by_station.length > 0 ? (
                <div className="grid gap-3">
                  {(todaysSales.sales_by_station as any[]).map((station, index) => (
                    <div key={station.station_id || index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium">{station.station_name ?? 'N/A'}</div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(station.total_amount ?? 0, { maximumFractionDigits: 0, useLakhsCrores: true })}</div>
                          <div className="text-sm text-gray-600">{formatVolume(station.total_volume ?? 0, 0)}</div>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{station.entries_count !== undefined ? station.entries_count : 'N/A'} entries • {station.nozzles_active !== undefined ? station.nozzles_active : 'N/A'} nozzles active</span>
                        <span>Fuels: {Array.isArray(station.fuel_types) ? station.fuel_types.join(', ') : 'N/A'}</span>
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
              {todaysSales.credit_sales && todaysSales.credit_sales.length > 0 ? (
                <div className="grid gap-3">
                  {(todaysSales.credit_sales as any[]).map((credit, index) => (
                    <div key={`${credit.creditor_id}-${credit.station_id}` || index} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <div>
                        <div className="font-medium">{credit.creditor_name}</div>
                        <div className="text-sm text-gray-600">
                          {credit.station_name} • {credit.entries_count} entries
                        </div>
                      </div>
                      <div className="font-medium text-red-600">
                        {formatCurrency(credit.total_amount, { maximumFractionDigits: 0, useLakhsCrores: true })}
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
};
