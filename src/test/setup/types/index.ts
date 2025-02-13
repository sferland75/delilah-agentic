import type { GenerationProgress } from '@/lib/reports/ReportGenerator';

export interface MockProviderProps {
  children: React.ReactNode;
}

export type TestID = string;

export interface TestProps {
  testId?: TestID;
}

// Progress Types
export type ProgressStatus = 'pending' | 'processing' | 'complete' | 'error';

export interface ProgressSection {
  section: string;
  progress: number;
  status: ProgressStatus;
  error?: string;
}

export type ProgressSections = Record<string, ProgressSection>;

// Mock Event Handler Types
export type MockHandler = jest.Mock;
export type MockHandlers = Record<string, MockHandler>;