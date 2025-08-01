/**
 * @file hooks/useSecureAPI.ts
 * @description React hooks for secure API interactions
 */
import { useState, useCallback, useEffect } from 'react';
import { secureAPI, RequestValidator } from '@/utils/apiSecurity';

interface APIState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseSecureAPIOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  validateResponse?: (data: any) => boolean;
  retryAttempts?: number;
  retryDelay?: number;
}

export function useSecureAPI<T = any>(
  endpoint: string,
  options: UseSecureAPIOptions = {}
) {
  const [state, setState] = useState<APIState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const {
    onSuccess,
    onError,
    validateResponse,
    retryAttempts = 3,
    retryDelay = 1000,
  } = options;

  const executeRequest = useCallback(
    async (
      method: 'GET' | 'POST' | 'PUT' | 'DELETE',
      data?: any,
      attempt = 1
    ): Promise<T | null> => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        let response: Response;

        switch (method) {
          case 'GET':
            response = await secureAPI.get(endpoint);
            break;
          case 'POST':
            response = await secureAPI.post(endpoint, data);
            break;
          case 'PUT':
            response = await secureAPI.put(endpoint, data);
            break;
          case 'DELETE':
            response = await secureAPI.delete(endpoint);
            break;
          default:
            throw new Error(`Unsupported method: ${method}`);
        }

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const responseData = await response.json();

        // Validate response if validator provided
        if (validateResponse && !validateResponse(responseData)) {
          throw new Error('Response validation failed');
        }

        setState({ data: responseData, loading: false, error: null });
        onSuccess?.(responseData);
        return responseData;
      } catch (error) {
        const errorMessage = (error as Error).message;

        // Retry logic for network errors
        if (
          attempt < retryAttempts &&
          (errorMessage.includes('network') || errorMessage.includes('fetch'))
        ) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
          return executeRequest(method, data, attempt + 1);
        }

        setState({ data: null, loading: false, error: errorMessage });
        onError?.(errorMessage);
        return null;
      }
    },
    [endpoint, onSuccess, onError, validateResponse, retryAttempts, retryDelay]
  );

  const get = useCallback(() => executeRequest('GET'), [executeRequest]);
  const post = useCallback((data: any) => executeRequest('POST', data), [executeRequest]);
  const put = useCallback((data: any) => executeRequest('PUT', data), [executeRequest]);
  const del = useCallback(() => executeRequest('DELETE'), [executeRequest]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    get,
    post,
    put,
    delete: del,
    reset,
  };
}

export function useSecureForm<T extends Record<string, any>>(
  endpoint: string,
  initialData: T,
  options: UseSecureAPIOptions = {}
) {
  const [formData, setFormData] = useState<T>(initialData);
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof T, string>>>({});
  const { post, put, loading, error } = useSecureAPI(endpoint, options);

  const validateField = useCallback((name: keyof T, value: any): string | null => {
    if (typeof value === 'string') {
      const validation = RequestValidator.validateInput(value);
      if (!validation.isValid) {
        return validation.errors[0];
      }

      // Email validation
      if (name === 'email' && !RequestValidator.validateEmail(value)) {
        return 'Please enter a valid email address';
      }
    }

    return null;
  }, []);

  const setFieldValue = useCallback(
    (name: keyof T, value: any) => {
      // Sanitize input
      const sanitizedValue = typeof value === 'string' 
        ? RequestValidator.sanitizeInput(value) 
        : value;

      setFormData(prev => ({ ...prev, [name]: sanitizedValue }));

      // Clear validation error
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));

      // Validate field
      const error = validateField(name, sanitizedValue);
      if (error) {
        setValidationErrors(prev => ({ ...prev, [name]: error }));
      }
    },
    [validateField]
  );

  const validateForm = useCallback((): boolean => {
    const errors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key as keyof T, value);
      if (error) {
        errors[key as keyof T] = error;
        isValid = false;
      }
    });

    setValidationErrors(errors);
    return isValid;
  }, [formData, validateField]);

  const submitForm = useCallback(
    async (method: 'POST' | 'PUT' = 'POST') => {
      if (!validateForm()) {
        return null;
      }

      return method === 'POST' ? post(formData) : put(formData);
    },
    [formData, validateForm, post, put]
  );

  const resetForm = useCallback(() => {
    setFormData(initialData);
    setValidationErrors({});
  }, [initialData]);

  return {
    formData,
    validationErrors,
    loading,
    error,
    setFieldValue,
    validateForm,
    submitForm,
    resetForm,
  };
}

