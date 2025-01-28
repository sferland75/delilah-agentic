import React from 'react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
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

interface PainAssessmentProps {
  region: {
    id: string;
    label: string;
  };
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
  };

  return (
    <div className="space-y-6">
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
    </div>
  );
}