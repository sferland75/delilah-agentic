import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PhysicalSymptoms } from './physical-symptoms';
import { CognitiveSymptoms } from './cognitive-symptoms';
import { EmotionalSymptoms } from './emotional-symptoms';
import { ClipboardList, Activity, Brain, Heart } from 'lucide-react';
import { Accordion } from '@/components/ui/accordion';

const symptomGuidance = {
  general: `Document overall symptom presentation and impact:
  - Pattern of symptoms
  - Temporal relationships
  - Aggravating factors
  - Alleviating factors
  - Impact on function
  - Changes over time`,
  physical: `Assess physical manifestations and characteristics:
  - Pain patterns and locations
  - Sensory changes
  - Balance issues
  - Fatigue patterns
  - Sleep disturbances
  - Physical limitations`,
  cognitive: `Evaluate cognitive function and processing:
  - Attention and concentration
  - Memory function
  - Processing speed
  - Executive function
  - Language and communication
  - Learning and recall`,
  emotional: `Assess emotional and psychological status:
  - Mood changes
  - Anxiety levels
  - Behavioral changes
  - Emotional regulation
  - Stress response
  - Coping mechanisms`
};

export function SymptomsSection() {
  const { register } = useFormContext();

  return (
    <Card className="p-6 bg-slate-50">
      <h2 className="text-2xl font-semibold mb-2 text-slate-800">Symptoms Assessment</h2>
      <p className="text-sm text-slate-600 mb-6">Comprehensive evaluation of symptoms across multiple domains</p>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger 
            value="general" 
            className="bg-white/50 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50"
          >
            <div className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              <span>General</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="physical" 
            className="bg-white/50 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50"
          >
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span>Physical</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="cognitive" 
            className="bg-white/50 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50"
          >
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span>Cognitive</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="emotional" 
            className="bg-white/50 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50"
          >
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span>Emotional</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription className="whitespace-pre-line text-slate-700">
              {symptomGuidance.general}
            </AlertDescription>
          </Alert>
          <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
            <h3 className="text-lg font-medium text-slate-800">General Symptoms Overview</h3>
            <div className="text-sm text-slate-600 mb-4">Document overall symptom patterns and functional impact</div>
            <Textarea
              {...register('symptoms.generalNotes')}
              className="min-h-[200px] bg-white"
              placeholder="Document overall symptom presentation, patterns, and functional impact..."
            />
          </div>
        </TabsContent>

        <TabsContent value="physical" className="space-y-6">
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription className="whitespace-pre-line text-slate-700">
              {symptomGuidance.physical}
            </AlertDescription>
          </Alert>
          <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
            <h3 className="text-lg font-medium text-slate-800">Physical Assessment</h3>
            <div className="text-sm text-slate-600 mb-4">Document physical symptoms and their characteristics</div>
            <Accordion type="single" collapsible className="bg-white">
              <PhysicalSymptoms />
            </Accordion>
          </div>
        </TabsContent>

        <TabsContent value="cognitive" className="space-y-6">
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription className="whitespace-pre-line text-slate-700">
              {symptomGuidance.cognitive}
            </AlertDescription>
          </Alert>
          <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
            <h3 className="text-lg font-medium text-slate-800">Cognitive Assessment</h3>
            <div className="text-sm text-slate-600 mb-4">Document cognitive symptoms and their impact</div>
            <Accordion type="single" collapsible className="bg-white">
              <CognitiveSymptoms />
            </Accordion>
          </div>
        </TabsContent>

        <TabsContent value="emotional" className="space-y-6">
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription className="whitespace-pre-line text-slate-700">
              {symptomGuidance.emotional}
            </AlertDescription>
          </Alert>
          <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
            <h3 className="text-lg font-medium text-slate-800">Emotional Assessment</h3>
            <div className="text-sm text-slate-600 mb-4">Document emotional symptoms and their impact</div>
            <Accordion type="single" collapsible className="bg-white">
              <EmotionalSymptoms />
            </Accordion>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}