import React from 'react';
import { useFormContext } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AssessmentFormData } from '@/lib/validation/assessment-schema';
import Level1Care from './sections/Level1Care';
import Level2Care from './sections/Level2Care';
import Level3Care from './sections/Level3Care';
import Calculations from './sections/Calculations';

export const AttendantCareSection: React.FC = () => {
    const { register } = useFormContext<AssessmentFormData>();
    
    return (
        <div className="space-y-6">
            <Card>
                <CardContent className="pt-6">
                    <h2 className="text-2xl font-bold mb-6">Assessment of Attendant Care Needs (Form 1)</h2>
                    
                    <Tabs defaultValue="level1">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="level1">Level 1 - Routine Personal Care</TabsTrigger>
                            <TabsTrigger value="level2">Level 2 - Basic Supervisory</TabsTrigger>
                            <TabsTrigger value="level3">Level 3 - Complex Health Care</TabsTrigger>
                            <TabsTrigger value="calculations">Calculations</TabsTrigger>
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
                </CardContent>
            </Card>
        </div>
    );
};

export default AttendantCareSection;