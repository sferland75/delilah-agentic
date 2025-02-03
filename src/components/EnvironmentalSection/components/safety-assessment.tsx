import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckboxGroup } from '@/components/ui/checkbox-group';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash } from 'lucide-react';

const commonHazards = [
  'Poor Lighting',
  'Uneven Flooring',
  'Loose Carpets/Rugs',
  'Steep Stairs',
  'Lack of Handrails',
  'Cluttered Pathways',
  'Electrical Hazards',
  'High Cabinets/Shelves',
  'Sharp Edges',
  'Slippery Surfaces',
  'Poor Ventilation',
  'Trip Hazards'
];

export function SafetyAssessment() {
  const { register, setValue, watch } = useFormContext();
  const safetyData = watch('environmental.safety');
  const selectedHazards = safetyData?.hazards || [];

  const handleHazardChange = (value: string[]) => {
    setValue('environmental.safety.hazards', value);
  };

  const handleOtherHazardAdd = () => {
    const currentHazards = [...selectedHazards];
    currentHazards.push('');
    setValue('environmental.safety.hazards', currentHazards);
  };

  const handleOtherHazardRemove = (index: number) => {
    const currentHazards = [...selectedHazards];
    currentHazards.splice(index, 1);
    setValue('environmental.safety.hazards', currentHazards);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-6">Safety Assessment</h3>

      <div className="space-y-6">
        <div className="space-y-4">
          <Label className="text-base">Common Hazards</Label>
          <CheckboxGroup 
            items={commonHazards.map(hazard => ({
              label: hazard,
              value: hazard
            }))}
            values={selectedHazards.filter(h => commonHazards.includes(h))}
            onChange={handleHazardChange}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base">Additional Hazards</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleOtherHazardAdd}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Add Hazard
            </Button>
          </div>

          {selectedHazards
            .filter(h => !commonHazards.includes(h))
            .map((hazard, index) => (
              <div key={index} className="flex gap-2">
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={hazard}
                  onChange={(e) => {
                    const currentHazards = [...selectedHazards];
                    const nonCommonIndex = selectedHazards
                      .filter(h => !commonHazards.includes(h))
                      .indexOf(hazard);
                    const actualIndex = selectedHazards.indexOf(hazard);
                    currentHazards[actualIndex] = e.target.value;
                    setValue('environmental.safety.hazards', currentHazards);
                  }}
                  placeholder="Describe the hazard"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleOtherHazardRemove(index)}
                >
                  <Trash className="h-4 w-4 text-destructive" />
                </Button>
              </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Additional Safety Concerns</Label>
            <Textarea
              {...register('environmental.safety.concerns')}
              placeholder="Describe any additional safety concerns..."
              className="h-32"
            />
          </div>

          <div className="space-y-2">
            <Label>Safety Recommendations</Label>
            <Textarea
              {...register('environmental.safety.recommendations')}
              placeholder="List recommended safety modifications and interventions..."
              className="h-32"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}