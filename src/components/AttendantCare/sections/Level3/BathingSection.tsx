import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { CareRow } from '../../../AttendantCare/CareRow';
import { useCareCalculations } from '../../../AttendantCare/hooks/useCareCalculations';

export const BathingSection = () => {
    const { calculateSectionTotal } = useCareCalculations(3);
    const fields = {
        bathtub: [
            'attendantCare.level3.bathing.bathtub.transfers',
            'attendantCare.level3.bathing.bathtub.bathing',
            'attendantCare.level3.bathing.bathtub.applications'
        ],
        bedBath: [
            'attendantCare.level3.bathing.bedBath.preparation',
            'attendantCare.level3.bathing.bedBath.bathing',
            'attendantCare.level3.bathing.bedBath.applications',
            'attendantCare.level3.bathing.bedBath.equipment'
        ],
        oralHygiene: [
            'attendantCare.level3.bathing.oralHygiene.brushing',
            'attendantCare.level3.bathing.oralHygiene.cleansing',
            'attendantCare.level3.bathing.oralHygiene.dentures'
        ]
    };

    const allFields = [
        ...fields.bathtub,
        ...fields.bedBath,
        ...fields.oralHygiene
    ];

    return (
        <React.Fragment>
            <TableRow className="bg-muted/50">
                <TableCell colSpan={5} className="font-medium px-8">Bathing</TableCell>
            </TableRow>

            {/* Bathtub or Shower */}
            <TableRow>
                <TableCell className="font-medium px-12" colSpan={5}>Bathtub or Shower</TableCell>
            </TableRow>
            <CareRow 
                label="Transfers applicant to and from bed, wheelchair or Hoyer lifts to bathtub or shower"
                fieldBase={fields.bathtub[0]}
            />
            <CareRow 
                label="Bathes and dries client"
                fieldBase={fields.bathtub[1]}
            />
            <CareRow 
                label="Applies creams, lotions, pastes, ointments, powders as prescribed or required"
                fieldBase={fields.bathtub[2]}
            />

            {/* Bed Bath */}
            <TableRow>
                <TableCell className="font-medium px-12" colSpan={5}>Bed Bath</TableCell>
            </TableRow>
            <CareRow 
                label="Prepares equipment"
                fieldBase={fields.bedBath[0]}
            />
            <CareRow 
                label="Bathes and dries applicant"
                fieldBase={fields.bedBath[1]}
            />
            <CareRow 
                label="Applies creams, lotions, pastes, ointments, powders as prescribed or required"
                fieldBase={fields.bedBath[2]}
            />
            <CareRow 
                label="Cleans and maintains bed/bath equipment"
                fieldBase={fields.bedBath[3]}
            />

            {/* Oral Hygiene */}
            <TableRow>
                <TableCell className="font-medium px-12" colSpan={5}>Oral Hygiene</TableCell>
            </TableRow>
            <CareRow 
                label="Brushes and flosses"
                fieldBase={fields.oralHygiene[0]}
            />
            <CareRow 
                label="Cleanses mouth as required"
                fieldBase={fields.oralHygiene[1]}
            />
            <CareRow 
                label="Cleans dentures as required"
                fieldBase={fields.oralHygiene[2]}
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

export default BathingSection;