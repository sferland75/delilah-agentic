'use client';

import React from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionContainerProps {
  title?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
  collapsible?: boolean;
  icon?: React.ReactNode;
}

export function SectionContainer({
  title,
  description,
  className,
  children,
  collapsible = false,
  icon,
}: SectionContainerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapsible.Root
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn(
        "w-full rounded-lg border bg-card text-card-foreground shadow-sm",
        "data-[state=open]:bg-blue-50/50",
        className
      )}
    >
      {collapsible ? (
        <Collapsible.Trigger asChild>
          <button 
            className={cn(
              "w-full flex items-center justify-between p-4",
              "hover:bg-accent/50 transition-colors"
            )}
          >
            <div className="flex items-start gap-3 flex-1">
              {icon && (
                <span className="h-4 w-4 text-muted-foreground mt-1">{icon}</span>
              )}
              <div className="flex-1">
                <h3 className="text-base font-medium">{title}</h3>
                {description && (
                  <p className="text-sm text-muted-foreground">{description}</p>
                )}
              </div>
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            />
          </button>
        </Collapsible.Trigger>
      ) : (
        <div className="flex items-start gap-3 p-4">
          {icon && (
            <span className="h-4 w-4 text-muted-foreground mt-1">{icon}</span>
          )}
          <div className="flex-1">
            <h3 className="text-base font-medium">{title}</h3>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
      )}
      <Collapsible.Content>
        <div className="px-4 pb-4 space-y-4">
          {children}
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}