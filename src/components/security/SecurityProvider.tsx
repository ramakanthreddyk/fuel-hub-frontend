/**
 * @file components/security/SecurityProvider.tsx
 * @description Security context provider for managing security features
 */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { RateLimiter, SecureStorage, getCSRFToken } from '@/utils/security';

interface SecuritySettings {
  enableCSRF: boolean;
  enableRateLimiting: boolean;
  enableSecureStorage: boolean;
  sessionTimeout: number; // in minutes
  maxLoginAttempts: number;
  requireHTTPS: boolean;
}

interface SecurityContextType {
  settings: SecuritySettings;
  updateSettings: (settings: Partial<SecuritySettings>) => void;
  isSecureContext: boolean;
  rateLimiter: RateLimiter;
  secureStorage: typeof SecureStorage;
  getCSRFToken: () => string | null;
  validateSession: () => boolean;
  extendSession: () => void;
  clearSession: () => void;
  reportSecurityEvent: (event: SecurityEvent) => void;
}

interface SecurityEvent {
  type: 'login_attempt' | 'csrf_violation' | 'rate_limit_exceeded' | 'session_expired' | 'suspicious_activity';
  details: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

const defaultSettings: SecuritySettings = {
  enableCSRF: true,
  enableRateLimiting: true,
  enableSecureStorage: true,
  sessionTimeout: 30, // 30 minutes
  maxLoginAttempts: 5,
  requireHTTPS: true,
};

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};

