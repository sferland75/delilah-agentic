import React from 'react';
import { cn } from '@/lib/utils';
import type { ButtonProps } from '../types';
import { Loader2 } from 'lucide-react';

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className,
    variant = 'default',
    size = 'md',
    fullWidth = false,
    isLoading = false,
    startIcon,
    endIcon,
    children,
    disabled,
    ...props
  }, ref) => {
    const baseClasses = cn(
      'inline-flex items-center justify-center rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2',
      { 'w-full': fullWidth },
      {
        'px-3 py-1 text-sm': size === 'sm',
        'px-4 py-2': size === 'md',
        'px-6 py-3 text-lg': size === 'lg'
      },
      {
        'bg-primary text-white hover:bg-primary-dark': variant === 'default',
        'border border-primary text-primary hover:bg-primary-light': variant === 'outline',
        'text-primary hover:bg-primary-light/10': variant === 'ghost'
      },
      { 'opacity-50 cursor-not-allowed': disabled || isLoading },
      className
    );

    return (
      <button
        ref={ref}
        className={baseClasses}
        disabled={disabled || isLoading}
        tabIndex={disabled ? -1 : 0}
        {...props}
      >
        {isLoading && (
          <Loader2 
            data-testid="spinner"
            className="w-4 h-4 mr-2 animate-spin"
          />
        )}
        {!isLoading && startIcon && (
          <span className="mr-2">{startIcon}</span>
        )}
        {children}
        {!isLoading && endIcon && (
          <span className="ml-2">{endIcon}</span>
        )}
      </button>
    );
  }
);