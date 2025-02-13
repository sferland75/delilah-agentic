import React from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import type { MockProviderProps } from '../types';

// Mock providers if needed
const AllProviders: React.FC<MockProviderProps> = ({ children }) => {
  return (
    <>
      {children}
    </>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) =>
  render(ui, { wrapper: AllProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };