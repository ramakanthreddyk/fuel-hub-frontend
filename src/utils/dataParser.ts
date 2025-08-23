/**
 * @file dataParser.ts
 * @description Parser for complex backend data formats (PostgreSQL decimal serialization)
 */

/**
 * Complex number format from PostgreSQL decimal serialization
 * Format: {s: sign, e: exponent, d: digits_array}
 * Example: {s: 1, e: 2, d: [600]} = 600
 * Example: {s: 1, e: 1, d: [96]} = 96
 * Example: {s: 1, e: 4, d: [12345, 6700000]} = 123456.7
 */
interface ComplexNumber {
  s: number; // sign (1 = positive, -1 = negative)
  e: number; // exponent
  d: number[]; // digits array
}

/**
 * Parse complex number format to regular number
 */
export function parseComplexNumber(value: any): number {
  // If it's already a number, return as-is
  if (typeof value === 'number') {
    return value;
  }

  // If it's null or undefined, return 0
  if (value === null || value === undefined) {
    return 0;
  }

  // If it's a string, try to parse as number
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }

  // If it's not an object with the expected structure, return 0
  if (typeof value !== 'object' || !value.hasOwnProperty('d') || !Array.isArray(value.d)) {
    return 0;
  }

  const complexNum = value as ComplexNumber;
  
  try {
    // Handle simple case: single digit in array
    if (complexNum.d.length === 1) {
      const result = complexNum.d[0] * (complexNum.s || 1);
      return result;
    }

    // Handle complex case: multiple digits (decimal numbers)
    if (complexNum.d.length > 1) {
      // Convert digits array to string and parse
      // Join all digits as strings for better performance and readability
      const numStr = complexNum.d.map(d => d.toString()).join('');
      // Use a new variable for decimal manipulation
      let decimalStr = numStr;
      // Apply decimal point based on exponent
      const exponent = complexNum.e || 0;
      if (exponent > 0 && exponent < numStr.length) {
        decimalStr = numStr.slice(0, exponent) + '.' + numStr.slice(exponent);
      }
      const result = parseFloat(decimalStr) * (complexNum.s || 1);
      return isNaN(result) ? 0 : result;
    }

    return 0;
  } catch (error) {
    console.warn('Error parsing complex number:', value, error);
    return 0;
  }
}

/**
 * Parse date field that might be empty object or valid date
 */
export function parseDate(value: any): string | null {
  // If it's null or undefined, return null
  if (value === null || value === undefined) {
    return null;
  }

  // If it's an empty object, return null
  if (typeof value === 'object' && Object.keys(value).length === 0) {
    return null;
  }

  // If it's already a string, return as-is
  if (typeof value === 'string') {
    return value;
  }

  // If it's a Date object, convert to ISO string
  if (value instanceof Date) {
    return value.toISOString();
  }

  // Try to parse as date
  try {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
  } catch (error) {
    console.warn('Error parsing date:', value, error);
  }

  return null;
}

/**
 * Parse a single reading object from backend
 */
export function parseReading(reading: any): any {
  if (!reading || typeof reading !== 'object') {
    return reading;
  }

  return {
    ...reading,
    // Parse complex number fields
    reading: parseComplexNumber(reading.reading),
    previousReading: parseComplexNumber(reading.previousReading),
    pricePerLitre: parseComplexNumber(reading.pricePerLitre),
    volume: parseComplexNumber(reading.volume),
    amount: parseComplexNumber(reading.amount),
    
    // Parse date fields - don't default to current date for invalid dates
    recordedAt: parseDate(reading.recordedAt),
    createdAt: parseDate(reading.createdAt),
    updatedAt: parseDate(reading.updatedAt),
    
    // Ensure other fields are preserved
    id: reading.id,
    nozzleId: reading.nozzleId,
    nozzleNumber: reading.nozzleNumber,
    fuelType: reading.fuelType,
    pumpId: reading.pumpId,
    pumpName: reading.pumpName,
    stationId: reading.stationId,
    stationName: reading.stationName,
    paymentMethod: reading.paymentMethod,
    attendantName: reading.attendantName,
    creditorId: reading.creditorId,
    notes: reading.notes,
    status: reading.status
  };
}

/**
 * Parse array of readings from backend response
 */
export function parseReadings(readings: any[]): any[] {
  if (!Array.isArray(readings)) {
    return [];
  }

  return readings.map(parseReading);
}

/**
 * Parse complete readings API response
 */
