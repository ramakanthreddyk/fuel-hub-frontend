
import { useState } from "react";
import { useAttendantStations, useSubmitCashReport } from "@/hooks/api/useAttendant";
import { useCreditors } from "@/hooks/api/useCreditors";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AttendantCashReportProps {
  stationId?: string;
}

export function AttendantCashReport({ stationId: propStationId }: AttendantCashReportProps) {
  const { toast } = useToast();
  const [selectedStationId, setSelectedStationId] = useState<string>(propStationId || "");
  const [cashAmount, setCashAmount] = useState<string>("");
  const [cardAmount, setCardAmount] = useState<string>("");
  const [upiAmount, setUpiAmount] = useState<string>("");
  const [creditAmount, setCreditAmount] = useState<string>("");
  const [creditorId, setCreditorId] = useState<string>("");
  const [shift, setShift] = useState<"morning" | "afternoon" | "night">("morning");

  const { data: stations = [], isLoading: stationsLoading } = useAttendantStations();
  const { data: creditors = [] } = useCreditors();
  const submitCashReport = useSubmitCashReport();

  // Handle form submission
  const handleSubmit = () => {
    if (!selectedStationId || !cashAmount) {
      toast({
        title: "Missing Information",
        description: "Please select a station and enter cash amount.",
        variant: "destructive",
      });
      return;
    }

    // Validate numeric values
    const cashValue = parseFloat(cashAmount);
    const cardValue = cardAmount ? parseFloat(cardAmount) : 0;
    const upiValue = upiAmount ? parseFloat(upiAmount) : 0;
    const creditValue = creditAmount ? parseFloat(creditAmount) : 0;
    
    if (isNaN(cashValue) || cashValue < 0) {
      toast({
        title: "Invalid Cash Amount",
        description: "Please enter a valid cash amount.",
        variant: "destructive",
      });
      return;
    }
    
    if ((cardAmount && (isNaN(cardValue) || cardValue < 0)) || 
        (upiAmount && (isNaN(upiValue) || upiValue < 0)) ||
        (creditAmount && (isNaN(creditValue) || creditValue < 0))) {
      toast({
        title: "Invalid Amount",
        description: "Please enter valid amounts.",
        variant: "destructive",
      });
      return;
    }
    
    if (creditValue > 0 && !creditorId) {
      toast({
        title: "Missing Creditor",
        description: "Please select a creditor for credit amount.",
        variant: "destructive",
      });
      return;
    }

    submitCashReport.mutate({
      stationId: selectedStationId,
      cashAmount: cashValue,
      cardAmount: cardAmount ? cardValue : undefined,
      upiAmount: upiAmount ? upiValue : undefined,
      creditAmount: creditValue > 0 ? creditValue : undefined,
      creditorId: creditValue > 0 ? creditorId : undefined,
      reportDate: new Date().toISOString(),
      shift
    }, {
      onSuccess: () => {
        const totalAmount = cashValue + cardValue + upiValue + creditValue;
        toast({
          title: "Cash Report Submitted",
          description: `Successfully submitted ${shift} shift report for ₹${totalAmount.toFixed(2)}`,
          variant: "success",
        });
        // Reset form
        setCashAmount("");
        setCardAmount("");
        setUpiAmount("");
        setCreditAmount("");
        setCreditorId("");
      },
      onError: (error: any) => {
        const errorMessage = error.response?.data?.message || 
                           error.message || 
                           "Please try again.";
        toast({
          title: "Failed to Submit Report",
          description: errorMessage,
          variant: "destructive",
        });
        console.error("Cash report submission error:", error);
      }
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

        {/* Credit Amount */}
        <div className="space-y-2">
          <Label htmlFor="credit">Credit Amount</Label>
          <Input
            id="credit"
            type="number"
            value={creditAmount}
            onChange={(e) => setCreditAmount(e.target.value)}
            placeholder="Enter credit amount"
          />
        </div>

        {/* Creditor Selection */}
        {creditAmount && parseFloat(creditAmount) > 0 && (
          <div className="space-y-2">
            <Label htmlFor="creditor">Creditor</Label>
            <Select value={creditorId} onValueChange={setCreditorId}>
              <SelectTrigger id="creditor">
                <SelectValue placeholder="Select creditor" />
              </SelectTrigger>
              <SelectContent>
                {creditors.map(creditor => (
                  <SelectItem key={creditor.id} value={creditor.id}>
                    {creditor.party_name || creditor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
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
    </Card>
  );
}
