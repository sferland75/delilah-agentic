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
  FaAngleDown,
  FaLightbulb,
  FaClock,
  FaListUl,
  FaBolt,
  FaComments,
  FaRegCommentDots,
  FaHistory,
  FaCogs,
  FaRegClock,
  FaRocket,
  FaUserCog,
  FaBullseye,
  FaMemory,
  FaTasks
} from 'react-icons/fa';

const cognitiveSymptoms = {
  attention_concentration: {
    title: "Attention and Concentration",
    icon: FaBullseye,
    symptoms: [/* ... symptoms remain the same ... */]
  },
  memory: {
    title: "Memory Function",
    icon: FaMemory,
    symptoms: [/* ... symptoms remain the same ... */]
  },
  processing_speed: {
    title: "Processing Speed",
    icon: FaRegClock,
    symptoms: [/* ... symptoms remain the same ... */]
  },
  executive_function: {
    title: "Executive Function",
    icon: FaCogs,
    symptoms: [/* ... symptoms remain the same ... */]
  },
  post_concussive: {
    title: "Post-Concussive Symptoms",
    icon: FaBrain,
    symptoms: [/* ... symptoms remain the same ... */]
  },
  language_communication: {
    title: "Language and Communication",
    icon: FaComments,
    symptoms: [/* ... symptoms remain the same ... */]
  }
};

const CognitiveSymptoms = () => {
  const { setValue, watch } = useFormContext();
  const watchSymptoms = watch('symptoms.cognitive') || {};
  const [openSections, setOpenSections] = useState<string[]>([]);

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
      {Object.entries(cognitiveSymptoms).map(([category, { title, icon: Icon, symptoms }]) => (
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
          <div className="flex items-center gap-2">
            <FaBrain className="h-5 w-5 text-blue-600" />
            <CardTitle>Overall Cognitive Impairment Summary</CardTitle>
          </div>
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