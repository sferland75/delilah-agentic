import { useFormContext } from 'react-hook-form';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RangeOfMotion } from '@/components/RangeOfMotion';
import { ManualMuscle } from '@/components/ManualMuscle';
import { BergBalanceTest } from '@/components/BergBalanceTest/BergBalanceTest';
import { ClinicalObservations } from '@/components/FunctionalAssessment/components/clinical-observations';
import { PosturalTolerances } from '@/components/FunctionalAssessment/postural-tolerances';
import { TransfersAssessment } from '@/components/FunctionalAssessment/transfers-assessment';
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
          <TabsTrigger value="berg">Berg Balance</TabsTrigger>
          <TabsTrigger value="observations">Observations</TabsTrigger>
          <TabsTrigger value="postural">Postural</TabsTrigger>
          <TabsTrigger value="transfers">Transfers</TabsTrigger>
        </TabsList>

        <TabsContent value="rom">
          <RangeOfMotion />
        </TabsContent>

        <TabsContent value="mmt">
          <ManualMuscle />
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
      </Tabs>
    </Card>
  );
}