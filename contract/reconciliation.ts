// Canonical contract for daily closure and reconciliation (sync with DB schema)
// Copy this file to both repos and keep in sync

export interface DayReconciliation {
  id: string;
  stationId: string;
  date: string;
  reportedCashAmount: number;
  varianceAmount: number;
  varianceReason?: string;
  closedBy: string;
  closedAt: string;
}

export interface ReconciliationDiff {
  id: string;
  stationId: string;
  date: string;
  type: string;
  description: string;
  resolved: boolean;
  createdAt: string;
  resolvedAt?: string;
}

export interface ReconciliationDiffSummary {
  total: number;
  unresolved: number;
  byType: Record<string, number>;
}

// Add more shared types as needed
