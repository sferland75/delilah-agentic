import type { ProgressSections } from '../types';

export const mockProgressSections: ProgressSections = {
  demographics: {
    section: 'Demographics',
    progress: 100,
    status: 'complete'
  },
  medical: {
    section: 'Medical History',
    progress: 50,
    status: 'processing'
  }
};

export const mockProgressWithError: ProgressSections = {
  demographics: {
    section: 'Demographics',
    progress: 0,
    status: 'error',
    error: 'Failed to generate demographics'
  },
  medical: {
    section: 'Medical History',
    progress: 50,
    status: 'processing'
  }
};

export const mockMixedProgress: ProgressSections = {
  demographics: {
    section: 'Demographics',
    progress: 100,
    status: 'complete'
  },
  medical: {
    section: 'Medical History',
    progress: 50,
    status: 'processing'
  },
  symptoms: {
    section: 'Symptoms',
    progress: 0,
    status: 'error',
    error: 'Failed to generate'
  }
};