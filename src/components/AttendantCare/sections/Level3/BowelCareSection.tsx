import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { CareRow } from '../../../AttendantCare/CareRow';
import { useCareCalculations } from '../../../AttendantCare/hooks/useCareCalculations';

export const BowelCareSection = () => {
    const { calculateSectionTotal } = useCareCalculations(3);
    const fields = [
        'attendantCare.level3.bowelCare.enemas',
        'attendantCare.level3.bowelCare.colostomy',
        'attendantCare.level3.bowelCare.drainageSystems',
        'attendantCare.level3.bowelCare.disposableBriefs',
        'attendantCare.level3.bowelCare.cleaning'
    ];

    return (
        <React.Fragment>
            <TableRow className="bg-muted/50">
                <TableCell colSpan={5} className="font-medium px-8">Bowel Care</TableCell>
            </TableRow>
            <CareRow 
                label="Administers enemas or suppositories and performs stimulation or disimpaction"
                fieldBase={fields[0]}
            />
            <CareRow 
                label="Performs colostomy and/or ileostomy care"
                fieldBase={fields[1]}
            />
            <CareRow 
                label="Positions, empties and cleans drainage systems, including ilio-conduits"
                fieldBase={fields[2]}
            />
            <CareRow 
                label="Uses disposable briefs as required"
                fieldBase={fields[3]}
            />
            <CareRow 
                label="Cleans applicant and equipment after procedure/evacuation"
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

export default BowelCareSection;