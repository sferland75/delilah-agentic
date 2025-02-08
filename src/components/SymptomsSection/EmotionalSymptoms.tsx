import React, { useState } from 'react';
import { useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  FaExclamationTriangle,
  FaBolt,
  FaRegFrownOpen,
  FaExchangeAlt,
  FaUsers,
  FaUserCircle,
  FaHeartBroken,
} from 'react-icons/fa';

const EmotionalSymptoms = () => {
  const { setValue, watch } = useFormContext();
  const watchSymptoms = watch('symptoms.emotional') || {};
  const [openSections, setOpenSections] = useState<string[]>([]);

  const EMOTIONAL_SYMPTOMS = {
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
      symptoms: [
        { id: "general_anxiety", label: "Generalized anxiety/worry" },
        { id: "panic_symptoms", label: "Panic symptoms" },
        { id: "social_anxiety", label: "Social anxiety/withdrawal" },
        { id: "health_anxiety", label: "Health-related anxiety" }
      ]
    },
    depression: {
      title: "Depression and Mood",
      icon: FaRegFrownOpen,
      symptoms: [
        { id: "low_mood", label: "Persistent low mood" },
        { id: "anhedonia", label: "Loss of interest/pleasure" },
        { id: "fatigue", label: "Mental/physical fatigue" },
        { id: "sleep_changes", label: "Sleep disturbances" }
      ]
    },
    behavioral_changes: {
      title: "Behavioral Changes",
      icon: FaExchangeAlt,
      symptoms: [
        { id: "irritability", label: "Increased irritability" },
        { id: "restlessness", label: "Restlessness/agitation" },
        { id: "avoidance", label: "Avoidance behaviors" },
        { id: "motivation", label: "Decreased motivation" }
      ]
    },
    relationship_impact: {
      title: "Relationship and Social Impact",
      icon: FaUsers,
      symptoms: [
        { id: "social_withdrawal", label: "Social withdrawal" },
        { id: "relationship_strain", label: "Relationship strain" },
        { id: "communication", label: "Communication difficulties" },
        { id: "support_seeking", label: "Changes in support seeking" }
      ]
    },
    self_concept: {
      title: "Self-Concept and Identity",
      icon: FaUserCircle,
      symptoms: [
        { id: "self_image", label: "Changes in self-image" },
        { id: "confidence", label: "Decreased confidence" },
        { id: "independence", label: "Loss of independence" },
        { id: "future_outlook", label: "Changed future outlook" }
      ]
    }
  };

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
      frequency: watchSymptoms[symptomId]?.frequency || "intermittent",
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
    <div className="space-y-4">
      {Object.entries(EMOTIONAL_SYMPTOMS).map(([category, { title, icon: Icon, symptoms }]) => (
        <div key={category} className="border rounded-md overflow-hidden">
          <Collapsible
            open={openSections.includes(category)}
            onOpenChange={() => toggleSection(category)}
          >
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
                      `symptoms.emotional.${category}_observations`,
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
          <FaHeartBroken className="h-4 w-4 text-blue-600" />
          <span className="text-sm text-muted-foreground">Overall Psychological/Emotional Impairment Summary</span>
        </div>
        <Textarea
          placeholder="Document overall psychological/emotional impairment level and impact on function..."
          className="text-sm resize-none"
          value={watchSymptoms.clinical_impression || ""}
          onChange={(e) => setValue(
            'symptoms.emotional.clinical_impression',
            e.target.value,
            { shouldDirty: true }
          )}
        />
      </div>
    </div>
  );
};

export default EmotionalSymptoms;