import { useFormContext } from 'react-hook-form';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyOverview } from '@/components/EnvironmentalSection/property-overview';
import { RoomAssessment } from '@/components/EnvironmentalSection/room-assessment';
import { ExteriorFeatures } from '@/components/EnvironmentalSection/exterior-features';
import { SafetyAssessment } from '@/components/EnvironmentalSection/safety-assessment';
import { AccessibilityAssessment } from '@/components/EnvironmentalSection/accessibility-assessment';
import type { AssessmentFormData } from '@/lib/validation/assessment-schema';

export function EnvironmentalAssessment() {
  const form = useFormContext<AssessmentFormData>();

  if (!form) {
    throw new Error('EnvironmentalAssessment must be used within a FormProvider');
  }

  return (
    <Card className="p-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
          <TabsTrigger value="exterior">Exterior</TabsTrigger>
          <TabsTrigger value="safety">Safety</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <PropertyOverview />
        </TabsContent>

        <TabsContent value="rooms">
          <RoomAssessment />
        </TabsContent>

        <TabsContent value="exterior">
          <ExteriorFeatures />
        </TabsContent>

        <TabsContent value="safety">
          <SafetyAssessment />
        </TabsContent>

        <TabsContent value="accessibility">
          <AccessibilityAssessment />
        </TabsContent>
      </Tabs>
    </Card>
  );
}