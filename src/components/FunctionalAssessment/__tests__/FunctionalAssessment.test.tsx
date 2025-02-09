import { render, screen, fireEvent } from '@test/test-utils';
import { FunctionalAssessment } from '../FunctionalAssessment';
import { mockAssessmentData } from '@test/mocks/assessment-data';

describe('FunctionalAssessment', () => {
  const defaultFormValues = {
    functionalAssessment: {
      rangeOfMotion: {
        measurements: [],
        generalNotes: ''
      },
      tolerances: {
        standing: '',
        walking: '',
        sitting: '',
        lifting: '',
        carrying: '',
        notes: ''
      },
      transfers: {
        bedMobility: '',
        toileting: '',
        bathing: '',
        carTransfer: '',
        notes: ''
      },
      motorSkills: [],
      generalNotes: ''
    }
  };

  it('renders all required fields', () => {
    render(<FunctionalAssessment />, { formValues: defaultFormValues });
    
    expect(screen.getByLabelText('Standing tolerance')).toBeInTheDocument();
    expect(screen.getByLabelText('Walking tolerance')).toBeInTheDocument();
    expect(screen.getByLabelText('Sitting tolerance')).toBeInTheDocument();
  });

  it('allows input in tolerance fields', () => {
    render(<FunctionalAssessment />, { formValues: defaultFormValues });
    
    const standingInput = screen.getByLabelText('Standing tolerance');
    fireEvent.change(standingInput, { target: { value: '30 minutes' } });
    expect(standingInput).toHaveValue('30 minutes');
  });

  it('updates ROM measurements', () => {
    render(<FunctionalAssessment />, { formValues: defaultFormValues });
    
    const addMeasurementButton = screen.getByRole('button', { name: /add measurement/i });
    fireEvent.click(addMeasurementButton);
    
    const jointInput = screen.getByLabelText(/joint/i);
    const movementInput = screen.getByLabelText(/movement/i);
    
    fireEvent.change(jointInput, { target: { value: 'Shoulder' } });
    fireEvent.change(movementInput, { target: { value: 'Flexion' } });
    
    expect(jointInput).toHaveValue('Shoulder');
    expect(movementInput).toHaveValue('Flexion');
  });

  it('handles form validation', () => {
    const { container } = render(<FunctionalAssessment />, { formValues: defaultFormValues });
    
    const submitButton = screen.getByRole('button', { name: /save assessment/i });
    fireEvent.submit(container.querySelector('form'));
    
    // Check for validation message either in aria-invalid or error message
    const standingInput = screen.getByLabelText('Standing tolerance');
    expect(standingInput).toHaveAttribute('aria-invalid', 'true');
  });

  it('handles form submission', async () => {
    const onSubmit = jest.fn();
    const { container } = render(
      <FunctionalAssessment onSubmit={onSubmit} />, 
      { formValues: defaultFormValues }
    );
    
    const standingInput = screen.getByLabelText('Standing tolerance');
    fireEvent.change(standingInput, { target: { value: '30 minutes' } });
    
    const form = container.querySelector('form');
    fireEvent.submit(form);
    
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        functionalAssessment: expect.objectContaining({
          tolerances: expect.objectContaining({
            standing: '30 minutes'
          })
        })
      })
    );
  });
});