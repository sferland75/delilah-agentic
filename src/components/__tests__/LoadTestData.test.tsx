import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoadTestData from '../LoadTestData';

// Mock functions and data
const mockOnFileLoad = jest.fn();
const mockJsonData = {
  testData: {
    name: "Test Patient",
    age: 45,
    assessmentDate: "2025-02-11"
  }
};

// Mock file reader
const mockFileReader = {
  readAsText: jest.fn(),
  result: JSON.stringify(mockJsonData),
  onload: jest.fn(),
};

// Mock file
const createMockFile = (content: any, name = 'test.json', type = 'application/json') => {
  return new File([JSON.stringify(content)], name, { type });
};

describe('LoadTestData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.FileReader = jest.fn(() => mockFileReader);
  });

  it('renders file input and button', () => {
    render(<LoadTestData onFileLoad={mockOnFileLoad} />);
    
    expect(screen.getByText('Choose JSON File')).toBeInTheDocument();
    expect(screen.getByLabelText(/file input/i)).toBeInTheDocument();
  });

  it('handles valid JSON file upload', async () => {
    render(<LoadTestData onFileLoad={mockOnFileLoad} />);
    
    const file = createMockFile(mockJsonData);
    const input = screen.getByLabelText(/file input/i);
    
    await userEvent.upload(input, file);
    
    // Simulate FileReader load event
    mockFileReader.onload();
    
    expect(mockOnFileLoad).toHaveBeenCalledWith(mockJsonData);
  });

  it('shows error for invalid JSON file', async () => {
    render(<LoadTestData onFileLoad={mockOnFileLoad} />);
    
    const invalidFile = new File(['invalid json'], 'test.json', { type: 'application/json' });
    const input = screen.getByLabelText(/file input/i);
    
    await userEvent.upload(input, invalidFile);
    
    // Simulate FileReader load event with invalid JSON
    mockFileReader.result = 'invalid json';
    mockFileReader.onload();
    
    expect(screen.getByText(/Invalid JSON file format/i)).toBeInTheDocument();
    expect(mockOnFileLoad).not.toHaveBeenCalled();
  });

  it('handles file button click', () => {
    render(<LoadTestData onFileLoad={mockOnFileLoad} />);
    
    const fileInput = screen.getByLabelText(/file input/i);
    const button = screen.getByText('Choose JSON File');
    
    // Mock click function
    const mockClick = jest.fn();
    fileInput.click = mockClick;
    
    fireEvent.click(button);
    
    expect(mockClick).toHaveBeenCalled();
  });

  it('shows error for wrong file type', async () => {
    render(<LoadTestData onFileLoad={mockOnFileLoad} />);
    
    const wrongFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByLabelText(/file input/i);
    
    await userEvent.upload(input, wrongFile);
    
    expect(screen.getByText(/Please select a JSON file/i)).toBeInTheDocument();
    expect(mockOnFileLoad).not.toHaveBeenCalled();
  });

  it('clears error when new file is selected', async () => {
    render(<LoadTestData onFileLoad={mockOnFileLoad} />);
    
    // First upload invalid file
    const invalidFile = new File(['invalid'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByLabelText(/file input/i);
    
    await userEvent.upload(input, invalidFile);
    expect(screen.getByText(/Please select a JSON file/i)).toBeInTheDocument();
    
    // Then upload valid file
    const validFile = createMockFile(mockJsonData);
    await userEvent.upload(input, validFile);
    
    // Error should be cleared
    expect(screen.queryByText(/Please select a JSON file/i)).not.toBeInTheDocument();
  });
});