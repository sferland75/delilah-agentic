/** @jest-environment jsdom */
import '@testing-library/jest-dom';
import React from 'react';

type MockComponentProps = {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
} & Record<string, any>;

// Mock Icons
const mockIcon = (name: string) => 
  function Icon(props: MockComponentProps) {
    return React.createElement(
      'div',
      {
        'data-testid': `mock-${name.toLowerCase()}`,
        ...props
      },
      name
    );
  };

jest.mock('lucide-react', () => ({
  Loader2: mockIcon('Loader2'),
  X: mockIcon('X'),
  AlertCircle: mockIcon('AlertCircle'),
  CheckCircle: mockIcon('CheckCircle'),
  Circle: mockIcon('Circle'),
  Download: mockIcon('Download'),
  FileText: mockIcon('FileText')
}));

// Mock Dialog components
const createMockComponent = (name: string) => {
  const Component = ({ children, ...props }: MockComponentProps) =>
    React.createElement(
      'div',
      {
        'data-testid': `mock-${name.toLowerCase()}`,
        ...props
      },
      children
    );
  Component.displayName = name;
  return Component;
};

jest.mock('@/components/ui/dialog', () => ({
  Dialog: createMockComponent('Dialog'),
  DialogContent: createMockComponent('DialogContent'),
  DialogHeader: createMockComponent('DialogHeader'),
  DialogTitle: createMockComponent('DialogTitle'),
  DialogDescription: createMockComponent('DialogDescription'),
  DialogFooter: createMockComponent('DialogFooter')
}));

// Mock Button component
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, className, onClick, disabled, ...props }: MockComponentProps) =>
    React.createElement(
      'button',
      {
        className,
        onClick,
        disabled,
        'data-testid': props['data-testid'] || 'button',
        ...props
      },
      children
    )
}));

// Mock Progress component
type ProgressProps = MockComponentProps & {
  value?: number;
  max?: number;
};

jest.mock('@/components/ui/progress', () => ({
  Progress: ({ value = 0, max = 100, className, ...props }: ProgressProps) =>
    React.createElement(
      'div',
      {
        role: 'progressbar',
        'aria-valuenow': value,
        'aria-valuemin': 0,
        'aria-valuemax': max,
        'data-testid': 'progress',
        className,
        ...props
      },
      `${value}%`
    )
}));

// Mock Alert components
jest.mock('@/components/ui/alert', () => ({
  Alert: createMockComponent('Alert'),
  AlertTitle: createMockComponent('AlertTitle'),
  AlertDescription: createMockComponent('AlertDescription')
}));