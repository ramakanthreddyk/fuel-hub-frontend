
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

  const { data: stations } = useQuery({
    queryKey: ['stations'],
    queryFn: stationsApi.getStations,
  });

  const handleFilterChange = (key: keyof SalesFilters, value: string) => {
    const newFilters = { ...filters, [key]: value || undefined };
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
              value={filters.stationId || ''}
              onValueChange={(value) => handleFilterChange('stationId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All stations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All stations</SelectItem>
                {stations?.map((station) => (
                  <SelectItem key={station.id} value={station.id}>
                    {station.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="fromDate">From Date</Label>
            <Input
              type="date"
              value={filters.fromDate || ''}
              onChange={(e) => handleFilterChange('fromDate', e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="toDate">To Date</Label>
            <Input
              type="date"
              value={filters.toDate || ''}
              onChange={(e) => handleFilterChange('toDate', e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select
              value={filters.paymentMethod || ''}
              onValueChange={(value) => handleFilterChange('paymentMethod', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All methods" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All methods</SelectItem>
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
