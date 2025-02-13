import React from 'react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
<<<<<<< HEAD
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';
import { getQualifiersForRegion } from './pain-qualifiers';
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
=======
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

// Pain qualifiers organized by categories
const painQualifiers = {
  sensory: [
    { id: "sharp", label: "Sharp" },
    { id: "dull", label: "Dull" },
    { id: "aching", label: "Aching" },
    { id: "throbbing", label: "Throbbing" },
    { id: "stabbing", label: "Stabbing" },
    { id: "burning", label: "Burning" },
    { id: "tingling", label: "Tingling" },
    { id: "numbness", label: "Numbness" }
  ],
  temporal: [
    { id: "constant", label: "Constant" },
    { id: "intermittent", label: "Intermittent" },
    { id: "rhythmic", label: "Rhythmic" },
    { id: "brief", label: "Brief" },
    { id: "momentary", label: "Momentary" }
  ],
  aggravating: [
    { id: "movement", label: "Movement Dependent" },
    { id: "pressure", label: "Pressure Dependent" },
    { id: "position", label: "Position Dependent" },
    { id: "activity", label: "Activity Dependent" },
    { id: "time_of_day", label: "Time of Day Dependent" }
  ],
  impact: [
    { id: "limits_rom", label: "Limits Range of Motion" },
    { id: "limits_strength", label: "Limits Strength" },
    { id: "limits_function", label: "Limits Function" },
    { id: "limits_sleep", label: "Affects Sleep" },
    { id: "limits_daily", label: "Affects Daily Activities" }
  ]
};
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801

interface PainAssessmentProps {
  region: {
    id: string;
    label: string;
  };
<<<<<<< HEAD
  initialData?: any;
  onSave: (data: any) => void;
}

export function PainAssessment({ region, initialData, onSave }: PainAssessmentProps) {
  // Initialize state with initialData if available
  const [painLevel, setPainLevel] = React.useState(initialData?.severity || 0);
  const [notes, setNotes] = React.useState(initialData?.notes || '');
  const [selectedQualifiers, setSelectedQualifiers] = React.useState<string[]>(
    initialData?.symptoms || []
  );

  const qualifiers = getQualifiersForRegion(region.id);

  const handleQualifierToggle = (qualifier: string) => {
    setSelectedQualifiers(prev => 
      prev.includes(qualifier)
        ? prev.filter(q => q !== qualifier)
        : [...prev, qualifier]
    );
  };

  const handleSave = () => {
    // Ensure all data is included in the save
    console.log('Saving data for region:', region.id);
    const saveData = {
      severity: painLevel,
      symptoms: selectedQualifiers,
      notes: notes,
      timestamp: new Date().toISOString()
    };
    console.log('Save data:', saveData);
    onSave(saveData);
=======
  onSave: (data: any) => void;
  initialData?: any;
}

export function PainAssessment({ region, onSave, initialData }: PainAssessmentProps) {
  const [painLevel, setPainLevel] = React.useState(initialData?.painLevel || 0);
  const [selectedQualifiers, setSelectedQualifiers] = React.useState<string[]>(
    initialData?.qualifiers || []
  );
  const [notes, setNotes] = React.useState(initialData?.notes || '');

  const handleQualifierChange = (qualifier: string) => {
    setSelectedQualifiers(prev => {
      if (prev.includes(qualifier)) {
        return prev.filter(q => q !== qualifier);
      } else {
        return [...prev, qualifier];
      }
    });
  };

  const handleSave = () => {
    onSave({
      region: region.id,
      painLevel,
      qualifiers: selectedQualifiers,
      notes
    });
  };

  // Get pain level description
  const getPainDescription = (level: number) => {
    if (level === 0) return "No Pain";
    if (level <= 3) return "Mild";
    if (level <= 6) return "Moderate";
    if (level <= 8) return "Severe";
    return "Extreme";
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
  };

  return (
    <div className="space-y-6">
<<<<<<< HEAD
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Pain Level: {painLevel}
            </Label>
            <Slider
              min={0}
              max={10}
              step={1}
              value={[painLevel]}
              onValueChange={values => setPainLevel(values[0])}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>No Pain</span>
              <span>Worst Pain</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Pain Qualifiers</Label>
            <div className="flex flex-wrap gap-2">
              {qualifiers.map((qualifier) => (
                <Badge
                  key={qualifier}
                  variant={selectedQualifiers.includes(qualifier) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/90"
                  onClick={() => handleQualifierToggle(qualifier)}
                >
                  {qualifier}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Additional Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe onset, timing, aggravating/alleviating factors..."
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={handleSave}
        className="w-full"
        type="button"
      >
        <Check className="w-4 h-4 mr-2" />
        Save Assessment
      </Button>
=======
      {/* Pain Scale */}
      <div className="space-y-4">
        <Label>
          Pain Level: {painLevel} - {getPainDescription(painLevel)}
        </Label>
        <Slider
          min={0}
          max={10}
          step={1}
          value={[painLevel]}
          onValueChange={(value) => setPainLevel(value[0])}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>No Pain (0)</span>
          <span>Worst Possible (10)</span>
        </div>
      </div>

      {/* Pain Qualifiers */}
      <div className="space-y-4">
        {Object.entries(painQualifiers).map(([category, qualifiers]) => (
          <Card key={category}>
            <CardContent className="pt-4">
              <Label className="capitalize mb-2 block font-bold">
                {category.replace('_', ' ')} Characteristics
              </Label>
              <div className="grid grid-cols-2 gap-4">
                {qualifiers.map((qualifier) => (
                  <div key={qualifier.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={qualifier.id}
                      checked={selectedQualifiers.includes(qualifier.id)}
                      onCheckedChange={() => handleQualifierChange(qualifier.id)}
                    />
                    <Label htmlFor={qualifier.id}>{qualifier.label}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          placeholder="Enter any additional details about the pain..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[100px]"
        />
      </div>
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
    </div>
  );
}