interface SecurityProviderProps {
  children: React.ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<SecuritySettings>(() => {
    // Load settings from secure storage
    const saved = localStorage.getItem('security-settings');
    if (saved) {
      try {
        return { ...defaultSettings, ...JSON.parse(saved) };
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  const [isSecureContext, setIsSecureContext] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(Date.now());
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [rateLimiter] = useState(() => new RateLimiter(settings.maxLoginAttempts));

  useEffect(() => {
    // Check if we're in a secure context
    const checkSecureContext = () => {
      const isSecure = window.location.protocol === 'https:' ||
                      window.location.hostname === 'localhost' ||
                      window.location.hostname === '127.0.0.1';
      setIsSecureContext(isSecure);

      if (settings.requireHTTPS && !isSecure) {
        reportSecurityEvent({
          type: 'suspicious_activity',
          details: { reason: 'Non-HTTPS connection detected' },
          severity: 'medium',
        });
      }
    };

    checkSecureContext();
  }, [settings.requireHTTPS]);

  useEffect(() => {
    // Session timeout monitoring
    const checkSession = () => {
      const now = Date.now();
      const sessionAge = now - sessionStartTime;
      const inactivityTime = now - lastActivity;

      const sessionTimeoutMs = settings.sessionTimeout * 60 * 1000;

      if (sessionAge > sessionTimeoutMs || inactivityTime > sessionTimeoutMs) {
        reportSecurityEvent({
          type: 'session_expired',
          details: { sessionAge, inactivityTime },
          severity: 'low',
        });
        clearSession();
      }
    };

    const interval = setInterval(checkSession, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [sessionStartTime, lastActivity, settings.sessionTimeout]);

  useEffect(() => {
    // Activity monitoring
    const updateActivity = () => {
      setLastActivity(Date.now());
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, []);

  useEffect(() => {
    // Save settings to storage
    localStorage.setItem('security-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<SecuritySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const validateSession = (): boolean => {
    const now = Date.now();
    const sessionAge = now - sessionStartTime;
    const inactivityTime = now - lastActivity;
    const sessionTimeoutMs = settings.sessionTimeout * 60 * 1000;

    return sessionAge <= sessionTimeoutMs && inactivityTime <= sessionTimeoutMs;
  };

  const extendSession = () => {
    setLastActivity(Date.now());
  };

  const clearSession = () => {
    // Clear sensitive data
    sessionStorage.clear();
    SecureStorage.removeItem('auth-token');
    SecureStorage.removeItem('user-data');
    
    // Reset session timing
    setSessionStartTime(Date.now());
    setLastActivity(Date.now());

    // Redirect to login if needed
    if (window.location.pathname !== '/login') {
      window.location.href = '/login?reason=session_expired';
    }
  };

  const reportSecurityEvent = (event: SecurityEvent) => {
    // Log security event
    console.warn(`Security Event [${event.severity.toUpperCase()}]:`, event);

    // Store in secure storage for analysis
    const events = JSON.parse(localStorage.getItem('security-events') || '[]');
    events.push({
      ...event,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    });

    // Keep only last 100 events
    if (events.length > 100) {
      events.splice(0, events.length - 100);
    }

    localStorage.setItem('security-events', JSON.stringify(events));

    // Send to server in production
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/security/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': getCSRFToken() || '',
        },
        body: JSON.stringify(event),
      }).catch(error => {
        console.warn('Failed to report security event:', error);
      });
    }
  };

  const value: SecurityContextType = {
    settings,
    updateSettings,
    isSecureContext,
    rateLimiter,
    secureStorage: SecureStorage,
    getCSRFToken,
    validateSession,
    extendSession,
    clearSession,
    reportSecurityEvent,
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};

// Security monitoring component
export const SecurityMonitor: React.FC = () => {
  const { isSecureContext, settings, reportSecurityEvent } = useSecurity();

  useEffect(() => {
    // Monitor for security violations
    const checkSecurityViolations = () => {
      // Check for developer tools
      if (typeof window !== 'undefined') {
        const devtools = {
          open: false,
          orientation: null as string | null,
        };

        const threshold = 160;

        setInterval(() => {
          if (
            window.outerHeight - window.innerHeight > threshold ||
            window.outerWidth - window.innerWidth > threshold
          ) {
            if (!devtools.open) {
              devtools.open = true;
              reportSecurityEvent({
                type: 'suspicious_activity',
                details: { reason: 'Developer tools detected' },
                severity: 'low',
              });
            }
          } else {
            devtools.open = false;
          }
        }, 500);
      }

      // Monitor for suspicious console activity
      const originalConsole = { ...console };
      ['log', 'warn', 'error', 'info'].forEach(method => {
        (console as any)[method] = (...args: any[]) => {
          // Check for potential XSS attempts
          const message = args.join(' ');
          if (message.includes('<script>') || message.includes('javascript:')) {
            reportSecurityEvent({
              type: 'suspicious_activity',
              details: { reason: 'Potential XSS in console', message },
              severity: 'high',
            });
          }
          (originalConsole as any)[method](...args);
        };
      });
    };

    checkSecurityViolations();
  }, [reportSecurityEvent]);

  // Security warnings
  if (!isSecureContext && settings.requireHTTPS) {
    return (
      <div className="fixed top-0 left-0 right-0 bg-destructive text-destructive-foreground p-2 text-center z-50">
        ⚠️ Insecure Connection: This application requires HTTPS for security.
      </div>
    );
  }

  return null;
};

// Security settings panel
export const SecuritySettings: React.FC = () => {
  const { settings, updateSettings } = useSecurity();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Security Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure security features for your account
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium">CSRF Protection</label>
            <p className="text-xs text-muted-foreground">
              Protect against cross-site request forgery attacks
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.enableCSRF}
            onChange={(e) => updateSettings({ enableCSRF: e.target.checked })}
            className="toggle"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium">Rate Limiting</label>
            <p className="text-xs text-muted-foreground">
              Limit the number of requests to prevent abuse
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.enableRateLimiting}
            onChange={(e) => updateSettings({ enableRateLimiting: e.target.checked })}
            className="toggle"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium">Secure Storage</label>
            <p className="text-xs text-muted-foreground">
              Encrypt sensitive data stored locally
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.enableSecureStorage}
            onChange={(e) => updateSettings({ enableSecureStorage: e.target.checked })}
            className="toggle"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Session Timeout (minutes)</label>
          <input
            type="number"
            min="5"
            max="480"
            value={settings.sessionTimeout}
            onChange={(e) => updateSettings({ sessionTimeout: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border border-input px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Max Login Attempts</label>
          <input
            type="number"
            min="3"
            max="10"
            value={settings.maxLoginAttempts}
            onChange={(e) => updateSettings({ maxLoginAttempts: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border border-input px-3 py-2"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium">Require HTTPS</label>
            <p className="text-xs text-muted-foreground">
              Enforce secure connections only
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.requireHTTPS}
            onChange={(e) => updateSettings({ requireHTTPS: e.target.checked })}
            className="toggle"
          />
        </div>
      </div>
    </div>
  );
};
