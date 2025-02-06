import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import type { AssessmentFormData } from '@/lib/validation/assessment-schema';

const STORAGE_KEY = 'attendantCare.level3.data';

export const useLevel3Persistence = () => {
    const { watch, setValue } = useFormContext<AssessmentFormData>();

    // Load data from localStorage on component mount
    useEffect(() => {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
            try {
                const data = JSON.parse(storedData);
                Object.entries(data).forEach(([key, value]) => {
                    setValue(key as any, value);
                });
            } catch (error) {
                console.error('Error loading Level 3 data:', error);
            }
        }
    }, [setValue]);

    // Save data to localStorage whenever form fields change
    useEffect(() => {
        const subscription = watch((value) => {
            const level3Data = value.attendantCare?.level3;
            if (level3Data) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(level3Data));
            }
        });

        return () => subscription.unsubscribe();
    }, [watch]);

    const clearStoredData = () => {
        localStorage.removeItem(STORAGE_KEY);
    };

    return { clearStoredData };
};
