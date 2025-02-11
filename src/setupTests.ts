import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Mock window.fs for file system operations
const mockFs = {
  readFile: jest.fn(),
  writeFile: jest.fn(),
  readdir: jest.fn(),
  mkdir: jest.fn()
};

global.window = {
  ...global.window,
  fs: mockFs
};

// Mock TextEncoder/TextDecoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

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