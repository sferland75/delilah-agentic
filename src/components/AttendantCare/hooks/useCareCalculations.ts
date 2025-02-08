import { useFormContext } from 'react-hook-form';
import { useEffect, useCallback } from 'react';
import type { AssessmentFormData } from '@/lib/validation/assessment-schema';

export const useCareCalculations = (level: 1 | 2 | 3) => {
    const { watch, setValue } = useFormContext<AssessmentFormData>();
    
    const calculateTotalForField = useCallback((fieldBase: string) => {
        const minutes = watch(`${fieldBase}.minutes`) || 0;
        const timesPerWeek = watch(`${fieldBase}.timesPerWeek`) || 0;
        return Number(minutes) * Number(timesPerWeek);
    }, [watch]);

    const calculateSectionTotal = useCallback((sectionFields: string[]) => {
        return sectionFields.reduce((sum, fieldBase) => {
            const fieldTotal = calculateTotalForField(fieldBase);
            return sum + fieldTotal;
        }, 0);
    }, [calculateTotalForField]);

    const updateSectionTotals = useCallback(() => {
        let totalMinutes = 0;

        // Level 1 care needs
        if (level === 1) {
            const fields = {
                dress: [
                    'attendantCare.level1.dress.upperBody',
                    'attendantCare.level1.dress.lowerBody'
                ],
                undress: [
                    'attendantCare.level1.undress.upperBody',
                    'attendantCare.level1.undress.lowerBody'
                ],
                prosthetics: [
                    'attendantCare.level1.prosthetics.apply',
                    'attendantCare.level1.prosthetics.devices',
                    'attendantCare.level1.prosthetics.maintenance'
                ],
                orthotics: [
                    'attendantCare.level1.orthotics'
                ],
                grooming: [
                    'attendantCare.level1.grooming.face',
                    'attendantCare.level1.grooming.hands',
                    'attendantCare.level1.grooming.shaving',
                    'attendantCare.level1.grooming.cosmetics',
                    'attendantCare.level1.grooming.hairBrushing',
                    'attendantCare.level1.grooming.hairWashing',
                    'attendantCare.level1.grooming.hairStyling',
                    'attendantCare.level1.grooming.fingernails',
                    'attendantCare.level1.grooming.toenails'
                ],
                feeding: [
                    'attendantCare.level1.feeding.preparation',
                    'attendantCare.level1.feeding.assistance'
                ],
                mobility: [
                    'attendantCare.level1.mobility.sitting',
                    'attendantCare.level1.mobility.walking',
                    'attendantCare.level1.mobility.transfers'
                ],
                laundering: [
                    'attendantCare.level1.laundering.incontinence',
                    'attendantCare.level1.laundering.orthotics'
                ]
            };

            Object.entries(fields).forEach(([section, fieldsList]) => {
                fieldsList.forEach(fieldBase => {
                    const fieldTotal = calculateTotalForField(fieldBase);
                    setValue(`${fieldBase}.totalMinutes`, fieldTotal, { shouldValidate: false });
                });
                
                const sectionTotal = calculateSectionTotal(fieldsList);
                setValue(`attendantCare.level1.${section}.total`, sectionTotal, { shouldValidate: false });
                totalMinutes += sectionTotal;
            });
        }

        // Level 2 care needs
        if (level === 2) {
            const fields = {
                hygiene: {
                    bathroom: [
                        'attendantCare.level2.hygiene.bathroom.cleaning'
                    ],
                    bedroom: [
                        'attendantCare.level2.hygiene.bedroom.cleaning',
                        'attendantCare.level2.hygiene.bedroom.safety'
                    ],
                    clothing: [
                        'attendantCare.level2.hygiene.clothing.preparation',
                        'attendantCare.level2.hygiene.clothing.laundry'
                    ]
                },
                supervisory: [
                    'attendantCare.level2.supervisory.trachea',
                    'attendantCare.level2.supervisory.mobility',
                    'attendantCare.level2.supervisory.wheelchair',
                    'attendantCare.level2.supervisory.emergency'
                ],
                coordination: [
                    'attendantCare.level2.coordination'
                ]
            };

            // Calculate hygiene section totals
            let hygieneTotal = 0;
            Object.entries(fields.hygiene).forEach(([subsection, fieldsList]) => {
                fieldsList.forEach(fieldBase => {
                    const fieldTotal = calculateTotalForField(fieldBase);
                    setValue(`${fieldBase}.totalMinutes`, fieldTotal, { shouldValidate: false });
                });
                
                const subsectionTotal = calculateSectionTotal(fieldsList);
                setValue(`attendantCare.level2.hygiene.${subsection}.total`, subsectionTotal, { shouldValidate: false });
                hygieneTotal += subsectionTotal;
            });
            setValue('attendantCare.level2.hygiene.total', hygieneTotal, { shouldValidate: false });
            totalMinutes += hygieneTotal;

            // Calculate other sections
            ['supervisory', 'coordination'].forEach(section => {
                const fieldsList = fields[section];
                fieldsList.forEach(fieldBase => {
                    const fieldTotal = calculateTotalForField(fieldBase);
                    setValue(`${fieldBase}.totalMinutes`, fieldTotal, { shouldValidate: false });
                });
                
                const sectionTotal = calculateSectionTotal(fieldsList);
                setValue(`attendantCare.level2.${section}.total`, sectionTotal, { shouldValidate: false });
                totalMinutes += sectionTotal;
            });
        }

        setValue(`attendantCare.level${level}.total`, totalMinutes, { shouldValidate: true });
        return totalMinutes;
    }, [level, calculateTotalForField, calculateSectionTotal, setValue]);

    // Update totals whenever any value changes
    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name?.includes(`attendantCare.level${level}`) && 
                (name?.includes('minutes') || name?.includes('timesPerWeek'))) {
                updateSectionTotals();
            }
        });

        // Initial calculation
        updateSectionTotals();

        return () => subscription.unsubscribe();
    }, [watch, level, updateSectionTotals]);

    return {
        calculateTotalForField,
        calculateSectionTotal,
        updateTotals: updateSectionTotals
    };
};

export default useCareCalculations;