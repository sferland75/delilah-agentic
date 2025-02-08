import React, { useState } from 'react';
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

import {
  FaBrain,
  FaExclamationTriangle,
  FaRegFrownOpen,
  FaBolt,
  FaUsers,
  FaUserCircle,
  FaHeartBroken,
  FaAngleDown,
  FaCommentDots,
  FaComments,
  FaHeadSideBrain,
  FaThinkPeaks,
  FaHandSparkles,
  FaUserFriends,
  FaUserCheck
} from 'react-icons/fa';

import {
  FiHeart,
  FiActivity
} from 'react-icons/fi';

const emotionalSymptoms = {
  post_traumatic: {
    title: "Post-Traumatic Stress Symptoms",
    icon: FaExclamationTriangle,
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
    icon: FaBolt,
    symptoms: [/* ... symptoms remain the same ... */]
  },
  depression: {
    title: "Depression and Mood",
    icon: FaRegFrownOpen,
    symptoms: [/* ... symptoms remain the same ... */]
  },
  behavioral_changes: {
    title: "Behavioral Changes",
    icon: FiActivity,
    symptoms: [/* ... symptoms remain the same ... */]
  },
  relationship_impact: {
    title: "Relationship and Social Impact",
    icon: FaUsers,
    symptoms: [/* ... symptoms remain the same ... */]
  },
  self_concept: {
    title: "Self-Concept and Identity",
    icon: FaUserCircle,
    symptoms: [/* ... symptoms remain the same ... */]
  }
};

const EmotionalSymptoms = () => {
  const { setValue, watch } = useFormContext();
  const watchSymptoms = watch('symptoms.emotional') || {};
  const [openSections, setOpenSections] = useState<string[]>([]);

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
      {Object.entries(emotionalSymptoms).map(([category, { title, icon: Icon, symptoms }]) => (
        <Card key={category}>
          <Collapsible
            open={openSections.includes(category)}
            onOpenChange={() => toggleSection(category)}
          >
            <CollapsibleTrigger className="w-full">
              <CardHeader className="hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-blue-600" />
                    <CardTitle>{title}</CardTitle>
                  </div>
                  <FaAngleDown 
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
          <div className="flex items-center gap-2">
            <FiHeart className="h-5 w-5 text-blue-600" />
            <CardTitle>Overall Psychological/Emotional Impairment Summary</CardTitle>
          </div>
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