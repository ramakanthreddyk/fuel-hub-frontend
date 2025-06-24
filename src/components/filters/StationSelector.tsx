
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStations } from '@/hooks/useStations';
import { Building2 } from 'lucide-react';

interface StationSelectorProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  showAll?: boolean;
  placeholder?: string;
}

export function StationSelector({ value, onChange, showAll = true, placeholder = "Select station" }: StationSelectorProps) {
  const { data: stations = [], isLoading } = useStations();

  return (
    <Select value={value || ''} onValueChange={(val) => onChange(val === 'all' ? undefined : val)}>
      <SelectTrigger className="w-[200px] bg-white">
        <Building2 className="h-4 w-4 mr-2 text-purple-600" />
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {showAll && (
          <SelectItem value="all">All Stations</SelectItem>
        )}
        {isLoading ? (
          <SelectItem value="loading" disabled>Loading...</SelectItem>
        ) : (
          stations.map((station) => (
            <SelectItem key={station.id} value={station.id}>
              {station.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
