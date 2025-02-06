import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { CareRow } from '../../../AttendantCare/CareRow';
import { useCareCalculations } from '../../../AttendantCare/hooks/useCareCalculations';

export const SkinCareSection = () => {
    const { calculateSectionTotal } = useCareCalculations(3);
    const fields = [
        'attendantCare.level3.skinCare.wounds',
        'attendantCare.level3.skinCare.dressings',
        'attendantCare.level3.skinCare.applications',
        'attendantCare.level3.skinCare.checks',
        'attendantCare.level3.skinCare.turning'
    ];

    return (
        <React.Fragment>
            <TableRow className="bg-muted/50">
                <TableCell colSpan={5} className="font-medium px-8">Skin Care (excluding bathing)</TableCell>
            </TableRow>
            <CareRow 
                label="Attends to skin care needs – wounds, sores, eruptions, (amputees, severe burns, spinal cord injuries, etc.)"
                fieldBase={fields[0]}
            />
            <CareRow 
                label="Applies medication and prescribed dressings"
                fieldBase={fields[1]}
            />
            <CareRow 
                label="Applies creams, lotions, pastes, ointments, powders as prescribed or required"
                fieldBase={fields[2]}
            />
            <CareRow 
                label="Checks body area(s) for evidence of pressure sores, skin breakdown or eruptions"
                fieldBase={fields[3]}
            />
            <CareRow 
                label="Periodic turning to prevent or minimize pressure sores and skin breakdown/shearing"
                fieldBase={fields[4]}
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

export default SkinCareSection;