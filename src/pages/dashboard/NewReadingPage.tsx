
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Gauge, Fuel, Clock, CheckCircle } from 'lucide-react';
import { stationsApi } from '@/api/stations';
import { useToast } from '@/hooks/use-toast';

export default function NewReadingPage() {
  const [selectedStation, setSelectedStation] = useState('');
  const [readings, setReadings] = useState({
    pump1: '',
    pump2: '',
    pump3: '',
    diesel: '',
    petrol: '',
    premium: ''
  });
  
  const { toast } = useToast();

  const { data: stations } = useQuery({
    queryKey: ['stations'],
    queryFn: stationsApi.getStations
  });

  const handleSubmitReading = () => {
    if (!selectedStation) {
      toast({
        title: "Error",
        description: "Please select a station first",
        variant: "destructive",
      });
      return;
    }

    // Here you would submit to the readings API
    toast({
      title: "Success",
      description: "Reading submitted successfully",
    });

    // Reset form
    setReadings({
      pump1: '',
      pump2: '',
      pump3: '',
      diesel: '',
      petrol: '',
      premium: ''
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Reading</h1>
        <p className="text-muted-foreground">Submit fuel pump and tank readings</p>
      </div>

      <div className="grid gap-6">
        {/* Station Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fuel className="h-5 w-5" />
              Station Selection
            </CardTitle>
            <CardDescription>
              Choose the station for this reading
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Label htmlFor="station">Station</Label>
              <Select value={selectedStation} onValueChange={setSelectedStation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a station" />
                </SelectTrigger>
                <SelectContent>
                  {stations?.map((station) => (
                    <SelectItem key={station.id} value={station.id}>
                      <div className="flex items-center gap-2">
                        {station.name}
                        <Badge variant={station.status === 'active' ? 'default' : 'secondary'}>
                          {station.status}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Pump Readings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              Pump Readings
            </CardTitle>
            <CardDescription>
              Enter current meter readings for each pump
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor="pump1">Pump 1 (Liters)</Label>
                <Input
                  id="pump1"
                  type="number"
                  value={readings.pump1}
                  onChange={(e) => setReadings({ ...readings, pump1: e.target.value })}
                  placeholder="Enter reading"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pump2">Pump 2 (Liters)</Label>
                <Input
                  id="pump2"
                  type="number"
                  value={readings.pump2}
                  onChange={(e) => setReadings({ ...readings, pump2: e.target.value })}
                  placeholder="Enter reading"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pump3">Pump 3 (Liters)</Label>
                <Input
                  id="pump3"
                  type="number"
                  value={readings.pump3}
                  onChange={(e) => setReadings({ ...readings, pump3: e.target.value })}
                  placeholder="Enter reading"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tank Readings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fuel className="h-5 w-5" />
              Tank Readings
            </CardTitle>
            <CardDescription>
              Enter current fuel levels in storage tanks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor="diesel">Diesel Tank (Liters)</Label>
                <Input
                  id="diesel"
                  type="number"
                  value={readings.diesel}
                  onChange={(e) => setReadings({ ...readings, diesel: e.target.value })}
                  placeholder="Enter level"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="petrol">Petrol Tank (Liters)</Label>
                <Input
                  id="petrol"
                  type="number"
                  value={readings.petrol}
                  onChange={(e) => setReadings({ ...readings, petrol: e.target.value })}
                  placeholder="Enter level"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="premium">Premium Tank (Liters)</Label>
                <Input
                  id="premium"
                  type="number"
                  value={readings.premium}
                  onChange={(e) => setReadings({ ...readings, premium: e.target.value })}
                  placeholder="Enter level"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reading Info */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Reading Time: {new Date().toLocaleString()}
                </span>
              </div>
              <Button onClick={handleSubmitReading} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Submit Reading
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
