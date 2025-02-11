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
        <div className="p-6">
            <Tabs defaultValue="level1" className="w-full">
                <div className="bg-slate-100/80 p-1 rounded-md mb-6">
                    <TabsList className="grid w-full grid-cols-4 gap-1">
                        <TabsTrigger 
                            value="level1"
                            className="data-[state=active]:bg-[#2563EB] data-[state=active]:text-white text-slate-600 hover:bg-slate-200"
                        >
                            <div className="flex items-center gap-2">
                                <FaHandHoldingHeart className="h-4 w-4" />
                                <span>Level 1</span>
                            </div>
                        </TabsTrigger>
                        <TabsTrigger 
                            value="level2"
                            className="data-[state=active]:bg-[#2563EB] data-[state=active]:text-white text-slate-600 hover:bg-slate-200"
                        >
                            <div className="flex items-center gap-2">
                                <FaUserNurse className="h-4 w-4" />
                                <span>Level 2</span>
                            </div>
                        </TabsTrigger>
                        <TabsTrigger 
                            value="level3"
                            className="data-[state=active]:bg-[#2563EB] data-[state=active]:text-white text-slate-600 hover:bg-slate-200"
                        >
                            <div className="flex items-center gap-2">
                                <FaUserMd className="h-4 w-4" />
                                <span>Level 3</span>
                            </div>
                        </TabsTrigger>
                        <TabsTrigger 
                            value="calculations"
                            className="data-[state=active]:bg-[#2563EB] data-[state=active]:text-white text-slate-600 hover:bg-slate-200"
                        >
                            <div className="flex items-center gap-2">
                                <FaCalculator className="h-4 w-4" />
                                <span>Calculations</span>
                            </div>
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="level1">
                    <div className="space-y-4">
                        <Level1Care />
                    </div>
                </TabsContent>

                <TabsContent value="level2">
                    <div className="space-y-4">
                        <Level2Care />
                    </div>
                </TabsContent>

                <TabsContent value="level3">
                    <div className="space-y-4">
                        <Level3Care />
                    </div>
                </TabsContent>

                <TabsContent value="calculations">
                    <div className="space-y-4">
                        <Calculations />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AttendantCareSection;