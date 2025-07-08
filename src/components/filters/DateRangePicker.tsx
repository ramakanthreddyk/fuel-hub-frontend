
/**
 * @file components/filters/DateRangePicker.tsx
 * @description Responsive date range picker component
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
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="Start date"
          className="w-full sm:w-32 text-xs sm:text-sm"
        />
      </div>
      <span className="text-muted-foreground text-xs sm:text-sm hidden sm:block">to</span>
      <Input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        placeholder="End date"
        className="w-full sm:w-32 text-xs sm:text-sm"
      />
      <div className="flex gap-2 w-full sm:w-auto">
        <Button onClick={handleApply} size="sm" className="flex-1 sm:flex-none text-xs">
          Apply
        </Button>
        <Button onClick={handleClear} variant="outline" size="sm" className="flex-1 sm:flex-none text-xs">
          Clear
        </Button>
      </div>
    </div>
  );
}
