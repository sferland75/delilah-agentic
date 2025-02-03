import React from 'react';

type MockComponentProps = {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  open?: boolean;
} & Record<string, any>;

export const createMockComponent = (name: string) => {
  const Component = ({ children, onOpenChange, ...props }: MockComponentProps) =>
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

// Mock shadcn components
export const Dialog = createMockComponent('Dialog');
export const DialogContent = createMockComponent('DialogContent');
export const DialogHeader = createMockComponent('DialogHeader');
export const DialogTitle = createMockComponent('DialogTitle');
export const DialogDescription = createMockComponent('DialogDescription');
export const DialogFooter = createMockComponent('DialogFooter');
export const Button = createMockComponent('Button');
export const Progress = createMockComponent('Progress');
export const Alert = createMockComponent('Alert');
export const AlertDescription = createMockComponent('AlertDescription');

// Mock the Loader2 component
export const Loader2 = ({ className }: { className?: string }) => (
  <div data-testid="mock-loader2" className={className}>
    Loader2
  </div>
);