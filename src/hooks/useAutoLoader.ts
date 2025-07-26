import { useEffect } from 'react';
import { useGlobalLoader } from '@/hooks/useGlobalLoader';

export const useAutoLoader = (isLoading: boolean, message?: string) => {
  const { show, hide } = useGlobalLoader();

  useEffect(() => {
    if (isLoading) {
      show(message);
    } else {
      hide();
    }
  }, [isLoading, message, show, hide]);
};