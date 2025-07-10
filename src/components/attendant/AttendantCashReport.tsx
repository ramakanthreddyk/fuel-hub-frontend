import { useState } from "react";
import { useAttendantStations, useSubmitCashReport } from "@/hooks/api/useAttendant";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle } from "lucide-react";

interface AttendantCashReportProps {
  stationId?: string;
}

export function AttendantCashReport({ stationId: propStationId }: AttendantCashReportProps) {
  const [selectedStationId, setSelectedStationId] = useState<string>(propStationId || "");
  const [cashAmount, setCashAmount] = useState<string>("");
  const [cardAmount, setCardAmount] = useState<string>("");
  const [upiAmount, setUpiAmount] = useState<string>("");
  const [shift, setShift] = useState<"morning" | "afternoon" | "night">("morning");

  const { data: stations = [], isLoading: stationsLoading } = useAttendantStations();
  const submitCashReport = useSubmitCashReport();

  // Handle form submission
  const handleSubmit = () => {
    if (!selectedStationId || !cashAmount) return;

    submitCashReport.mutate({
      stationId: selectedStationId,
      cashAmount: parseFloat(cashAmount),
      cardAmount: cardAmount ? parseFloat(cardAmount) : undefined,
      upiAmount: upiAmount ? parseFloat(upiAmount) : undefined,
      reportDate: new Date().toISOString(),
      shift
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Cash Report</CardTitle>
        <CardDescription>Record the cash, card, and UPI payments for your shift</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Station Selection */}
        <div className="space-y-2">
          <Label htmlFor="station">Station</Label>
          <Select 
            value={selectedStationId || undefined} 
            onValueChange={setSelectedStationId} 
            disabled={stationsLoading || !!propStationId}
          >
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

        {/* Shift Selection */}
        <div className="space-y-2">
          <Label htmlFor="shift">Shift</Label>
          <Select value={shift} onValueChange={(value: "morning" | "afternoon" | "night") => setShift(value)}>
            <SelectTrigger id="shift">
              <SelectValue placeholder="Select shift" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="morning">Morning</SelectItem>
              <SelectItem value="afternoon">Afternoon</SelectItem>
              <SelectItem value="night">Night</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Cash Amount */}
        <div className="space-y-2">
          <Label htmlFor="cash">Cash Amount</Label>
          <Input
            id="cash"
            type="number"
            value={cashAmount}
            onChange={(e) => setCashAmount(e.target.value)}
            placeholder="Enter cash amount"
          />
        </div>

        {/* Card Amount */}
        <div className="space-y-2">
          <Label htmlFor="card">Card Amount</Label>
          <Input
            id="card"
            type="number"
            value={cardAmount}
            onChange={(e) => setCardAmount(e.target.value)}
            placeholder="Enter card amount"
          />
        </div>

        {/* UPI Amount */}
        <div className="space-y-2">
          <Label htmlFor="upi">UPI Amount</Label>
          <Input
            id="upi"
            type="number"
            value={upiAmount}
            onChange={(e) => setUpiAmount(e.target.value)}
            placeholder="Enter UPI amount"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          disabled={!selectedStationId || !cashAmount || submitCashReport.isPending}
          className="w-full"
        >
          {submitCashReport.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : "Submit Cash Report"}
        </Button>
      </CardFooter>

      {submitCashReport.isSuccess && (
        <div className="px-6 pb-4">
          <Alert variant="default" className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Cash report submitted successfully</AlertDescription>
          </Alert>
        </div>
      )}
    </Card>
  );
}