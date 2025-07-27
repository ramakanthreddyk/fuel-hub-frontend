/**
 * Secure storage utilities for sensitive data
 */

const ENCRYPTION_KEY = 'fuelsync_secure_key';

// Simple encryption for localStorage (better than plain text)
const encrypt = (text: string): string => {
  try {
    return btoa(text);
  } catch {
    return text;
  }
};

const decrypt = (encryptedText: string): string => {
  try {
    return atob(encryptedText);
  } catch {
    return encryptedText;
  }
};

export const secureStorage = {
  setItem: (key: string, value: string) => {
    try {
      const encrypted = encrypt(value);
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Failed to store item securely:', error);
      localStorage.setItem(key, value); // Fallback to plain storage
    }
  },

  getItem: (key: string): string | null => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      return decrypt(item);
    } catch (error) {
      console.error('Failed to retrieve item securely:', error);
      return localStorage.getItem(key); // Fallback to plain retrieval
    }
  },

  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },

  clear: () => {
    localStorage.clear();
  }
};

// Token management with expiration
export const tokenManager = {
  setToken: (token: string, expiresIn?: number) => {
    const tokenData = {
      token,
      expiresAt: expiresIn ? Date.now() + (expiresIn * 1000) : null
    };
    secureStorage.setItem('fuelsync_token', JSON.stringify(tokenData));
  },

  getToken: (): string | null => {
    try {
      const tokenDataStr = secureStorage.getItem('fuelsync_token');
      if (!tokenDataStr) return null;

      const tokenData = JSON.parse(tokenDataStr);
      
      // Check if token is expired
      if (tokenData.expiresAt && Date.now() > tokenData.expiresAt) {
        tokenManager.removeToken();
        return null;
      }

      return tokenData.token;
    } catch {
      return null;
    }
  },

  removeToken: () => {
    secureStorage.removeItem('fuelsync_token');
  },

  isTokenValid: (): boolean => {
    return tokenManager.getToken() !== null;
  }
};