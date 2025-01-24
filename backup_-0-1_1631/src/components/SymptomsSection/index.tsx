import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PhysicalSymptoms } from './physical-symptoms';
import { CognitiveSymptoms } from './cognitive-symptoms';
import { EmotionalSymptoms } from './emotional-symptoms';
import { Activity, Brain, Heart, AlertCircle } from 'lucide-react';
import { Accordion } from '@/components/ui/accordion';

const symptomSections = {
  general: {
    title: "General Symptom Overview",
    description: `Document overall symptom presentation and impact:
    - Pattern of symptoms
    - Temporal relationships
    - Aggravating factors
    - Alleviating factors
    - Impact on function
    - Changes over time`,
    icon: AlertCircle,
  },
  physical: {
    title: "Physical Symptoms",
    description: `Assess physical manifestations and characteristics:
    - Pain patterns and locations
    - Sensory changes
    - Balance issues
    - Fatigue patterns
    - Sleep disturbances
    - Physical limitations`,
    icon: Activity,
  },
  cognitive: {
    title: "Cognitive Symptoms",
    description: `Evaluate cognitive function and processing:
    - Attention and concentration
    - Memory function
    - Processing speed
    - Executive function
    - Language and communication
    - Learning and recall`,
    icon: Brain,
  },
  emotional: {
    title: "Emotional Symptoms",
    description: `Assess emotional and psychological status:
    - Mood changes
    - Anxiety levels
    - Behavioral changes
    - Emotional regulation
    - Stress response
    - Coping mechanisms`,
    icon: Heart,
  }
};

export function SymptomsSection() {
  const { register } = useFormContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Symptoms Assessment</CardTitle>
        <CardDescription>
          Comprehensive evaluation of physical, cognitive, and emotional symptoms
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Alert>
            <AlertDescription>
              Document all reported symptoms and clinical observations. Consider frequency,
              severity, and impact on function. Note patterns, triggers, and temporal relationships.
            </AlertDescription>
          </Alert>

          {/* General Notes Section */}
          <div className="space-y-6 p-4 border rounded-lg">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <symptomSections.general.icon className="h-5 w-5" />
                <h3 className="text-lg font-semibold">{symptomSections.general.title}</h3>
              </div>
              <Alert>
                <AlertDescription className="whitespace-pre-line">
                  {symptomSections.general.description}
                </AlertDescription>
              </Alert>
            </div>

            <div className="space-y-4">
              <Textarea
                {...register('symptoms.generalNotes')}
                className="min-h-[150px]"
                placeholder="Document overall symptom presentation, patterns, and functional impact..."
              />
            </div>
          </div>

          <Separator />

          {/* Detailed Symptoms */}
          <Tabs defaultValue="physical" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="physical">Physical</TabsTrigger>
              <TabsTrigger value="cognitive">Cognitive</TabsTrigger>
              <TabsTrigger value="emotional">Emotional</TabsTrigger>
            </TabsList>

            <TabsContent value="physical">
              <div className="space-y-6">
                <Alert>
                  <AlertDescription className="whitespace-pre-line">
                    {symptomSections.physical.description}
                  </AlertDescription>
                </Alert>
                <div className="border rounded-lg">
                  <Accordion type="single" collapsible>
                    <PhysicalSymptoms />
                  </Accordion>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="cognitive">
              <div className="space-y-6">
                <Alert>
                  <AlertDescription className="whitespace-pre-line">
                    {symptomSections.cognitive.description}
                  </AlertDescription>
                </Alert>
                <div className="border rounded-lg">
                  <Accordion type="single" collapsible>
                    <CognitiveSymptoms />
                  </Accordion>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="emotional">
              <div className="space-y-6">
                <Alert>
                  <AlertDescription className="whitespace-pre-line">
                    {symptomSections.emotional.description}
                  </AlertDescription>
                </Alert>
                <div className="border rounded-lg">
                  <Accordion type="single" collapsible>
                    <EmotionalSymptoms />
                  </Accordion>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}