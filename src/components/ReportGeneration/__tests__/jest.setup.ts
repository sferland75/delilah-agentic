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
  FileText: mockIcon('FileText'),
  Lock: mockIcon('Lock'),
  Unlock: mockIcon('Unlock'),
  History: mockIcon('History'),
  Edit2: mockIcon('Edit2'),
  Check: mockIcon('Check')
}));

// Mock Dialog components
const createMockComponent = (name: string) => {
  const Component = ({ children, ...props }: MockComponentProps) =>
    React.createElement(
      'div',
      {
        'data-testid': `mock-${name.toLowerCase()}`,
        'role': name.toLowerCase(),
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
  DialogFooter: createMockComponent('DialogFooter'),
  DialogClose: createMockComponent('DialogClose')
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
        'aria-label': props['aria-label'],
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
  Alert: ({ children, variant, className, ...props }: MockComponentProps) =>
    React.createElement(
      'div',
      {
        'data-testid': 'alert',
        'data-variant': variant,
        className,
        ...props
      },
      children
    ),
  AlertTitle: createMockComponent('AlertTitle'),
  AlertDescription: createMockComponent('AlertDescription')
}));

// Mock Textarea component
jest.mock('@/components/ui/textarea', () => ({
  Textarea: ({ value, onChange, className, ...props }: MockComponentProps) =>
    React.createElement(
      'textarea',
      {
        value,
        onChange,
        className,
        'data-testid': 'textarea',
        ...props
      }
    )
}));

// Mock ScrollArea component
jest.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: ({ children, className, ...props }: MockComponentProps) =>
    React.createElement(
      'div',
      {
        'data-testid': 'scroll-area',
        className,
        ...props
      },
      children
    )
}));

// Mock PromptEditor component
jest.mock('../components/PromptEditor', () => ({
  PromptEditor: ({ onSubmit, onClose }: any) =>
    React.createElement(
      'div',
      { 'data-testid': 'prompt-editor' },
      [
        React.createElement('textarea', { 
          'data-testid': 'system-prompt',
          key: 'system',
          defaultValue: 'test system'
        }),
        React.createElement('textarea', {
          'data-testid': 'human-prompt',
          key: 'human',
          defaultValue: 'test human'
        }),
        React.createElement(
          'button',
          { 
            key: 'submit',
            onClick: () => onSubmit({ system: 'test system', human: 'test human' })
          },
          'Submit'
        ),
        React.createElement(
          'button',
          { key: 'cancel', onClick: onClose },
          'Cancel'
        )
      ]
    )
}));