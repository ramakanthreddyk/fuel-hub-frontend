
import { format } from 'date-fns';

export const formatDate = (dateString: string): string => {
  try {
    return format(new Date(dateString), 'MMM dd, yyyy');
  } catch (error) {
    return 'Invalid Date';
  }
};

export const formatDateTime = (dateString: string): string => {
  try {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  } catch (error) {
    return 'Invalid Date';
  }
};

export const formatCurrency = (amount: number, currency: string = '₹'): string => {
  try {
    return `${currency}${amount.toLocaleString('en-IN')}`;
  } catch (error) {
    return `${currency}${amount}`;
  }
};

export const formatNumber = (num: number): string => {
  try {
    return num.toLocaleString('en-IN');
  } catch (error) {
    return num.toString();
  }
};
