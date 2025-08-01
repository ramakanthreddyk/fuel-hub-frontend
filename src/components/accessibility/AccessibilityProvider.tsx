/**
 * @file components/accessibility/AccessibilityProvider.tsx
 * @description Accessibility context provider for managing accessibility features
 */
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  screenReaderMode: boolean;
  keyboardNavigation: boolean;
  focusVisible: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (settings: Partial<AccessibilitySettings>) => void;
  announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => void;
  focusElement: (elementId: string) => void;
  skipToContent: () => void;
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  reducedMotion: false,
  fontSize: 'medium',
  screenReaderMode: false,
  keyboardNavigation: true,
  focusVisible: true,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      try {
        return { ...defaultSettings, ...JSON.parse(saved) };
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  const [announcer, setAnnouncer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Create screen reader announcer
    const announcerElement = document.createElement('div');
    announcerElement.setAttribute('aria-live', 'polite');
    announcerElement.setAttribute('aria-atomic', 'true');
    announcerElement.setAttribute('aria-relevant', 'text');
    announcerElement.style.position = 'absolute';
    announcerElement.style.left = '-10000px';
    announcerElement.style.width = '1px';
    announcerElement.style.height = '1px';
    announcerElement.style.overflow = 'hidden';
    document.body.appendChild(announcerElement);
    setAnnouncer(announcerElement);

    return () => {
      if (announcerElement.parentNode) {
        announcerElement.parentNode.removeChild(announcerElement);
      }
    };
  }, []);

  useEffect(() => {
    // Detect system preferences
    const mediaQueries = {
      highContrast: window.matchMedia('(prefers-contrast: high)'),
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)'),
    };

    const handleMediaChange = () => {
      setSettings(prev => ({
        ...prev,
        highContrast: prev.highContrast || mediaQueries.highContrast.matches,
        reducedMotion: prev.reducedMotion || mediaQueries.reducedMotion.matches,
      }));
    };

    Object.values(mediaQueries).forEach(mq => {
      mq.addEventListener('change', handleMediaChange);
    });

    handleMediaChange();

    return () => {
      Object.values(mediaQueries).forEach(mq => {
        mq.removeEventListener('change', handleMediaChange);
      });
    };
  }, []);

  useEffect(() => {
    // Apply accessibility settings to document
    const root = document.documentElement;
    
    // High contrast
    root.classList.toggle('high-contrast', settings.highContrast);
    
    // Reduced motion
    root.classList.toggle('reduced-motion', settings.reducedMotion);
    
    // Font size
    root.setAttribute('data-font-size', settings.fontSize);
    
    // Screen reader mode
    root.classList.toggle('screen-reader-mode', settings.screenReaderMode);
    
    // Focus visible
    root.classList.toggle('focus-visible', settings.focusVisible);

    // Save settings
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    // Keyboard navigation handler
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!settings.keyboardNavigation) return;

      // Skip to content (Alt + S)
      if (event.altKey && event.key === 's') {
        event.preventDefault();
        skipToContent();
      }

      // Focus management for modals and dialogs
      if (event.key === 'Escape') {
        const activeModal = document.querySelector('[role="dialog"][aria-modal="true"]');
        if (activeModal) {
          const closeButton = activeModal.querySelector('[data-close-modal]') as HTMLElement;
          if (closeButton) {
            closeButton.click();
          }
        }
      }

      // Tab trapping for modals
      if (event.key === 'Tab') {
        const activeModal = document.querySelector('[role="dialog"][aria-modal="true"]');
        if (activeModal) {
          const focusableElements = activeModal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

          if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [settings.keyboardNavigation]);

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!announcer) return;

    announcer.setAttribute('aria-live', priority);
    announcer.textContent = message;

    // Clear after announcement
    setTimeout(() => {
      announcer.textContent = '';
    }, 1000);
  };

  const focusElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const skipToContent = () => {
    const mainContent = document.getElementById('main-content') || 
                      document.querySelector('main') ||
                      document.querySelector('[role="main"]');
    
    if (mainContent) {
      (mainContent as HTMLElement).focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
      announceToScreenReader('Skipped to main content');
    }
  };

  const value: AccessibilityContextType = {
    settings,
    updateSettings,
    announceToScreenReader,
    focusElement,
    skipToContent,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

// Skip to content link component
export const SkipToContentLink: React.FC = () => {
  const { skipToContent } = useAccessibility();

  return (
    <a
      href="#main-content"
      className="skip-to-content"
      onClick={(e) => {
        e.preventDefault();
        skipToContent();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          skipToContent();
        }
      }}
    >
      Skip to main content
    </a>
  );
};

// Accessibility settings panel component
export const AccessibilitySettings: React.FC = () => {
  const { settings, updateSettings } = useAccessibility();

  return (
    <div className="accessibility-settings" role="region" aria-labelledby="accessibility-heading">
      <h2 id="accessibility-heading">Accessibility Settings</h2>
      
      <div className="setting-group">
        <label>
          <input
            type="checkbox"
            checked={settings.highContrast}
            onChange={(e) => updateSettings({ highContrast: e.target.checked })}
            aria-describedby="high-contrast-desc"
          />
          High Contrast Mode
        </label>
        <p id="high-contrast-desc" className="setting-description">
          Increases contrast for better visibility
        </p>
      </div>

      <div className="setting-group">
        <label>
          <input
            type="checkbox"
            checked={settings.reducedMotion}
            onChange={(e) => updateSettings({ reducedMotion: e.target.checked })}
            aria-describedby="reduced-motion-desc"
          />
          Reduce Motion
        </label>
        <p id="reduced-motion-desc" className="setting-description">
          Minimizes animations and transitions
        </p>
      </div>

      <div className="setting-group">
        <label htmlFor="font-size-select">Font Size</label>
        <select
          id="font-size-select"
          value={settings.fontSize}
          onChange={(e) => updateSettings({ fontSize: e.target.value as any })}
          aria-describedby="font-size-desc"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
          <option value="extra-large">Extra Large</option>
        </select>
        <p id="font-size-desc" className="setting-description">
          Adjusts text size throughout the application
        </p>
      </div>

      <div className="setting-group">
        <label>
          <input
            type="checkbox"
            checked={settings.screenReaderMode}
            onChange={(e) => updateSettings({ screenReaderMode: e.target.checked })}
            aria-describedby="screen-reader-desc"
          />
          Screen Reader Optimizations
        </label>
        <p id="screen-reader-desc" className="setting-description">
          Optimizes interface for screen reader users
        </p>
      </div>
    </div>
  );
};
