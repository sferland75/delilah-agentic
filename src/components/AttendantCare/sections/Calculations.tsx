import React, { useState } from 'react';
import { useFormContext } from "react-hook-form";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { AssessmentFormData } from '@/lib/validation/assessment-schema';
import { DEFAULT_RATES, HISTORICAL_RATES, type AttendantCareRates } from '@/lib/config/attendantCareRates';

export const Calculations = () => {
    const { watch } = useFormContext<AssessmentFormData>();
    const [rates, setRates] = useState<AttendantCareRates>(DEFAULT_RATES);
    const [isEditingRates, setIsEditingRates] = useState(false);

    // Helper to convert minutes to hours
    const minutesToHours = (minutes: number) => minutes / 60;

    // Helper to calculate monthly hours
    const calculateMonthlyHours = (weeklyHours: number) => weeklyHours * 4.3;

    // Calculate total minutes per week for each level
    const totalMinutesLevel1 = watch('attendantCare.level1.total') || 0;
    const totalMinutesLevel2 = watch('attendantCare.level2.total') || 0;
    const totalMinutesLevel3 = watch('attendantCare.level3.total') || 0;

    // Convert to weekly hours
    const weeklyHoursLevel1 = minutesToHours(totalMinutesLevel1);
    const weeklyHoursLevel2 = minutesToHours(totalMinutesLevel2);
    const weeklyHoursLevel3 = minutesToHours(totalMinutesLevel3);

    // Calculate monthly hours
    const monthlyHoursLevel1 = calculateMonthlyHours(weeklyHoursLevel1);
    const monthlyHoursLevel2 = calculateMonthlyHours(weeklyHoursLevel2);
    const monthlyHoursLevel3 = calculateMonthlyHours(weeklyHoursLevel3);

    // Calculate monthly benefits
    const monthlyBenefitLevel1 = monthlyHoursLevel1 * rates.A;
    const monthlyBenefitLevel2 = monthlyHoursLevel2 * rates.B;
    const monthlyBenefitLevel3 = monthlyHoursLevel3 * rates.C;
    const totalMonthlyBenefit = monthlyBenefitLevel1 + monthlyBenefitLevel2 + monthlyBenefitLevel3;

    const handleRateChange = (level: keyof AttendantCareRates, value: string) => {
        const newRate = parseFloat(value) || 0;
        setRates(prev => ({
            ...prev,
            [level]: newRate
        }));
    };

    const useHistoricalRates = () => {
        setRates(HISTORICAL_RATES);
    };

    const useCurrentRates = () => {
        setRates(DEFAULT_RATES);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardContent className="pt-6">
                    <Table>
                        <TableCaption>Part 4: Calculation of Attendant Care Costs</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="pl-8">Level</TableHead>
                                <TableHead className="text-center">Total Minutes per Week</TableHead>
                                <TableHead className="text-center">Total Weekly Hours</TableHead>
                                <TableHead className="text-center">Total Monthly Hours</TableHead>
                                <TableHead className="text-center">Hourly Rate</TableHead>
                                <TableHead className="text-right pr-8">Monthly Care Benefit</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="pl-8">Part 1</TableCell>
                                <TableCell className="text-center">{totalMinutesLevel1}</TableCell>
                                <TableCell className="text-center">{weeklyHoursLevel1.toFixed(2)}</TableCell>
                                <TableCell className="text-center">{monthlyHoursLevel1.toFixed(2)}</TableCell>
                                <TableCell className="text-center">
                                    {isEditingRates ? (
                                        <Input
                                            type="number"
                                            value={rates.A}
                                            onChange={(e) => handleRateChange('A', e.target.value)}
                                            className="w-24 text-right mx-auto"
                                            step="0.01"
                                        />
                                    ) : (
                                        `$${rates.A.toFixed(2)}`
                                    )}
                                </TableCell>
                                <TableCell className="text-right pr-8">${monthlyBenefitLevel1.toFixed(2)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="pl-8">Part 2</TableCell>
                                <TableCell className="text-center">{totalMinutesLevel2}</TableCell>
                                <TableCell className="text-center">{weeklyHoursLevel2.toFixed(2)}</TableCell>
                                <TableCell className="text-center">{monthlyHoursLevel2.toFixed(2)}</TableCell>
                                <TableCell className="text-center">
                                    {isEditingRates ? (
                                        <Input
                                            type="number"
                                            value={rates.B}
                                            onChange={(e) => handleRateChange('B', e.target.value)}
                                            className="w-24 text-right mx-auto"
                                            step="0.01"
                                        />
                                    ) : (
                                        `$${rates.B.toFixed(2)}`
                                    )}
                                </TableCell>
                                <TableCell className="text-right pr-8">${monthlyBenefitLevel2.toFixed(2)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="pl-8">Part 3</TableCell>
                                <TableCell className="text-center">{totalMinutesLevel3}</TableCell>
                                <TableCell className="text-center">{weeklyHoursLevel3.toFixed(2)}</TableCell>
                                <TableCell className="text-center">{monthlyHoursLevel3.toFixed(2)}</TableCell>
                                <TableCell className="text-center">
                                    {isEditingRates ? (
                                        <Input
                                            type="number"
                                            value={rates.C}
                                            onChange={(e) => handleRateChange('C', e.target.value)}
                                            className="w-24 text-right mx-auto"
                                            step="0.01"
                                        />
                                    ) : (
                                        `$${rates.C.toFixed(2)}`
                                    )}
                                </TableCell>
                                <TableCell className="text-right pr-8">${monthlyBenefitLevel3.toFixed(2)}</TableCell>
                            </TableRow>
                            <TableRow className="font-medium">
                                <TableCell colSpan={5} className="pl-8">Total Assessed Monthly Attendant Care Benefit</TableCell>
                                <TableCell className="text-right pr-8">${totalMonthlyBenefit.toFixed(2)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <div className="mt-6 flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            * This amount is subject to the limits allowed under the Statutory Accident Benefits Schedule
                        </p>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setIsEditingRates(!isEditingRates)}
                                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md"
                            >
                                {isEditingRates ? 'Done Editing' : 'Edit Rates'}
                            </button>
                            {isEditingRates && (
                                <>
                                    <button 
                                        onClick={useCurrentRates}
                                        className="px-4 py-2 text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-md"
                                    >
                                        Use Current Rates
                                    </button>
                                    <button 
                                        onClick={useHistoricalRates}
                                        className="px-4 py-2 text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-md"
                                    >
                                        Use 2008-2010 Rates
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="mt-8">
                        <h4 className="font-medium mb-4">Hourly Rates Chart:</h4>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-8">Level</TableHead>
                                    <TableHead>Current Rate (2025)</TableHead>
                                    <TableHead className="text-right pr-8">2008-2010 Rate</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="pl-8">Level 1 (A)</TableCell>
                                    <TableCell>${DEFAULT_RATES.A.toFixed(2)}</TableCell>
                                    <TableCell className="text-right pr-8">${HISTORICAL_RATES.A.toFixed(2)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="pl-8">Level 2 (B)</TableCell>
                                    <TableCell>${DEFAULT_RATES.B.toFixed(2)}</TableCell>
                                    <TableCell className="text-right pr-8">${HISTORICAL_RATES.B.toFixed(2)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="pl-8">Level 3 (C)</TableCell>
                                    <TableCell>${DEFAULT_RATES.C.toFixed(2)}</TableCell>
                                    <TableCell className="text-right pr-8">${HISTORICAL_RATES.C.toFixed(2)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Calculations;