
/**
 * @file components/filters/DateRangePicker.tsx
 * @description Date range picker component
 */
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from 'lucide-react';

export interface DateRange {
  from?: Date;
  to?: Date;
}

interface DateRangePickerProps {
  value?: DateRange;
  onChange: (range: DateRange | undefined) => void;
  placeholder?: string;
}

export function DateRangePicker({ value, onChange, placeholder = "Select date range" }: DateRangePickerProps) {
  const [startDate, setStartDate] = useState(value?.from?.toISOString().split('T')[0] || '');
  const [endDate, setEndDate] = useState(value?.to?.toISOString().split('T')[0] || '');

  const handleApply = () => {
    if (startDate || endDate) {
      onChange({
        from: startDate ? new Date(startDate) : undefined,
        to: endDate ? new Date(endDate) : undefined
      });
    } else {
      onChange(undefined);
    }
  };

  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    onChange(undefined);
  };

  return (
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4 text-muted-foreground" />
      <Input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        placeholder="Start date"
        className="w-36"
      />
      <span className="text-muted-foreground">to</span>
      <Input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        placeholder="End date"
        className="w-36"
      />
      <Button onClick={handleApply} size="sm">Apply</Button>
      <Button onClick={handleClear} variant="outline" size="sm">Clear</Button>
    </div>
  );
}
