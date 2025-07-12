
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SearchableStationSelectorProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
}

export function SearchableStationSelector({ value, onChange, placeholder = "Select Station" }: SearchableStationSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="bg-white border-gray-300 text-gray-800 rounded-xl">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-white border-gray-200 z-50">
        <SelectItem value="all">All Stations</SelectItem>
        <SelectItem value="station1">Station 1</SelectItem>
        <SelectItem value="station2">Station 2</SelectItem>
      </SelectContent>
    </Select>
  );
}
