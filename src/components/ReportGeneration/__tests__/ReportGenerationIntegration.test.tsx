import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FormProvider } from '@/context/FormContext';
import { ReportGenerationButton } from '../components/ReportGenerationButton';

// Mock assessment data
const mockAssessmentData = {
  assessment: {
    demographics: {
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: "1980-01-01",
      gender: "Male",
      phone: "555-0123",
      email: "john.doe@email.com",
      address: "123 Main St",
      maritalStatus: "Married",
      emergencyContact: {
        name: "Jane Doe",
        relationship: "Spouse",
        phone: "555-0124"
      }
    },
    medicalHistory: {
      medications: [
        {
          name: "Aspirin",
          dosage: "81mg",
          frequency: "daily",
          purpose: "blood thinner"
        }
      ],
      allergies: ["Penicillin"],
      treatments: ["Physiotherapy"],
      currentTreatment: [
        {
          name: "Dr. Smith",
          providerType: "Family Doctor",
          frequency: "Monthly",
          focus: "General health monitoring"
        }
      ],
      preExisting: "None reported",
      surgeries: "None"
    },
    symptoms: {
      physical: [
        {
          location: "Lower back",
          painType: "Dull",
          severity: "Moderate",
          frequency: "Daily",
          aggravating: "Prolonged sitting",
          relieving: "Walking"
        }
      ],
      cognitive: [
        {
          symptom: "Memory",
          severity: "Mild",
          frequency: "Occasional",
          impact: "Minor impact on daily activities",
          management: "Using reminders"
        }
      ],
      generalNotes: "Symptoms are generally manageable"
    },
    functionalAssessment: {},
    environmental: {},
    adl: {},
    amaGuides: {}
  }
};

describe('Report Generation Integration', () => {
  const mockFormContext = {
    formData: mockAssessmentData,
    updateFormData: jest.fn(),
  };

  // Mock download functionality
  let mockDownloadUrl = '';
  let mockDownloadFilename = '';

  beforeEach(() => {
    // Mock URL functions
    mockDownloadUrl = '';
    mockDownloadFilename = '';
    window.URL.createObjectURL = jest.fn((blob) => {
      return 'mock-url';
    });
    window.URL.revokeObjectURL = jest.fn();

    // Mock file download
    Object.defineProperty(document, 'createElement', {
      writable: true,
      value: jest.fn().mockImplementation((tag) => {
        if (tag === 'a') {
          return {
            click: jest.fn(),
            setAttribute: jest.fn(),
            style: {},
            href: '',
            download: '',
          };
        }
        const element = document.createElement(tag);
        return element;
      }),
    });

    // Mock appendChild and removeChild
    document.body.appendChild = jest.fn();
    document.body.removeChild = jest.fn();
  });

  it('generates report with sample data', async () => {
    render(
      <FormProvider value={mockFormContext}>
        <ReportGenerationButton />
      </FormProvider>
    );

    // Click generate button
    const generateButton = screen.getByText('Generate Report');
    fireEvent.click(generateButton);

    // Check if progress dialog appears
    await waitFor(() => {
      expect(screen.getByText('Generating Report')).toBeInTheDocument();
    });
    
    // Wait for completion toast
    await waitFor(() => {
      expect(screen.getByText('Report Generated')).toBeInTheDocument();
    });

    // Verify URL creation and cleanup
    expect(window.URL.createObjectURL).toHaveBeenCalled();
    expect(window.URL.revokeObjectURL).toHaveBeenCalled();
  });
});