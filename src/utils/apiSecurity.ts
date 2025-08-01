/**
 * @file utils/apiSecurity.ts
 * @description API security utilities including rate limiting, CSRF protection, and request validation
 */

// Rate limiting implementation
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests = 100, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    // Add current request
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    
    return true;
  }

  getRemainingRequests(identifier: string): number {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    return Math.max(0, this.maxRequests - validRequests.length);
  }

  getResetTime(identifier: string): number {
    const requests = this.requests.get(identifier) || [];
    if (requests.length === 0) return 0;
    
    const oldestRequest = Math.min(...requests);
    return oldestRequest + this.windowMs;
  }

  reset(identifier: string): void {
    this.requests.delete(identifier);
  }
}

// CSRF token management
export class CSRFManager {
  private static token: string | null = null;
  private static readonly TOKEN_HEADER = 'X-CSRF-Token';
  private static readonly TOKEN_META = 'csrf-token';

  static generateToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    
    this.token = token;
    this.setTokenInDOM(token);
    
    return token;
  }

  static getToken(): string | null {
    if (this.token) return this.token;
    
    // Try to get from meta tag
    const metaTag = document.querySelector(`meta[name="${this.TOKEN_META}"]`);
    if (metaTag) {
      this.token = metaTag.getAttribute('content');
      return this.token;
    }
    
    // Generate new token if none exists
    return this.generateToken();
  }

  static setTokenInDOM(token: string): void {
    let metaTag = document.querySelector(`meta[name="${this.TOKEN_META}"]`);
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('name', this.TOKEN_META);
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute('content', token);
  }

  static addTokenToHeaders(headers: Headers): void {
    const token = this.getToken();
    if (token) {
      headers.set(this.TOKEN_HEADER, token);
    }
  }

  static validateToken(token: string): boolean {
    return token === this.token && token.length === 64;
  }
}

