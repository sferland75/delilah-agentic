import React from 'react';
import { useFormContext } from 'react-hook-form';
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

export function MedicalHistorySection() {
  const { control } = useFormContext();

  return (
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
            <PreExistingConditions control={control} />
          </div>
        </TabsContent>

        <TabsContent value="injury">
          <div className="space-y-4">
            <InjuryMechanism control={control} />
          </div>
        </TabsContent>

        <TabsContent value="treatment">
          <div className="space-y-4">
            <CurrentTreatment control={control} />
          </div>
        </TabsContent>

        <TabsContent value="medications">
          <div className="space-y-4">
            <Medications control={control} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}