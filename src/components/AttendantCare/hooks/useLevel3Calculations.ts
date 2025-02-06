import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
import type { AssessmentFormData } from '@/lib/validation/assessment-schema';

export const useLevel3Calculations = () => {
    const { watch, setValue } = useFormContext<AssessmentFormData>();
    
    const calculateTotalForField = (fieldBase: string) => {
        const minutes = watch(`${fieldBase}.minutes`) || 0;
        const timesPerWeek = watch(`${fieldBase}.timesPerWeek`) || 0;
        return minutes * timesPerWeek;
    };

    const updateAllTotals = () => {
        // List of all field bases in Level 3
        const fields = {
            genitourinary: [
                'attendantCare.level3.genitourinary.catheterizations',
                'attendantCare.level3.genitourinary.drainageSystems',
                'attendantCare.level3.genitourinary.cleaning',
                'attendantCare.level3.genitourinary.disposableBriefs',
                'attendantCare.level3.genitourinary.menstrualCare',
                'attendantCare.level3.genitourinary.residuals'
            ],
            // Add other sections...
        };

        // Calculate totals for each field and section
        let grandTotal = 0;
        
        Object.entries(fields).forEach(([section, fieldsList]) => {
            let sectionTotal = 0;
            
            fieldsList.forEach(fieldBase => {
                const total = calculateTotalForField(fieldBase);
                sectionTotal += total;
                setValue(`${fieldBase}.totalMinutes`, total);
            });
            
            setValue(`attendantCare.level3.${section}.total`, sectionTotal);
            grandTotal += sectionTotal;
        });

        setValue('attendantCare.level3.total', grandTotal);
        return grandTotal;
    };

    // Watch all relevant fields and update totals when they change
    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name?.includes('attendantCare.level3') && 
                (name?.includes('minutes') || name?.includes('timesPerWeek'))) {
                updateAllTotals();
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, setValue]);

    return {
        calculateTotalForField,
        updateAllTotals
    };
};

export default useLevel3Calculations;