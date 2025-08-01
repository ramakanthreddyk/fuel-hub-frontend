/**
 * @file hooks/__tests__/useToastNotifications.test.ts
 * @description Tests for useToastNotifications hook
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToastNotifications } from '../useToastNotifications';

// Mock the dependencies
const mockShow = vi.fn();
const mockHide = vi.fn();
const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
};

vi.mock('@/hooks/useGlobalLoader', () => ({
  useGlobalLoader: () => ({
    show: mockShow,
    hide: mockHide,
  }),
}));

vi.mock('sonner', () => ({
  toast: Object.assign(vi.fn(), mockToast),
}));

describe('useToastNotifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('showSuccess', () => {
    it('should show success toast and hide loader', () => {
      const { result } = renderHook(() => useToastNotifications());

      act(() => {
        result.current.showSuccess('Operation completed');
      });

      expect(mockHide).toHaveBeenCalledTimes(1);
      expect(mockToast.success).toHaveBeenCalledWith('Operation completed');
    });

    it('should show success toast with description', () => {
      const { result } = renderHook(() => useToastNotifications());

      act(() => {
        result.current.showSuccess('Success', 'Data saved successfully');
      });

      expect(mockHide).toHaveBeenCalledTimes(1);
      expect(mockToast.success).toHaveBeenCalledWith('Success: Data saved successfully');
    });

    it('should handle success toast without description', () => {
      const { result } = renderHook(() => useToastNotifications());

      act(() => {
        result.current.showSuccess('Success');
      });

      expect(mockToast.success).toHaveBeenCalledWith('Success');
    });
  });

  describe('showError', () => {
    it('should show error toast and hide loader', () => {
      const { result } = renderHook(() => useToastNotifications());

      act(() => {
        result.current.showError('Operation failed');
      });

      expect(mockHide).toHaveBeenCalledTimes(1);
      expect(mockToast.error).toHaveBeenCalledWith('Operation failed');
    });

    it('should show error toast with description', () => {
      const { result } = renderHook(() => useToastNotifications());

      act(() => {
        result.current.showError('Error', 'Network connection failed');
      });

      expect(mockHide).toHaveBeenCalledTimes(1);
      expect(mockToast.error).toHaveBeenCalledWith('Error: Network connection failed');
    });

    it('should handle error toast without description', () => {
      const { result } = renderHook(() => useToastNotifications());

      act(() => {
        result.current.showError('Error');
      });

      expect(mockToast.error).toHaveBeenCalledWith('Error');
    });
  });

  describe('showWarning', () => {
    it('should show warning toast and hide loader', () => {
      const { result } = renderHook(() => useToastNotifications());

      act(() => {
        result.current.showWarning('Warning message');
      });

      expect(mockHide).toHaveBeenCalledTimes(1);
      expect(mockToast).toHaveBeenCalledWith('⚠️ Warning message', {
        icon: '⚠️',
        style: {
          background: '#fbbf24',
          color: '#000',
        },
      });
    });

    it('should show warning toast with description', () => {
      const { result } = renderHook(() => useToastNotifications());

      act(() => {
        result.current.showWarning('Warning', 'This action cannot be undone');
      });

      expect(mockHide).toHaveBeenCalledTimes(1);
      expect(mockToast).toHaveBeenCalledWith('⚠️ Warning: This action cannot be undone', {
        icon: '⚠️',
        style: {
          background: '#fbbf24',
          color: '#000',
        },
      });
    });

    it('should handle warning toast without description', () => {
      const { result } = renderHook(() => useToastNotifications());

      act(() => {
        result.current.showWarning('Warning');
      });

      expect(mockToast).toHaveBeenCalledWith('⚠️ Warning', {
        icon: '⚠️',
        style: {
          background: '#fbbf24',
          color: '#000',
        },
      });
    });
  });

  describe('showInfo', () => {
    it('should show info toast and hide loader', () => {
      const { result } = renderHook(() => useToastNotifications());

      act(() => {
        result.current.showInfo('Information');
      });

      expect(mockHide).toHaveBeenCalledTimes(1);
      expect(mockToast.info).toHaveBeenCalledWith('Information');
    });

    it('should show info toast with description', () => {
      const { result } = renderHook(() => useToastNotifications());

      act(() => {
        result.current.showInfo('Info', 'New feature available');
      });

      expect(mockHide).toHaveBeenCalledTimes(1);
      expect(mockToast.info).toHaveBeenCalledWith('Info: New feature available');
    });
  });

  describe('showLoading', () => {
    it('should show loading toast and global loader', () => {
      const { result } = renderHook(() => useToastNotifications());

      act(() => {
        result.current.showLoading('Processing...');
      });

      expect(mockShow).toHaveBeenCalledWith('Processing...');
      expect(mockToast).toHaveBeenCalledWith('Processing...', {
        icon: '⏳',
        duration: Infinity,
      });
    });

    it('should show loading toast with default message', () => {
      const { result } = renderHook(() => useToastNotifications());

      act(() => {
        result.current.showLoading();
      });

      expect(mockShow).toHaveBeenCalledWith('Loading...');
      expect(mockToast).toHaveBeenCalledWith('Loading...', {
        icon: '⏳',
        duration: Infinity,
      });
    });
  });

  describe('hideLoading', () => {
    it('should hide global loader', () => {
      const { result } = renderHook(() => useToastNotifications());

      act(() => {
        result.current.hideLoading();
      });

      expect(mockHide).toHaveBeenCalledTimes(1);
    });
  });

  describe('showPromise', () => {
    it('should handle successful promise', async () => {
      const { result } = renderHook(() => useToastNotifications());
      const successPromise = Promise.resolve('Success data');

      await act(async () => {
        await result.current.showPromise(
          successPromise,
          {
            loading: 'Saving...',
            success: 'Saved successfully',
            error: 'Failed to save',
          }
        );
      });

      expect(mockToast).toHaveBeenCalledWith(successPromise, {
        loading: 'Saving...',
        success: 'Saved successfully',
        error: 'Failed to save',
      });
    });

    it('should handle failed promise', async () => {
      const { result } = renderHook(() => useToastNotifications());
      const errorPromise = Promise.reject(new Error('Network error'));

      await act(async () => {
        try {
          await result.current.showPromise(
            errorPromise,
            {
              loading: 'Loading...',
              success: 'Loaded successfully',
              error: 'Failed to load',
            }
          );
        } catch (error) {
          // Expected to throw
        }
      });

      expect(mockToast).toHaveBeenCalledWith(errorPromise, {
        loading: 'Loading...',
        success: 'Loaded successfully',
        error: 'Failed to load',
      });
    });

    it('should handle promise with dynamic messages', async () => {
      const { result } = renderHook(() => useToastNotifications());
      const successPromise = Promise.resolve({ name: 'Test Item' });

      await act(async () => {
        await result.current.showPromise(
          successPromise,
          {
            loading: 'Creating item...',
            success: (data) => `Created ${data.name} successfully`,
            error: (error) => `Failed to create: ${error.message}`,
          }
        );
      });

      expect(mockToast).toHaveBeenCalledWith(successPromise, {
        loading: 'Creating item...',
        success: expect.any(Function),
        error: expect.any(Function),
      });
    });
  });

  describe('showCustom', () => {
    it('should show custom toast with options', () => {
      const { result } = renderHook(() => useToastNotifications());

      act(() => {
        result.current.showCustom('Custom message', {
          icon: '🎉',
          duration: 5000,
          style: { background: 'blue' },
        });
      });

      expect(mockToast).toHaveBeenCalledWith('Custom message', {
        icon: '🎉',
        duration: 5000,
        style: { background: 'blue' },
      });
    });

    it('should show custom toast without options', () => {
      const { result } = renderHook(() => useToastNotifications());

      act(() => {
        result.current.showCustom('Custom message');
      });

      expect(mockToast).toHaveBeenCalledWith('Custom message', undefined);
    });
  });

  describe('dismiss', () => {
    it('should dismiss specific toast', () => {
      const mockDismiss = vi.fn();
      mockToast.dismiss = mockDismiss;

      const { result } = renderHook(() => useToastNotifications());

      act(() => {
        result.current.dismiss('toast-id');
      });

      expect(mockDismiss).toHaveBeenCalledWith('toast-id');
    });

    it('should dismiss all toasts when no id provided', () => {
      const mockDismiss = vi.fn();
      mockToast.dismiss = mockDismiss;

      const { result } = renderHook(() => useToastNotifications());

      act(() => {
        result.current.dismiss();
      });

      expect(mockDismiss).toHaveBeenCalledWith();
    });
  });

  describe('integration scenarios', () => {
    it('should handle multiple notifications in sequence', () => {
      const { result } = renderHook(() => useToastNotifications());

      act(() => {
        result.current.showLoading('Processing...');
      });

      expect(mockShow).toHaveBeenCalledWith('Processing...');

      act(() => {
        result.current.showSuccess('Completed');
      });

      expect(mockHide).toHaveBeenCalledTimes(1);
      expect(mockToast.success).toHaveBeenCalledWith('Completed');
    });

    it('should handle error after loading', () => {
      const { result } = renderHook(() => useToastNotifications());

      act(() => {
        result.current.showLoading('Saving...');
      });

      expect(mockShow).toHaveBeenCalledWith('Saving...');

      act(() => {
        result.current.showError('Save failed');
      });

      expect(mockHide).toHaveBeenCalledTimes(1);
      expect(mockToast.error).toHaveBeenCalledWith('Save failed');
    });

    it('should handle warning after info', () => {
      const { result } = renderHook(() => useToastNotifications());

      act(() => {
        result.current.showInfo('Data loaded');
      });

      expect(mockToast.info).toHaveBeenCalledWith('Data loaded');

      act(() => {
        result.current.showWarning('Data is outdated');
      });

      expect(mockToast).toHaveBeenCalledWith('⚠️ Data is outdated', {
        icon: '⚠️',
        style: {
          background: '#fbbf24',
          color: '#000',
        },
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty strings', () => {
      const { result } = renderHook(() => useToastNotifications());

      act(() => {
        result.current.showSuccess('');
      });

      expect(mockToast.success).toHaveBeenCalledWith('');
    });

    it('should handle null/undefined messages', () => {
      const { result } = renderHook(() => useToastNotifications());

      act(() => {
        result.current.showError(null as any);
      });

      expect(mockToast.error).toHaveBeenCalledWith(null);
    });

    it('should handle very long messages', () => {
      const { result } = renderHook(() => useToastNotifications());
      const longMessage = 'A'.repeat(1000);

      act(() => {
        result.current.showInfo(longMessage);
      });

      expect(mockToast.info).toHaveBeenCalledWith(longMessage);
    });

    it('should handle special characters in messages', () => {
      const { result } = renderHook(() => useToastNotifications());
      const specialMessage = '🎉 Success! <script>alert("xss")</script> 💯';

      act(() => {
        result.current.showSuccess(specialMessage);
      });

      expect(mockToast.success).toHaveBeenCalledWith(specialMessage);
    });
  });

  describe('memory management', () => {
    it('should not leak memory on multiple calls', () => {
      const { result } = renderHook(() => useToastNotifications());

      // Simulate many toast calls
      act(() => {
        for (let i = 0; i < 100; i++) {
          result.current.showInfo(`Message ${i}`);
        }
      });

      expect(mockToast.info).toHaveBeenCalledTimes(100);
      expect(mockHide).toHaveBeenCalledTimes(100);
    });

    it('should handle rapid successive calls', () => {
      const { result } = renderHook(() => useToastNotifications());

      act(() => {
        result.current.showLoading('Loading...');
        result.current.showSuccess('Success');
        result.current.showError('Error');
        result.current.showWarning('Warning');
        result.current.showInfo('Info');
      });

      expect(mockShow).toHaveBeenCalledTimes(1);
      expect(mockHide).toHaveBeenCalledTimes(4); // Called by success, error, warning, info
    });
  });
});
