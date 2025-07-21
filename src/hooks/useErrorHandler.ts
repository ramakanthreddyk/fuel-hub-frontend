import { useToast } from '@/hooks/use-toast';
import { isAxiosError } from 'axios';

interface ErrorResponse {
  message: string;
  error?: string;
  details?: Record<string, any>;
}

export function useErrorHandler() {
  const { toast } = useToast();

  const handleError = (error: unknown, defaultMessage: string) => {
    let title = 'Error';
    let description = defaultMessage;

    if (isAxiosError(error) && error.response) {
      const errorData = error.response.data as ErrorResponse;
      title = errorData.error || 'Error';
      description = errorData.message;

      if (errorData.details) {
        // Handle detailed errors, e.g., validation errors
        const details = Object.entries(errorData.details)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n');
        description += `\n${details}`;
      }
    } else if (error instanceof Error) {
      description = error.message;
    }

    toast({
      title,
      description,
      variant: 'destructive',
    });
  };

  return { handleError };
}
