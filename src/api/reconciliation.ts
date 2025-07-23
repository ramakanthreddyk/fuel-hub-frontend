
import { apiClient, extractApiData, extractApiArray } from './client';
import type { 
  ReconciliationRecord, 
  CreateReconciliationRequest, 
  DailyReadingSummary,
  ApiResponse 
} from './api-contract';

export const reconciliationApi = {
  // Get daily readings summary for reconciliation
  getDailyReadingsSummary: async (stationId: string, date: string): Promise<DailyReadingSummary[]> => {
    try {
      if (!stationId || !date) {
        console.error('Error: stationId and date are required for daily readings summary');
        throw new Error('Station ID and date are required for daily readings summary');
      }
      
      console.log(`API Request: Getting daily readings summary for station ${stationId} on ${date}`);
      
      // Ensure the date is properly formatted (YYYY-MM-DD)
      const formattedDate = new Date(date).toISOString().split('T')[0];
      
      const response = await apiClient.get(`/reconciliation/daily-summary?stationId=${stationId}&date=${formattedDate}`);
      console.log('API Response:', response.data);
      
      const data = extractApiArray<DailyReadingSummary>(response, 'readings');
      console.log(`Extracted ${data.length} readings`);
      
      // Normalize the data to ensure it has all required fields
      return data.map(item => ({
        ...item,
        nozzleId: item.nozzleId || '',
        nozzleNumber: item.nozzleNumber || 0,
        previousReading: item.previousReading || item.openingReading || 0,
        currentReading: item.currentReading || item.closingReading || 0,
        deltaVolume: item.deltaVolume || item.totalVolume || 0,
        pricePerLitre: item.pricePerLitre || 0,
        saleValue: item.saleValue || item.revenue || 0,
        fuelType: item.fuelType || 'Unknown',
        // Add aliases for compatibility
        openingReading: item.openingReading || item.previousReading || 0,
        closingReading: item.closingReading || item.currentReading || 0,
        totalVolume: item.totalVolume || item.deltaVolume || 0,
        revenue: item.revenue || item.saleValue || 0,
        cashDeclared: item.cashDeclared || 0 // Ensure cashDeclared is always defined
      }));
    } catch (error: any) {
      console.error('Error fetching daily readings summary:', error);
      // Provide more detailed error information
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      console.error(`API Error Details: ${errorMessage}`);
      throw new Error(`Failed to fetch sales data: ${errorMessage}`);
    }
  },

  // Create new reconciliation record
  createReconciliation: async (data: CreateReconciliationRequest): Promise<ReconciliationRecord> => {
    try {
      // Validate required fields
      if (!data.stationId) throw new Error('Station ID is required');
      if (!data.date) throw new Error('Date is required');
      
      // First check if there are readings for this station and date
      const readings = await reconciliationApi.getDailyReadingsSummary(data.stationId, data.date);
      if (!readings || readings.length === 0) {
        throw new Error('Cannot create reconciliation: No nozzle readings found for this date. Please ensure readings are entered first.');
      }
      
      // Calculate totals to verify there's actual data
      const totals = readings.reduce((acc, reading) => ({
        volume: acc.volume + (reading.totalVolume || reading.deltaVolume || 0),
        revenue: acc.revenue + (reading.saleValue || reading.revenue || 0),
      }), { volume: 0, revenue: 0 });
      
      // Verify that there are actual readings with non-zero values
      if (totals.volume === 0 || totals.revenue === 0) {
        throw new Error('Cannot create reconciliation with zero sales volume or revenue. Please ensure valid readings are entered.');
      }
      
      // Check if reconciliation already exists for this station and date
      try {
        const existingRec = await reconciliationApi.getReconciliationByStationAndDate(data.stationId, data.date);
        if (existingRec && existingRec.finalized) {
          throw new Error('Reconciliation for this station and date has already been finalized.');
        }
      } catch (err: any) {
        // If error is not 404 (not found), rethrow it
        if (!err.response || err.response.status !== 404) {
          throw err;
        }
        // Otherwise, continue with creating a new reconciliation
      }
      
      const response = await apiClient.post('/reconciliation', data);
      const result = extractApiData<ReconciliationRecord>(response);
      
      // Check if the result has zero values, which might indicate a problem
      if (result.totalSales === 0 && result.cash_total === 0 && result.variance === 0) {
        console.warn('Warning: Reconciliation created with zero values. This might indicate missing data.');
      }
      
      // Ensure the result has all required fields
      return {
        ...result,
        id: result.id || '',
        stationId: result.stationId || data.stationId,
        date: result.date || data.date,
        openingReading: result.openingReading || 0,
        closingReading: result.closingReading || 0,
        variance: result.variance || 0,
        reconciliationNotes: result.reconciliationNotes || data.reconciliationNotes,
        managerConfirmation: result.managerConfirmation || data.managerConfirmation,
        createdAt: result.createdAt || new Date().toISOString(),
        finalized: result.finalized || false
      };
    } catch (error: any) {
      console.error('Error creating reconciliation:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to create reconciliation');
    }
  },

  // Get reconciliation history
  getReconciliationHistory: async (stationId?: string): Promise<ReconciliationRecord[]> => {
    try {
      const params = new URLSearchParams();
      if (stationId) params.append('stationId', stationId);
      
      const response = await apiClient.get(`/reconciliation?${params.toString()}`);
      const records = extractApiArray<ReconciliationRecord>(response, 'reconciliations');
      
      // Additional validation to ensure finalized flag is correct
      return records.map(record => {
        const hasReadings = (record.openingReading > 0 || record.closingReading > 0);
        const hasSales = (record.totalSales > 0 || record.cash_total > 0);
        const shouldBeFinalized = record.finalized && hasReadings && hasSales;
        
        return {
          ...record,
          finalized: shouldBeFinalized
        };
      });
    } catch (error) {
      console.error('Error fetching reconciliation history:', error);
      return [];
    }
  },

  // Get reconciliation by ID
  getReconciliationById: async (id: string): Promise<ReconciliationRecord> => {
    const response = await apiClient.get(`/reconciliation/${id}`);
    const record = extractApiData<ReconciliationRecord>(response);
    
    // Additional validation to ensure finalized flag is correct
    const hasReadings = (record.openingReading > 0 || record.closingReading > 0);
    const hasSales = (record.totalSales > 0 || record.cash_total > 0);
    const shouldBeFinalized = record.finalized && hasReadings && hasSales;
    
    return {
      ...record,
      finalized: shouldBeFinalized
    };
  },

  // Get reconciliation by station and date
  getReconciliationByStationAndDate: async (stationId: string, date: string): Promise<ReconciliationRecord> => {
    const response = await apiClient.get(`/reconciliation/${stationId}/${date}`);
    const record = extractApiData<ReconciliationRecord>(response);
    
    // Additional validation to ensure finalized flag is correct
    const hasReadings = (record.openingReading > 0 || record.closingReading > 0);
    const hasSales = (record.totalSales > 0 || record.cash_total > 0);
    const shouldBeFinalized = record.finalized && hasReadings && hasSales;
    
    return {
      ...record,
      finalized: shouldBeFinalized
    };
  },

  // Approve reconciliation
  approveReconciliation: async (id: string): Promise<ReconciliationRecord> => {
    const response = await apiClient.post(`/reconciliation/${id}/approve`);
    return extractApiData<ReconciliationRecord>(response);
  }
};
