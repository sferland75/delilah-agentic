export interface ValidationError {
  section: string;
  message: string;
}

export interface ValidationResult {
  errors: ValidationError[];
}