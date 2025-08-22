/**
 * @file reading-status-config.ts
 * @description Utility function for reading status configuration
 */
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export function getStatusConfig(status?: string) {
  switch (status) {
    case 'completed':
      return {
        color: 'bg-green-100 text-green-800 border-green-300',
        icon: CheckCircle,
        label: 'Completed',
      };
    case 'pending':
      return {
        color: 'bg-orange-100 text-orange-800 border-orange-300',
        icon: Clock,
        label: 'Pending',
      };
    case 'discrepancy':
      return {
        color: 'bg-red-100 text-red-800 border-red-300',
        icon: AlertTriangle,
        label: 'Discrepancy',
      };
    default:
      return {
        color: 'bg-gray-100 text-gray-800 border-gray-300',
        icon: AlertTriangle,
        label: 'Unknown',
      };
  }
}
