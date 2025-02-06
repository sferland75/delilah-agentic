import React from 'react';
import { useFormContext } from "react-hook-form";
import { Table, TableBody, TableHeader, TableCell, TableRow } from "@/components/ui/table";
import CareRow from '../CareRow';
import CareTableHeader from '../CareTableHeader';
import { useCareCalculations } from '../hooks/useCareCalculations';
import type { AssessmentFormData } from '@/lib/validation/assessment-schema';

export const Level2Care = () => {
    const { watch } = useFormContext<AssessmentFormData>();
    const { calculateSectionTotal } = useCareCalculations(2);

    return (
        <div className="space-y-6">
            <Table>
                <TableHeader>
                    <CareTableHeader />
                </TableHeader>
                <TableBody>
                    {/* Hygiene Section */}
                    <TableRow className="bg-muted/50">
                        <TableCell colSpan={5} className="font-medium px-8">Hygiene</TableCell>
                    </TableRow>
                    
                    {/* Bathroom subsection */}
                    <TableRow>
                        <TableCell className="font-medium px-12" colSpan={5}>Bathroom</TableCell>
                    </TableRow>
                    <CareRow 
                        label="Cleans tub/shower/sink/toilet after applicant's use"
                        fieldBase="attendantCare.level2.hygiene.bathroom.cleaning"
                    />

                    {/* Bedroom subsection */}
                    <TableRow>
                        <TableCell className="font-medium px-12" colSpan={5}>Bedroom</TableCell>
                    </TableRow>
                    <CareRow 
                        label="Changes applicant's bedding, makes bed, cleans bedroom, including Hoyer lifts, overhead bars, bedside tables"
                        fieldBase="attendantCare.level2.hygiene.bedroom.cleaning"
                    />
                    <CareRow 
                        label="Ensures comfort, safety and security in this environment"
                        fieldBase="attendantCare.level2.hygiene.bedroom.safety"
                    />

                    {/* Clothing Care subsection */}
                    <TableRow>
                        <TableCell className="font-medium px-12" colSpan={5}>Clothing Care</TableCell>
                    </TableRow>
                    <CareRow 
                        label="Assists in preparing daily wearing apparel"
                        fieldBase="attendantCare.level2.hygiene.clothing.preparation"
                    />
                    <CareRow 
                        label="Hangs clothes and sorts clothing to be laundered/cleaned"
                        fieldBase="attendantCare.level2.hygiene.clothing.laundry"
                    />

                    <TableRow>
                        <TableCell className="font-medium px-12">Subtotal</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell className="text-right pr-8 font-medium">
                            {calculateSectionTotal([
                                'attendantCare.level2.hygiene.bathroom.cleaning',
                                'attendantCare.level2.hygiene.bedroom.cleaning',
                                'attendantCare.level2.hygiene.bedroom.safety',
                                'attendantCare.level2.hygiene.clothing.preparation',
                                'attendantCare.level2.hygiene.clothing.laundry'
                            ])}
                        </TableCell>
                        <TableCell></TableCell>
                    </TableRow>

                    {/* Basic Supervisory Care Section */}
                    <TableRow className="bg-muted/50">
                        <TableCell colSpan={5} className="font-medium px-8">Basic Supervisory Care</TableCell>
                    </TableRow>
                    <CareRow 
                        label="Applicant lacks the capacity to reattach tubing if it becomes detached from trachea"
                        fieldBase="attendantCare.level2.supervisory.trachea"
                    />
                    <CareRow 
                        label="Applicant requires assistance to transfer from wheelchair, periodic turning, genitourinary care"
                        fieldBase="attendantCare.level2.supervisory.mobility"
                    />
                    <CareRow 
                        label="Applicant lacks the ability to independently get in and out of a wheelchair or to be self-sufficient in an emergency"
                        fieldBase="attendantCare.level2.supervisory.wheelchair"
                    />
                    <CareRow 
                        label="Applicant lacks the ability to respond to an emergency or needs custodial care due to changes in behaviour"
                        fieldBase="attendantCare.level2.supervisory.emergency"
                    />

                    <TableRow>
                        <TableCell className="font-medium px-12">Subtotal</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell className="text-right pr-8 font-medium">
                            {calculateSectionTotal([
                                'attendantCare.level2.supervisory.trachea',
                                'attendantCare.level2.supervisory.mobility',
                                'attendantCare.level2.supervisory.wheelchair',
                                'attendantCare.level2.supervisory.emergency'
                            ])}
                        </TableCell>
                        <TableCell></TableCell>
                    </TableRow>

                    {/* Co-ordination Section */}
                    <TableRow className="bg-muted/50">
                        <TableCell colSpan={5} className="font-medium px-8">Co-ordination of Attendant Care</TableCell>
                    </TableRow>
                    <CareRow 
                        label="Applicant requires assistance in co-ordinating/scheduling attendant care (maximum 1 hour per week)"
                        fieldBase="attendantCare.level2.coordination"
                    />

                    <TableRow>
                        <TableCell className="font-medium px-12">Subtotal</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell className="text-right pr-8 font-medium">
                            {calculateSectionTotal(['attendantCare.level2.coordination'])}
                        </TableCell>
                        <TableCell></TableCell>
                    </TableRow>

                    {/* Level 2 Total Row */}
                    <TableRow className="font-medium bg-muted">
                        <TableCell className="px-8">Level 2 Total</TableCell>
                        <TableCell colSpan={2}></TableCell>
                        <TableCell className="text-right pr-8">
                            {watch('attendantCare.level2.total') || 0}
                        </TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
};

export default Level2Care;