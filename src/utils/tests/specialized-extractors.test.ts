import { SpecializedExtractors } from '../specialized-extractors';

describe('SpecializedExtractors', () => {
  describe('Attendant Care Extraction', () => {
    const sampleText = `
      Attendant Care Assessment
      
      Personal Care
      Task | Frequency | Time Required | Notes
      Morning Care | Daily | 2.5 | Requires assistance with dressing
      Evening Care | Daily | 3.3 | Assistance with bathing
      
      Housekeeping
      Task | Frequency | Time Required | Notes
      Meal Prep | Daily | 4.0 | Modified techniques required
    `;

    it('extracts attendant care categories and tasks correctly', () => {
      const result = SpecializedExtractors.extractAttendantCare(sampleText);

      expect(result.length).toBe(2);
      expect(result[0].name).toBe('Personal Care');
      expect(result[0].tasks).toHaveLength(2);
      expect(result[0].totalHoursPerWeek).toBeCloseTo(5.8);
      expect(result[1].name).toBe('Housekeeping');
      expect(result[1].tasks).toHaveLength(1);
    });

    it('calculates total hours correctly', () => {
      const result = SpecializedExtractors.extractAttendantCare(sampleText);
      expect(result[0].totalHoursPerWeek).toBeCloseTo(5.8);
      expect(result[1].totalHoursPerWeek).toBeCloseTo(4.0);
    });
  });

  describe('AMA Assessment Extraction', () => {
    const sampleText = `
      AMA Guide Assessment
      
      Impairment Ratings
      Body Part | Impairment Value | Findings
      Cervical Spine | 8% WPI | ROM limitations; Muscle tension
      Lumbar Spine | 12% WPI | Radiculopathy; Muscle weakness
    `;

    it('extracts AMA assessment data correctly', () => {
      const result = SpecializedExtractors.extractAMAAssessment(sampleText);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        bodyPart: 'Cervical Spine',
        impairmentValue: '8% WPI',
        findings: ['ROM limitations', 'Muscle tension']
      });
      expect(result[1]).toEqual({
        bodyPart: 'Lumbar Spine',
        impairmentValue: '12% WPI',
        findings: ['Radiculopathy', 'Muscle weakness']
      });
    });
  });

  describe('Housekeeping Assessment Extraction', () => {
    const sampleText = `
      Housekeeping Assessment
      
      Daily Tasks
      Start Time | End Time | Task | Assistance Required
      8:00 | 9:00 | Kitchen cleaning | Full assist
      10:00 | 10:30 | Laundry | Partial assist
    `;

    it('extracts housekeeping tasks correctly', () => {
      const result = SpecializedExtractors.extractHousekeeping(sampleText);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        timeRange: {
          startTime: '8:00',
          endTime: '9:00'
        },
        activity: 'Kitchen cleaning',
        assistanceRequired: 'Full assist'
      });
    });
  });

  describe('Daily Schedule Extraction', () => {
    const sampleText = `
      Daily Schedule
      
      Schedule
      Time | Activity | Assistance Required
      7:00-8:00 | Morning Care | Full assist
      12:00-13:00 | Lunch preparation | Partial assist
    `;

    it('extracts schedule entries correctly', () => {
      const result = SpecializedExtractors.extractDailySchedule(sampleText);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        timeRange: {
          startTime: '7:00',
          endTime: '8:00'
        },
        activity: 'Morning Care',
        assistanceRequired: 'Full assist'
      });
    });
  });

  describe('Error Handling', () => {
    const malformedText = `
      Attendant Care Assessment
      Invalid table format
      Missing required fields
    `;

    it('handles malformed attendant care data', () => {
      const result = SpecializedExtractors.extractAttendantCare(malformedText);
      expect(result).toHaveLength(2); // Still returns both categories
      expect(result[0].tasks).toHaveLength(0); // But with empty tasks
    });

    it('handles malformed AMA data', () => {
      const result = SpecializedExtractors.extractAMAAssessment(malformedText);
      expect(result).toHaveLength(0);
    });
  });
});