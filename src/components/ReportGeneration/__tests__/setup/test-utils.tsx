import React from 'react';
import { render as rtlRender } from '@testing-library/react';

// Mock Dialog components
jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open, onOpenChange }: any) => 
    open ? <div role="dialog" onKeyDown={(e) => e.key === 'Escape' && onOpenChange?.(false)}>{children}</div> : null,
  DialogContent: ({ children }: any) => <div>{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <div>{children}</div>,
}));

// Mock Button component
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
}));

// Mock Progress component
jest.mock('@/components/ui/progress', () => ({
  Progress: ({ value }: any) => (
    <div role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div style={{ width: `${value}%` }} />
    </div>
  ),
}));

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  Loader2: () => <div data-testid="spinner">Spinner</div>,
}));

const customRender = (ui: React.ReactElement, options = {}) => {
  return rtlRender(ui, { ...options });
};

export * from '@testing-library/react';
export { customRender as render };