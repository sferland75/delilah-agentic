import React from 'react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';
import { headSymptoms } from './headSegments';

interface HeadPainAssessmentProps {
  region: any;
  onSave: (data: any) => void;
  initialData?: any;
}

export const HeadPainAssessment: React.FC<HeadPainAssessmentProps> = ({
  region,
  onSave,
  initialData
}) => {
  // Initialize state with initialData
  const [severity, setSeverity] = React.useState(initialData?.severity ?? 0);
  const [selectedSymptoms, setSelectedSymptoms] = React.useState<string[]>(initialData?.symptoms ?? []);
  const [pattern, setPattern] = React.useState(initialData?.pattern ?? '');
  const [impact, setImpact] = React.useState(initialData?.impact ?? '');
  const [notes, setNotes] = React.useState(initialData?.notes ?? '');

  // Update state when initialData changes
  React.useEffect(() => {
    console.log('Initial data received:', initialData);
    setSeverity(initialData?.severity ?? 0);
    setSelectedSymptoms(initialData?.symptoms ?? []);
    setPattern(initialData?.pattern ?? '');
    setImpact(initialData?.impact ?? '');
    setNotes(initialData?.notes ?? '');
  }, [initialData]);

  const symptomCategories = {
    'Headache Characteristics': headSymptoms.headache,
    'Visual Symptoms': headSymptoms.visual,
    'TMJ/Facial': headSymptoms.tmj,
    'Vestibular': headSymptoms.vestibular,
    'Sensory': headSymptoms.sensory
  };

  const handleSymptomToggle = (symptom: string, checked: boolean) => {
    setSelectedSymptoms(prev => {
      if (checked) {
        return [...prev, symptom];
      } else {
        return prev.filter(s => s !== symptom);
      }
    });
  };

  const handleSave = () => {
    const data = {
      severity,
      symptoms: selectedSymptoms,
      pattern,
      impact,
      notes,
      timestamp: new Date().toISOString()
    };
    console.log('Saving pain assessment data:', data);
    onSave(data);
  };

  return (
    <div className="space-y-6">
      {/* Pain Severity */}
      <div className="space-y-2">
        <Label>Pain Severity</Label>
        <Slider
          min={0}
          max={10}
          step={1}
          value={[severity]}
          onValueChange={(value) => setSeverity(value[0])}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>No Pain (0)</span>
          <span>Worst Pain (10)</span>
        </div>
      </div>

      {/* Symptoms by Category */}
      <div className="space-y-4">
        <Label>Associated Symptoms</Label>
        {Object.entries(symptomCategories).map(([category, symptoms]) => (
          <div key={category} className="space-y-2">
            <h4 className="font-medium text-sm">{category}</h4>
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

      {/* Pattern and Frequency */}
      <div className="space-y-2">
        <Label>Pattern and Frequency</Label>
        <Textarea
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder="Describe the pattern (constant, intermittent, etc.) and frequency of symptoms..."
        />
      </div>

      {/* Functional Impact */}
      <div className="space-y-2">
        <Label>Impact on Function</Label>
        <Textarea
          value={impact}
          onChange={(e) => setImpact(e.target.value)}
          placeholder="Describe how these symptoms affect daily activities, work, sleep..."
        />
      </div>

      {/* Additional Notes */}
      <div className="space-y-2">
        <Label>Clinical Notes</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional clinical observations..."
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