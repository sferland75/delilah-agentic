import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Types for mocked fs
interface MockFS {
  readFile: jest.Mock;
  writeFile: jest.Mock;
  readdir: jest.Mock;
  mkdir: jest.Mock;
}

// Extend Window interface
declare global {
  interface Window {
    fs: MockFS;
    TextEncoder: typeof TextEncoder;
    TextDecoder: typeof TextDecoder;
  }
}

// Mock window.fs for file system operations
const mockFs: MockFS = {
  readFile: jest.fn(),
  writeFile: jest.fn(),
  readdir: jest.fn(),
  mkdir: jest.fn()
};

// Safely extend window object
Object.defineProperty(window, 'fs', {
  value: mockFs,
  writable: true
});

// Mock TextEncoder/TextDecoder
Object.defineProperty(window, 'TextEncoder', {
  value: TextEncoder,
  writable: true
});

Object.defineProperty(window, 'TextDecoder', {
  value: TextDecoder,
  writable: true
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

// Clean up mocks
afterEach(() => {
  jest.clearAllMocks();
});

// Additional test setup
jest.setTimeout(10000); // Increase timeout for integration tests