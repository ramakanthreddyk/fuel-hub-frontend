/**
 * @file hooks/useSecurity.ts
 * @description Security-related React hooks
 */
import { useCallback, useEffect, useState } from 'react';
import { useSecurity as useSecurityContext } from '@/components/security/SecurityProvider';
import { sanitizeInput, validateEmail, validatePassword } from '@/utils/security';

// Hook for secure form handling
export function useSecureForm<T extends Record<string, any>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getCSRFToken, reportSecurityEvent } = useSecurityContext();

  const setValue = useCallback((name: keyof T, value: any) => {
    // Sanitize input
    const sanitizedValue = typeof value === 'string' ? sanitizeInput(value) : value;
    
    setValues(prev => ({ ...prev, [name]: sanitizedValue }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }, [errors]);

  const setError = useCallback((name: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  const validateField = useCallback((name: keyof T, value: any): string | null => {
    // Email validation
    if (name === 'email' && value) {
      if (!validateEmail(value)) {
        return 'Please enter a valid email address';
      }
    }

    // Password validation
    if (name === 'password' && value) {
      const validation = validatePassword(value);
      if (!validation.isValid) {
        return validation.errors[0];
      }
    }

    // Required field validation
    if (!value && typeof value !== 'number') {
      return 'This field is required';
    }

    return null;
  }, []);

  const validate = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(values).forEach(key => {
      const error = validateField(key as keyof T, values[key as keyof T]);
      if (error) {
        newErrors[key as keyof T] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validateField]);

  const submit = useCallback(async (
    onSubmit: (values: T, csrfToken: string) => Promise<void>
  ) => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Validate form
      if (!validate()) {
        reportSecurityEvent({
          type: 'suspicious_activity',
          details: { reason: 'Form submission with validation errors' },
          severity: 'low',
        });
        return;
      }

      // Get CSRF token
      const csrfToken = getCSRFToken();
      if (!csrfToken) {
        throw new Error('CSRF token not available');
      }

      // Submit form
      await onSubmit(values, csrfToken);
    } catch (error) {
      console.error('Form submission error:', error);
      reportSecurityEvent({
        type: 'suspicious_activity',
        details: { reason: 'Form submission error', error: (error as Error).message },
        severity: 'medium',
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [values, isSubmitting, validate, getCSRFToken, reportSecurityEvent]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    isSubmitting,
    setValue,
    setError,
    validate,
    submit,
    reset,
  };
}

// Hook for rate limiting
export function useRateLimit(identifier: string, maxAttempts = 5, windowMs = 15 * 60 * 1000) {
  const { rateLimiter } = useSecurityContext();
  const [isBlocked, setIsBlocked] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState(maxAttempts);
  const [timeUntilReset, setTimeUntilReset] = useState(0);

  const checkLimit = useCallback(() => {
    const allowed = rateLimiter.isAllowed(identifier);
    const remaining = rateLimiter.getRemainingAttempts(identifier);
    const resetTime = rateLimiter.getTimeUntilReset(identifier);

    setIsBlocked(!allowed);
    setRemainingAttempts(remaining);
    setTimeUntilReset(resetTime);

    return allowed;
  }, [identifier, rateLimiter]);

  const reset = useCallback(() => {
    rateLimiter.reset(identifier);
    setIsBlocked(false);
    setRemainingAttempts(maxAttempts);
    setTimeUntilReset(0);
  }, [identifier, rateLimiter, maxAttempts]);

  useEffect(() => {
    checkLimit();
  }, [checkLimit]);

  return {
    isBlocked,
    remainingAttempts,
    timeUntilReset,
    checkLimit,
    reset,
  };
}

// Hook for session management
export function useSession() {
  const { validateSession, extendSession, clearSession } = useSecurityContext();
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    const checkSession = () => {
      const valid = validateSession();
      setIsValid(valid);
      
      if (!valid) {
        clearSession();
      }
    };

    // Check session validity every minute
    const interval = setInterval(checkSession, 60000);
    
    // Check immediately
    checkSession();

    return () => clearInterval(interval);
  }, [validateSession, clearSession]);

  const extend = useCallback(() => {
    extendSession();
    setIsValid(true);
  }, [extendSession]);

  const logout = useCallback(() => {
    clearSession();
    setIsValid(false);
  }, [clearSession]);

  return {
    isValid,
    extend,
    logout,
  };
}

// Hook for secure API requests
export function useSecureAPI() {
  const { getCSRFToken, reportSecurityEvent } = useSecurityContext();

  const secureRequest = useCallback(async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    // Add CSRF token to headers
    const csrfToken = getCSRFToken();
    const headers = new Headers(options.headers);
    
    if (csrfToken) {
      headers.set('X-CSRF-Token', csrfToken);
    }

    // Add security headers
    headers.set('X-Requested-With', 'XMLHttpRequest');
    
    // Ensure content type for POST/PUT requests
    if (['POST', 'PUT', 'PATCH'].includes(options.method?.toUpperCase() || '')) {
      if (!headers.get('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }
    }

    const secureOptions: RequestInit = {
      ...options,
      headers,
      credentials: 'same-origin', // Include cookies for same-origin requests
    };

    try {
      const response = await fetch(url, secureOptions);

      // Check for security-related errors
      if (response.status === 403) {
        reportSecurityEvent({
          type: 'csrf_violation',
          details: { url, method: options.method || 'GET' },
          severity: 'high',
        });
      }

      if (response.status === 429) {
        reportSecurityEvent({
          type: 'rate_limit_exceeded',
          details: { url, method: options.method || 'GET' },
          severity: 'medium',
        });
      }

      return response;
    } catch (error) {
      reportSecurityEvent({
        type: 'suspicious_activity',
        details: { 
          reason: 'API request failed', 
          url, 
          error: (error as Error).message 
        },
        severity: 'low',
      });
      throw error;
    }
  }, [getCSRFToken, reportSecurityEvent]);

  return { secureRequest };
}

// Hook for input sanitization
export function useSanitizedInput(initialValue = '') {
  const [value, setValue] = useState(initialValue);
  const [sanitizedValue, setSanitizedValue] = useState(sanitizeInput(initialValue));

  const handleChange = useCallback((newValue: string) => {
    setValue(newValue);
    setSanitizedValue(sanitizeInput(newValue));
  }, []);

  const reset = useCallback(() => {
    setValue(initialValue);
    setSanitizedValue(sanitizeInput(initialValue));
  }, [initialValue]);

  return {
    value,
    sanitizedValue,
    onChange: handleChange,
    reset,
  };
}

// Hook for password strength checking
export function usePasswordStrength(password: string) {
  const [strength, setStrength] = useState<{
    score: number;
    feedback: string[];
    isValid: boolean;
  }>({ score: 0, feedback: [], isValid: false });

  useEffect(() => {
    const validation = validatePassword(password);
    
    // Calculate strength score (0-4)
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

    setStrength({
      score,
      feedback: validation.errors,
      isValid: validation.isValid,
    });
  }, [password]);

  const getStrengthLabel = () => {
    switch (strength.score) {
      case 0:
      case 1: return 'Very Weak';
      case 2: return 'Weak';
      case 3: return 'Fair';
      case 4: return 'Good';
      case 5: return 'Strong';
      default: return 'Unknown';
    }
  };

  const getStrengthColor = () => {
    switch (strength.score) {
      case 0:
      case 1: return 'text-red-500';
      case 2: return 'text-orange-500';
      case 3: return 'text-yellow-500';
      case 4: return 'text-blue-500';
      case 5: return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return {
    ...strength,
    label: getStrengthLabel(),
    color: getStrengthColor(),
  };
}

// Hook for detecting suspicious activity
export function useSuspiciousActivityDetection() {
  const { reportSecurityEvent } = useSecurityContext();

  useEffect(() => {
    let rapidClickCount = 0;
    let rapidClickTimer: NodeJS.Timeout;

    const handleClick = () => {
      rapidClickCount++;
      
      clearTimeout(rapidClickTimer);
      rapidClickTimer = setTimeout(() => {
        if (rapidClickCount > 10) {
          reportSecurityEvent({
            type: 'suspicious_activity',
            details: { reason: 'Rapid clicking detected', count: rapidClickCount },
            severity: 'low',
          });
        }
        rapidClickCount = 0;
      }, 1000);
    };

    // Monitor for rapid clicking
    document.addEventListener('click', handleClick);

    // Monitor for copy/paste of sensitive data
    const handlePaste = (event: ClipboardEvent) => {
      const pastedText = event.clipboardData?.getData('text') || '';
      
      // Check for potential sensitive data patterns
      if (
        /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/.test(pastedText) || // Credit card
        /\b\d{3}-\d{2}-\d{4}\b/.test(pastedText) || // SSN
        /password|token|secret|key/i.test(pastedText) // Sensitive keywords
      ) {
        reportSecurityEvent({
          type: 'suspicious_activity',
          details: { reason: 'Potential sensitive data pasted' },
          severity: 'medium',
        });
      }
    };

    document.addEventListener('paste', handlePaste);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('paste', handlePaste);
      clearTimeout(rapidClickTimer);
    };
  }, [reportSecurityEvent]);
}
