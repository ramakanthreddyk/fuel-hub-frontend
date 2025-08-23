/**
 * @file utils/logger.ts
 * @description Production-ready logging utility with security features
 */

import { sanitizeForLogging } from './security';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  context?: Record<string, unknown>;
  error?: Error;
}

class Logger {
  private logLevel: LogLevel;
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.logLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.INFO;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private formatMessage(level: string, message: string, context?: Record<string, unknown>): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message: sanitizeForLogging(message),
      context: context ? this.sanitizeContext(context) : undefined,
    };
  }

  private sanitizeContext(context: Record<string, unknown>): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};
    
    for (const [key, value] of Object.entries(context)) {
      // Skip sensitive keys
      if (this.isSensitiveKey(key)) {
        sanitized[key] = '[REDACTED]';
        continue;
      }
      
      sanitized[key] = sanitizeForLogging(value);
    }
    
    return sanitized;
  }

  private isSensitiveKey(key: string): boolean {
    const sensitiveKeys = [
      'password', 'token', 'secret', 'key', 'auth', 'authorization',
      'cookie', 'session', 'credential', 'private', 'confidential'
    ];
    
    return sensitiveKeys.some(sensitive => 
      key.toLowerCase().includes(sensitive)
    );
  }

  private output(entry: LogEntry): void {
    if (!this.isDevelopment) {
      // In production, you might want to send logs to a service
      // For now, we'll use console but with structured format
      console.log(JSON.stringify(entry));
      return;
    }

    // Development formatting
    const { timestamp, level, message, context } = entry;
    const prefix = `[${timestamp}] ${level}:`;
    
    if (context) {
      console.log(prefix, message, context);
    } else {
      console.log(prefix, message);
    }
  }

  debug(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    
    const entry = this.formatMessage('DEBUG', message, context);
    this.output(entry);
  }

  info(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.INFO)) return;
    
    const entry = this.formatMessage('INFO', message, context);
    this.output(entry);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.WARN)) return;
    
    const entry = this.formatMessage('WARN', message, context);
    this.output(entry);
  }

  error(message: string, error?: Error | unknown, context?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;
    
    const entry = this.formatMessage('ERROR', message, context);
    
    if (error instanceof Error) {
      entry.error = {
        name: error.name,
        message: sanitizeForLogging(error.message),
        stack: this.isDevelopment ? error.stack : undefined,
      } as Error;
    } else if (error) {
      entry.context = {
        ...entry.context,
        error: sanitizeForLogging(error),
      };
    }
    
    this.output(entry);
  }

  // Specialized logging methods for common use cases
  apiRequest(method: string, url: string, status?: number): void {
    this.debug('API Request', {
      method: sanitizeForLogging(method),
      url: sanitizeForLogging(url),
      status,
    });
  }

  apiError(method: string, url: string, error: unknown): void {
    this.error('API Error', error, {
      method: sanitizeForLogging(method),
      url: sanitizeForLogging(url),
    });
  }

  userAction(action: string, userId?: string, details?: Record<string, unknown>): void {
    this.info('User Action', {
      action: sanitizeForLogging(action),
      userId: userId ? sanitizeForLogging(userId) : undefined,
      ...details,
    });
  }

  securityEvent(event: string, details?: Record<string, unknown>): void {
    this.warn('Security Event', {
      event: sanitizeForLogging(event),
      ...details,
    });
  }

  performanceMetric(metric: string, value: number, unit?: string): void {
    this.debug('Performance Metric', {
      metric: sanitizeForLogging(metric),
      value,
      unit: unit ? sanitizeForLogging(unit) : 'ms',
    });
  }
}

// Export singleton instance
export const logger = new Logger();

// Export convenience functions that match console API
export const log = {
  debug: (message: string, ...args: unknown[]) => {
    logger.debug(message, { args: args.map(sanitizeForLogging) });
  },
  
  info: (message: string, ...args: unknown[]) => {
    logger.info(message, { args: args.map(sanitizeForLogging) });
  },
  
  warn: (message: string, ...args: unknown[]) => {
    logger.warn(message, { args: args.map(sanitizeForLogging) });
  },
  
  error: (message: string, ...args: unknown[]) => {
    const error = args.find(arg => arg instanceof Error) as Error;
    const otherArgs = args.filter(arg => !(arg instanceof Error));
    
    logger.error(
      message, 
      error, 
      otherArgs.length > 0 ? { args: otherArgs.map(sanitizeForLogging) } : undefined
    );
  },
};

// Replace console methods in development for better logging
if (process.env.NODE_ENV === 'development') {
  // Store original console methods
  const originalConsole = {
    log: console.log,
    debug: console.debug,
    info: console.info,
    warn: console.warn,
    error: console.error,
  };

  // Override console methods
  console.debug = log.debug;
  console.info = log.info;
  console.warn = log.warn;
  console.error = log.error;
  
  // Keep original console.log for general use
  console.log = originalConsole.log;
  
  // Provide access to original methods if needed
  (window as any).__originalConsole = originalConsole;
}