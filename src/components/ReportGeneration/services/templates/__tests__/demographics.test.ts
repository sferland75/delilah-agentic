import { demographicsSection } from '../demographics';
import { AssessmentData } from '../../../../../types/assessment';

describe('Demographics Section Generator', () => {
  const mockFullAssessmentData: AssessmentData = {
    assessment: {
      demographics: {
        firstName: 'John',
        lastName: 'Smith',
        dateOfBirth: '1980-01-01',
        gender: 'Male',
        phone: '555-0123',
        email: 'john.smith@email.com',
        address: '123 Main St, City, State 12345',
        maritalStatus: 'Married',
        numberOfChildren: 2,
        childrenDetails: 'Two children aged 8 and 10',
        householdMembers: [
          { name: 'Jane Smith', relationship: 'Spouse', notes: 'Primary caregiver' },
          { name: 'Tom Smith', relationship: 'Son' },
          { name: 'Sarah Smith', relationship: 'Daughter' }
        ],
        emergencyContact: {
          name: 'Jane Smith',
          phone: '555-0124',
          relationship: 'Spouse'
        }
      }
    } as any // Cast to any as we don't need full assessment data for these tests
  };

  const mockMinimalAssessmentData: AssessmentData = {
    assessment: {
      demographics: {
        firstName: 'John',
        lastName: 'Smith',
        dateOfBirth: '1980-01-01',
        gender: 'Male',
        phone: '',
        email: '',
        address: '',
        maritalStatus: 'Single',
        emergencyContact: {
          name: 'Jane Smith',
          relationship: 'Sister'
        }
      }
    } as any
  };

  it('generates complete demographics section with all data', async () => {
    const result = await demographicsSection.generate(mockFullAssessmentData);
    
    // Check section header
    expect(result).toContain('# DEMOGRAPHICS');
    
    // Check personal information section
    expect(result).toContain('## PERSONAL INFORMATION');
    expect(result).toContain('Full Name: John Smith');
    expect(result).toContain('Date of Birth: 1980-01-01');
    expect(result).toContain('Gender: Male');
    expect(result).toContain('Marital Status: Married');
    expect(result).toContain('Number of Children: 2');
    expect(result).toContain('Children Details: Two children aged 8 and 10');
    
    // Check contact information section
    expect(result).toContain('## CONTACT INFORMATION');
    expect(result).toContain('Phone: 555-0123');
    expect(result).toContain('Email: john.smith@email.com');
    expect(result).toContain('Address: 123 Main St, City, State 12345');
    
    // Check emergency contact section
    expect(result).toContain('## EMERGENCY CONTACT');
    expect(result).toContain('Name: Jane Smith');
    expect(result).toContain('Relationship: Spouse');
    expect(result).toContain('Phone: 555-0124');
  });

  it('generates demographics section with minimal data', async () => {
    const result = await demographicsSection.generate(mockMinimalAssessmentData);
    
    // Check required fields
    expect(result).toContain('Full Name: John Smith');
    expect(result).toContain('Date of Birth: 1980-01-01');
    expect(result).toContain('Gender: Male');
    expect(result).toContain('Marital Status: Single');
    
    // Check optional fields show as "Not provided"
    expect(result).toContain('Phone: Not provided');
    expect(result).toContain('Email: Not provided');
    expect(result).toContain('Address: Not provided');
    
    // Check emergency contact without phone
    expect(result).toContain('Name: Jane Smith');
    expect(result).toContain('Relationship: Sister');
    expect(result).toContain('Phone: Not provided');
  });

  it('handles missing optional sections gracefully', async () => {
    const dataWithoutOptional = {
      assessment: {
        demographics: {
          firstName: 'John',
          lastName: 'Smith',
          dateOfBirth: '1980-01-01',
          gender: 'Male',
          phone: '555-0123',
          email: 'john@email.com',
          address: '123 Main St',
          maritalStatus: 'Single',
          emergencyContact: {
            name: 'Jane Smith',
            relationship: 'Sister'
          }
        }
      }
    } as AssessmentData;

    const result = await demographicsSection.generate(dataWithoutOptional);
    
    // Should not contain children section when not provided
    expect(result).not.toContain('Number of Children');
    expect(result).not.toContain('Children Details');
    
    // Emergency contact should handle missing phone
    expect(result).toContain('Phone: Not provided');
  });

  it('maintains consistent section order and structure', async () => {
    const result = await demographicsSection.generate(mockFullAssessmentData);
    const sections = result.split('\n\n');
    
    // Check order of main sections
    expect(sections[0]).toContain('# DEMOGRAPHICS');
    expect(sections[1]).toContain('## PERSONAL INFORMATION');
    expect(sections[2]).toContain('## CONTACT INFORMATION');
    expect(sections[3]).toContain('## EMERGENCY CONTACT');
  });

  it('has correct section metadata', () => {
    expect(demographicsSection.id).toBe('demographics');
    expect(demographicsSection.title).toBe('DEMOGRAPHICS');
    expect(demographicsSection.order).toBe(1);
  });
});
