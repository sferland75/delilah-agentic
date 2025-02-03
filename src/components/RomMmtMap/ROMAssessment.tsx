import React from 'react';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ROM_SCORES = [
  { value: 'WFL', label: 'Within Functional Limits' },
  { value: '3/4', label: '75% of normal' },
  { value: '1/2', label: '50% of normal' },
  { value: '1/4', label: '25% of normal' },
  { value: 'nominal', label: 'Nominal/Trace' },
] as const;

interface ROMAssessmentProps {
  joint: {
    id: string;
    label: string;
    movements: string[];
  };
  onSave: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export function ROMAssessment({ joint, onSave, onCancel, initialData }: ROMAssessmentProps) {
  const [selectedMovement, setSelectedMovement] = React.useState(initialData?.movement || (joint.movements?.[0] || ''));
  const [score, setScore] = React.useState(initialData?.score || 'WFL');
  const [notes, setNotes] = React.useState(initialData?.notes || '');

  console.log('ROM Assessment initialized with:', { joint, initialData, selectedMovement });

  const handleSave = () => {
    onSave({
      joint: joint.id,
      movement: selectedMovement,
      score,
      notes,
      label: `${joint.label} ${selectedMovement}`
    });
  };

  return (
    <div className="space-y-6">
      {/* Movement Selection */}
      {joint.movements && joint.movements.length > 0 && (
        <div className="space-y-2">
          <Label>Movement</Label>
          <Select
            value={selectedMovement}
            onValueChange={setSelectedMovement}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select movement" />
            </SelectTrigger>
            <SelectContent>
              {joint.movements.map((movement) => (
                <SelectItem key={movement} value={movement}>
                  {movement}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* ROM Score */}
      <div>
        <h4 className="text-sm font-medium mb-3">ROM Score</h4>
        <RadioGroup
          value={score}
          onValueChange={setScore}
          className="grid grid-cols-1 gap-2"
        >
          {ROM_SCORES.map(({ value, label }) => (
            <div key={value} className="flex items-center space-x-2">
              <RadioGroupItem value={value} id={value} />
              <Label htmlFor={value}>{label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Notes */}
      <div>
        <h4 className="text-sm font-medium mb-3">Notes</h4>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter any observations or notes..."
          className="min-h-[100px]"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSave}>Save Assessment</Button>
      </div>
    </div>
  );
}