import React from 'react';
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

// Define cognitive symptom categories
const cognitiveSymptoms = {
  attention: {
    title: "Attention and Concentration",
    symptoms: [
      { id: "sustained_attention", label: "Difficulty maintaining attention" },
      { id: "divided_attention", label: "Trouble multitasking" },
      { id: "distractibility", label: "Easily distracted" },
      { id: "mental_fatigue", label: "Mental fatigue with concentration" }
    ]
  },
  memory: {
    title: "Memory",
    symptoms: [
      { id: "short_term", label: "Short-term memory problems" },
      { id: "working_memory", label: "Difficulty holding information while using it" },
      { id: "recall", label: "Trouble recalling information" },
      { id: "prospective", label: "Forgetting to do planned tasks" }
    ]
  },
  processing: {
    title: "Processing Speed",
    symptoms: [
      { id: "processing_speed", label: "Slowed thinking" },
      { id: "reaction_time", label: "Delayed reaction time" },
      { id: "decision_making", label: "Difficulty making decisions" },
      { id: "problem_solving", label: "Trouble solving problems" }
    ]
  },
  executive: {
    title: "Executive Function",
    symptoms: [
      { id: "planning", label: "Difficulty planning and organizing" },
      { id: "initiation", label: "Trouble getting started on tasks" },
      { id: "sequencing", label: "Problems with step-by-step tasks" },
      { id: "mental_flexibility", label: "Difficulty switching between tasks" }
    ]
  },
  language: {
    title: "Language and Communication",
    symptoms: [
      { id: "word_finding", label: "Word-finding difficulties" },
      { id: "verbal_fluency", label: "Reduced verbal fluency" },
      { id: "comprehension", label: "Trouble understanding complex information" },
      { id: "expression", label: "Difficulty expressing thoughts clearly" }
    ]
  }
};

export function CognitiveSymptoms() {
  const { register, watch, setValue } = useFormContext();
  const watchSymptoms = watch('symptoms.cognitive') || {};
  const [openSections, setOpenSections] = React.useState<string[]>([]);

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleSeverityChange = (symptomId: string, value: number[]) => {
    setValue(`symptoms.cognitive.${symptomId}.severity`, value[0], { 
      shouldDirty: true 
    });
  };

  return (
    <div className="space-y-6">
      {Object.entries(cognitiveSymptoms).map(([category, { title, symptoms }]) => (
        <Card key={category}>
          <Collapsible
            open={openSections.includes(category)}
            onOpenChange={() => toggleSection(category)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{title}</CardTitle>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <ChevronDown 
                      className={`h-6 w-6 transform transition-transform duration-200 ${
                        openSections.includes(category) ? 'rotate-180' : ''
                      }`}
                    />
                  </Button>
                </CollapsibleTrigger>
              </div>
            </CardHeader>

            <CollapsibleContent>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    {symptoms.map((symptom) => {
                      const symptomValue = watchSymptoms[symptom.id];
                      return (
                        <div key={symptom.id} className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={symptom.id}
                              {...register(`symptoms.cognitive.${symptom.id}.present`)}
                            />
                            <Label htmlFor={symptom.id}>{symptom.label}</Label>
                          </div>
                          
                          {symptomValue?.present && (
                            <div className="ml-6 space-y-4">
                              <div className="space-y-2">
                                <Label className="text-sm">
                                  Severity: {watchSymptoms[symptom.id]?.severity || 0}
                                </Label>
                                <Slider
                                  min={0}
                                  max={10}
                                  step={1}
                                  value={[watchSymptoms[symptom.id]?.severity || 0]}
                                  onValueChange={(value) => handleSeverityChange(symptom.id, value)}
                                />
                                <div className="flex justify-between text-xs text-gray-500">
                                  <span>Minimal Impact</span>
                                  <span>Severe Impact</span>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-sm">Examples/Observations</Label>
                                <Textarea
                                  placeholder="Provide specific examples or clinical observations..."
                                  className="h-20"
                                  {...register(`symptoms.cognitive.${symptom.id}.notes`)}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-2 pt-4 border-t">
                    <Label>Category Observations</Label>
                    <Textarea
                      placeholder={`Additional observations about ${title.toLowerCase()}...`}
                      className="h-24"
                      {...register(`symptoms.cognitive.${category}_observations`)}
                    />
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      ))}
      
      <Card>
        <CardHeader>
          <CardTitle>General Cognitive Function Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Overall observations about cognitive function, patterns noticed, or additional symptoms not covered above..."
            className="min-h-[100px]"
            {...register('symptoms.cognitive.general_observations')}
          />
        </CardContent>
      </Card>
    </div>
  );
}