import React from 'react';
import { cn } from '@/lib/utils';
import { 
  ChevronDown, 
  ChevronRight,
  User,
  FileText,
  Activity,
  Brain,
  Heart,
  Home,
  Users,
  ClipboardCheck,
  GraduationCap,
  ClipboardList,
  Stethoscope,
  ListChecks,
  ScrollText,
  TimerReset
} from 'lucide-react';

// Icon mapping for main sections
const sectionIcons = {
  demographics: User,
  documentation: FileText,
  medical: Stethoscope,
  symptoms: Activity,
  functional: TimerReset,
  care: Users,
  ama: ClipboardCheck,
  summary: ListChecks,
  professional: GraduationCap
} as const;

type SectionIconType = keyof typeof sectionIcons;

interface MainSectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: SectionIconType;
  className?: string;
}

interface SubSectionHeaderProps {
  title: string;
  subtitle?: string;
  collapsible?: boolean;
  expanded?: boolean;
  onToggle?: () => void;
  className?: string;
}

// Main section header (e.g., "Initial Information", "Medical History")
export const MainSectionHeader = ({
  title,
  subtitle,
  icon,
  className
}: MainSectionHeaderProps) => {
  const Icon = icon ? sectionIcons[icon] : null;

  return (
    <div className={cn("space-y-1.5 p-6", className)}>
      <div className="flex items-center gap-3">
        {Icon && <Icon className="h-5 w-5 text-primary" />}
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      </div>
      {subtitle && (
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
};

// Sub-section header (e.g., "Basic Information", "Contact Information")
export const SubSectionHeader = ({
  title,
  subtitle,
  collapsible = false,
  expanded = false,
  onToggle,
  className
}: SubSectionHeaderProps) => {
  return (
    <div 
      className={cn(
        "flex items-start gap-3 p-4",
        collapsible && "cursor-pointer hover:bg-accent/50 transition-colors",
        className
      )}
      onClick={collapsible ? onToggle : undefined}
    >
      {collapsible && (
        <div className="mt-1">
          {expanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      )}
      <div className="space-y-1">
        <h2 className="text-xl font-medium text-foreground">{title}</h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
};