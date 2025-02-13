import { useFormContext } from 'react-hook-form';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
<<<<<<< HEAD
import { RomMmtMap } from '@/components/RomMmtMap';
=======
import { RangeOfMotion } from '@/components/RangeOfMotion';
import { ManualMuscle } from '@/components/ManualMuscle';
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
import { BergBalanceTest } from '@/components/BergBalanceTest/BergBalanceTest';
import { ClinicalObservations } from '@/components/FunctionalAssessment/components/clinical-observations';
import { PosturalTolerances } from '@/components/FunctionalAssessment/postural-tolerances';
import { TransfersAssessment } from '@/components/FunctionalAssessment/transfers-assessment';
<<<<<<< HEAD
import { useToast } from '@/components/ui/use-toast';
import { FunctionalCapacityForm } from '@/components/FunctionalAssessment/functional-capacity-form';

export function FunctionalAssessment() {
  const { register, watch, setValue } = useFormContext();
  const { toast } = useToast();

  const handleAssessmentUpdate = (data: any) => {
    console.log('Assessment updated:', data);
    if (data.type === 'ROM') {
      setValue('assessment.rom', data.data);
    } else if (data.type === 'MMT') {
      setValue('assessment.mmt', data.data);
    }
    toast({
      title: 'Assessment Updated',
      description: `${data.type} assessment has been updated`,
    });
  };
  
  return (
    <Card className="p-6">
      <Tabs defaultValue="capacity" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="capacity">Capacities</TabsTrigger>
          <TabsTrigger value="bodymap">Body Map</TabsTrigger>
=======
import type { AssessmentFormData } from '@/lib/validation/assessment-schema';

export function FunctionalAssessment() {
  const form = useFormContext<AssessmentFormData>();

  if (!form) {
    throw new Error('FunctionalAssessment must be used within a FormProvider');
  }

  return (
    <Card className="p-6">
      <Tabs defaultValue="rom" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="rom">Range of Motion</TabsTrigger>
          <TabsTrigger value="mmt">Manual Muscle</TabsTrigger>
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
          <TabsTrigger value="berg">Berg Balance</TabsTrigger>
          <TabsTrigger value="observations">Observations</TabsTrigger>
          <TabsTrigger value="postural">Postural</TabsTrigger>
          <TabsTrigger value="transfers">Transfers</TabsTrigger>
<<<<<<< HEAD
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="capacity">
          <FunctionalCapacityForm />
        </TabsContent>

        <TabsContent value="bodymap">
          <RomMmtMap onUpdate={handleAssessmentUpdate} />
=======
        </TabsList>

        <TabsContent value="rom">
          <RangeOfMotion />
        </TabsContent>

        <TabsContent value="mmt">
          <ManualMuscle />
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
        </TabsContent>

        <TabsContent value="berg">
          <BergBalanceTest />
        </TabsContent>

        <TabsContent value="observations">
          <ClinicalObservations />
        </TabsContent>

        <TabsContent value="postural">
          <PosturalTolerances />
        </TabsContent>

        <TabsContent value="transfers">
          <TransfersAssessment />
        </TabsContent>
<<<<<<< HEAD

        <TabsContent value="notes">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Assessment Notes</h3>
            <textarea
              {...register('assessment.functionalNotes')}
              className="w-full h-32 p-2 border rounded"
              placeholder="Enter any additional notes about the functional assessment..."
            />
          </div>
        </TabsContent>
=======
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
      </Tabs>
    </Card>
  );
}