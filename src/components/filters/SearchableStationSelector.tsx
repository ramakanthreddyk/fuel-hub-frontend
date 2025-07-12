
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface SearchableStationSelectorProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  multiple?: boolean;
  selectedValues?: string[];
  onMultipleChange?: (values: string[]) => void;
}

export function SearchableStationSelector({ 
  value, 
  onChange, 
  placeholder = "Select Station",
  multiple = false,
  selectedValues = [],
  onMultipleChange
}: SearchableStationSelectorProps) {
  const stations = [
    { id: 'all', name: 'All Stations' },
    { id: 'station1', name: 'Station 1' },
    { id: 'station2', name: 'Station 2' },
    { id: 'station3', name: 'Station 3' },
  ];

  if (multiple) {
    const handleSelect = (stationId: string) => {
      if (!onMultipleChange) return;
      
      if (selectedValues.includes(stationId)) {
        onMultipleChange(selectedValues.filter(id => id !== stationId));
      } else {
        onMultipleChange([...selectedValues, stationId]);
      }
    };

    const handleRemove = (stationId: string) => {
      if (!onMultipleChange) return;
      onMultipleChange(selectedValues.filter(id => id !== stationId));
    };

    return (
      <div className="space-y-2">
        <Select onValueChange={handleSelect}>
          <SelectTrigger className="bg-white border-gray-300 text-gray-800 rounded-xl">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200 z-50">
            {stations.map((station) => (
              <SelectItem 
                key={station.id} 
                value={station.id}
                disabled={selectedValues.includes(station.id)}
              >
                {station.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {selectedValues.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedValues.map((stationId) => {
              const station = stations.find(s => s.id === stationId);
              return (
                <Badge key={stationId} variant="secondary" className="flex items-center gap-1">
                  {station?.name || stationId}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleRemove(stationId)}
                  />
                </Badge>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="bg-white border-gray-300 text-gray-800 rounded-xl">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-white border-gray-200 z-50">
        {stations.map((station) => (
          <SelectItem key={station.id} value={station.id}>
            {station.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
