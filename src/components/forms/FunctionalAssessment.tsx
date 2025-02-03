import { useFormContext } from 'react-hook-form';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RomMmtMap } from '@/components/RomMmtMap';
import { BergBalanceTest } from '@/components/BergBalanceTest/BergBalanceTest';
import { ClinicalObservations } from '@/components/FunctionalAssessment/components/clinical-observations';
import { PosturalTolerances } from '@/components/FunctionalAssessment/postural-tolerances';
import { TransfersAssessment } from '@/components/FunctionalAssessment/transfers-assessment';
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
          <TabsTrigger value="berg">Berg Balance</TabsTrigger>
          <TabsTrigger value="observations">Observations</TabsTrigger>
          <TabsTrigger value="postural">Postural</TabsTrigger>
          <TabsTrigger value="transfers">Transfers</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="capacity">
          <FunctionalCapacityForm />
        </TabsContent>

        <TabsContent value="bodymap">
          <RomMmtMap onUpdate={handleAssessmentUpdate} />
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
      </Tabs>
    </Card>
  );
}