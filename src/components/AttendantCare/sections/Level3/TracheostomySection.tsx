import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { CareRow } from '../../../AttendantCare/CareRow';
import { useCareCalculations } from '../../../AttendantCare/hooks/useCareCalculations';

export const TracheostomySection = () => {
    const { calculateSectionTotal } = useCareCalculations(3);
    const fields = [
        'attendantCare.level3.tracheostomy.cannulae',
        'attendantCare.level3.tracheostomy.tapes',
        'attendantCare.level3.tracheostomy.suctioning',
        'attendantCare.level3.tracheostomy.equipment'
    ];

    return (
        <React.Fragment>
            <TableRow className="bg-muted/50">
                <TableCell colSpan={5} className="font-medium px-8">Tracheostomy Care</TableCell>
            </TableRow>
            <CareRow 
                label="Changes and cleans inner and outer cannulae as needed"
                fieldBase={fields[0]}
            />
            <CareRow 
                label="Changes tapes as required"
                fieldBase={fields[1]}
            />
            <CareRow 
                label="Performs suctioning as required"
                fieldBase={fields[2]}
            />
            <CareRow 
                label="Cleans and maintains suction equipment"
                fieldBase={fields[3]}
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

export default TracheostomySection;