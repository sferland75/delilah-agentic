import React from 'react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';

const handSymptoms = {
  pain: [
    "Generalized hand pain",
    "Joint-specific pain",
    "Pain with gripping",
    "Pain with fine motor tasks",
    "Pain at rest"
  ],
  motor: [
    "Reduced grip strength",
    "Difficulty with fine motor tasks",
    "Problems with tool use",
    "Writing difficulties",
    "Buttoning/zipping issues",
    "Drop items frequently"
  ],
  sensory: [
    "Numbness",
    "Tingling",
    "Reduced sensation",
    "Temperature sensitivity",
    "Altered proprioception"
  ],
  movement: [
    "Stiffness",
    "Reduced range of motion",
    "Joint locking",
    "Weak pinch strength",
    "Limited finger extension"
  ],
  physical: [
    "Swelling",
    "Joint instability",
    "Muscle weakness",
    "Tremor",
    "Color changes"
  ]
};

interface HandPainAssessmentProps {
  region: any;
  onSave: (data: any) => void;
  initialData?: any;
}

export const HandPainAssessment: React.FC<HandPainAssessmentProps> = ({
  region,
  onSave,
  initialData
}) => {
  const [severity, setSeverity] = React.useState(initialData?.severity || 0);
  const [selectedSymptoms, setSelectedSymptoms] = React.useState<string[]>(initialData?.symptoms || []);
  const [impact, setImpact] = React.useState(initialData?.impact || '');
  const [notes, setNotes] = React.useState(initialData?.notes || '');

  const handleSymptomToggle = (symptom: string, checked: boolean) => {
    if (checked) {
      setSelectedSymptoms(prev => [...prev, symptom]);
    } else {
      setSelectedSymptoms(prev => prev.filter(s => s !== symptom));
    }
  };

  const handleSave = () => {
    const data = {
      severity,
      symptoms: selectedSymptoms,
      impact,
      notes,
      timestamp: new Date().toISOString()
    };
    onSave(data);
  };

  return (
    <div className="space-y-6">
      {/* Pain Severity */}
      <div className="space-y-2">
        <Label>Pain/Symptom Severity</Label>
        <Slider
          min={0}
          max={10}
          step={1}
          value={[severity]}
          onValueChange={(value) => setSeverity(value[0])}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>No Pain/Symptoms (0)</span>
          <span>Severe (10)</span>
        </div>
      </div>

      {/* Symptoms by Category */}
      <div className="space-y-4">
        <Label>Associated Symptoms</Label>
        {Object.entries(handSymptoms).map(([category, symptoms]) => (
          <div key={category} className="space-y-2">
            <h4 className="font-medium text-sm capitalize">{category} Symptoms</h4>
            <div className="grid grid-cols-2 gap-2">
              {symptoms.map((symptom) => (
                <div key={symptom} className="flex items-center space-x-2">
                  <Checkbox
                    id={symptom}
                    checked={selectedSymptoms.includes(symptom)}
                    onCheckedChange={(checked) => handleSymptomToggle(symptom, checked === true)}
                  />
                  <Label htmlFor={symptom} className="text-sm">{symptom}</Label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Functional Impact */}
      <div className="space-y-2">
        <Label>Impact on Function</Label>
        <Textarea
          value={impact}
          onChange={(e) => setImpact(e.target.value)}
          placeholder="Describe impact on activities like writing, typing, tool use, daily tasks..."
          className="min-h-[100px]"
        />
      </div>

      {/* Clinical Notes */}
      <div className="space-y-2">
        <Label>Clinical Notes</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional observations, patterns of symptoms, aggravating/alleviating factors..."
          className="min-h-[100px]"
        />
      </div>

      {/* Save Button */}
      <Button 
        onClick={handleSave}
        className="w-full"
      >
        <Check className="w-4 h-4 mr-2" />
        Save Assessment
      </Button>
    </div>
  );
};

export default HandPainAssessment;