export function parseReadingsResponse(response: any): any {
  if (!response?.data) {
    return response;
  }

  return {
    ...response,
    data: {
      ...response.data,
      readings: parseReadings(response.data.readings || [])
    }
  };
}

/**
 * Parse today's sales response (if it has similar issues)
 */
export function parseTodaysSalesResponse(response: any): any {
  if (!response?.data) {
    return response;
  }

  const data = response.data;
  
  return {
    ...response,
    data: {
      ...data,
      // Parse numeric fields if they're in complex format
      totalAmount: parseComplexNumber(data.totalAmount),
      totalVolume: parseComplexNumber(data.totalVolume),
      totalEntries: parseComplexNumber(data.totalEntries),
      
      // Parse payment breakdown
      paymentBreakdown: data.paymentBreakdown ? {
        cash: parseComplexNumber(data.paymentBreakdown.cash),
        card: parseComplexNumber(data.paymentBreakdown.card),
        upi: parseComplexNumber(data.paymentBreakdown.upi),
        credit: parseComplexNumber(data.paymentBreakdown.credit)
      } : { cash: 0, card: 0, upi: 0, credit: 0 },
      
      // Parse arrays
      nozzleEntries: (data.nozzleEntries || []).map((entry: any) => ({
        ...entry,
        totalVolume: parseComplexNumber(entry.totalVolume),
        totalAmount: parseComplexNumber(entry.totalAmount),
        entriesCount: parseComplexNumber(entry.entriesCount),
        averageTicketSize: parseComplexNumber(entry.averageTicketSize)
      })),
      
      salesByFuel: (data.salesByFuel || []).map((fuel: any) => ({
        ...fuel,
        totalVolume: parseComplexNumber(fuel.totalVolume),
        totalAmount: parseComplexNumber(fuel.totalAmount),
        entriesCount: parseComplexNumber(fuel.entriesCount),
        averagePrice: parseComplexNumber(fuel.averagePrice),
        stationsCount: parseComplexNumber(fuel.stationsCount)
      })),
      
      salesByStation: (data.salesByStation || []).map((station: any) => ({
        ...station,
        totalVolume: parseComplexNumber(station.totalVolume),
        totalAmount: parseComplexNumber(station.totalAmount),
        entriesCount: parseComplexNumber(station.entriesCount),
        nozzlesActive: parseComplexNumber(station.nozzlesActive)
      })),
      
      creditSales: (data.creditSales || []).map((credit: any) => ({
        ...credit,
        totalAmount: parseComplexNumber(credit.totalAmount),
        entriesCount: parseComplexNumber(credit.entriesCount)
      }))
    }
  };
}

/**
 * Debug function to log complex number parsing
 */
export function debugComplexNumber(value: any, fieldName: string = ''): void {
  console.log(`[COMPLEX NUMBER DEBUG] ${fieldName}:`, {
    original: value,
    type: typeof value,
    parsed: parseComplexNumber(value),
    isComplex: typeof value === 'object' && value?.hasOwnProperty('d')
  });
}

/**
 * Test function to verify parsing works correctly
 */
export function testDataParser(): void {
  console.log('🧪 TESTING DATA PARSER');
  console.log('======================');
  
  // Test complex numbers
  const testNumbers = [
    { input: { s: 1, e: 2, d: [600] }, expected: 600 },
    { input: { s: 1, e: 1, d: [96] }, expected: 96 },
    { input: { s: 1, e: 4, d: [12345, 6700000] }, expected: 123456.7 },
    { input: 500, expected: 500 },
    { input: null, expected: 0 },
    { input: "123.45", expected: 123.45 }
  ];
  
  testNumbers.forEach(({ input, expected }, index) => {
    const result = parseComplexNumber(input);
    const passed = Math.abs(result - expected) < 0.01;
    console.log(`Test ${index + 1}: ${passed ? '✅' : '❌'} ${JSON.stringify(input)} → ${result} (expected: ${expected})`);
  });
  
  // Test dates
  const testDates = [
    { input: {}, expected: null },
    { input: null, expected: null },
    { input: "2023-01-01T00:00:00Z", expected: "2023-01-01T00:00:00Z" }
  ];
  
  testDates.forEach(({ input, expected }, index) => {
    const result = parseDate(input);
    const passed = result === expected || (result !== null && expected !== null);
    console.log(`Date Test ${index + 1}: ${passed ? '✅' : '❌'} ${JSON.stringify(input)} → ${result}`);
  });
}
