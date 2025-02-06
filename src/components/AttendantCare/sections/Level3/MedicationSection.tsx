import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { CareRow } from '../../../AttendantCare/CareRow';
import { useCareCalculations } from '../../../AttendantCare/hooks/useCareCalculations';

export const MedicationSection = () => {
    const { calculateSectionTotal } = useCareCalculations(3);
    const fields = {
        oral: [
            'attendantCare.level3.medication.oral.administration',
            'attendantCare.level3.medication.oral.monitoring',
            'attendantCare.level3.medication.oral.supply'
        ],
        injections: [
            'attendantCare.level3.medication.injections.administration',
            'attendantCare.level3.medication.injections.monitoring',
            'attendantCare.level3.medication.injections.supply'
        ],
        inhalation: [
            'attendantCare.level3.medication.inhalation.administration',
            'attendantCare.level3.medication.inhalation.supply',
            'attendantCare.level3.medication.inhalation.equipment'
        ]
    };

    const allFields = [...fields.oral, ...fields.injections, ...fields.inhalation];

    return (
        <React.Fragment>
            <TableRow className="bg-muted/50">
                <TableCell colSpan={5} className="font-medium px-8">Medication</TableCell>
            </TableRow>

            {/* Oral */}
            <TableRow>
                <TableCell className="font-medium px-12" colSpan={5}>Oral</TableCell>
            </TableRow>
            <CareRow 
                label="Administers prescribed medications"
                fieldBase={fields.oral[0]}
            />
            <CareRow 
                label="Monitors medication intake and effect"
                fieldBase={fields.oral[1]}
            />
            <CareRow 
                label="Maintains and controls medication supply"
                fieldBase={fields.oral[2]}
            />

            {/* Injections */}
            <TableRow>
                <TableCell className="font-medium px-12" colSpan={5}>Injections</TableCell>
            </TableRow>
            <CareRow 
                label="Administers prescribed medications"
                fieldBase={fields.injections[0]}
            />
            <CareRow 
                label="Monitors medication intake and effect"
                fieldBase={fields.injections[1]}
            />
            <CareRow 
                label="Maintains and controls medication supply"
                fieldBase={fields.injections[2]}
            />

            {/* Inhalation/Oxygen Therapy */}
            <TableRow>
                <TableCell className="font-medium px-12" colSpan={5}>Inhalation/Oxygen Therapy</TableCell>
            </TableRow>
            <CareRow 
                label="Administers prescribed dosage as required"
                fieldBase={fields.inhalation[0]}
            />
            <CareRow 
                label="Maintains and controls inhalation supplies"
                fieldBase={fields.inhalation[1]}
            />
            <CareRow 
                label="Cleans and maintains equipment"
                fieldBase={fields.inhalation[2]}
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

export default MedicationSection;