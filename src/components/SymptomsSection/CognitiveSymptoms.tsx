<<<<<<< HEAD
import React, { useState } from 'react';
import { useFormContext } from "react-hook-form";
=======
import React from 'react';
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
<<<<<<< HEAD
import { ChevronDown } from 'lucide-react';
=======
import { Button } from "@/components/ui/button";
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
<<<<<<< HEAD
import {
  FaBrain,
  FaCog,
  FaRegClock,
  FaLanguage,
  FaRegLightbulb,
  FaRegCompass,
  FaRobot,
} from 'react-icons/fa';

const CognitiveSymptoms = () => {
  const { setValue, watch } = useFormContext();
  const watchSymptoms = watch('symptoms.cognitive') || {};
  const [openSections, setOpenSections] = useState<string[]>([]);

  const COGNITIVE_SYMPTOMS = {
    attention_concentration: {
      title: "Attention and Concentration",
      icon: FaBrain,
      symptoms: [
        { id: "sustained_attention", label: "Difficulty maintaining attention" },
        { id: "divided_attention", label: "Problems with multitasking" },
        { id: "concentration", label: "Reduced concentration span" },
        { id: "distractibility", label: "Increased distractibility" }
      ]
    },
    processing_speed: {
      title: "Processing Speed",
      icon: FaCog,
      symptoms: [
        { id: "mental_speed", label: "Slowed mental processing" },
        { id: "reaction_time", label: "Delayed reaction time" },
        { id: "decision_making", label: "Slower decision-making" },
        { id: "task_completion", label: "Extended task completion time" }
      ]
    },
    memory: {
      title: "Memory Function",
      icon: FaRegClock,
      symptoms: [
        { id: "short_term", label: "Short-term memory difficulties" },
        { id: "working_memory", label: "Working memory problems" },
        { id: "recall", label: "Difficulty recalling information" },
        { id: "learning", label: "Impaired new learning" }
      ]
    },
    language: {
      title: "Language and Communication",
      icon: FaLanguage,
      symptoms: [
        { id: "word_finding", label: "Word-finding difficulties" },
        { id: "verbal_fluency", label: "Reduced verbal fluency" },
        { id: "comprehension", label: "Comprehension issues" },
        { id: "expression", label: "Expression difficulties" }
      ]
    },
    executive_function: {
      title: "Executive Function",
      icon: FaRegLightbulb,
      symptoms: [
        { id: "planning", label: "Planning and organization" },
        { id: "problem_solving", label: "Problem-solving difficulties" },
        { id: "mental_flexibility", label: "Reduced mental flexibility" },
        { id: "initiation", label: "Task initiation problems" }
      ]
    },
    orientation: {
      title: "Orientation and Awareness",
      icon: FaRegCompass,
      symptoms: [
        { id: "spatial_orientation", label: "Spatial orientation issues" },
        { id: "time_awareness", label: "Time awareness difficulties" },
        { id: "environment_awareness", label: "Environmental awareness" },
        { id: "self_monitoring", label: "Self-monitoring challenges" }
      ]
    }
  };
=======
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
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

<<<<<<< HEAD
  const handleSymptomChange = (symptomId: string, checked: boolean) => {
    setValue(`symptoms.cognitive.${symptomId}`, {
      present: checked,
      severity: checked ? 5 : 0,
      notes: watchSymptoms[symptomId]?.notes || "",
      frequency: watchSymptoms[symptomId]?.frequency || "intermittent",
    }, { 
      shouldDirty: true,
      shouldValidate: true
    });
  };

=======
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
  const handleSeverityChange = (symptomId: string, value: number[]) => {
    setValue(`symptoms.cognitive.${symptomId}.severity`, value[0], { 
      shouldDirty: true 
    });
  };

<<<<<<< HEAD
  const handleNotesChange = (symptomId: string, notes: string) => {
    setValue(`symptoms.cognitive.${symptomId}.notes`, notes, {
      shouldDirty: true
    });
  };

  return (
    <div className="space-y-4">
      {Object.entries(COGNITIVE_SYMPTOMS).map(([category, { title, icon: Icon, symptoms }]) => (
        <div key={category} className="border rounded-md overflow-hidden">
=======
  return (
    <div className="space-y-6">
      {Object.entries(cognitiveSymptoms).map(([category, { title, symptoms }]) => (
        <Card key={category}>
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
          <Collapsible
            open={openSections.includes(category)}
            onOpenChange={() => toggleSection(category)}
          >
<<<<<<< HEAD
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-muted-foreground">{title}</span>
                </div>
                <ChevronDown 
                  className={`h-4 w-4 text-muted-foreground transform transition-transform duration-200 ${
                    openSections.includes(category) ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className="p-4 pt-0">
                <div className="space-y-4">
                  {symptoms.map((symptom) => {
                    const symptomValue = watchSymptoms[symptom.id] || { 
                      present: false, 
                      severity: 0, 
                      notes: "",
                      frequency: "intermittent"
                    };
                    return (
                      <div key={symptom.id} className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={symptom.id}
                            checked={symptomValue.present === true}
                            onCheckedChange={(checked) => {
                              handleSymptomChange(symptom.id, checked === true);
                            }}
                          />
                          <Label htmlFor={symptom.id} className="text-sm">{symptom.label}</Label>
                        </div>
                        
                        {symptomValue.present && (
                          <div className="ml-6 space-y-3">
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">
                                Severity: {symptomValue.severity || 0}
                              </Label>
                              <Slider
                                min={0}
                                max={10}
                                step={1}
                                value={[symptomValue.severity || 0]}
                                onValueChange={(value) => handleSeverityChange(symptom.id, value)}
                              />
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Minimal Impact</span>
                                <span>Severe Impact</span>
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Impact on Function</Label>
                              <Textarea
                                placeholder="Describe frequency, triggers, and impact on activities of daily living..."
                                className="text-sm resize-none"
                                value={symptomValue.notes || ""}
                                onChange={(e) => handleNotesChange(symptom.id, e.target.value)}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-1 pt-4 border-t mt-4">
                  <Label className="text-xs text-muted-foreground">Impairment Summary</Label>
                  <Textarea
                    placeholder={`Document overall functional impact and impairment related to ${title.toLowerCase()}...`}
                    className="text-sm resize-none"
                    value={watchSymptoms[`${category}_observations`] || ""}
                    onChange={(e) => setValue(
                      `symptoms.cognitive.${category}_observations`,
                      e.target.value,
                      { shouldDirty: true }
                    )}
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      ))}
      
      <div className="border rounded-md p-4 space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <FaRobot className="h-4 w-4 text-blue-600" />
          <span className="text-sm text-muted-foreground">Overall Cognitive Impairment Summary</span>
        </div>
        <Textarea
          placeholder="Document overall cognitive impairment level and impact on function..."
          className="text-sm resize-none"
          value={watchSymptoms.clinical_impression || ""}
          onChange={(e) => setValue(
            'symptoms.cognitive.clinical_impression',
            e.target.value,
            { shouldDirty: true }
          )}
        />
      </div>
    </div>
  );
};

export default CognitiveSymptoms;
=======
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
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
