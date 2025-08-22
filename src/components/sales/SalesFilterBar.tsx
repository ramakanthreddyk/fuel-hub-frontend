import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { stationsApi } from '@/api/stations';
import { SalesFilters } from '@/api/sales';
import { ReusableSelect } from '@/components/readings/ReadingEntryForm';

interface SalesFilterBarProps {
  filters: SalesFilters;
  onFiltersChange: (filters: SalesFilters) => void;
}

export function SalesFilterBar({ filters, onFiltersChange }: SalesFilterBarProps) {
  const { data: stations = [] } = useQuery({
    queryKey: ['stations'],
    queryFn: () => stationsApi.getStations(),
  });

  const handleFilterChange = (key: keyof SalesFilters, value: string) => {
    const effectiveValue = value === 'all' ? undefined : value;
    const newFilters = { ...filters, [key]: effectiveValue };
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="grid gap-2">
            <Label htmlFor="station">Station</Label>
            <ReusableSelect
              value={filters.stationId || 'all'}
              onChange={(value) => handleFilterChange('stationId', value)}
              options={stations.map((station) => ({ id: station.id, name: station.name }))}
              placeholder="All stations"
            />
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
            <ReusableSelect
              value={filters.paymentMethod || 'all'}
              onChange={(value) => handleFilterChange('paymentMethod', value)}
              options={[
                { id: 'all', name: 'All methods' },
                { id: 'cash', name: 'Cash' },
                { id: 'card', name: 'Card' },
                { id: 'upi', name: 'UPI' },
                { id: 'credit', name: 'Credit' },
              ]}
              placeholder="All methods"
            />
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
