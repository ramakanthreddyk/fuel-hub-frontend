
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAttendantStations } from "@/hooks/api/useAttendant";
import { useInventory } from "@/hooks/api/useInventory";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ClipboardList } from "lucide-react";

interface InventoryItem {
  id: string;
  fuelType: string;
  currentStock: number;
  status: string;
}

export default function AttendantInventoryPage() {
  const [selectedStationId, setSelectedStationId] = useState<string>("");
  const { data: stations = [], isLoading: stationsLoading } = useAttendantStations();
  const { data: inventory = [], isLoading: inventoryLoading } = useInventory(selectedStationId);

  // Type assertion to ensure inventory is an array of InventoryItem
  const typedInventory = inventory as InventoryItem[];

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-3 mb-6">
        <ClipboardList className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Fuel Inventory</h1>
      </div>
      
      <div className="mb-6">
        <Label htmlFor="station">Select Station</Label>
        <Select value={selectedStationId} onValueChange={setSelectedStationId} disabled={stationsLoading}>
          <SelectTrigger id="station" className="w-full md:w-[300px]">
            <SelectValue placeholder={stationsLoading ? "Loading..." : "Select a station"} />
          </SelectTrigger>
          <SelectContent>
            {stations.map(station => (
              <SelectItem key={station.id} value={station.id}>
                {station.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {selectedStationId && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {inventoryLoading ? (
            Array(3).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-12 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))
          ) : typedInventory.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No inventory data available for this station</p>
              </CardContent>
            </Card>
          ) : (
            typedInventory.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle className="capitalize">{item.fuelType}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{(item.currentStock || 0).toFixed(2)} L</div>
                  <div className="text-sm text-muted-foreground">
                    Status: <span className={`font-medium ${getStatusColor(item.status)}`}>{item.status}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'normal':
      return 'text-green-600';
    case 'low':
      return 'text-amber-600';
    case 'critical':
      return 'text-red-600';
    case 'overstocked':
      return 'text-blue-600';
    default:
      return 'text-gray-600';
  }
}
