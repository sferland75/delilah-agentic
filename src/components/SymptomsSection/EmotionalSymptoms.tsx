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

const emotionalSymptoms = {
  post_traumatic: {
    title: "Post-Traumatic Stress Symptoms",
    symptoms: [
      { id: "flashbacks", label: "Flashbacks/Intrusive memories of accident" },
      { id: "driving_avoidance", label: "Avoidance of driving/being in vehicles" },
      { id: "traffic_anxiety", label: "Anxiety in traffic situations" },
      { id: "startle_response", label: "Heightened startle response (esp. to traffic sounds)" },
      { id: "accident_nightmares", label: "Nightmares/night terrors about accident" },
      { id: "hyper_vigilance", label: "Hypervigilance while in vehicles/traffic" },
      { id: "dissociation", label: "Dissociative episodes/feeling detached" },
      { id: "panic_attacks", label: "Panic attacks related to travel/vehicles" }
    ]
  },
  anxiety: {
    title: "Anxiety and Stress",
    symptoms: [
      { id: "generalized_anxiety", label: "Generalized anxiety/constant worry" },
      { id: "health_anxiety", label: "Anxiety about injuries/recovery" },
      { id: "anticipatory_anxiety", label: "Anticipatory anxiety about appointments/travel" },
      { id: "social_anxiety", label: "Social anxiety/withdrawal" },
      { id: "agoraphobia", label: "Fear of leaving home/safe spaces" },
      { id: "catastrophic_thinking", label: "Catastrophic thinking about future" },
      { id: "medical_anxiety", label: "Anxiety about medical procedures" },
      { id: "control_loss", label: "Anxiety about loss of control" }
    ]
  },
  depression: {
    title: "Depression and Mood",
    symptoms: [
      { id: "depressed_mood", label: "Persistent low/depressed mood" },
      { id: "anhedonia", label: "Loss of interest/pleasure in activities" },
      { id: "hopelessness", label: "Feelings of hopelessness about recovery" },
      { id: "worthlessness", label: "Feelings of worthlessness/low self-worth" },
      { id: "grief", label: "Grief over life changes/losses" },
      { id: "sleep_changes", label: "Sleep disturbances/changes" },
      { id: "appetite_changes", label: "Changes in appetite/eating patterns" },
      { id: "suicidal_thoughts", label: "Thoughts of death/suicide" }
    ]
  },
  behavioral_changes: {
    title: "Behavioral Changes",
    symptoms: [
      { id: "irritability", label: "Increased irritability/short temper" },
      { id: "impulsivity", label: "Impulsive behavior/poor control" },
      { id: "agitation", label: "Restlessness/agitation" },
      { id: "emotional_lability", label: "Emotional lability/mood swings" },
      { id: "aggression", label: "Increased aggression/hostility" },
      { id: "apathy", label: "Apathy/loss of motivation" },
      { id: "disinhibition", label: "Social disinhibition" },
      { id: "personality_changes", label: "Personality changes noted by others" }
    ]
  },
  relationship_impact: {
    title: "Relationship and Social Impact",
    symptoms: [
      { id: "isolation", label: "Social isolation/withdrawal" },
      { id: "dependency", label: "Increased dependency on others" },
      { id: "relationship_strain", label: "Strain on relationships/marriage" },
      { id: "communication", label: "Difficulty communicating needs" },
      { id: "role_changes", label: "Distress over role changes in family" },
      { id: "intimacy", label: "Changes in intimate relationships" },
      { id: "social_support", label: "Difficulty accepting help/support" },
      { id: "work_relationships", label: "Impact on work relationships" }
    ]
  },
  self_concept: {
    title: "Self-Concept and Identity",
    symptoms: [
      { id: "identity_changes", label: "Changes in sense of self/identity" },
      { id: "body_image", label: "Negative changes in body image" },
      { id: "self_esteem", label: "Decreased self-esteem" },
      { id: "guilt", label: "Guilt/self-blame about accident" },
      { id: "confidence", label: "Loss of confidence in abilities" },
      { id: "future_plans", label: "Uncertainty about future plans" },
      { id: "independence", label: "Loss of independence impact" },
      { id: "disability_adjustment", label: "Difficulty adjusting to disability" }
    ]
  }
};

const EmotionalSymptoms = () => {
  const { setValue, watch } = useFormContext();
  const watchSymptoms = watch('symptoms.emotional') || {};
  const [openSections, setOpenSections] = React.useState<string[]>([]);

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleSymptomChange = (symptomId: string, checked: boolean) => {
    setValue(`symptoms.emotional.${symptomId}`, {
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
    setValue(`symptoms.emotional.${symptomId}.severity`, value[0], { 
      shouldDirty: true 
    });
  };

  const handleNotesChange = (symptomId: string, notes: string) => {
    setValue(`symptoms.emotional.${symptomId}.notes`, notes, {
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
                                <Label className="text-sm">Impact on Function</Label>
                                <Textarea
                                  placeholder="Describe frequency, triggers, and impact on activities of daily living..."
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
                      placeholder={`Document overall functional impact and impairment related to ${title.toLowerCase()}...`}
                      className="h-24"
                      value={watchSymptoms[`${category}_observations`] || ""}
                      onChange={(e) => setValue(
                        `symptoms.emotional.${category}_observations`,
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
          <CardTitle>Overall Psychological/Emotional Impairment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Clinical Assessment & Functional Impact</Label>
            <Textarea
              placeholder="Document overall psychological/emotional impairment level and impact on function..."
              className="min-h-[100px]"
              value={watchSymptoms.clinical_impression || ""}
              onChange={(e) => setValue(
                'symptoms.emotional.clinical_impression',
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

export default EmotionalSymptoms;