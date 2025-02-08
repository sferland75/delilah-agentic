import React from 'react';
import { useFormContext } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AssessmentFormData } from '@/lib/validation/assessment-schema';
import Level1Care from './sections/Level1Care';
import Level2Care from './sections/Level2Care';
import Level3Care from './sections/Level3Care';
import Calculations from './sections/Calculations';
import { 
    FaUserNurse,
    FaHandHoldingHeart,
    FaUserMd,
    FaCalculator
} from 'react-icons/fa';

export const AttendantCareSection: React.FC = () => {
    const { register } = useFormContext<AssessmentFormData>();
    
    return (
        <div className="space-y-6">
            {/* Section Header */}
            <div className="flex items-center gap-2 mb-4">
                <FaUserNurse className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Assessment of Attendant Care Needs (Form 1)</h3>
            </div>

            {/* Tabs Navigation */}
            <div className="border rounded-md p-4">
                <Tabs defaultValue="level1">
                    <TabsList className="grid w-full grid-cols-4 bg-slate-50/80 p-1">
                        <TabsTrigger 
                            value="level1"
                            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                        >
                            <div className="flex items-center gap-2">
                                <FaHandHoldingHeart className="h-4 w-4" />
                                <span>Level 1 - Routine Personal Care</span>
                            </div>
                        </TabsTrigger>
                        <TabsTrigger 
                            value="level2"
                            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                        >
                            <div className="flex items-center gap-2">
                                <FaUserNurse className="h-4 w-4" />
                                <span>Level 2 - Basic Supervisory</span>
                            </div>
                        </TabsTrigger>
                        <TabsTrigger 
                            value="level3"
                            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                        >
                            <div className="flex items-center gap-2">
                                <FaUserMd className="h-4 w-4" />
                                <span>Level 3 - Complex Health Care</span>
                            </div>
                        </TabsTrigger>
                        <TabsTrigger 
                            value="calculations"
                            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                        >
                            <div className="flex items-center gap-2">
                                <FaCalculator className="h-4 w-4" />
                                <span>Calculations</span>
                            </div>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="level1" className="mt-6">
                        <Level1Care />
                    </TabsContent>

                    <TabsContent value="level2" className="mt-6">
                        <Level2Care />
                    </TabsContent>

                    <TabsContent value="level3" className="mt-6">
                        <Level3Care />
                    </TabsContent>

                    <TabsContent value="calculations" className="mt-6">
                        <Calculations />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default AttendantCareSection;