/**
 * @file components/filters/StationSelector.tsx
 * @description Station selector component
 */
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStations } from '@/hooks/api/useStations';
import { Building2 } from 'lucide-react';

interface StationSelectorProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  showAll?: boolean;
  placeholder?: string;
}

export function StationSelector({ value, onChange, showAll = false, placeholder = "Select station" }: StationSelectorProps) {
  const { data: stations = [] } = useStations();

  return (
    <Select value={value || ''} onValueChange={(val) => onChange(val === 'all' ? undefined : val)}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {showAll && (
          <SelectItem value="all">All Stations</SelectItem>
        )}
        {stations.map((station) => (
          <SelectItem key={station.id} value={station.id}>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              {station.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}