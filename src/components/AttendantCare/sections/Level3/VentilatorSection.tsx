import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { CareRow } from '../../../AttendantCare/CareRow';
import { useCareCalculations } from '../../../AttendantCare/hooks/useCareCalculations';

export const VentilatorSection = () => {
    const { calculateSectionTotal } = useCareCalculations(3);
    const fields = [
        'attendantCare.level3.ventilator.maintenance',
        'attendantCare.level3.ventilator.humidification',
        'attendantCare.level3.ventilator.tubing',
        'attendantCare.level3.ventilator.humidity',
        'attendantCare.level3.ventilator.settings',
        'attendantCare.level3.ventilator.reattach'
    ];

    return (
        <React.Fragment>
            <TableRow className="bg-muted/50">
                <TableCell colSpan={5} className="font-medium px-8">Ventilator Care</TableCell>
            </TableRow>
            <CareRow 
                label="Ensures volume rate and pressure are maintained as prescribed"
                fieldBase={fields[0]}
            />
            <CareRow 
                label="Maintains humidification as specified"
                fieldBase={fields[1]}
            />
            <CareRow 
                label="Changes and cleans tubing and filters as required"
                fieldBase={fields[2]}
            />
            <CareRow 
                label="Cleans humidification system as required"
                fieldBase={fields[3]}
            />
            <CareRow 
                label="Adjusts settings according to client needs (for example, colds, congestion)"
                fieldBase={fields[4]}
            />
            <CareRow 
                label="Reattaches tubing if it becomes detached"
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

export default VentilatorSection;