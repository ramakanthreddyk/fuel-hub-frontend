import toast from 'react-hot-toast';
import { useCallback } from 'react';
import { useGlobalLoader } from '@/hooks/useGlobalLoader';

export const useToastNotifications = () => {
  const { show: showLoader, hide: hideLoader } = useGlobalLoader();

  const showSuccess = useCallback((title: string, description?: string) => {
    hideLoader();
    toast.success(description ? `${title}: ${description}` : title);
  }, [hideLoader]);

  const showError = useCallback((title: string, description?: string) => {
    hideLoader();
    toast.error(description ? `${title}: ${description}` : title);
  }, [hideLoader]);

  const showWarning = useCallback((title: string, description?: string) => {
    hideLoader();
    toast(description ? `⚠️ ${title}: ${description}` : `⚠️ ${title}`, {
      icon: '⚠️',
      style: {
        background: '#fbbf24',
        color: '#000',
      },
    });
  }, [hideLoader]);

  const showInfo = useCallback((title: string, description?: string) => {
    hideLoader();
    toast(description ? `ℹ️ ${title}: ${description}` : `ℹ️ ${title}`, {
      icon: 'ℹ️',
      style: {
        background: '#3b82f6',
        color: '#fff',
      },
    });
  }, [hideLoader]);

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
    const message = error?.response?.data?.message || error?.message || 'An unexpected error occurred';
    toast.error(context ? `${context} Failed: ${message}` : message);
  }, [hideLoader]);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    handleApiResponse,
    handleApiError,
    showLoader,
    hideLoader,
  };
};