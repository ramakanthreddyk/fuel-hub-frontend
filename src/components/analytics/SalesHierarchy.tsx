import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { unifiedReportsApi } from '@/api/unified-reports';
import { DailySalesReport } from '@/api/api-contract';

export function SalesHierarchy() {
  const [expandedStations, setExpandedStations] = useState<Set<string>>(new Set());
  const [expandedPumps, setExpandedPumps] = useState<Set<string>>(new Set());

  const { data: report, isLoading } = useQuery<DailySalesReport>({
    queryKey: ['sales-hierarchy-report'],
    queryFn: () => unifiedReportsApi.getDailySalesReport({ date: new Date().toISOString() }),
  });

  const toggleStation = (stationId: string) => {
    const newSet = new Set(expandedStations);
    if (newSet.has(stationId)) {
      newSet.delete(stationId);
    } else {
      newSet.add(stationId);
    }
    setExpandedStations(newSet);
  };

  const togglePump = (pumpId: string) => {
    const newSet = new Set(expandedPumps);
    if (newSet.has(pumpId)) {
      newSet.delete(pumpId);
    } else {
      newSet.add(pumpId);
    }
    setExpandedPumps(newSet);
  };

  if (isLoading) {
    return <div>Loading sales hierarchy...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Hierarchy</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Total Sales</TableHead>
              <TableHead>Total Volume</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {report?.stationSales.map((station) => (
              <>
                <TableRow key={station.stationId}>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => toggleStation(station.stationId)}>
                      {expandedStations.has(station.stationId) ? <ChevronDown /> : <ChevronRight />}
                      {station.stationName}
                    </Button>
                  </TableCell>
                  <TableCell>{station.totalSales}</TableCell>
                  <TableCell>{station.totalVolume}</TableCell>
                </TableRow>
                {expandedStations.has(station.stationId) &&
                  station.pumpSales.map((pump) => (
                    <>
                      <TableRow key={pump.pumpId}>
                        <TableCell className="pl-8">
                          <Button variant="ghost" size="sm" onClick={() => togglePump(pump.pumpId)}>
                            {expandedPumps.has(pump.pumpId) ? <ChevronDown /> : <ChevronRight />}
                            {pump.pumpName}
                          </Button>
                        </TableCell>
                        <TableCell>{pump.totalSales}</TableCell>
                        <TableCell>{pump.totalVolume}</TableCell>
                      </TableRow>
                      {expandedPumps.has(pump.pumpId) &&
                        pump.nozzleSales.map((nozzle) => (
                          <TableRow key={nozzle.nozzleId}>
                            <TableCell className="pl-16">{nozzle.nozzleName}</TableCell>
                            <TableCell>{nozzle.totalSales}</TableCell>
                            <TableCell>{nozzle.totalVolume}</TableCell>
                          </TableRow>
                        ))}
                    </>
                  ))}
              </>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
