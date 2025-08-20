import { toast } from 'sonner';
import { useCallback } from 'react';
import { useGlobalLoader } from '@/hooks/useGlobalLoader';
import { formatReading, formatVolume } from '@/utils/formatters';
import { isNaN } from 'lodash';

export const useToastNotifications = () => {
  const { show: showLoader, hide: hideLoader } = useGlobalLoader();

  const showSuccess = useCallback((title: string, description?: string | number) => {
    hideLoader();
    const formattedDescription = description && !isNaN(Number(description))
      ? formatVolume(description, 2) // Ensure 2 decimal places
      : 'N/A';
    toast.success(title, {
      description: formattedDescription,
      duration: 3000,
    });
  }, [hideLoader]);

  const showError = useCallback((title: string, description?: string | number) => {
    hideLoader();
    const formattedDescription = description && !isNaN(Number(description))
      ? formatVolume(description, 2) // Ensure 2 decimal places
      : 'N/A';
    toast.error(title, {
      description: formattedDescription,
      duration: 5000,
    });
  }, [hideLoader]);

  const showWarning = useCallback((title: string, description?: string) => {
    hideLoader();
    toast.warning(title, {
      description,
      duration: 4000,
    });
  }, [hideLoader]);

  const showInfo = useCallback((title: string, description?: string) => {
    hideLoader();
    toast.info(title, {
      description,
      duration: 4000,
    });
  }, [hideLoader]);

  const showLoading = useCallback((message: string) => {
    return toast.loading(message);
  }, []);

  const handleApiResponse = useCallback((response: any, successMessage?: string) => {
    if (response?.success) {
      if (successMessage) {
        showSuccess(successMessage);
      }
    } else {
      showError('Operation Failed', response?.message || 'An error occurred');
    }
  }, [showSuccess, showError]);

  const handleApiError = useCallback((error: any, context?: string) => {
    hideLoader();

    // Check if this is actually an authentication error
    const isAuthError = error?.response?.status === 401 || error?.response?.status === 403;
    const isNetworkError = !error?.response || error?.code === 'ERR_NETWORK';
    const isServerError = error?.response?.status >= 500;

    // Get the actual error message
    const message = error?.response?.data?.message || error?.message || 'An unexpected error occurred';

    // Don't show "Invalid or expired token" for non-auth errors
    let displayMessage = message;
    let title = context ? `${context} Failed` : 'Error';

    if (isAuthError) {
      title = 'Authentication Error';
      displayMessage = 'Your session has expired. Please log in again.';
    } else if (isNetworkError) {
      title = 'Connection Error';
      displayMessage = 'Unable to connect to server. Please check your internet connection.';
    } else if (isServerError) {
      title = 'Server Error';
      displayMessage = 'Server is experiencing issues. Please try again later.';
    } else if (message.toLowerCase().includes('no data') || message.toLowerCase().includes('not found')) {
      // This is likely an empty data scenario, not an error
      console.log(`[API Info] ${context}: No data available`);
      return; // Don't show error toast for empty data
    }

    showError(title, displayMessage);
    console.error(`[API Error] ${title}:`, error);
  }, [hideLoader, showError]);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    handleApiResponse,
    handleApiError,
    showLoader,
    hideLoader,
  };
};