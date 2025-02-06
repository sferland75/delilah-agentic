import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { CareRow } from '../../../AttendantCare/CareRow';
import { useCareCalculations } from '../../../AttendantCare/hooks/useCareCalculations';

export const OtherTherapySection = () => {
    const { calculateSectionTotal } = useCareCalculations(3);
    const fields = {
        tens: [
            'attendantCare.level3.otherTherapy.tens.preparation',
            'attendantCare.level3.otherTherapy.tens.administration'
        ],
        dcs: [
            'attendantCare.level3.otherTherapy.dcs.monitoring',
            'attendantCare.level3.otherTherapy.dcs.maintenance'
        ]
    };

    const allFields = [...fields.tens, ...fields.dcs];

    return (
        <React.Fragment>
            <TableRow className="bg-muted/50">
                <TableCell colSpan={5} className="font-medium px-8">Other Therapy</TableCell>
            </TableRow>

            {/* TENS */}
            <TableRow>
                <TableCell className="font-medium px-12" colSpan={5}>Transcutaneous Electrical Nerve Stimulation (TENS)</TableCell>
            </TableRow>
            <CareRow 
                label="Prepares equipment"
                fieldBase={fields.tens[0]}
            />
            <CareRow 
                label="Administers treatment as prescribed or required"
                fieldBase={fields.tens[1]}
            />

            {/* DCS */}
            <TableRow>
                <TableCell className="font-medium px-12" colSpan={5}>Dorsal Column Stimulation (DCS)</TableCell>
            </TableRow>
            <CareRow 
                label="Monitors skin"
                fieldBase={fields.dcs[0]}
            />
            <CareRow 
                label="Maintains equipment"
                fieldBase={fields.dcs[1]}
            />

            {/* Section Subtotal */}
            <TableRow>
                <TableCell className="font-medium px-12">Subtotal</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right pr-8 font-medium">
                    {calculateSectionTotal(allFields)}
                </TableCell>
                <TableCell></TableCell>
            </TableRow>
        </React.Fragment>
    );
};

export default OtherTherapySection;