import React from 'react';
import { useFormContext } from '@/context/FormContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RomMmtMap } from '@/components/RomMmtMap';
import { FunctionalCapacityForm } from './functional-capacity-form';

export const FunctionalAssessment: React.FC = () => {
  const { formData, updateFormData } = useFormContext();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Functional Assessment</CardTitle>
        <CardDescription>
          Evaluate functional capacities and limitations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="capacity" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="capacity">Functional Capacity</TabsTrigger>
            <TabsTrigger value="bodymap">ROM & MMT Assessment</TabsTrigger>
          </TabsList>

          <TabsContent value="capacity">
            <FunctionalCapacityForm />
          </TabsContent>

          <TabsContent value="bodymap">
            <RomMmtMap onUpdate={(data) => {
              updateFormData({
                functionalAssessment: {
                  ...formData.functionalAssessment,
                  [data.type === 'ROM' ? 'rangeOfMotion' : 'manualMuscleTesting']: data.data
                }
              });
            }} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FunctionalAssessment;