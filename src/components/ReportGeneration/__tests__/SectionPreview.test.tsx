import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SectionPreview } from '../components/SectionPreview';
import { SectionHistory } from '@/lib/reports/sectionHistory';

// Mock SectionHistory
jest.mock('@/lib/reports/sectionHistory');

describe('SectionPreview', () => {
  const defaultProps = {
    sectionKey: 'demographics',
    title: 'Demographics',
    content: 'Initial content',
    originalPrompt: {
      system: 'System prompt',
      human: 'Human prompt'
    },
    onRegenerateSection: jest.fn(),
    onLockSection: jest.fn(),
    onUpdateContent: jest.fn(),
    isLocked: false,
    isEditing: false,
    onToggleEdit: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders initial content correctly', () => {
    render(<SectionPreview {...defaultProps} />);
    
    expect(screen.getByText('Demographics')).toBeInTheDocument();
    expect(screen.getByText('Initial content')).toBeInTheDocument();
  });

  it('handles edit mode toggle', async () => {
    render(<SectionPreview {...defaultProps} />);
    
    const editButton = screen.getByRole('button', { 
      name: /edit/i 
    });
    await userEvent.click(editButton);
    
    expect(defaultProps.onToggleEdit).toHaveBeenCalled();
  });

  it('handles content editing', async () => {
    render(<SectionPreview {...defaultProps} isEditing={true} />);
    
    const textarea = screen.getByRole('textbox');
    await userEvent.type(textarea, ' additional text');
    
    expect(defaultProps.onUpdateContent).toHaveBeenCalledWith('Initial content additional text');
  });

  it('disables editing when locked', () => {
    render(<SectionPreview {...defaultProps} isLocked={true} />);
    
    const editButton = screen.getByRole('button', { name: /edit/i });
    const customizeButton = screen.getByRole('button', { name: /customize prompt/i });
    
    expect(editButton).toBeDisabled();
    expect(customizeButton).toBeDisabled();
  });

  it('shows prompt editor when customize is clicked', async () => {
    render(<SectionPreview {...defaultProps} />);
    
    const customizeButton = screen.getByRole('button', { name: /customize prompt/i });
    await userEvent.click(customizeButton);
    
    expect(screen.getByText('System Prompt')).toBeInTheDocument();
  });

  it('handles section regeneration', async () => {
    render(<SectionPreview {...defaultProps} />);
    
    const customizeButton = screen.getByRole('button', { name: /customize prompt/i });
    await userEvent.click(customizeButton);
    
    const newPrompt = {
      system: 'New system prompt',
      human: 'New human prompt'
    };

    const systemInput = screen.getByLabelText(/system prompt/i);
    const humanInput = screen.getByLabelText(/human prompt/i);
    
    await userEvent.clear(systemInput);
    await userEvent.type(systemInput, newPrompt.system);
    await userEvent.clear(humanInput);
    await userEvent.type(humanInput, newPrompt.human);
    
    const regenerateButton = screen.getByRole('button', { name: /regenerate section/i });
    await userEvent.click(regenerateButton);
    
    expect(defaultProps.onRegenerateSection).toHaveBeenCalledWith(newPrompt);
  });

  it('handles version history', async () => {
    const mockHistory = new SectionHistory();
    mockHistory.addVersion('demographics', 'Version 1');
    mockHistory.addVersion('demographics', 'Version 2');
    
    render(<SectionPreview {...defaultProps} />);
    
    const historyButton = screen.getByRole('button', { name: /history/i });
    await userEvent.click(historyButton);
    
    expect(screen.getByText('Previous Versions')).toBeInTheDocument();
    expect(screen.getByText('Version 1')).toBeInTheDocument();
    expect(screen.getByText('Version 2')).toBeInTheDocument();
  });

  it('handles version revert', async () => {
    const mockHistory = new SectionHistory();
    mockHistory.addVersion('demographics', 'Old version');
    
    render(<SectionPreview {...defaultProps} />);
    
    const historyButton = screen.getByRole('button', { name: /history/i });
    await userEvent.click(historyButton);
    
    const revertButton = screen.getByRole('button', { name: /revert to this version/i });
    await userEvent.click(revertButton);
    
    expect(defaultProps.onUpdateContent).toHaveBeenCalledWith('Old version');
  });

  it('handles errors during regeneration', async () => {
    const errorProps = {
      ...defaultProps,
      onRegenerateSection: jest.fn().mockRejectedValue(new Error('Test error'))
    };
    
    render(<SectionPreview {...errorProps} />);
    
    const customizeButton = screen.getByRole('button', { name: /customize prompt/i });
    await userEvent.click(customizeButton);
    
    const regenerateButton = screen.getByRole('button', { name: /regenerate section/i });
    await userEvent.click(regenerateButton);
    
    await waitFor(() => {
      expect(screen.getByText('Test error')).toBeInTheDocument();
    });
  });

  it('saves content before regenerating', async () => {
    render(<SectionPreview {...defaultProps} isEditing={true} />);
    
    const textarea = screen.getByRole('textbox');
    await userEvent.type(textarea, ' new content');
    
    const saveButton = screen.getByRole('button', { name: /check/i });
    await userEvent.click(saveButton);
    
    expect(defaultProps.onUpdateContent).toHaveBeenCalledWith('Initial content new content');
    expect(defaultProps.onToggleEdit).toHaveBeenCalled();
  });

  it('maintains lock state through operations', async () => {
    const { rerender } = render(<SectionPreview {...defaultProps} />);
    
    const lockButton = screen.getByRole('button', { name: /unlock/i });
    await userEvent.click(lockButton);
    
    expect(defaultProps.onLockSection).toHaveBeenCalled();
    
    // Simulate locked state
    rerender(<SectionPreview {...defaultProps} isLocked={true} />);
    
    const editButton = screen.getByRole('button', { name: /edit/i });
    const customizeButton = screen.getByRole('button', { name: /customize prompt/i });
    
    expect(editButton).toBeDisabled();
    expect(customizeButton).toBeDisabled();
  });
});