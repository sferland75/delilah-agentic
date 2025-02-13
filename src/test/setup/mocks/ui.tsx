import React from 'react';
import type { TestProps } from '../types';

interface BaseProps extends TestProps {
  className?: string;
  children?: React.ReactNode;
}

interface ButtonProps extends BaseProps {
  onClick?: () => void;
  disabled?: boolean;
  variant?: string;
  size?: string;
}

interface DialogProps extends BaseProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface ProgressProps extends BaseProps {
  value?: number;
}

export const Card = ({ children, className = '', testId }: BaseProps) => (
  <div data-testid={testId || 'card'} className={className}>{children}</div>
);

export const CardHeader = ({ children, className = '', testId }: BaseProps) => (
  <div data-testid={testId || 'card-header'} className={className}>{children}</div>
);

export const CardTitle = ({ children, className = '', testId }: BaseProps) => (
  <div data-testid={testId || 'card-title'} className={className}>{children}</div>
);

export const CardContent = ({ children, className = '', testId }: BaseProps) => (
  <div data-testid={testId || 'card-content'} className={className}>{children}</div>
);

export const Button = ({ 
  children, 
  onClick, 
  disabled, 
  className = '', 
  variant,
  size,
  testId 
}: ButtonProps) => (
  <button
    data-testid={testId || 'button'}
    onClick={onClick}
    disabled={disabled}
    className={className}
    data-variant={variant}
    data-size={size}
  >
    {children}
  </button>
);

export const Progress = ({ value = 0, className = '', testId }: ProgressProps) => (
  <div 
    data-testid={testId || 'progress'} 
    className={className}
    role="progressbar"
    aria-valuenow={value}
    aria-valuemin={0}
    aria-valuemax={100}
  >
    <div style={{ width: `${value}%` }} />
  </div>
);

export const Dialog = ({ children, open, onOpenChange, testId }: DialogProps) => (
  open ? (
    <div data-testid={testId || 'dialog'} role="dialog">
      {children}
      {onOpenChange && (
        <button onClick={() => onOpenChange(false)} data-testid="dialog-close">
          Close
        </button>
      )}
    </div>
  ) : null
);

export const Alert = ({ children, className = '', variant = '', testId }: BaseProps) => (
  <div 
    data-testid={testId || 'alert'} 
    className={className}
    data-variant={variant}
    role="alert"
  >
    {children}
  </div>
);

export const AlertDescription = ({ children, testId }: BaseProps) => (
  <div data-testid={testId || 'alert-description'}>{children}</div>
);