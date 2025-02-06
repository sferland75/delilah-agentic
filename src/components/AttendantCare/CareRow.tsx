import React from 'react';
import { useFormContext } from "react-hook-form";
import { TableCell, TableRow } from '@/components/ui/table';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { AssessmentFormData } from '@/lib/validation/assessment-schema';

interface CareRowProps {
    label: string;
    fieldBase: string;
}

export const CareRow: React.FC<CareRowProps> = ({ label, fieldBase }) => {
    const { register, watch } = useFormContext<AssessmentFormData>();

    // Calculate total when either value changes
    const minutes = watch(`${fieldBase}.minutes`) || 0;
    const timesPerWeek = watch(`${fieldBase}.timesPerWeek`) || 0;
    const total = Number(minutes) * Number(timesPerWeek);

    return (
        <TableRow>
            <TableCell className="px-8">{label}</TableCell>
            <TableCell className="text-center">
                <Input 
                    type="number"
                    min="0"
                    {...register(`${fieldBase}.minutes`)}
                    className="w-20 text-right mx-auto"
                />
            </TableCell>
            <TableCell className="text-center">
                <Input 
                    type="number"
                    min="0"
                    max="168"  // Maximum hours per week (24 * 7)
                    {...register(`${fieldBase}.timesPerWeek`)}
                    className="w-20 text-right mx-auto"
                />
            </TableCell>
            <TableCell className="text-right pr-8">{total}</TableCell>
            <TableCell className="pl-4">
                <Textarea 
                    {...register(`${fieldBase}.justification`)}
                    placeholder="Clinical justification..."
                    className="min-h-[60px] w-full"
                />
            </TableCell>
        </TableRow>
    );
};

export default CareRow;