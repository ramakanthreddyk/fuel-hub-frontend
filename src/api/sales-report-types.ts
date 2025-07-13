/**
 * Sales Report Types
 * 
 * This file contains types related to sales reports to avoid duplicate interface errors
 */

import { FuelTypeBreakdown, PaymentMethodBreakdown } from './api-contract';

export interface SalesReportSummary {
  totalRevenue: number;
  totalVolume: number;
  salesCount: number;
  averageTicketSize: number;
  byPaymentMethod?: PaymentMethodBreakdown[];
  byFuelType?: FuelTypeBreakdown[];
  paymentMethodBreakdown?: PaymentMethodBreakdown[]; // Alias
  fuelTypeBreakdown?: FuelTypeBreakdown[]; // Alias
  fuelTypeBreakdown2?: {
    petrol?: { volume: number; revenue: number };
    diesel?: { volume: number; revenue: number };
    premium?: { volume: number; revenue: number };
  };
  paymentMethodBreakdown2?: {
    cash?: number;
    card?: number;
    upi?: number;
    credit?: number;
  };
  // Additional properties needed by components
  cashSales?: number;
  creditSales?: number;
  cardSales?: number;
  upiSales?: number;
  growthPercentage?: number;
  totalProfit?: number;
  profitMargin?: number;
  period?: string;
  previousPeriodRevenue?: number;
}