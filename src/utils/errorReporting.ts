/**
 * @file utils/errorReporting.ts
 * @description Comprehensive error reporting and monitoring system
 */

export interface ErrorReport {
  id: string;
  timestamp: Date;
  message: string;
  stack?: string;
  url: string;
  userAgent: string;
  userId?: string;
  sessionId: string;
  component?: string;
  action?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, any>;
  tags?: string[];
}

export interface ErrorMetrics {
  totalErrors: number;
  errorsByType: Record<string, number>;
  errorsBySeverity: Record<string, number>;
  errorsByComponent: Record<string, number>;
  recentErrors: ErrorReport[];
}

class ErrorReportingService {
  private static instance: ErrorReportingService;
  private reports: ErrorReport[] = [];
  private maxReports = 1000;
  private sessionId: string;
  private userId?: string;
  private isEnabled = true;

  static getInstance(): ErrorReportingService {
    if (!ErrorReportingService.instance) {
      ErrorReportingService.instance = new ErrorReportingService();
    }
    return ErrorReportingService.instance;
  }

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeGlobalErrorHandlers();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeGlobalErrorHandlers() {
    if (typeof window === 'undefined') return;

    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      this.reportError({
        error: event.error || new Error(event.message),
        component: 'Global',
        action: 'JavaScript Error',
        severity: 'high',
        context: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.reportError({
        error: new Error(`Unhandled Promise Rejection: ${event.reason}`),
        component: 'Global',
        action: 'Promise Rejection',
        severity: 'high',
        context: {
          reason: event.reason,
        },
      });
    });

    // Handle React errors (will be caught by error boundaries)
    const originalConsoleError = console.error;
    console.error = (...args) => {
      // Check if this is a React error
      const message = args.join(' ');
      if (message.includes('React') || message.includes('Warning:')) {
        this.reportError({
          error: new Error(message),
          component: 'React',
          action: 'React Warning/Error',
          severity: 'medium',
          context: { args },
        });
      }
      originalConsoleError.apply(console, args);
    };
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  reportError({
    error,
    component,
    action,
    severity = 'medium',
    context = {},
    tags = [],
  }: {
    error: Error;
    component?: string;
    action?: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    context?: Record<string, any>;
    tags?: string[];
  }) {
    if (!this.isEnabled) return;

    const report: ErrorReport = {
      id: this.generateErrorId(),
      timestamp: new Date(),
      message: error.message,
      stack: error.stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      userId: this.userId,
      sessionId: this.sessionId,
      component,
      action,
      severity,
      context: {
        ...context,
        ...this.getEnvironmentContext(),
      },
      tags,
    };

    this.addReport(report);
    this.sendToExternalService(report);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 Error Report [${severity.toUpperCase()}]`);
      console.error('Error:', error);
      console.log('Report:', report);
      console.groupEnd();
    }
  }

  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getEnvironmentContext() {
    return {
      timestamp: new Date().toISOString(),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      screen: {
        width: screen.width,
        height: screen.height,
      },
      memory: this.getMemoryInfo(),
      connection: this.getConnectionInfo(),
      performance: this.getPerformanceInfo(),
    };
  }

  private getMemoryInfo() {
    if ((performance as any).memory) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
      };
    }
    return null;
  }

  private getConnectionInfo() {
    if ((navigator as any).connection) {
      const connection = (navigator as any).connection;
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
      };
    }
    return null;
  }

  private getPerformanceInfo() {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        firstPaint: this.getFirstPaint(),
      };
    }
    return null;
  }

  private getFirstPaint() {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? firstPaint.startTime : null;
  }

  private addReport(report: ErrorReport) {
    this.reports.unshift(report);
    
    // Keep only the most recent reports
    if (this.reports.length > this.maxReports) {
      this.reports = this.reports.slice(0, this.maxReports);
    }

    // Store in localStorage for persistence
    try {
      const recentReports = this.reports.slice(0, 100); // Store only 100 most recent
      localStorage.setItem('error-reports', JSON.stringify(recentReports));
    } catch (error) {
      console.warn('Failed to store error reports in localStorage:', error);
    }
  }

  private async sendToExternalService(report: ErrorReport) {
    // In a real application, you would send this to your error reporting service
    // Examples: Sentry, Bugsnag, LogRocket, etc.
    
    if (process.env.NODE_ENV === 'production') {
      try {
        // Example: Send to your API endpoint
        await fetch('/api/errors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(report),
        });
      } catch (error) {
        console.warn('Failed to send error report to external service:', error);
      }
    }
  }

  getReports(): ErrorReport[] {
    return [...this.reports];
  }

  getMetrics(): ErrorMetrics {
    const errorsByType: Record<string, number> = {};
    const errorsBySeverity: Record<string, number> = {};
    const errorsByComponent: Record<string, number> = {};

    this.reports.forEach(report => {
      // Count by error type (based on message)
      const errorType = this.categorizeError(report.message);
      errorsByType[errorType] = (errorsByType[errorType] || 0) + 1;

      // Count by severity
      errorsBySeverity[report.severity] = (errorsBySeverity[report.severity] || 0) + 1;

      // Count by component
      if (report.component) {
        errorsByComponent[report.component] = (errorsByComponent[report.component] || 0) + 1;
      }
    });

    return {
      totalErrors: this.reports.length,
      errorsByType,
      errorsBySeverity,
      errorsByComponent,
      recentErrors: this.reports.slice(0, 10),
    };
  }

  private categorizeError(message: string): string {
    if (message.includes('Network') || message.includes('fetch')) return 'Network';
    if (message.includes('Permission') || message.includes('Unauthorized')) return 'Permission';
    if (message.includes('Validation') || message.includes('Invalid')) return 'Validation';
    if (message.includes('React') || message.includes('Component')) return 'React';
    if (message.includes('Promise') || message.includes('async')) return 'Async';
    return 'Unknown';
  }

  clearReports() {
    this.reports = [];
    localStorage.removeItem('error-reports');
  }

  exportReports(): string {
    return JSON.stringify(this.reports, null, 2);
  }

  importReports(data: string) {
    try {
      const reports = JSON.parse(data) as ErrorReport[];
      this.reports = reports.filter(report => 
        report.id && report.timestamp && report.message
      );
    } catch (error) {
      throw new Error('Invalid error reports data');
    }
  }

  // Load reports from localStorage on initialization
  loadStoredReports() {
    try {
      const stored = localStorage.getItem('error-reports');
      if (stored) {
        const reports = JSON.parse(stored) as ErrorReport[];
        this.reports = reports.map(report => ({
          ...report,
          timestamp: new Date(report.timestamp),
        }));
      }
    } catch (error) {
      console.warn('Failed to load stored error reports:', error);
    }
  }
}

// Export singleton instance
export const errorReporting = ErrorReportingService.getInstance();

// Initialize stored reports
errorReporting.loadStoredReports();

// Utility functions
export function reportError(
  error: Error,
  options: {
    component?: string;
    action?: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    context?: Record<string, any>;
    tags?: string[];
  } = {}
) {
  errorReporting.reportError({ error, ...options });
}

export function setErrorReportingUserId(userId: string) {
  errorReporting.setUserId(userId);
}

export function getErrorMetrics(): ErrorMetrics {
  return errorReporting.getMetrics();
}

export function clearErrorReports() {
  errorReporting.clearReports();
}

export function exportErrorReports(): string {
  return errorReporting.exportReports();
}

// React hook for error reporting
export function useErrorReporting() {
  return {
    reportError: (error: Error, options?: any) => reportError(error, options),
    getMetrics: () => getErrorMetrics(),
    clearReports: () => clearErrorReports(),
    exportReports: () => exportErrorReports(),
  };
}