export function useRateLimit() {
  const [rateLimitStatus, setRateLimitStatus] = useState({
    remaining: 100,
    resetTime: 0,
  });

  useEffect(() => {
    const updateStatus = () => {
      const status = secureAPI.getRateLimitStatus();
      setRateLimitStatus(status);
    };

    updateStatus();
    const interval = setInterval(updateStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  const isLimited = rateLimitStatus.remaining <= 0;
  const timeUntilReset = Math.max(0, rateLimitStatus.resetTime - Date.now());

  return {
    remaining: rateLimitStatus.remaining,
    isLimited,
    timeUntilReset,
    resetTime: rateLimitStatus.resetTime,
  };
}

export function useSecurityMonitoring() {
  const [securityEvents, setSecurityEvents] = useState<any[]>([]);

  useEffect(() => {
    const loadEvents = () => {
      const events = JSON.parse(localStorage.getItem('security_events') || '[]');
      setSecurityEvents(events);
    };

    loadEvents();
    
    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'security_events') {
        loadEvents();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Periodic refresh
    const interval = setInterval(loadEvents, 10000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const clearEvents = useCallback(() => {
    localStorage.removeItem('security_events');
    setSecurityEvents([]);
  }, []);

  const getEventsByType = useCallback((type: string) => {
    return securityEvents.filter(event => event.type === type);
  }, [securityEvents]);

  const getRecentEvents = useCallback((hours = 24) => {
    const cutoff = Date.now() - (hours * 60 * 60 * 1000);
    return securityEvents.filter(event => 
      new Date(event.timestamp).getTime() > cutoff
    );
  }, [securityEvents]);

  return {
    events: securityEvents,
    clearEvents,
    getEventsByType,
    getRecentEvents,
    totalEvents: securityEvents.length,
  };
}

export function useInputSanitization(initialValue = '') {
  const [value, setValue] = useState(initialValue);
  const [sanitizedValue, setSanitizedValue] = useState(
    RequestValidator.sanitizeInput(initialValue)
  );
  const [isValid, setIsValid] = useState(true);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleChange = useCallback((newValue: string) => {
    setValue(newValue);
    
    const sanitized = RequestValidator.sanitizeInput(newValue);
    setSanitizedValue(sanitized);
    
    const validation = RequestValidator.validateInput(newValue);
    setIsValid(validation.isValid);
    setValidationErrors(validation.errors);
  }, []);

  const reset = useCallback(() => {
    setValue(initialValue);
    setSanitizedValue(RequestValidator.sanitizeInput(initialValue));
    setIsValid(true);
    setValidationErrors([]);
  }, [initialValue]);

  return {
    value,
    sanitizedValue,
    isValid,
    validationErrors,
    onChange: handleChange,
    reset,
  };
}

export function useCSRFToken() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Get initial token
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    if (metaTag) {
      setToken(metaTag.getAttribute('content'));
    }

    // Watch for token changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'content') {
          const target = mutation.target as HTMLMetaElement;
          if (target.name === 'csrf-token') {
            setToken(target.content);
          }
        }
      });
    });

    if (metaTag) {
      observer.observe(metaTag, { attributes: true });
    }

    return () => observer.disconnect();
  }, []);

  const refreshToken = useCallback(() => {
    // This would typically make a request to get a new token
    // For now, we'll generate a new one client-side
    const newToken = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    const metaTag = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
    if (metaTag) {
      metaTag.content = newToken;
      setToken(newToken);
    }
  }, []);

  return {
    token,
    refreshToken,
    isValid: token !== null && token.length === 64,
  };
}
