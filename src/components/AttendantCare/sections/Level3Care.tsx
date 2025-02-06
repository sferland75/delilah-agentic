import React from 'react';
import { Table, TableBody, TableCell, TableRow, TableHeader } from '@/components/ui/table';
import { useLevel3Calculations } from '../hooks/useLevel3Calculations';
import { useLevel3Persistence } from '../hooks/useLevel3Persistence';
import { useFormContext } from 'react-hook-form';
import CareTableHeader from '../CareTableHeader';

import GenitourinarySection from './Level3/GenitourinarySection';
import BowelCareSection from './Level3/BowelCareSection';
import TracheostomySection from './Level3/TracheostomySection';
import VentilatorSection from './Level3/VentilatorSection';
import ExerciseSection from './Level3/ExerciseSection';
import SkinCareSection from './Level3/SkinCareSection';
import MedicationSection from './Level3/MedicationSection';
import BathingSection from './Level3/BathingSection';
import OtherTherapySection from './Level3/OtherTherapySection';
import MaintenanceSection from './Level3/MaintenanceSection';

const Level3Care: React.FC = () => {
    const { watch } = useFormContext();
    const { updateAllTotals } = useLevel3Calculations();
    useLevel3Persistence();

    const total = watch('attendantCare.level3.total') || 0;

    return (
        <div className="space-y-6">
            <Table>
                <TableHeader>
                    <CareTableHeader />
                </TableHeader>
                <TableBody>
                    <GenitourinarySection />
                    <BowelCareSection />
                    <TracheostomySection />
                    <VentilatorSection />
                    <ExerciseSection />
                    <SkinCareSection />
                    <MedicationSection />
                    <BathingSection />
                    <OtherTherapySection />
                    <MaintenanceSection />
                    
                    {/* Level 3 Total Row */}
                    <TableRow className="font-medium bg-muted">
                        <TableCell className="px-8">Level 3 Total</TableCell>
                        <TableCell colSpan={2}></TableCell>
                        <TableCell className="text-right pr-8">
                            {total}
                        </TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
};

export default Level3Care;