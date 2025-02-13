import { MedicationAnalyzer } from '../MedicationAnalyzer';

describe('MedicationAnalyzer', () => {
    let analyzer: MedicationAnalyzer;

    beforeEach(() => {
        analyzer = new MedicationAnalyzer();
    });

    describe('analyzeMedications', () => {
        it('handles empty or invalid input', () => {
            expect(analyzer.analyzeMedications([])).toEqual([]);
            expect(analyzer.analyzeMedications(null as any)).toEqual([]);
            expect(analyzer.analyzeMedications(undefined as any)).toEqual([]);
        });

        it('filters out medications without names', () => {
            const input = [
                { dosage: '10mg' },
                { name: 'Valid Med', dosage: '20mg' },
                { frequency: 'daily' }
            ];
            const result = analyzer.analyzeMedications(input);
            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('Valid Med');
        });

        it('preserves all medication details', () => {
            const input = [{
                name: 'Test Med',
                dosage: '10mg',
                frequency: 'daily',
                purpose: 'testing'
            }];
            const result = analyzer.analyzeMedications(input);
            expect(result[0]).toEqual(input[0]);
        });
    });

    describe('formatMedication', () => {
        it('formats medication with all details', () => {
            const med = {
                name: 'Test Med',
                dosage: '10mg',
                frequency: 'daily',
                purpose: 'testing'
            };
            const result = analyzer.formatMedication(med);
            expect(result).toBe('Test Med 10mg daily for testing');
        });

        it('handles missing optional details', () => {
            const med = { name: 'Test Med' };
            const result = analyzer.formatMedication(med);
            expect(result).toBe('Test Med');
        });
    });

    describe('formatMedicationList', () => {
        it('handles empty list', () => {
            const result = analyzer.formatMedicationList([]);
            expect(result).toBe('No current medications reported');
        });

        it('formats multiple medications', () => {
            const meds = [
                { name: 'Med 1', dosage: '10mg' },
                { name: 'Med 2', frequency: 'daily' }
            ];
            const result = analyzer.formatMedicationList(meds);
            expect(result).toBe('Med 1 10mg\nMed 2 daily');
        });
    });
});