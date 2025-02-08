import React from 'react';
import { Table, TableBody, TableCell, TableRow, TableHeader } from '@/components/ui/table';
import { useLevel3Calculations } from '../hooks/useLevel3Calculations';
import { useLevel3Persistence } from '../hooks/useLevel3Persistence';
import { useFormContext } from 'react-hook-form';
import CareTableHeader from '../CareTableHeader';
import {
    FaToilet,
    FaLungs,
    FaRunning,
    FaHandHoldingMedical,
    FaPills,
    FaBath,
    FaClinicMedical,
    FaCog,
    FaUserNurse
} from 'react-icons/fa';

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

const SectionHeader = ({ icon: Icon, title }) => (
    <TableRow className="bg-muted/50">
        <TableCell colSpan={5} className="px-8">
            <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-blue-600" />
                <span className="font-medium">{title}</span>
            </div>
        </TableCell>
    </TableRow>
);

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
                    {/* Genitourinary Section with Icon */}
                    <SectionHeader icon={FaToilet} title="Genitourinary Care" />
                    <GenitourinarySection />

                    {/* Bowel Care Section with Icon */}
                    <SectionHeader icon={FaToilet} title="Bowel Care" />
                    <BowelCareSection />

                    {/* Tracheostomy Section with Icon */}
                    <SectionHeader icon={FaLungs} title="Tracheostomy Care" />
                    <TracheostomySection />

                    {/* Ventilator Section with Icon */}
                    <SectionHeader icon={FaLungs} title="Ventilator Care" />
                    <VentilatorSection />

                    {/* Exercise Section with Icon */}
                    <SectionHeader icon={FaRunning} title="Exercise & ROM Care" />
                    <ExerciseSection />

                    {/* Skin Care Section with Icon */}
                    <SectionHeader icon={FaHandHoldingMedical} title="Skin Care" />
                    <SkinCareSection />

                    {/* Medication Section with Icon */}
                    <SectionHeader icon={FaPills} title="Medication Administration" />
                    <MedicationSection />

                    {/* Bathing Section with Icon */}
                    <SectionHeader icon={FaBath} title="Complex Bathing Care" />
                    <BathingSection />

                    {/* Other Therapy Section with Icon */}
                    <SectionHeader icon={FaClinicMedical} title="Other Therapy" />
                    <OtherTherapySection />

                    {/* Maintenance Section with Icon */}
                    <SectionHeader icon={FaCog} title="Equipment Maintenance" />
                    <MaintenanceSection />
                    
                    {/* Level 3 Total Row */}
                    <TableRow className="font-medium bg-muted">
                        <TableCell className="px-8">
                            <div className="flex items-center gap-2">
                                <FaUserNurse className="h-4 w-4 text-blue-600" />
                                <span>Level 3 Total</span>
                            </div>
                        </TableCell>
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