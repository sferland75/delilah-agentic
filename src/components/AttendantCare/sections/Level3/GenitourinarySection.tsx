import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { CareRow } from '../../../AttendantCare/CareRow';
import { useCareCalculations } from '../../../AttendantCare/hooks/useCareCalculations';

export const GenitourinarySection = () => {
    const { calculateSectionTotal } = useCareCalculations(3);
    const fields = [
        'attendantCare.level3.genitourinary.catheterizations',
        'attendantCare.level3.genitourinary.drainageSystems',
        'attendantCare.level3.genitourinary.cleaning',
        'attendantCare.level3.genitourinary.disposableBriefs',
        'attendantCare.level3.genitourinary.menstrualCare',
        'attendantCare.level3.genitourinary.residuals'
    ];

    return (
        <React.Fragment>
            <TableRow className="bg-muted/50">
                <TableCell colSpan={5} className="font-medium px-8">Genitourinary Tracts</TableCell>
            </TableRow>
            <CareRow 
                label="Performs catheterizations"
                fieldBase={fields[0]}
            />
            <CareRow 
                label="Positions, empties and cleans drainage systems"
                fieldBase={fields[1]}
            />
            <CareRow 
                label="Cleans applicant and equipment after procedure/incontinence"
                fieldBase={fields[2]}
            />
            <CareRow 
                label="Uses disposable briefs as required"
                fieldBase={fields[3]}
            />
            <CareRow 
                label="Attends to menstrual cycle needs as required"
                fieldBase={fields[4]}
            />
            <CareRow 
                label="Monitors residuals"
                fieldBase={fields[5]}
            />

            {/* Section Subtotal */}
            <TableRow>
                <TableCell className="font-medium px-12">Subtotal</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right pr-8 font-medium">
                    {calculateSectionTotal(fields)}
                </TableCell>
                <TableCell></TableCell>
            </TableRow>
        </React.Fragment>
    );
};

export default GenitourinarySection;