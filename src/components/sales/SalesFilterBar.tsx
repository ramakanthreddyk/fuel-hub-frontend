
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { stationsApi } from '@/api/stations';
import { SalesFilters } from '@/api/sales';

interface SalesFilterBarProps {
  onFiltersChange: (filters: SalesFilters) => void;
}

export function SalesFilterBar({ onFiltersChange }: SalesFilterBarProps) {
  const [filters, setFilters] = useState<SalesFilters>({});

  const { data: stations = [] } = useQuery({
    queryKey: ['stations'],
    queryFn: stationsApi.getStations,
  });

  const handleFilterChange = (key: keyof SalesFilters, value: string) => {
    // If value is 'all', treat it as undefined (no filter)
    const effectiveValue = value === 'all' ? undefined : value;
    const newFilters = { ...filters, [key]: effectiveValue };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFiltersChange({});
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="grid gap-2">
            <Label htmlFor="station">Station</Label>
            <Select
              value={filters.stationId || 'all'}
              onValueChange={(value) => handleFilterChange('stationId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All stations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All stations</SelectItem>
                {Array.isArray(stations) && stations.map((station) => (
                  <SelectItem key={station.id} value={station.id}>
                    {station.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="startDate">From Date</Label>
            <Input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="endDate">To Date</Label>
            <Input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select
              value={filters.paymentMethod || 'all'}
              onValueChange={(value) => handleFilterChange('paymentMethod', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All methods" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All methods</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="credit">Credit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button variant="outline" onClick={clearFilters} className="w-full">
              Clear Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
