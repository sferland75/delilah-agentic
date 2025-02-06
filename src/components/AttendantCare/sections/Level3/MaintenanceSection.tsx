import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { CareRow } from '../../../AttendantCare/CareRow';
import { useCareCalculations } from '../../../AttendantCare/hooks/useCareCalculations';

export const MaintenanceSection = () => {
    const { calculateSectionTotal } = useCareCalculations(3);
    const fields = [
        'attendantCare.level3.maintenance.supplies',
        'attendantCare.level3.maintenance.equipment'
    ];

    return (
        <React.Fragment>
            <TableRow className="bg-muted/50">
                <TableCell colSpan={5} className="font-medium px-8">Maintenance of Supplies and Equipment</TableCell>
            </TableRow>
            <CareRow 
                label="Monitors, orders and maintains required supplies/equipment"
                fieldBase={fields[0]}
            />
            <CareRow 
                label="Ensures wheelchairs, prosthetic devices, Hoyer lifts, shower commodes and other specialized medical equipment and assistive devices are safe and secure"
                fieldBase={fields[1]}
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

export default MaintenanceSection;