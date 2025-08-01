/**
 * @file utils/security.ts
 * @description Security utilities and protection mechanisms
 */

// Content Security Policy utilities
export function setupCSP() {
  if (typeof document === 'undefined') return;

  // Create CSP meta tag if it doesn't exist
  let cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (!cspMeta) {
    cspMeta = document.createElement('meta');
    cspMeta.setAttribute('http-equiv', 'Content-Security-Policy');
    document.head.appendChild(cspMeta);
  }

  // Define CSP policy
  const cspPolicy = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Note: In production, remove unsafe-inline and unsafe-eval
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://api.fuelhub.com wss://api.fuelhub.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');

  cspMeta.setAttribute('content', cspPolicy);
}

// XSS Protection
export function sanitizeHTML(html: string): string {
  if (typeof DOMParser === 'undefined') return html;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Remove script tags
  const scripts = doc.querySelectorAll('script');
  scripts.forEach(script => script.remove());

  // Remove event handlers
  const allElements = doc.querySelectorAll('*');
  allElements.forEach(element => {
    const attributes = Array.from(element.attributes);
    attributes.forEach(attr => {
      if (attr.name.startsWith('on')) {
        element.removeAttribute(attr.name);
      }
    });
  });

  // Remove dangerous attributes
  const dangerousAttributes = ['src', 'href', 'action', 'formaction', 'data'];
  allElements.forEach(element => {
    dangerousAttributes.forEach(attr => {
      const value = element.getAttribute(attr);
      if (value && (value.includes('javascript:') || value.includes('data:'))) {
        element.removeAttribute(attr);
      }
    });
  });

  return doc.body.innerHTML;
}

// Input validation and sanitization
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';

  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// CSRF Protection
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function setCSRFToken(token: string) {
  if (typeof document !== 'undefined') {
    // Set as meta tag
    let csrfMeta = document.querySelector('meta[name="csrf-token"]');
    if (!csrfMeta) {
      csrfMeta = document.createElement('meta');
      csrfMeta.setAttribute('name', 'csrf-token');
      document.head.appendChild(csrfMeta);
    }
    csrfMeta.setAttribute('content', token);

    // Store in sessionStorage
    sessionStorage.setItem('csrf-token', token);
  }
}

export function getCSRFToken(): string | null {
  if (typeof document === 'undefined') return null;

  // Try to get from meta tag first
  const csrfMeta = document.querySelector('meta[name="csrf-token"]');
  if (csrfMeta) {
    return csrfMeta.getAttribute('content');
  }

  // Fallback to sessionStorage
  return sessionStorage.getItem('csrf-token');
}

// Secure storage utilities
export class SecureStorage {
  private static encryptionKey: string | null = null;

  static async generateKey(): Promise<string> {
    if (typeof crypto === 'undefined' || !crypto.subtle) {
      throw new Error('Web Crypto API not supported');
    }

    const key = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );

    const exported = await crypto.subtle.exportKey('raw', key);
    return Array.from(new Uint8Array(exported))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  static setEncryptionKey(key: string) {
    this.encryptionKey = key;
  }

  static async encrypt(data: string): Promise<string> {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not set');
    }

    if (typeof crypto === 'undefined' || !crypto.subtle) {
      // Fallback to base64 encoding (not secure, but better than nothing)
      return btoa(data);
    }

    const keyData = new Uint8Array(
      this.encryptionKey.match(/.{2}/g)!.map(byte => parseInt(byte, 16))
    );

    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedData = new TextEncoder().encode(data);

    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encodedData
    );

    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    return Array.from(combined)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  static async decrypt(encryptedData: string): Promise<string> {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not set');
    }

    if (typeof crypto === 'undefined' || !crypto.subtle) {
      // Fallback from base64 encoding
      return atob(encryptedData);
    }

    const keyData = new Uint8Array(
      this.encryptionKey.match(/.{2}/g)!.map(byte => parseInt(byte, 16))
    );

    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );

    const combined = new Uint8Array(
      encryptedData.match(/.{2}/g)!.map(byte => parseInt(byte, 16))
    );

    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    );

    return new TextDecoder().decode(decrypted);
  }

  static async setItem(key: string, value: string): Promise<void> {
    try {
      const encrypted = await this.encrypt(value);
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.warn('Failed to encrypt data, storing as plain text:', error);
      localStorage.setItem(key, value);
    }
  }

  static async getItem(key: string): Promise<string | null> {
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    try {
      return await this.decrypt(stored);
    } catch (error) {
      console.warn('Failed to decrypt data, returning as plain text:', error);
      return stored;
    }
  }

  static removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}

// Rate limiting
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();

  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 15 * 60 * 1000 // 15 minutes
  ) {}

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];

    // Remove old attempts outside the window
    const validAttempts = attempts.filter(time => now - time < this.windowMs);

    if (validAttempts.length >= this.maxAttempts) {
      return false;
    }

    // Add current attempt
    validAttempts.push(now);
    this.attempts.set(identifier, validAttempts);

    return true;
  }

  getRemainingAttempts(identifier: string): number {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];
    const validAttempts = attempts.filter(time => now - time < this.windowMs);

    return Math.max(0, this.maxAttempts - validAttempts.length);
  }

  getTimeUntilReset(identifier: string): number {
    const attempts = this.attempts.get(identifier) || [];
    if (attempts.length === 0) return 0;

    const oldestAttempt = Math.min(...attempts);
    const resetTime = oldestAttempt + this.windowMs;

    return Math.max(0, resetTime - Date.now());
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

// Session security
export function generateSecureSessionId(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function isSecureContext(): boolean {
  return typeof window !== 'undefined' && (
    window.location.protocol === 'https:' ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  );
}

// Security headers validation
export function validateSecurityHeaders(): {
  isSecure: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];

  if (typeof document === 'undefined') {
    return { isSecure: true, warnings: [] };
  }

  // Check for HTTPS
  if (!isSecureContext()) {
    warnings.push('Application is not served over HTTPS');
  }

  // Check for CSP header
  const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (!cspMeta) {
    warnings.push('Content Security Policy not found');
  }

  // Check for X-Frame-Options
  const frameOptions = document.querySelector('meta[http-equiv="X-Frame-Options"]');
  if (!frameOptions) {
    warnings.push('X-Frame-Options header not found');
  }

  return {
    isSecure: warnings.length === 0,
    warnings,
  };
}

// Initialize security measures
export function initializeSecurity() {
  if (typeof window === 'undefined') return;

  // Setup CSP
  setupCSP();

  // Generate and set CSRF token
  const csrfToken = generateCSRFToken();
  setCSRFToken(csrfToken);

  // Initialize secure storage encryption key
  SecureStorage.generateKey().then(key => {
    SecureStorage.setEncryptionKey(key);
  }).catch(error => {
    console.warn('Failed to generate encryption key:', error);
  });

  // Validate security headers
  const validation = validateSecurityHeaders();
  if (!validation.isSecure) {
    console.warn('Security warnings:', validation.warnings);
  }

  // Prevent clickjacking
  if (window.top !== window.self) {
    window.top!.location = window.self.location;
  }

  // Clear sensitive data on page unload
  window.addEventListener('beforeunload', () => {
    // Clear any sensitive data from memory
    sessionStorage.removeItem('sensitive-data');
  });
}
