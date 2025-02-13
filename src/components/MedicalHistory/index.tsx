import React from 'react';
import { useFormContext } from 'react-hook-form';
<<<<<<< HEAD
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PreExistingConditions } from './PreExistingConditions';
import { PreAccidentHistory } from './PreAccidentHistory';
import { InjuryMechanism } from './InjuryMechanism';
import { Medications } from './Medications';
import { CurrentTreatment } from './CurrentTreatment';
import { 
  FaHistory, 
  FaUserMd, 
  FaBandAid, 
  FaStethoscope, 
  FaPrescriptionBottleAlt,
} from 'react-icons/fa';
=======
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PreExistingConditions } from './PreExistingConditions';
import { InjuryMechanism } from './InjuryMechanism';
import { Medications } from './Medications';
import { CurrentTreatment } from './CurrentTreatment';
import { History, Bone, Stethoscope, Pill } from 'lucide-react';
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801

export function MedicalHistorySection() {
  const { control } = useFormContext();

  return (
<<<<<<< HEAD
    <div className="p-6">
      <Tabs defaultValue="preAccident" className="w-full">
        <div className="bg-slate-100/80 p-1 rounded-md mb-6">
          <TabsList className="grid w-full grid-cols-5 gap-1">
            <TabsTrigger 
              value="preAccident"
              className="data-[state=active]:bg-[#2563EB] data-[state=active]:text-white text-slate-600 hover:bg-slate-200"
            >
              <div className="flex items-center gap-2">
                <FaHistory className="h-4 w-4" />
                <span>Pre-Accident</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="preExisting"
              className="data-[state=active]:bg-[#2563EB] data-[state=active]:text-white text-slate-600 hover:bg-slate-200"
            >
              <div className="flex items-center gap-2">
                <FaUserMd className="h-4 w-4" />
                <span>Pre-Existing</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="injury"
              className="data-[state=active]:bg-[#2563EB] data-[state=active]:text-white text-slate-600 hover:bg-slate-200"
            >
              <div className="flex items-center gap-2">
                <FaBandAid className="h-4 w-4" />
                <span>Injury</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="treatment"
              className="data-[state=active]:bg-[#2563EB] data-[state=active]:text-white text-slate-600 hover:bg-slate-200"
            >
              <div className="flex items-center gap-2">
                <FaStethoscope className="h-4 w-4" />
                <span>Treatment</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="medications"
              className="data-[state=active]:bg-[#2563EB] data-[state=active]:text-white text-slate-600 hover:bg-slate-200"
            >
              <div className="flex items-center gap-2">
                <FaPrescriptionBottleAlt className="h-4 w-4" />
                <span>Medications</span>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="preAccident">
          <div className="space-y-4">
            <PreAccidentHistory control={control} />
          </div>
        </TabsContent>

        <TabsContent value="preExisting">
          <div className="space-y-4">
=======
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
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
            <PreExistingConditions control={control} />
          </div>
        </TabsContent>

        <TabsContent value="injury">
<<<<<<< HEAD
          <div className="space-y-4">
=======
          <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
            <InjuryMechanism control={control} />
          </div>
        </TabsContent>

        <TabsContent value="treatment">
<<<<<<< HEAD
          <div className="space-y-4">
=======
          <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
            <CurrentTreatment control={control} />
          </div>
        </TabsContent>

        <TabsContent value="medications">
<<<<<<< HEAD
          <div className="space-y-4">
=======
          <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
            <Medications control={control} />
          </div>
        </TabsContent>
      </Tabs>
<<<<<<< HEAD
    </div>
=======
    </Card>
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
  );
}