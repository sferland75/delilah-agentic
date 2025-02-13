import '@testing-library/jest-dom';
import React from 'react';

type MockFS = {
  readFile: jest.Mock;
  writeFile: jest.Mock;
};

// Mock window.fs
(global.window as any).fs = {
  readFile: jest.fn(),
  writeFile: jest.fn()
} as MockFS;

// Mock ShadCN components that we use frequently
jest.mock('@/components/ui/button', () => ({
  __esModule: true,
  Button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    React.createElement('button', props, children)
  )
}));

jest.mock('@/components/ui/dialog', () => ({
  __esModule: true,
  Dialog: ({ children, open }: React.PropsWithChildren<{ open?: boolean }>) => 
    open ? React.createElement('div', { role: 'dialog' }, children) : null,
  DialogContent: ({ children }: React.PropsWithChildren) => 
    React.createElement('div', null, children),
  DialogHeader: ({ children }: React.PropsWithChildren) => 
    React.createElement('div', null, children),
  DialogTitle: ({ children }: React.PropsWithChildren) => 
    React.createElement('div', null, children),
  DialogFooter: ({ children }: React.PropsWithChildren) => 
    React.createElement('div', null, children),
}));

jest.mock('@/components/ui/progress', () => ({
  __esModule: true,
  Progress: ({ value }: { value: number }) => 
    React.createElement('div', {
      role: 'progressbar',
      'data-progress': value,
      'aria-valuenow': value,
      'aria-valuemin': 0,
      'aria-valuemax': 100
    }, `${value}%`)
}));

// Mock icons
jest.mock('lucide-react', () => ({
  __esModule: true,
  Loader2: () => React.createElement('div', { 'data-testid': 'spinner' }, 'Loading...'),
  FileText: () => React.createElement('div', { 'data-testid': 'file-text-icon' }, 'File Icon'),
  AlertCircle: () => React.createElement('div', { 'data-testid': 'alert-circle-icon' }, 'Alert Icon'),
  Check: () => React.createElement('div', { 'data-testid': 'check-icon' }, 'Check Icon'),
  Edit2: () => React.createElement('div', { 'data-testid': 'edit-icon' }, 'Edit Icon'),
  Lock: () => React.createElement('div', { 'data-testid': 'lock-icon' }, 'Lock Icon'),
  Unlock: () => React.createElement('div', { 'data-testid': 'unlock-icon' }, 'Unlock Icon'),
  History: () => React.createElement('div', { 'data-testid': 'history-icon' }, 'History Icon'),
  RefreshCw: () => React.createElement('div', { 'data-testid': 'refresh-icon' }, 'Refresh Icon'),
  Save: () => React.createElement('div', { 'data-testid': 'save-icon' }, 'Save Icon')
}));