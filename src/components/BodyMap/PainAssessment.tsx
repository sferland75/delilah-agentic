import React from 'react';
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';
import { getQualifiersForRegion } from './pain-qualifiers';
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface PainAssessmentProps {
  region: {
    id: string;
    label: string;
  };
  initialData?: {
    painLevel: number;
    qualifiers: string[];
    notes: string;
  };
  onSave: (data: any) => void;
}

export function PainAssessment({ region, initialData, onSave }: PainAssessmentProps) {
  const { setValue } = useFormContext();
  const [painLevel, setPainLevel] = React.useState(initialData?.painLevel || 0);
  const [notes, setNotes] = React.useState(initialData?.notes || '');
  const [selectedQualifiers, setSelectedQualifiers] = React.useState<string[]>(initialData?.qualifiers || []);

  const qualifiers = getQualifiersForRegion(region.id);

  const handleQualifierToggle = (qualifier: string) => {
    setSelectedQualifiers(prev => 
      prev.includes(qualifier)
        ? prev.filter(q => q !== qualifier)
        : [...prev, qualifier]
    );
  };

  const handleSave = () => {
    const data = {
      region: region.id,
      painLevel,
      qualifiers: selectedQualifiers,
      notes
    };

    // Update the form context directly
    setValue(`symptoms.physical.regions.${region.id}`, {
      label: region.label,
      painLevel,
      qualifiers: selectedQualifiers,
      notes,
      timestamp: new Date().toISOString()
    }, { shouldDirty: true });

    // Call the original onSave for bodymap update
    onSave(data);
  };

  const getPainDescription = (level: number) => {
    if (level === 0) return "No Pain";
    if (level <= 3) return "Mild";
    if (level <= 6) return "Moderate";
    if (level <= 8) return "Severe";
    return "Very Severe";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">
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
      >
        <Check className="w-4 h-4 mr-2" />
        Save Assessment
      </Button>
    </div>
  );
}