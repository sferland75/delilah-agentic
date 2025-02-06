import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
import type { AssessmentFormData } from '@/lib/validation/assessment-schema';

export const useCareCalculations = (level: 1 | 2 | 3) => {
    const { watch, setValue } = useFormContext<AssessmentFormData>();
    
    const calculateTotalForField = (fieldBase: string) => {
        const minutes = watch(`${fieldBase}.minutes`) || 0;
        const timesPerWeek = watch(`${fieldBase}.timesPerWeek`) || 0;
        return Number(minutes) * Number(timesPerWeek);
    };

    const calculateSectionTotal = (sectionFields: string[]) => {
        return sectionFields.reduce((total, fieldBase) => {
            return total + calculateTotalForField(fieldBase);
        }, 0);
    };

    // Update totals whenever any value changes
    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name?.includes(`attendantCare.level${level}`) && 
                (name?.includes('minutes') || name?.includes('timesPerWeek'))) {
                updateTotals();
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, setValue, level]);

    const updateTotals = () => {
        // Implementation will vary based on level
        // This will be completed after harmonizing all three level components
    };

    return {
        calculateTotalForField,
        calculateSectionTotal,
        updateTotals
    };
};

export default useCareCalculations;