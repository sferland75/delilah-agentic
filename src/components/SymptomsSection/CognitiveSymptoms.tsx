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

const cognitiveSymptoms = {
  attention_concentration: {
    title: "Attention and Concentration",
    symptoms: [
      { id: "sustained_attention", label: "Difficulty maintaining attention on tasks" },
      { id: "divided_attention", label: "Problems multitasking/handling multiple inputs" },
      { id: "selective_attention", label: "Trouble filtering out distractions" },
      { id: "attention_fatigue", label: "Mental fatigue with sustained attention" },
      { id: "concentration", label: "Poor concentration during conversations" },
      { id: "task_completion", label: "Difficulty completing tasks" },
      { id: "distractibility", label: "Easily distracted by environment" },
      { id: "attention_fluctuation", label: "Fluctuating attention throughout day" }
    ]
  },
  memory: {
    title: "Memory Function",
    symptoms: [
      { id: "working_memory", label: "Poor working memory/holding information" },
      { id: "short_term", label: "Short-term memory difficulties" },
      { id: "episodic_memory", label: "Trouble remembering recent events" },
      { id: "prospective", label: "Forgetting appointments/planned tasks" },
      { id: "procedural", label: "Difficulty remembering learned procedures" },
      { id: "names_faces", label: "Problems remembering names/faces" },
      { id: "location_memory", label: "Getting lost/spatial memory issues" },
      { id: "memory_retrieval", label: "Slow or difficult memory retrieval" }
    ]
  },
  processing_speed: {
    title: "Processing Speed",
    symptoms: [
      { id: "mental_speed", label: "Slowed thinking/mental processing" },
      { id: "reaction_time", label: "Delayed reaction times" },
      { id: "decision_speed", label: "Slow decision making" },
      { id: "reading_speed", label: "Reduced reading speed/comprehension" },
      { id: "conversation_pace", label: "Trouble keeping up with conversations" },
      { id: "processing_overload", label: "Information processing overload" },
      { id: "mental_fatigue", label: "Mental fatigue with complex tasks" },
      { id: "processing_accuracy", label: "Errors in processing information" }
    ]
  },
  executive_function: {
    title: "Executive Function",
    symptoms: [
      { id: "planning", label: "Difficulty planning/organizing" },
      { id: "initiation", label: "Problems initiating tasks" },
      { id: "mental_flexibility", label: "Poor mental flexibility/adaptability" },
      { id: "problem_solving", label: "Impaired problem-solving ability" },
      { id: "sequencing", label: "Difficulty with step-by-step tasks" },
      { id: "organization", label: "Poor organizational skills" },
      { id: "time_management", label: "Time management difficulties" },
      { id: "decision_making", label: "Impaired decision-making ability" }
    ]
  },
  post_concussive: {
    title: "Post-Concussive Symptoms",
    symptoms: [
      { id: "cognitive_fatigue", label: "Mental fatigue/cognitive exhaustion" },
      { id: "mental_fog", label: "Brain fog/mental haziness" },
      { id: "sensory_overload", label: "Sensory processing overload" },
      { id: "light_sensitivity", label: "Cognitive impact of light sensitivity" },
      { id: "noise_sensitivity", label: "Cognitive impact of noise sensitivity" },
      { id: "visual_processing", label: "Visual processing difficulties" },
      { id: "concentration_headache", label: "Headaches with mental effort" },
      { id: "cognitive_stamina", label: "Reduced cognitive stamina" }
    ]
  },
  language_communication: {
    title: "Language and Communication",
    symptoms: [
      { id: "word_finding", label: "Word-finding difficulties" },
      { id: "verbal_fluency", label: "Reduced verbal fluency" },
      { id: "comprehension", label: "Difficulty understanding complex info" },
      { id: "expression", label: "Trouble expressing thoughts clearly" },
      { id: "conversation", label: "Difficulty following conversations" },
      { id: "reading", label: "Reading comprehension problems" },
      { id: "writing", label: "Written expression difficulties" },
      { id: "pragmatics", label: "Social communication problems" }
    ]
  }
};

const CognitiveSymptoms = () => {
  const { setValue, watch } = useFormContext();
  const watchSymptoms = watch('symptoms.cognitive') || {};
  const [openSections, setOpenSections] = React.useState<string[]>([]);

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleSymptomChange = (symptomId: string, checked: boolean) => {
    setValue(`symptoms.cognitive.${symptomId}`, {
      present: checked,
      severity: checked ? 5 : 0,
      notes: watchSymptoms[symptomId]?.notes || "",
      onset: watchSymptoms[symptomId]?.onset || "post_accident",
      frequency: watchSymptoms[symptomId]?.frequency || "intermittent",
      impact: watchSymptoms[symptomId]?.impact || ""
    }, { 
      shouldDirty: true,
      shouldValidate: true
    });
  };

  const handleSeverityChange = (symptomId: string, value: number[]) => {
    setValue(`symptoms.cognitive.${symptomId}.severity`, value[0], { 
      shouldDirty: true 
    });
  };

  const handleNotesChange = (symptomId: string, notes: string) => {
    setValue(`symptoms.cognitive.${symptomId}.notes`, notes, {
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
                      const symptomValue = watchSymptoms[symptom.id] || { 
                        present: false, 
                        severity: 0, 
                        notes: "",
                        onset: "post_accident",
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
                            <Label htmlFor={symptom.id}>{symptom.label}</Label>
                          </div>
                          
                          {symptomValue.present && (
                            <div className="ml-6 space-y-4">
                              <div className="space-y-2">
                                <Label className="text-sm">
                                  Severity: {symptomValue.severity || 0}
                                </Label>
                                <Slider
                                  min={0}
                                  max={10}
                                  step={1}
                                  value={[symptomValue.severity || 0]}
                                  onValueChange={(value) => handleSeverityChange(symptom.id, value)}
                                />
                                <div className="flex justify-between text-xs text-gray-500">
                                  <span>Minimal Impact</span>
                                  <span>Severe Impact</span>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-sm">Functional Impact</Label>
                                <Textarea
                                  placeholder="Document impact on daily activities, work function, and independence..."
                                  className="h-20"
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

                  <div className="space-y-2 pt-4 border-t">
                    <Label>Impairment Summary</Label>
                    <Textarea
                      placeholder={`Document overall functional impact and level of impairment related to ${title.toLowerCase()}...`}
                      className="h-24"
                      value={watchSymptoms[`${category}_observations`] || ""}
                      onChange={(e) => setValue(
                        `symptoms.cognitive.${category}_observations`,
                        e.target.value,
                        { shouldDirty: true }
                      )}
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
          <CardTitle>Overall Cognitive Impairment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Clinical Assessment & Functional Impact</Label>
            <Textarea
              placeholder="Document overall cognitive impairment level and impact on function, including effects on work, daily activities, and independence..."
              className="min-h-[100px]"
              value={watchSymptoms.clinical_impression || ""}
              onChange={(e) => setValue(
                'symptoms.cognitive.clinical_impression',
                e.target.value,
                { shouldDirty: true }
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CognitiveSymptoms;