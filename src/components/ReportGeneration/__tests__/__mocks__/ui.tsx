import React from 'react';

export const Card = ({ children, className = '' }) => (
  <div data-testid="card" className={className}>{children}</div>
);

export const CardHeader = ({ children, className = '' }) => (
  <div data-testid="card-header" className={className}>{children}</div>
);

export const CardTitle = ({ children, className = '' }) => (
  <div data-testid="card-title" className={className}>{children}</div>
);

export const CardContent = ({ children, className = '' }) => (
  <div data-testid="card-content" className={className}>{children}</div>
);

export const Button = ({ children, onClick, disabled, className = '', ...props }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={className}
    {...props}
  >
    {children}
  </button>
);

export const Textarea = ({ value, onChange, className = '', ...props }) => (
  <textarea
    value={value}
    onChange={onChange}
    className={className}
    {...props}
  />
);

export const Alert = ({ children, className = '', variant = '' }) => (
  <div data-testid="alert" className={`${className} ${variant}`}>{children}</div>
);

export const AlertDescription = ({ children }) => (
  <div data-testid="alert-description">{children}</div>
);

export const ScrollArea = ({ children, className = '' }) => (
  <div data-testid="scroll-area" className={className}>{children}</div>
);