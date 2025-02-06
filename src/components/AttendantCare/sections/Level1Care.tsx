import React from 'react';
import { useFormContext } from "react-hook-form";
import { Table, TableBody, TableHeader, TableCell, TableRow } from "@/components/ui/table";
import CareRow from '../CareRow';
import CareTableHeader from '../CareTableHeader';
import { useCareCalculations } from '../hooks/useCareCalculations';
import type { AssessmentFormData } from '@/lib/validation/assessment-schema';

export const Level1Care = () => {
    const { watch } = useFormContext<AssessmentFormData>();
    const { calculateSectionTotal } = useCareCalculations(1);

    return (
        <div className="space-y-6">
            <Table>
                <TableHeader>
                    <CareTableHeader />
                </TableHeader>
                <TableBody>
                    {/* Dress Section */}
                    <TableRow className="bg-muted/50">
                        <TableCell colSpan={5} className="font-medium px-8">Dress</TableCell>
                    </TableRow>
                    <CareRow 
                        label="Upper Body (underwear, shirt/blouse, sweater, tie, jacket, gloves, jewelry)"
                        fieldBase="attendantCare.level1.dress.upperBody"
                    />
                    <CareRow 
                        label="Lower Body (underwear, disposable briefs, skirt/pants, socks, panty hose, slippers shoes)"
                        fieldBase="attendantCare.level1.dress.lowerBody"
                    />

                    {/* Undress Section */}
                    <TableRow className="bg-muted/50">
                        <TableCell colSpan={5} className="font-medium px-8">Undress</TableCell>
                    </TableRow>
                    <CareRow 
                        label="Upper Body (underwear, shirt/blouse, sweater, tie, jacket, gloves, jewelry)"
                        fieldBase="attendantCare.level1.undress.upperBody"
                    />
                    <CareRow 
                        label="Lower Body (underwear, disposable briefs, skirt/pants, socks, panty hose, slippers shoes)"
                        fieldBase="attendantCare.level1.undress.lowerBody"
                    />

                    {/* Prosthetics Section */}
                    <TableRow className="bg-muted/50">
                        <TableCell colSpan={5} className="font-medium px-8">Prosthetics</TableCell>
                    </TableRow>
                    <CareRow 
                        label="Applies to upper/lower limb prosthesis and stump sock(s)"
                        fieldBase="attendantCare.level1.prosthetics.apply"
                    />
                    <CareRow 
                        label="Exchanges terminal devices and adjusts prosthesis as required"
                        fieldBase="attendantCare.level1.prosthetics.devices"
                    />
                    <CareRow 
                        label="Ensures prosthesis is properly maintained and in good working condition"
                        fieldBase="attendantCare.level1.prosthetics.maintenance"
                    />
                    <TableRow>
                        <TableCell className="font-medium px-12">Subtotal</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell className="text-right pr-8 font-medium">
                            {calculateSectionTotal([
                                'attendantCare.level1.prosthetics.apply',
                                'attendantCare.level1.prosthetics.devices',
                                'attendantCare.level1.prosthetics.maintenance'
                            ])}
                        </TableCell>
                        <TableCell></TableCell>
                    </TableRow>

                    {/* Orthotics Section */}
                    <TableRow className="bg-muted/50">
                        <TableCell colSpan={5} className="font-medium px-8">Orthotics</TableCell>
                    </TableRow>
                    <CareRow 
                        label="Assists dressing applicant using prescribed orthotics (burn garment(s), brace(s), support(s), splints, elastic stockings)"
                        fieldBase="attendantCare.level1.orthotics"
                    />
                    <TableRow>
                        <TableCell className="font-medium px-12">Subtotal</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell className="text-right pr-8 font-medium">
                            {calculateSectionTotal(['attendantCare.level1.orthotics'])}
                        </TableCell>
                        <TableCell></TableCell>
                    </TableRow>

                    {/* Grooming Section */}
                    <TableRow className="bg-muted/50">
                        <TableCell colSpan={5} className="font-medium px-8">Grooming</TableCell>
                    </TableRow>
                    <CareRow 
                        label="Face: wash, rinse, dry, morning and evening"
                        fieldBase="attendantCare.level1.grooming.face"
                    />
                    <CareRow 
                        label="Hands: wash, rinse, dry, morning and evening, before and after meals, and after elimination"
                        fieldBase="attendantCare.level1.grooming.hands"
                    />
                    <CareRow 
                        label="Shaving: shaves applicant using electric/safety razor"
                        fieldBase="attendantCare.level1.grooming.shaving"
                    />
                    <CareRow 
                        label="Cosmetics: applies makeup as desired or required"
                        fieldBase="attendantCare.level1.grooming.cosmetics"
                    />
                    <CareRow 
                        label="Hair: brushes/combs as required"
                        fieldBase="attendantCare.level1.grooming.hairBrushing"
                    />
                    <CareRow 
                        label="Hair: shampoos, blow/towel dries"
                        fieldBase="attendantCare.level1.grooming.hairWashing"
                    />
                    <CareRow 
                        label="Hair: performs styling, set and comb-out"
                        fieldBase="attendantCare.level1.grooming.hairStyling"
                    />
                    <CareRow 
                        label="Fingernails: cleans and manicures as required"
                        fieldBase="attendantCare.level1.grooming.fingernails"
                    />
                    <CareRow 
                        label="Toenails: cleans and trims as required"
                        fieldBase="attendantCare.level1.grooming.toenails"
                    />
                    <TableRow>
                        <TableCell className="font-medium px-12">Subtotal</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell className="text-right pr-8 font-medium">
                            {calculateSectionTotal([
                                'attendantCare.level1.grooming.face',
                                'attendantCare.level1.grooming.hands',
                                'attendantCare.level1.grooming.shaving',
                                'attendantCare.level1.grooming.cosmetics',
                                'attendantCare.level1.grooming.hairBrushing',
                                'attendantCare.level1.grooming.hairWashing',
                                'attendantCare.level1.grooming.hairStyling',
                                'attendantCare.level1.grooming.fingernails',
                                'attendantCare.level1.grooming.toenails'
                            ])}
                        </TableCell>
                        <TableCell></TableCell>
                    </TableRow>

                    {/* Feeding Section */}
                    <TableRow className="bg-muted/50">
                        <TableCell colSpan={5} className="font-medium px-8">Feeding</TableCell>
                    </TableRow>
                    <CareRow 
                        label="Prepares applicant for meals (includes transfer to appropriate location)"
                        fieldBase="attendantCare.level1.feeding.preparation"
                    />
                    <CareRow 
                        label="Provides assistance, either in whole or in part, in preparing serving and feeding meals"
                        fieldBase="attendantCare.level1.feeding.assistance"
                    />
                    <TableRow>
                        <TableCell className="font-medium px-12">Subtotal</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell className="text-right pr-8 font-medium">
                            {calculateSectionTotal([
                                'attendantCare.level1.feeding.preparation',
                                'attendantCare.level1.feeding.assistance'
                            ])}
                        </TableCell>
                        <TableCell></TableCell>
                    </TableRow>

                    {/* Mobility Section */}
                    <TableRow className="bg-muted/50">
                        <TableCell colSpan={5} className="font-medium px-8">Mobility (location change)</TableCell>
                    </TableRow>
                    <CareRow 
                        label="Assists applicant from sitting position (wheelchair, chair, sofa)"
                        fieldBase="attendantCare.level1.mobility.sitting"
                    />
                    <CareRow 
                        label="Supervises/assists in walking"
                        fieldBase="attendantCare.level1.mobility.walking"
                    />
                    <CareRow 
                        label="Performs transfer needs as required (bed to wheelchair, wheelchair to bed)"
                        fieldBase="attendantCare.level1.mobility.transfers"
                    />
                    <TableRow>
                        <TableCell className="font-medium px-12">Subtotal</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell className="text-right pr-8 font-medium">
                            {calculateSectionTotal([
                                'attendantCare.level1.mobility.sitting',
                                'attendantCare.level1.mobility.walking',
                                'attendantCare.level1.mobility.transfers'
                            ])}
                        </TableCell>
                        <TableCell></TableCell>
                    </TableRow>

                    {/* Extra Laundering Section */}
                    <TableRow className="bg-muted/50">
                        <TableCell colSpan={5} className="font-medium px-8">Extra Laundering</TableCell>
                    </TableRow>
                    <CareRow 
                        label="Launders applicant's bedding and clothing as a result of incontinence/spillage"
                        fieldBase="attendantCare.level1.laundering.incontinence"
                    />
                    <CareRow 
                        label="Launders/cleans orthotic supplies that require special care"
                        fieldBase="attendantCare.level1.laundering.orthotics"
                    />
                    <TableRow>
                        <TableCell className="font-medium px-12">Subtotal</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell className="text-right pr-8 font-medium">
                            {calculateSectionTotal([
                                'attendantCare.level1.laundering.incontinence',
                                'attendantCare.level1.laundering.orthotics'
                            ])}
                        </TableCell>
                        <TableCell></TableCell>
                    </TableRow>

                    {/* Level 1 Total Row */}
                    <TableRow className="font-medium bg-muted">
                        <TableCell className="px-8">Level 1 Total</TableCell>
                        <TableCell colSpan={2}></TableCell>
                        <TableCell className="text-right pr-8">
                            {watch('attendantCare.level1.total') || 0}
                        </TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
};

export default Level1Care;