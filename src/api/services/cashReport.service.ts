/**
 * @file api/services/cashReport.service.ts
 * @description Frontend service for cash report operations
 */
import { apiClient } from '@/api/client';

import { sanitizeUrlParam, secureLog } from '@/utils/security';
export interface CashReport {
  id: string;
  attendantId: string;
  attendantName: string;
  stationId: string;
  stationName: string;
  date: string;
  shift: 'morning' | 'afternoon' | 'night';
  cashAmount: number;
  cardAmount: number;
  upiAmount: number;
  creditAmount: number;
  totalAmount: number;
  variance: number;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCashReportData {
  stationId: string;
  date: string;
  shift: 'morning' | 'afternoon' | 'night';
  cashAmount: number;
  cardAmount: number;
  upiAmount: number;
  creditAmount: number;
  notes?: string;
}

/**
 * Get cash reports for the current user
 */
export async function getCashReports(): Promise<CashReport[]> {
  try {
    const response = await apiClient.get('/attendant/cash-reports');
    return response.data.reports || [];
  } catch (error) {
    secureLog.error('Error fetching cash reports:', error);
    throw new Error('Failed to fetch cash reports');
  }
}

/**
 * Get a specific cash report by ID
 */
export async function getCashReport(reportId: string): Promise<CashReport> {
  try {
    const response = await apiClient.get(`/attendant/cash-reports/${sanitizeUrlParam(reportId)}`);
    return response.data.report;
  } catch (error) {
    secureLog.error('Error fetching cash report:', error);
    throw new Error('Failed to fetch cash report');
  }
}

/**
 * Create a new cash report
 */
export async function createCashReport(data: CreateCashReportData): Promise<CashReport> {
  try {
    const response = await apiClient.post('/attendant/cash-report', data);
    return response.data.report;
  } catch (error) {
    secureLog.error('Error creating cash report:', error);
    return {
      id: '',
      attendantId: '',
      attendantName: '',
      stationId: '',
      stationName: '',
      date: '',
      shift: 'morning',
      cashAmount: 0,
      cardAmount: 0,
      upiAmount: 0,
      creditAmount: 0,
      totalAmount: 0,
      variance: 0,
      status: 'pending',
      notes: '',
      createdAt: '',
      updatedAt: ''
    };
  }
}

/**
 * Update a cash report
 */
export async function updateCashReport(reportId: string, data: Partial<CreateCashReportData>): Promise<CashReport> {
  try {
    const response = await apiClient.put(`/attendant/cash-reports/${sanitizeUrlParam(reportId)}`, data);
    return response.data.report;
  } catch (error) {
    secureLog.error('Error updating cash report:', error);
    return {
      id: '',
      attendantId: '',
      attendantName: '',
      stationId: '',
      stationName: '',
      date: '',
      shift: 'morning',
      cashAmount: 0,
      cardAmount: 0,
      upiAmount: 0,
      creditAmount: 0,
      totalAmount: 0,
      variance: 0,
      status: 'pending',
      notes: '',
      createdAt: '',
      updatedAt: ''
    };
  }
}

/**
 * Delete a cash report
 */
export async function deleteCashReport(reportId: string): Promise<void> {
  try {
    await apiClient.delete(`/attendant/cash-reports/${sanitizeUrlParam(reportId)}`);
  } catch (error) {
    secureLog.error('Error deleting cash report:', error);
    // Do not throw, just log error for safe default
  }
}

/**
 * Approve a cash report (for managers/owners)
 */
export async function approveCashReport(reportId: string): Promise<CashReport> {
  try {
    const response = await apiClient.post(`/attendant/cash-reports/${sanitizeUrlParam(reportId)}/approve`);
    return response.data.report;
  } catch (error) {
    secureLog.error('Error approving cash report:', error);
    throw new Error('Failed to approve cash report');
  }
}

/**
 * Reject a cash report (for managers/owners)
 */
export async function rejectCashReport(reportId: string, reason?: string): Promise<CashReport> {
  try {
    const response = await apiClient.post(`/attendant/cash-reports/${sanitizeUrlParam(reportId)}/reject`, { reason });
    return response.data.report;
  } catch (error) {
    secureLog.error('Error rejecting cash report:', error);
    throw new Error('Failed to reject cash report');
  }
}
