import React from 'react';
import { cn } from '@/lib/utils';

interface TwoColumnFieldProps {
  className?: string;
  children: React.ReactNode;
}

export function TwoColumnField({ className, children }: TwoColumnFieldProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", className)}>
      {children}
    </div>
  );
}