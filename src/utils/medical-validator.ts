import { DataValidator } from './data-validator';
import { DataSanitizer } from './data-sanitizer';

export class MedicalValidator {
    /**
     * Validate diagnosis format
     */
    static isValidDiagnosis(diagnosis: string): boolean {
        // Common diagnosis patterns
        const patterns = [
            /^[A-Z][a-z]+ (?:of|in|to) (?:the )?[a-z]+/,  // "Fracture of radius"
            /^[A-Z][a-z]+(?: [a-z]+)* syndrome/i,         // "Carpal tunnel syndrome"
            /^[A-Z][a-z]+(?: [a-z]+)* injury/i,          // "Soft tissue injury"
            /^[A-Z][a-z]+(?: [a-z]+)* pain/i,            // "Lower back pain"
            /^[A-Z][a-z]+(?: [a-z]+)* strain/i,          // "Cervical strain"
            /^[A-Z][a-z]+(?: [a-z]+)* sprain/i,          // "Lumbar sprain"
        ];

        const cleanDiagnosis = DataSanitizer.cleanText(diagnosis);
        return patterns.some(pattern => pattern.test(cleanDiagnosis));
    }

    /**
     * Validate medication format
     */
    static isValidMedication(medication: string): boolean {
        const genericPattern = /^[A-Z][a-z]+(?: [A-Z][a-z]+)*$/;  // "Acetaminophen"
        const brandPattern = /^[A-Z][A-Za-z]+(?: [A-Z][A-Za-z]+)*®?$/;  // "Tylenol®"
        
        const cleanMed = DataSanitizer.cleanText(medication);
        return genericPattern.test(cleanMed) || brandPattern.test(cleanMed);
    }

    /**
     * Validate dosage format
     */
    static isValidDosage(dosage: string): boolean {
        const patterns = [
            /^\d+(?:\.\d+)?\s*(?:mg|g|mcg|mL)$/i,        // "500 mg"
            /^\d+(?:\.\d+)?\s*(?:mg|g|mcg|mL)\s*\/\s*\d+(?:\.\d+)?\s*(?:mL|L)$/i,  // "2 mg/mL"
            /^\d+(?:\.\d+)?\s*%$/,                       // "0.9%"
        ];

        const cleanDosage = DataSanitizer.cleanText(dosage);
        return patterns.some(pattern => pattern.test(cleanDosage));
    }

    /**
     * Validate medical frequency format
     */
    static isValidMedicalFrequency(frequency: string): boolean {
        const frequencies = [
            'qd', 'bid', 'tid', 'qid', 'q4h', 'q6h', 'q8h', 'q12h',
            'daily', 'twice daily', 'three times daily', 'four times daily',
            'every morning', 'every evening', 'at bedtime', 'before meals',
            'after meals', 'with meals', 'as needed', 'prn'
        ];

        const cleanFreq = DataSanitizer.cleanText(frequency).toLowerCase();
        return frequencies.includes(cleanFreq);
    }

    /**
     * Validate blood pressure format
     */
    static isValidBloodPressure(bp: string): boolean {
        const pattern = /^(?:\d{2,3}\/\d{2,3})(?:\s*mmHg)?$/;
        const cleanBP = DataSanitizer.cleanText(bp);
        
        if (!pattern.test(cleanBP)) return false;

        const [systolic, diastolic] = cleanBP.split('/').map(Number);
        return systolic > diastolic && 
               systolic >= 70 && systolic <= 200 &&
               diastolic >= 40 && diastolic <= 130;
    }

    /**
     * Validate pulse rate format
     */
    static isValidPulseRate(pulse: string): boolean {
        const pattern = /^(?:\d{2,3})(?:\s*bpm)?$/;
        const cleanPulse = DataSanitizer.cleanText(pulse);
        
        if (!pattern.test(cleanPulse)) return false;

        const rate = parseInt(cleanPulse);
        return rate >= 40 && rate <= 200;
    }

    /**
     * Validate respiratory rate format
     */
    static isValidRespiratoryRate(resp: string): boolean {
        const pattern = /^(?:\d{1,2})(?:\s*breaths\/min)?$/;
        const cleanResp = DataSanitizer.cleanText(resp);
        
        if (!pattern.test(cleanResp)) return false;

        const rate = parseInt(cleanResp);
        return rate >= 8 && rate <= 40;
    }

    /**
     * Validate temperature format
     */
    static isValidTemperature(temp: string): boolean {
        const celsiusPattern = /^(?:\d{2}(?:\.\d)?)\s*°?C$/;
        const fahrenheitPattern = /^(?:\d{2,3}(?:\.\d)?)\s*°?F$/;
        
        const cleanTemp = DataSanitizer.cleanText(temp);
        
        if (celsiusPattern.test(cleanTemp)) {
            const value = parseFloat(cleanTemp);
            return value >= 35.0 && value <= 42.0;
        }
        
        if (fahrenheitPattern.test(cleanTemp)) {
            const value = parseFloat(cleanTemp);
            return value >= 95.0 && value <= 108.0;
        }

        return false;
    }

    /**
     * Normalize diagnosis
     */
    static normalizeDiagnosis(diagnosis: string): string {
        if (!this.isValidDiagnosis(diagnosis)) return '';
        return DataSanitizer.cleanText(diagnosis);
    }

    /**
     * Normalize medication
     */
    static normalizeMedication(medication: string): string {
        if (!this.isValidMedication(medication)) return '';
        return DataSanitizer.cleanText(medication);
    }

    /**
     * Normalize dosage
     */
    static normalizeDosage(dosage: string): string {
        if (!this.isValidDosage(dosage)) return '';
        return DataSanitizer.cleanText(dosage).toLowerCase();
    }

    /**
     * Normalize medical frequency
     */
    static normalizeMedicalFrequency(frequency: string): string {
        if (!this.isValidMedicalFrequency(frequency)) return '';
        const freq = DataSanitizer.cleanText(frequency).toLowerCase();
        
        const frequencyMap: { [key: string]: string } = {
            'qd': 'once daily',
            'bid': 'twice daily',
            'tid': 'three times daily',
            'qid': 'four times daily',
            'q4h': 'every 4 hours',
            'q6h': 'every 6 hours',
            'q8h': 'every 8 hours',
            'q12h': 'every 12 hours',
            'prn': 'as needed'
        };

        return frequencyMap[freq] || freq;
    }

    /**
     * Normalize vital signs
     */
    static normalizeVitalSigns(bp: string, pulse: string, resp: string, temp: string): {
        bloodPressure: string;
        pulseRate: string;
        respiratoryRate: string;
        temperature: string;
    } {
        return {
            bloodPressure: this.isValidBloodPressure(bp) ? 
                          DataSanitizer.cleanText(bp) + ' mmHg' : '',
            pulseRate: this.isValidPulseRate(pulse) ? 
                      DataSanitizer.cleanText(pulse) + ' bpm' : '',
            respiratoryRate: this.isValidRespiratoryRate(resp) ? 
                           DataSanitizer.cleanText(resp) + ' breaths/min' : '',
            temperature: this.isValidTemperature(temp) ? 
                        DataSanitizer.cleanText(temp) : ''
        };
    }
}