// Request sanitization and validation
export class RequestValidator {
  private static readonly DANGEROUS_PATTERNS = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /data:text\/html/gi,
    /vbscript:/gi,
  ];

  private static readonly SQL_INJECTION_PATTERNS = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
    /(\b(OR|AND)\s+\d+\s*=\s*\d+)/gi,
    /(--|\/\*|\*\/)/g,
    /(\b(SCRIPT|IFRAME|OBJECT|EMBED|FORM)\b)/gi,
  ];

  static sanitizeInput(input: string): string {
    if (typeof input !== 'string') return '';
    
    let sanitized = input;
    
    // Remove dangerous patterns
    this.DANGEROUS_PATTERNS.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });
    
    // Encode HTML entities
    sanitized = sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
    
    return sanitized.trim();
  }

  static validateInput(input: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Check for XSS patterns
    this.DANGEROUS_PATTERNS.forEach(pattern => {
      if (pattern.test(input)) {
        errors.push('Potentially dangerous script content detected');
      }
    });
    
    // Check for SQL injection patterns
    this.SQL_INJECTION_PATTERNS.forEach(pattern => {
      if (pattern.test(input)) {
        errors.push('Potentially dangerous SQL content detected');
      }
    });
    
    // Check for excessive length
    if (input.length > 10000) {
      errors.push('Input exceeds maximum allowed length');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  static validateURL(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }
}

// Secure API client
export class SecureAPIClient {
  private rateLimiter: RateLimiter;
  private baseURL: string;
  private defaultHeaders: Headers;

  constructor(baseURL: string, rateLimitConfig?: { maxRequests: number; windowMs: number }) {
    this.baseURL = baseURL;
    this.rateLimiter = new RateLimiter(
      rateLimitConfig?.maxRequests || 100,
      rateLimitConfig?.windowMs || 60000
    );
    
    this.defaultHeaders = new Headers({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    });
  }

  private getClientIdentifier(): string {
    // Use a combination of user agent and session info for rate limiting
    return `${navigator.userAgent}_${sessionStorage.getItem('sessionId') || 'anonymous'}`;
  }

  private validateRequest(url: string, options: RequestInit): void {
    // Validate URL
    if (!RequestValidator.validateURL(url)) {
      throw new Error('Invalid URL provided');
    }

    // Check rate limiting
    const identifier = this.getClientIdentifier();
    if (!this.rateLimiter.isAllowed(identifier)) {
      const resetTime = this.rateLimiter.getResetTime(identifier);
      const waitTime = Math.ceil((resetTime - Date.now()) / 1000);
      throw new Error(`Rate limit exceeded. Try again in ${waitTime} seconds.`);
    }

    // Validate request body if present
    if (options.body && typeof options.body === 'string') {
      try {
        const parsedBody = JSON.parse(options.body);
        this.validateRequestData(parsedBody);
      } catch (error) {
        throw new Error('Invalid request body format');
      }
    }
  }

  private validateRequestData(data: any): void {
    if (typeof data === 'object' && data !== null) {
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === 'string') {
          const validation = RequestValidator.validateInput(value);
          if (!validation.isValid) {
            throw new Error(`Invalid data in field '${key}': ${validation.errors.join(', ')}`);
          }
        } else if (typeof value === 'object' && value !== null) {
          this.validateRequestData(value);
        }
      });
    }
  }

  private prepareHeaders(customHeaders?: HeadersInit): Headers {
    const headers = new Headers(this.defaultHeaders);
    
    // Add CSRF token
    CSRFManager.addTokenToHeaders(headers);
    
    // Add custom headers
    if (customHeaders) {
      if (customHeaders instanceof Headers) {
        customHeaders.forEach((value, key) => headers.set(key, value));
      } else if (Array.isArray(customHeaders)) {
        customHeaders.forEach(([key, value]) => headers.set(key, value));
      } else {
        Object.entries(customHeaders).forEach(([key, value]) => headers.set(key, value));
      }
    }
    
    return headers;
  }

  async request(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Prepare request options
    const requestOptions: RequestInit = {
      ...options,
      headers: this.prepareHeaders(options.headers),
      credentials: 'same-origin',
    };

    // Validate request
    this.validateRequest(url, requestOptions);

    try {
      const response = await fetch(url, requestOptions);
      
      // Check for security-related errors
      if (response.status === 403) {
        throw new Error('Access forbidden - check CSRF token');
      }
      
      if (response.status === 429) {
        throw new Error('Too many requests - rate limit exceeded');
      }
      
      if (response.status === 401) {
        throw new Error('Unauthorized - authentication required');
      }
      
      return response;
    } catch (error) {
      // Log security events
      this.logSecurityEvent('api_request_failed', {
        endpoint,
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
      
      throw error;
    }
  }

  async get(endpoint: string, headers?: HeadersInit): Promise<Response> {
    return this.request(endpoint, { method: 'GET', headers });
  }

  async post(endpoint: string, data?: any, headers?: HeadersInit): Promise<Response> {
    return this.request(endpoint, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put(endpoint: string, data?: any, headers?: HeadersInit): Promise<Response> {
    return this.request(endpoint, {
      method: 'PUT',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete(endpoint: string, headers?: HeadersInit): Promise<Response> {
    return this.request(endpoint, { method: 'DELETE', headers });
  }

  private logSecurityEvent(type: string, details: any): void {
    // Store security events for monitoring
    const events = JSON.parse(localStorage.getItem('security_events') || '[]');
    events.push({ type, details, timestamp: new Date().toISOString() });
    
    // Keep only last 100 events
    if (events.length > 100) {
      events.splice(0, events.length - 100);
    }
    
    localStorage.setItem('security_events', JSON.stringify(events));
    
    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      console.warn('Security event:', { type, details });
    }
  }

  getRateLimitStatus(): { remaining: number; resetTime: number } {
    const identifier = this.getClientIdentifier();
    return {
      remaining: this.rateLimiter.getRemainingRequests(identifier),
      resetTime: this.rateLimiter.getResetTime(identifier),
    };
  }
}

// Content Security Policy helper
export class CSPManager {
  private static policies: string[] = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'", // Note: Remove unsafe-inline in production
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ];

  static setCSP(): void {
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = this.policies.join('; ');
    document.head.appendChild(meta);
  }

  static addPolicy(policy: string): void {
    this.policies.push(policy);
  }

  static removePolicy(policyType: string): void {
    this.policies = this.policies.filter(policy => !policy.startsWith(policyType));
  }
}

// Initialize security measures
export function initializeSecurity(): void {
  // Generate CSRF token
  CSRFManager.generateToken();
  
  // Set Content Security Policy
  CSPManager.setCSP();
  
  // Prevent clickjacking
  if (window.top !== window.self) {
    window.top!.location = window.self.location;
  }
  
  // Clear sensitive data on page unload
  window.addEventListener('beforeunload', () => {
    sessionStorage.removeItem('sensitive_data');
  });
}

// Export default secure API client instance
export const secureAPI = new SecureAPIClient(
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  { maxRequests: 100, windowMs: 60000 }
);
