import { z } from 'zod';
import { assessmentSchema, AssessmentFormData } from './assessment-schema';

export interface ValidationResult {
  isValid: boolean;
  errors: { [key: string]: string[] };
  warnings: { [key: string]: string[] };
  timestamp: string;
}

export class ValidationManager {
  private static instance: ValidationManager;
  private lastValidation: ValidationResult | null = null;

  private constructor() {}

  static getInstance(): ValidationManager {
    if (!ValidationManager.instance) {
      ValidationManager.instance = new ValidationManager();
    }
    return ValidationManager.instance;
  }

  validateSection(section: keyof AssessmentFormData, data: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      const sectionSchema = (assessmentSchema.shape as any)[section];
      sectionSchema.parse(data);

      // Only validate if section is actively being used
      if (this.isSectionInUse(section, data)) {
        // Section-specific validation rules
        switch (section) {
          case 'initial':
            this.validateInitialSection(data, errors, warnings);
            break;
          case 'medical':
            this.validateMedicalSection(data, errors, warnings);
            break;
          case 'environmental':
            this.validateEnvironmentalSection(data, errors, warnings);
            break;
        }
      }
    } catch (e) {
      if (e instanceof z.ZodError) {
        errors.push(...e.errors.map(err => err.message));
      }
    }

    const result = {
      isValid: errors.length === 0,
      errors: { [section]: errors },
      warnings: { [section]: warnings },
      timestamp: new Date().toISOString()
    };

    this.lastValidation = result;
    return result;
  }

  validateFullAssessment(data: Partial<AssessmentFormData>): ValidationResult {
    const errors: { [key: string]: string[] } = {};
    const warnings: { [key: string]: string[] } = {};

    // Only validate sections that are in use
    Object.entries(data).forEach(([section, sectionData]) => {
      if (this.isSectionInUse(section as keyof AssessmentFormData, sectionData)) {
        const sectionResult = this.validateSection(section as keyof AssessmentFormData, sectionData);
        if (sectionResult.errors[section]?.length > 0) {
          errors[section] = sectionResult.errors[section];
        }
        if (sectionResult.warnings[section]?.length > 0) {
          warnings[section] = sectionResult.warnings[section];
        }
      }
    });

    // Cross-section validation only if relevant sections are in use
    this.validateCrossSectionRules(data, errors, warnings);

    const result = {
      isValid: Object.keys(errors).length === 0,
      errors,
      warnings,
      timestamp: new Date().toISOString()
    };

    this.lastValidation = result;
    return result;
  }

  private isSectionInUse(section: keyof AssessmentFormData, data: any): boolean {
    // Check if section has any meaningful data
    if (!data) return false;

    switch (section) {
      case 'initial':
        // Initial section is considered in use if any personal info is filled
        return Object.values(data.personal || {}).some(value => value && value !== '');

      case 'medical':
        // Medical section is in use if any injury info or medications are present
        return (
          Object.values(data.injury || {}).some(value => value && value !== '') ||
          (data.medications || []).length > 0 ||
          (data.symptoms || []).length > 0
        );

      case 'environmental':
        // Environmental section is in use if any rooms or hazards are defined
        return (
          (data.rooms || []).length > 0 ||
          (data.hazards && data.hazards !== '')
        );

      case 'adl':
        // ADL section is in use if any activities are defined
        return Object.keys(data.activities || {}).length > 0;

      case 'attendantCare':
        // Care section is in use if any tasks or recommendations exist
        return (
          (data.tasks || []).length > 0 ||
          (data.recommendations || []).length > 0
        );

      default:
        // For other sections, check if there's any non-empty data
        return Object.values(data).some(value => {
          if (Array.isArray(value)) return value.length > 0;
          if (typeof value === 'object') return Object.keys(value).length > 0;
          return value !== '' && value !== null && value !== undefined;
        });
    }
  }

  private validateInitialSection(data: any, errors: string[], warnings: string[]) {
    const { personal } = data;
    if (!personal) return;

    // Only validate fields that are filled out
    if (personal.dateOfBirth) {
      const birthDate = new Date(personal.dateOfBirth);
      const age = (new Date().getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      if (age < 0 || age > 120) {
        errors.push('Invalid date of birth');
      }
    }

    if (personal.postalCode && !/^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/.test(personal.postalCode)) {
      errors.push('Invalid postal code format');
    }

    if (personal.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personal.email)) {
      errors.push('Invalid email format');
    }
  }

  private validateMedicalSection(data: any, errors: string[], warnings: string[]) {
    if (!data) return;

    // Only validate medications if any are entered
    if (data.medications?.length > 0) {
      // Check for medications with missing required info
      data.medications.forEach((med: any, index: number) => {
        if (med.name && (!med.dosage || !med.frequency)) {
          warnings.push(`Medication #${index + 1}: Consider adding dosage and frequency`);
        }
      });

      // Check for duplicate medications
      const medicationNames = data.medications
        .map((med: any) => med.name?.toLowerCase())
        .filter((name: string) => name);
      
      const duplicates = medicationNames.filter((name: string, index: number) => 
        medicationNames.indexOf(name) !== index
      );
      
      if (duplicates.length > 0) {
        warnings.push(`Duplicate medications found: ${duplicates.join(', ')}`);
      }
    }

    // Only validate imaging if present
    if (data.imaging?.length > 0) {
      data.imaging.forEach((img: any) => {
        if (img.date && new Date(img.date) > new Date()) {
          errors.push(`Future date not allowed for imaging: ${img.type}`);
        }
      });
    }
  }

  private validateEnvironmentalSection(data: any, errors: string[], warnings: string[]) {
    if (!data) return;

    // Only validate rooms if any are defined
    if (data.rooms?.length > 0) {
      const roomTypes = data.rooms.map((room: any) => room.type?.toLowerCase());
      
      // Suggest missing key rooms but don't mark as errors
      const keyRooms = ['bedroom', 'bathroom', 'kitchen'];
      keyRooms.forEach(room => {
        if (!roomTypes.includes(room)) {
          warnings.push(`Consider including assessment of ${room}`);
        }
      });
    }

    // Only validate hazards if documented
    if (data.hazards && data.hazards.length > 0 && !data.description) {
      warnings.push('Consider adding detailed description for documented hazards');
    }
  }

  private validateCrossSectionRules(
    data: Partial<AssessmentFormData>, 
    errors: { [key: string]: string[] }, 
    warnings: { [key: string]: string[] }
  ) {
    // Only validate relationships between sections that are actively in use
    
    // Example: Care tasks and ADL relationship
    if (this.isSectionInUse('attendantCare', data.attendantCare) && 
        data.attendantCare?.tasks?.length > 0) {
      
      if (!this.isSectionInUse('adl', data.adl)) {
        if (!warnings.adl) warnings.adl = [];
        warnings.adl.push('Consider completing ADL assessment when care tasks are specified');
      }
    }

    // Example: Environmental hazards and medical symptoms relationship
    if (this.isSectionInUse('environmental', data.environmental) && 
        data.environmental?.hazards) {
      
      if (!this.isSectionInUse('medical', data.medical) || 
          !(data.medical?.symptoms?.length > 0)) {
        if (!warnings.medical) warnings.medical = [];
        warnings.medical.push('Consider documenting medical symptoms when environmental hazards exist');
      }
    }
  }

  getLastValidation(): ValidationResult | null {
    return this.lastValidation;
  }
}

export const validationManager = ValidationManager.getInstance();