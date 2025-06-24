
import { useState, useMemo } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, Building2 } from 'lucide-react';
import { useStations } from '@/hooks/useStations';
import { cn } from '@/lib/utils';

interface SearchableStationSelectorProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  showAll?: boolean;
  placeholder?: string;
  multiple?: boolean;
  selectedValues?: string[];
  onMultipleChange?: (values: string[]) => void;
}

export function SearchableStationSelector({ 
  value, 
  onChange, 
  showAll = true, 
  placeholder = "Select station",
  multiple = false,
  selectedValues = [],
  onMultipleChange
}: SearchableStationSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { data: stations = [], isLoading } = useStations();

  const filteredStations = useMemo(() => {
    if (!search) return stations;
    return stations.filter(station => 
      station.name.toLowerCase().includes(search.toLowerCase()) ||
      station.address.toLowerCase().includes(search.toLowerCase())
    );
  }, [stations, search]);

  const selectedStation = stations.find(s => s.id === value);

  const handleSelect = (stationId: string) => {
    if (multiple && onMultipleChange) {
      const newSelection = selectedValues.includes(stationId)
        ? selectedValues.filter(id => id !== stationId)
        : [...selectedValues, stationId];
      onMultipleChange(newSelection);
    } else {
      onChange(stationId === 'all' ? undefined : stationId);
      setOpen(false);
    }
  };

  const displayText = useMemo(() => {
    if (multiple) {
      if (selectedValues.length === 0) return placeholder;
      if (selectedValues.length === 1) {
        const station = stations.find(s => s.id === selectedValues[0]);
        return station?.name || 'Unknown Station';
      }
      return `${selectedValues.length} stations selected`;
    }
    return selectedStation?.name || placeholder;
  }, [multiple, selectedValues, selectedStation, placeholder, stations]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] justify-between bg-white"
        >
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-purple-600" />
            <span className="truncate">{displayText}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput 
            placeholder="Search stations..." 
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? 'Loading stations...' : 'No stations found.'}
            </CommandEmpty>
            <CommandGroup>
              {showAll && !multiple && (
                <CommandItem
                  value="all"
                  onSelect={() => handleSelect('all')}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      !value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  All Stations
                </CommandItem>
              )}
              {filteredStations.map((station) => (
                <CommandItem
                  key={station.id}
                  value={station.id}
                  onSelect={() => handleSelect(station.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      (multiple ? selectedValues.includes(station.id) : value === station.id)
                        ? "opacity-100" 
                        : "opacity-0"
                    )}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{station.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {station.address}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
