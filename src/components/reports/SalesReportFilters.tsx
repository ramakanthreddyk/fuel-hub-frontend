
import { useQuery } from '@tanstack/react-query';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { stationsApi } from '@/api/stations';
import type { SalesReportFilters } from '@/api/api-contract';

interface SalesReportFiltersProps {
  readonly filters: SalesReportFilters;
  readonly onFiltersChange: (filters: SalesReportFilters) => void;
}

export function SalesReportFilters({ filters, onFiltersChange }: Readonly<SalesReportFiltersProps>) {
  const { data: stations } = useQuery({
    queryKey: ['stations'],
    queryFn: () => stationsApi.getStations(),
  });

  const handleFilterChange = (key: keyof SalesReportFilters, value: string) => {
    // If value is 'all', treat it as undefined (no filter)
    const effectiveValue = value === 'all' ? undefined : value;
    onFiltersChange({ ...filters, [key]: effectiveValue });
  };

  return (
    <Card className="bg-card border border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-card-foreground">Report Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="startDate" className="text-card-foreground">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={filters.dateFrom || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="bg-input border border-border text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate" className="text-card-foreground">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={filters.dateTo || new Date().toISOString().split('T')[0]}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="bg-input border border-border text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-card-foreground">Station</Label>
            <Select
              value={filters.stationId || 'all'}
              onValueChange={(value) => handleFilterChange('stationId', value)}
            >
              <SelectTrigger className="bg-input border border-border text-foreground">
                <SelectValue placeholder="All stations" />
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border">
                <SelectItem value="all">All stations</SelectItem>
                {stations?.map((station) => (
                  <SelectItem key={station.id} value={station.id}>
                    {station.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-card-foreground">Payment Method</Label>
            <Select
              value={filters.paymentMethod || 'all'}
              onValueChange={(value) => handleFilterChange('paymentMethod', value)}
            >
              <SelectTrigger className="bg-input border border-border text-foreground">
                <SelectValue placeholder="All methods" />
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border">
                <SelectItem value="all">All methods</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="credit">Credit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
