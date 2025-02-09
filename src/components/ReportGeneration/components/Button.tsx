import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'default',
  children,
  className,
  ...props
}) => {
  const baseClasses = 'px-4 py-2 rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantClasses = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    ghost: 'text-gray-700 hover:bg-gray-100'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className || ''}`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;