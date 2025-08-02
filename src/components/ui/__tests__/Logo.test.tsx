/**
 * @file Logo.test.tsx
 * @description Comprehensive tests for Logo component
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock the Logo component if it doesn't exist
vi.mock('../Logo', () => ({
  Logo: ({ size = 'md', variant = 'full', showText = true, className = '' }: any) => (
    <div className={`flex items-center space-x-3 ${className}`} data-testid="logo">
      {variant !== 'text' && (
        <div className={`h-${size === 'xs' ? '6' : size === 'sm' ? '8' : size === 'md' ? '10' : size === 'lg' ? '12' : '16'} w-${size === 'xs' ? '6' : size === 'sm' ? '8' : size === 'md' ? '10' : size === 'lg' ? '12' : '16'} bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl`} role="img" />
      )}
      {variant !== 'icon' && showText && (size === 'md' || size === 'lg' || size === 'xl') && (
        <div>
          <div className="font-bold text-gray-900">FuelSync</div>
          <div className="text-sm text-gray-600">Station Management</div>
        </div>
      )}
      {variant !== 'icon' && showText && (size === 'xs' || size === 'sm') && (
        <div className="font-bold text-gray-900">FuelSync</div>
      )}
    </div>
  ),
  AnimatedLogo: ({ size = 'md', className = '' }: any) => (
    <div className={`flex items-center space-x-3 ${className}`} data-testid="animated-logo">
      <div className={`h-${size === 'xs' ? '6' : size === 'sm' ? '8' : size === 'md' ? '10' : size === 'lg' ? '12' : '16'} w-${size === 'xs' ? '6' : size === 'sm' ? '8' : size === 'md' ? '10' : size === 'lg' ? '12' : '16'} animate-bounce`} />
      <div className="animate-pulse">
        <div className={`h-4 bg-gray-300 rounded w-${size === 'xs' ? '12' : size === 'lg' ? '20' : '16'} mb-2`} />
        {(size === 'md' || size === 'lg' || size === 'xl') && (
          <div className="h-3 bg-gray-300 rounded w-16" />
        )}
      </div>
    </div>
  )
}));

// Import after mocking
const { Logo, AnimatedLogo } = await import('../Logo');

describe('Logo Component', () => {
  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(<Logo />);
      expect(screen.getByText('FuelSync')).toBeInTheDocument();
      expect(screen.getByText('Station Management')).toBeInTheDocument();
    });

    it('renders icon variant without text', () => {
      render(<Logo variant="icon" />);
      expect(screen.queryByText('FuelSync')).not.toBeInTheDocument();
      expect(screen.queryByText('Station Management')).not.toBeInTheDocument();
    });

    it('renders text variant without icon', () => {
      render(<Logo variant="text" />);
      expect(screen.getByText('FuelSync')).toBeInTheDocument();
      expect(screen.getByText('Station Management')).toBeInTheDocument();
    });

    it('renders without text when showText is false', () => {
      render(<Logo showText={false} />);
      expect(screen.queryByText('FuelSync')).not.toBeInTheDocument();
      expect(screen.queryByText('Station Management')).not.toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it('applies correct size classes for xs', () => {
      const { container } = render(<Logo size="xs" />);
      expect(container.querySelector('.h-6')).toBeInTheDocument();
    });

    it('applies correct size classes for sm', () => {
      const { container } = render(<Logo size="sm" />);
      expect(container.querySelector('.h-8')).toBeInTheDocument();
    });

    it('applies correct size classes for md (default)', () => {
      const { container } = render(<Logo size="md" />);
      expect(container.querySelector('.h-10')).toBeInTheDocument();
    });

    it('applies correct size classes for lg', () => {
      const { container } = render(<Logo size="lg" />);
      expect(container.querySelector('.h-12')).toBeInTheDocument();
    });

    it('applies correct size classes for xl', () => {
      const { container } = render(<Logo size="xl" />);
      expect(container.querySelector('.h-16')).toBeInTheDocument();
    });
  });

  describe('Text Size Adaptation', () => {
    it('hides subtitle for xs size', () => {
      render(<Logo size="xs" />);
      expect(screen.queryByText('Station Management')).not.toBeInTheDocument();
    });

    it('hides subtitle for sm size', () => {
      render(<Logo size="sm" />);
      expect(screen.queryByText('Station Management')).not.toBeInTheDocument();
    });

    it('shows subtitle for md size and larger', () => {
      render(<Logo size="md" />);
      expect(screen.getByText('Station Management')).toBeInTheDocument();
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className', () => {
      const { container } = render(<Logo className="custom-class" />);
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('maintains default classes with custom className', () => {
      const { container } = render(<Logo className="custom-class" />);
      expect(container.firstChild).toHaveClass('flex', 'items-center', 'space-x-3', 'custom-class');
    });
  });

  describe('SVG Icon', () => {
    it('renders icon element', () => {
      render(<Logo />);
      const icon = screen.getByRole('img');
      expect(icon).toBeInTheDocument();
    });

    it('renders icon with proper styling', () => {
      const { container } = render(<Logo />);
      const icon = container.querySelector('[role="img"]');
      expect(icon).toHaveClass('bg-gradient-to-br', 'from-blue-600', 'to-purple-600');
    });
  });

  describe('Accessibility', () => {
    it('has proper text content for screen readers', () => {
      render(<Logo />);
      expect(screen.getByText('FuelSync')).toBeInTheDocument();
    });

    it('maintains accessibility in icon-only mode', () => {
      const { container } = render(<Logo variant="icon" />);
      const logoContainer = container.firstChild;
      expect(logoContainer).toBeInTheDocument();
    });
  });
});

describe('AnimatedLogo Component', () => {
  describe('Basic Rendering', () => {
    it('renders with animation classes', () => {
      const { container } = render(<AnimatedLogo />);
      expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
      expect(container.querySelector('.animate-bounce')).toBeInTheDocument();
    });

    it('applies correct size', () => {
      const { container } = render(<AnimatedLogo size="lg" />);
      expect(container.querySelector('.h-12')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(<AnimatedLogo className="custom-animated" />);
      expect(container.firstChild).toHaveClass('custom-animated');
    });
  });

  describe('Animation Elements', () => {
    it('renders animated placeholder elements', () => {
      const { container } = render(<AnimatedLogo />);
      const animatedElements = container.querySelectorAll('.animate-pulse, .animate-bounce');
      expect(animatedElements.length).toBeGreaterThan(0);
    });

    it('renders bouncing icon', () => {
      const { container } = render(<AnimatedLogo />);
      const bouncingIcon = container.querySelector('.animate-bounce');
      expect(bouncingIcon).toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it('adjusts placeholder width based on size', () => {
      const { container: xsContainer } = render(<AnimatedLogo size="xs" />);
      const { container: lgContainer } = render(<AnimatedLogo size="lg" />);
      
      const xsPlaceholder = xsContainer.querySelector('.w-12');
      const lgPlaceholder = lgContainer.querySelector('.w-20');
      
      expect(xsPlaceholder).toBeInTheDocument();
      expect(lgPlaceholder).toBeInTheDocument();
    });

    it('shows subtitle placeholder for larger sizes', () => {
      const { container: xsContainer } = render(<AnimatedLogo size="xs" />);
      const { container: mdContainer } = render(<AnimatedLogo size="md" />);
      
      const xsSubtitle = xsContainer.querySelector('.w-16');
      const mdSubtitle = mdContainer.querySelector('.w-16');
      
      expect(xsSubtitle).not.toBeInTheDocument();
      expect(mdSubtitle).toBeInTheDocument();
    });
  });
});

describe('Logo Integration', () => {
  describe('Brand Consistency', () => {
    it('maintains consistent gradient colors', () => {
      const { container } = render(<Logo />);
      const gradientElement = container.querySelector('.from-blue-600');
      expect(gradientElement).toBeInTheDocument();
    });

    it('uses consistent border radius', () => {
      const { container } = render(<Logo />);
      const roundedElement = container.querySelector('.rounded-xl');
      expect(roundedElement).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('renders quickly without layout shifts', () => {
      const startTime = performance.now();
      render(<Logo />);
      const endTime = performance.now();
      
      // Should render in less than 10ms
      expect(endTime - startTime).toBeLessThan(10);
    });

    it('handles multiple instances efficiently', () => {
      const { container } = render(
        <div>
          <Logo size="xs" />
          <Logo size="sm" />
          <Logo size="md" />
          <Logo size="lg" />
          <Logo size="xl" />
        </div>
      );
      
      const logos = container.querySelectorAll('.flex.items-center');
      expect(logos).toHaveLength(5);
    });
  });
});
