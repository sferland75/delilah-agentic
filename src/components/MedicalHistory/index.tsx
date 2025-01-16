import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PreExistingConditions } from './PreExistingConditions';
import { InjuryMechanism } from './InjuryMechanism';
import { Medications } from './Medications';
import { CurrentTreatment } from './CurrentTreatment';
import { History, Bone, Stethoscope, Pill } from 'lucide-react';

export function MedicalHistorySection() {
  const { control } = useFormContext();

  return (
    <Card className="p-6 bg-slate-50">
      <h2 className="text-2xl font-semibold mb-2 text-slate-800">Medical History</h2>
      <p className="text-sm text-slate-600 mb-6">Pre-accident history, injury details, and current treatments</p>

      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <AlertDescription className="text-slate-700">
          Document comprehensive medical history including:
          - Pre-existing conditions and treatments
          - Injury mechanism and immediate symptoms
          - Current medications and treatments
          - Healthcare providers and treatment details
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="preExisting" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger 
            value="preExisting"
            className="bg-white/50 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50"
          >
            <div className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <span>Pre-Existing</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="injury"
            className="bg-white/50 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50"
          >
            <div className="flex items-center gap-2">
              <Bone className="h-4 w-4" />
              <span>Injury Mechanism</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="treatment"
            className="bg-white/50 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50"
          >
            <div className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              <span>Current Treatment</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="medications"
            className="bg-white/50 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50"
          >
            <div className="flex items-center gap-2">
              <Pill className="h-4 w-4" />
              <span>Medications</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preExisting">
          <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
            <PreExistingConditions control={control} />
          </div>
        </TabsContent>

        <TabsContent value="injury">
          <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
            <InjuryMechanism control={control} />
          </div>
        </TabsContent>

        <TabsContent value="treatment">
          <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
            <CurrentTreatment control={control} />
          </div>
        </TabsContent>

        <TabsContent value="medications">
          <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
            <Medications control={control} />
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}