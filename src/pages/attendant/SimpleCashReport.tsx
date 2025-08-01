/**
 * @file SimpleCashReport.tsx
 * @description SUPER SIMPLE cash reporting for attendants
 * 
 * ATTENDANT WORKFLOW:
 * 1. See today's sales total
 * 2. Enter cash collected (big number pad)
 * 3. Enter card/UPI if any
 * 4. Submit (big green button)
 * 5. Done!
 */
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  Banknote, 
  CreditCard,
  Smartphone,
  CheckCircle,
  Calculator,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/api/client';
import { useToast } from '@/hooks/use-toast';

interface TodaysSales {
  totalSales: number;
  cashSales: number;
  cardSales: number;
  upiSales: number;
  existingCashReport?: {
    cashCollected: number;
    cardCollected: number;
    upiCollected: number;
  };
}

export default function SimpleCashReport() {
  const [salesData, setSalesData] = useState<TodaysSales | null>(null);
  const [cashAmount, setCashAmount] = useState('');
  const [cardAmount, setCardAmount] = useState('');
  const [upiAmount, setUpiAmount] = useState('');
  const [activeInput, setActiveInput] = useState<'cash' | 'card' | 'upi'>('cash');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch today's sales data
  const fetchTodaysSales = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/attendant/todays-sales');
      const data = response.data.data;
      setSalesData(data);
      
      // Pre-fill if there's existing cash report
      if (data.existingCashReport) {
        setCashAmount(data.existingCashReport.cashCollected.toString());
        setCardAmount(data.existingCashReport.cardCollected.toString());
        setUpiAmount(data.existingCashReport.upiCollected.toString());
      }
    } catch (error) {
      console.error('Error fetching today\'s sales:', error);
      toast({
        title: "Error",
        description: "Failed to load today's sales data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodaysSales();
  }, []);

  // Submit cash report
  const handleSubmit = async () => {
    const cash = parseFloat(cashAmount) || 0;
    const card = parseFloat(cardAmount) || 0;
    const upi = parseFloat(upiAmount) || 0;

    if (cash + card + upi <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter at least one amount",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      
      await apiClient.post('/attendant/cash-report', {
        stationId: 'default-station', // TODO: Get actual station ID
        cashAmount: cash,
        cardAmount: card,
        upiAmount: upi,
        notes: 'Reported by attendant'
      });

      toast({
        title: "Success!",
        description: `Cash report submitted: ${formatCurrency(cash + card + upi)}`,
        variant: "default"
      });

      // Go back to dashboard
      navigate('/attendant');
      
    } catch (error: any) {
      console.error('Error submitting cash report:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to submit cash report",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Number pad for amount entry
  const NumberPad = () => {
    const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '00'];
    
    const handleNumberClick = (num: string) => {
      const currentAmount = activeInput === 'cash' ? cashAmount : 
                           activeInput === 'card' ? cardAmount : upiAmount;
      
      if (currentAmount.length < 7) { // Limit to reasonable amount
        const newAmount = currentAmount + num;
        
        if (activeInput === 'cash') setCashAmount(newAmount);
        else if (activeInput === 'card') setCardAmount(newAmount);
        else setUpiAmount(newAmount);
      }
    };

    const handleClear = () => {
      if (activeInput === 'cash') setCashAmount('');
      else if (activeInput === 'card') setCardAmount('');
      else setUpiAmount('');
    };

    const handleBackspace = () => {
      if (activeInput === 'cash') setCashAmount(prev => prev.slice(0, -1));
      else if (activeInput === 'card') setCardAmount(prev => prev.slice(0, -1));
      else setUpiAmount(prev => prev.slice(0, -1));
    };

    return (
      <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
        {numbers.map((num) => (
          <Button
            key={num}
            variant="outline"
            size="lg"
            className="h-16 text-xl font-semibold"
            onClick={() => handleNumberClick(num)}
          >
            {num}
          </Button>
        ))}
        <Button
          variant="outline"
          size="lg"
          className="h-16 text-lg"
          onClick={handleBackspace}
        >
          ⌫
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="h-16 text-lg"
          onClick={handleClear}
        >
          Clear
        </Button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading sales data...</p>
        </div>
      </div>
    );
  }

  const totalCollected = (parseFloat(cashAmount) || 0) + (parseFloat(cardAmount) || 0) + (parseFloat(upiAmount) || 0);
  const difference = totalCollected - (salesData?.totalSales || 0);

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/attendant')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Report Cash</h1>
          <p className="text-gray-600">Enter cash, card & UPI collected</p>
        </div>
      </div>

      {/* Today's Sales Summary */}
      {salesData && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <TrendingUp className="h-5 w-5" />
              Today's Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {formatCurrency(salesData.totalSales)}
              </div>
              <p className="text-blue-700">Total sales from readings</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Amount Entry Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Enter Amounts Collected
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Payment Method Tabs */}
          <div className="flex gap-2">
            <Button
              variant={activeInput === 'cash' ? "default" : "outline"}
              className="flex-1"
              onClick={() => setActiveInput('cash')}
            >
              <Banknote className="h-4 w-4 mr-2" />
              Cash
            </Button>
            <Button
              variant={activeInput === 'card' ? "default" : "outline"}
              className="flex-1"
              onClick={() => setActiveInput('card')}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Card
            </Button>
            <Button
              variant={activeInput === 'upi' ? "default" : "outline"}
              className="flex-1"
              onClick={() => setActiveInput('upi')}
            >
              <Smartphone className="h-4 w-4 mr-2" />
              UPI
            </Button>
          </div>

          {/* Amount Display */}
          <div className="text-center">
            <Label className="text-lg font-medium capitalize">{activeInput} Amount (₹)</Label>
            <div className="text-4xl font-bold text-green-600 mt-2 mb-4">
              {activeInput === 'cash' ? (cashAmount ? formatCurrency(parseFloat(cashAmount)) : '₹0') :
               activeInput === 'card' ? (cardAmount ? formatCurrency(parseFloat(cardAmount)) : '₹0') :
               (upiAmount ? formatCurrency(parseFloat(upiAmount)) : '₹0')}
            </div>
          </div>

          {/* Number Pad */}
          <NumberPad />

          {/* Manual Input */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Or type manually:</p>
            <Input
              type="number"
              placeholder={`Enter ${activeInput} amount`}
              value={activeInput === 'cash' ? cashAmount : activeInput === 'card' ? cardAmount : upiAmount}
              onChange={(e) => {
                if (activeInput === 'cash') setCashAmount(e.target.value);
                else if (activeInput === 'card') setCardAmount(e.target.value);
                else setUpiAmount(e.target.value);
              }}
              className="text-center text-xl font-semibold max-w-xs mx-auto"
            />
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      {(cashAmount || cardAmount || upiAmount) && (
        <Card className="bg-gray-50">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Summary</h3>
            <div className="space-y-2 text-sm">
              {cashAmount && (
                <div className="flex justify-between">
                  <span>Cash:</span>
                  <span className="font-medium">{formatCurrency(parseFloat(cashAmount))}</span>
                </div>
              )}
              {cardAmount && (
                <div className="flex justify-between">
                  <span>Card:</span>
                  <span className="font-medium">{formatCurrency(parseFloat(cardAmount))}</span>
                </div>
              )}
              {upiAmount && (
                <div className="flex justify-between">
                  <span>UPI:</span>
                  <span className="font-medium">{formatCurrency(parseFloat(upiAmount))}</span>
                </div>
              )}
              <hr />
              <div className="flex justify-between font-semibold">
                <span>Total Collected:</span>
                <span>{formatCurrency(totalCollected)}</span>
              </div>
              {salesData && (
                <div className="flex justify-between text-xs">
                  <span>Sales Total:</span>
                  <span>{formatCurrency(salesData.totalSales)}</span>
                </div>
              )}
              {salesData && (
                <div className={`flex justify-between text-xs ${difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <span>Difference:</span>
                  <span>{difference >= 0 ? '+' : ''}{formatCurrency(difference)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      {totalCollected > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6 text-center">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-green-800">Ready to Submit</h3>
              <p className="text-green-700">
                Total: {formatCurrency(totalCollected)}
              </p>
            </div>
            
            <Button
              size="lg"
              className="w-full max-w-xs bg-green-600 hover:bg-green-700"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Submit Cash Report
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Help */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800">💡 Tips:</h4>
              <ul className="text-sm text-blue-700 mt-1 space-y-1">
                <li>• Count all cash received from customers</li>
                <li>• Include card payments if you handled them</li>
                <li>• Include UPI payments if you handled them</li>
                <li>• Small differences are normal</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
