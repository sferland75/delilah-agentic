import React from 'react';
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

// Same emotionalSymptoms object...
const emotionalSymptoms = {
  mood: {
    title: "Mood Symptoms",
    symptoms: [
      { id: "depression", label: "Depression" },
      { id: "anxiety", label: "Anxiety" },
      { id: "mood_swings", label: "Mood Swings" },
      { id: "irritability", label: "Irritability" }
    ]
  },
  emotional_control: {
    title: "Emotional Control",
    symptoms: [
      { id: "emotional_lability", label: "Emotional Lability" },
      { id: "impulsivity", label: "Emotional Impulsivity" },
      { id: "aggression", label: "Aggression/Agitation" },
      { id: "emotional_numbness", label: "Emotional Numbness" }
    ]
  },
  motivation: {
    title: "Motivation and Drive",
    symptoms: [
      { id: "apathy", label: "Apathy" },
      { id: "reduced_motivation", label: "Reduced Motivation" },
      { id: "anhedonia", label: "Loss of Interest/Pleasure" },
      { id: "initiative", label: "Reduced Initiative" }
    ]
  },
  social: {
    title: "Social-Emotional",
    symptoms: [
      { id: "social_withdrawal", label: "Social Withdrawal" },
      { id: "relationship_changes", label: "Changes in Relationships" },
      { id: "empathy", label: "Changes in Empathy" },
      { id: "social_anxiety", label: "Social Anxiety" }
    ]
  },
  self_awareness: {
    title: "Self-Awareness and Regulation",
    symptoms: [
      { id: "self_monitoring", label: "Difficulty Monitoring Emotions" },
      { id: "coping", label: "Poor Coping Skills" },
      { id: "emotional_awareness", label: "Reduced Emotional Awareness" },
      { id: "self_regulation", label: "Difficulty Self-Regulating" }
    ]
  }
};

export function EmotionalSymptoms() {
  const { register, watch, setValue } = useFormContext();
  const watchSymptoms = watch('symptoms.emotional') || {};
  const [openSections, setOpenSections] = React.useState<string[]>([]);

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleSeverityChange = (symptomId: string, value: number[]) => {
    setValue(`symptoms.emotional.${symptomId}.severity`, value[0], { 
      shouldDirty: true 
    });
  };

  return (
    <div className="space-y-6">
      {Object.entries(emotionalSymptoms).map(([category, { title, symptoms }]) => (
        <Card key={category}>
          <Collapsible
            open={openSections.includes(category)}
            onOpenChange={() => toggleSection(category)}
          >
            <CollapsibleTrigger className="w-full">
              <CardHeader className="hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle>{title}</CardTitle>
                  <ChevronDown 
                    className={`h-6 w-6 transform transition-transform duration-200 ${
                      openSections.includes(category) ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </CardHeader>
            </CollapsibleTrigger>

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
                              {...register(`symptoms.emotional.${symptom.id}.present`)}
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
                                  {...register(`symptoms.emotional.${symptom.id}.notes`)}
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
                      {...register(`symptoms.emotional.${category}_observations`)}
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
          <CardTitle>General Emotional/Behavioral Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Overall observations about emotional and behavioral function, patterns noticed, or additional symptoms not covered above..."
            className="min-h-[100px]"
            {...register('symptoms.emotional.general_observations')}
          />
        </CardContent>
      </Card>
    </div>
  );
}