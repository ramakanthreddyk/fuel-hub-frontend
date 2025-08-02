import { useState, useEffect } from "react";
import { 
  useAttendantStations, 
  useAttendantPumps, 
  useAttendantNozzles,
  useAttendantCreditors
} from "@/hooks/api/useAttendant";
import { useCanCreateReading, useCreateAttendantReading, useLatestNozzleReading } from "@/hooks/api/useAttendantReadings";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AttendantReadingFormProps {
  onSuccess?: () => void;
}

export function AttendantReadingForm({ onSuccess }: AttendantReadingFormProps) {
  const { toast } = useToast();
  const [selectedStationId, setSelectedStationId] = useState<string>("");
  const [selectedPumpId, setSelectedPumpId] = useState<string>("");
  const [selectedNozzleId, setSelectedNozzleId] = useState<string>("");
  const [readingValue, setReadingValue] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "upi" | "credit">("cash");
  const [creditorId, setCreditorId] = useState<string>("");

  // Fetch data using the attendant hooks
  const { data: stations = [], isLoading: stationsLoading } = useAttendantStations();
  const { data: pumps = [], isLoading: pumpsLoading } = useAttendantPumps(selectedStationId);
  const { data: nozzles = [], isLoading: nozzlesLoading } = useAttendantNozzles(selectedPumpId);
  const { data: creditors = [], isLoading: creditorsLoading } = useAttendantCreditors(selectedStationId);
  const { data: canCreateData } = useCanCreateReading(selectedNozzleId);
  const { data: latestReading } = useLatestNozzleReading(selectedNozzleId);
  
  // Mutations
  const createReading = useCreateAttendantReading();

  // Set default station if not selected
  useEffect(() => {
    if (!selectedStationId && stations.length > 0 && !stationsLoading) {
      setSelectedStationId(stations[0].id);
    }
  }, [stations, stationsLoading, selectedStationId]);

  // Handle station selection
  const handleStationChange = (value: string) => {
    setSelectedStationId(value);
    setSelectedPumpId("");
    setSelectedNozzleId("");
  };

  // Handle pump selection
  const handlePumpChange = (value: string) => {
    setSelectedPumpId(value);
    setSelectedNozzleId("");
  };

  // Handle nozzle selection
  const handleNozzleChange = (value: string) => {
    setSelectedNozzleId(value);
    setReadingValue("");
  };

  // Handle payment method selection
  const handlePaymentMethodChange = (value: "cash" | "card" | "upi" | "credit") => {
    setPaymentMethod(value);
    if (value !== "credit") {
      setCreditorId("");
    }
  };

  // Handle reading submission
  const handleSubmitReading = () => {
    if (!selectedNozzleId || !readingValue) {
      toast({
        title: "Missing Information",
        description: "Please select a nozzle and enter a reading value.",
        variant: "destructive",
      });
      return;
    }
    
    createReading.mutate({
      nozzleId: selectedNozzleId,
      reading: parseFloat(readingValue),
      recordedAt: new Date().toISOString(),
      paymentMethod,
      creditorId: paymentMethod === "credit" ? creditorId : undefined
    }, {
      onSuccess: () => {
        // Reset form
        setReadingValue("");
        // Toast notification is handled by the mutation hook to avoid duplicates
        if (onSuccess) onSuccess();
      },
      onError: (error: any) => {
        // Error toast is handled by the mutation hook to avoid duplicates
        console.error('Reading creation failed:', error);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Meter Reading</CardTitle>
        <CardDescription>Enter the current meter reading for the selected nozzle</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Station Selection */}
        <div className="space-y-2">
          <Label htmlFor="station">Station</Label>
          <Select value={selectedStationId || undefined} onValueChange={handleStationChange} disabled={stationsLoading}>
            <SelectTrigger id="station">
              <SelectValue placeholder={stationsLoading ? "Loading..." : "Select a station"} />
            </SelectTrigger>
            <SelectContent>
              {stations.map(station => (
                <SelectItem key={station.id} value={station.id || "default-id"}>
                  {station.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Pump Selection */}
        {selectedStationId && (
          <div className="space-y-2">
            <Label htmlFor="pump">Pump</Label>
            <Select value={selectedPumpId || undefined} onValueChange={handlePumpChange} disabled={pumpsLoading || !pumps?.length}>
              <SelectTrigger id="pump">
                <SelectValue placeholder={pumpsLoading ? "Loading..." : pumps?.length ? "Select a pump" : "No pumps available"} />
              </SelectTrigger>
              <SelectContent>
                {pumps?.map(pump => (
                  <SelectItem key={pump.id} value={pump.id || "default-pump-id"}>
                    {pump.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {/* Nozzle Selection */}
        {selectedPumpId && (
          <div className="space-y-2">
            <Label htmlFor="nozzle">Nozzle</Label>
            <Select value={selectedNozzleId || undefined} onValueChange={handleNozzleChange} disabled={nozzlesLoading || !nozzles?.length}>
              <SelectTrigger id="nozzle">
                <SelectValue placeholder={nozzlesLoading ? "Loading..." : nozzles?.length ? "Select a nozzle" : "No nozzles available"} />
              </SelectTrigger>
              <SelectContent>
                {nozzles?.map(nozzle => (
                  <SelectItem key={nozzle.id} value={nozzle.id || "default-nozzle-id"}>
                    Nozzle #{nozzle.nozzleNumber} - {nozzle.fuelType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {/* Reading Input */}
        {selectedNozzleId && (
          <>
            {latestReading && (
              <div className="text-sm bg-muted p-2 rounded">
                Previous reading: <span className="font-semibold">{latestReading.reading}</span>
              </div>
            )}
            
            {canCreateData?.canCreate === false && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Cannot create reading</AlertTitle>
                <AlertDescription>{canCreateData.reason}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="reading">Current Reading</Label>
              <Input 
                id="reading"
                type="number" 
                value={readingValue} 
                onChange={(e) => setReadingValue(e.target.value)}
                placeholder="Enter current meter reading"
                disabled={!canCreateData?.canCreate}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="payment">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={(value: any) => handlePaymentMethodChange(value)}>
                <SelectTrigger id="payment">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="credit">Credit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {paymentMethod === "credit" && (
              <div className="space-y-2">
                <Label htmlFor="creditor">Creditor</Label>
                <Select value={creditorId || undefined} onValueChange={setCreditorId} disabled={creditorsLoading || !creditors?.length}>
                  <SelectTrigger id="creditor">
                    <SelectValue placeholder={creditorsLoading ? "Loading..." : creditors?.length ? "Select a creditor" : "No creditors available"} />
                  </SelectTrigger>
                  <SelectContent>
                    {creditors?.map(creditor => (
                      <SelectItem key={creditor.id} value={creditor.id || "default-creditor-id"}>
                        {creditor.name || creditor.partyName || "Unknown Creditor"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmitReading} 
          disabled={!canCreateData?.canCreate || !readingValue || createReading.isPending || (paymentMethod === "credit" && !creditorId)}
          className="w-full"
        >
          {createReading.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : "Submit Reading"}
        </Button>
      </CardFooter>
    </Card>
  );
}
