import { useToast } from '@/hooks/use-toast';
import { useCallback } from 'react';
import { useGlobalLoader } from '@/hooks/useGlobalLoader';

export const useToastNotifications = () => {
  const { toast } = useToast();
  const { show: showLoader, hide: hideLoader } = useGlobalLoader();

  const showSuccess = useCallback((title: string, description?: string) => {
    toast({
      title,
      description,
      variant: 'default',
    });
  }, [toast]);

  const showError = useCallback((title: string, description?: string) => {
    toast({
      title,
      description,
      variant: 'destructive',
    });
  }, [toast]);

  const showWarning = useCallback((title: string, description?: string) => {
    toast({
      title: `⚠️ ${title}`,
      description,
      variant: 'default',
    });
  }, [toast]);

  const showInfo = useCallback((title: string, description?: string) => {
    toast({
      title: `ℹ️ ${title}`,
      description,
      variant: 'default',
    });
  }, [toast]);

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
    const message = error?.response?.data?.message || error?.message || 'An unexpected error occurred';
    showError(context ? `${context} Failed` : 'Error', message);
  }, [showError]);

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