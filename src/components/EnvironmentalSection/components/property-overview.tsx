import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { environmentalConfigs } from '../environmental-config';

export function PropertyOverview() {
  const { register, watch } = useFormContext();
  const prefix = 'environmental.propertyOverview';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Property Type</Label>
            <Select 
              defaultValue={watch(`${prefix}.type`)} 
              onValueChange={(value) => register(`${prefix}.type`).onChange({ target: { value } })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                {environmentalConfigs.propertyTypes.map((type) => (
                  <SelectItem key={type} value={type.toLowerCase()}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Layout</Label>
            <Input {...register(`${prefix}.layout`)} placeholder="e.g., Two story, Split level" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Exterior Access</Label>
          <div className="grid grid-cols-2 gap-4">
            <Input 
              {...register(`${prefix}.access.exterior.entranceType`)}
              placeholder="Entrance type"
            />
            <Input 
              type="number"
              {...register(`${prefix}.access.exterior.numberOfSteps`)}
              placeholder="Number of steps"
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register(`${prefix}.access.exterior.hasRailing`)}
                className="h-4 w-4"
              />
              <Label>Has Railing</Label>
            </div>
          </div>
          <Textarea 
            {...register(`${prefix}.access.exterior.notes`)}
            placeholder="Notes about exterior access"
          />
        </div>

        <div className="space-y-2">
          <Label>Interior Access</Label>
          <div className="grid grid-cols-2 gap-4">
            <Input 
              {...register(`${prefix}.access.interior.entranceType`)}
              placeholder="Interior entrance type"
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register(`${prefix}.access.interior.hasStairs`)}
                className="h-4 w-4"
              />
              <Label>Has Stairs</Label>
            </div>
            <Input 
              type="number"
              {...register(`${prefix}.access.interior.numberOfStairs`)}
              placeholder="Number of stairs"
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register(`${prefix}.access.interior.hasRailing`)}
                className="h-4 w-4"
              />
              <Label>Has Railing</Label>
            </div>
          </div>
          <Textarea 
            {...register(`${prefix}.access.interior.notes`)}
            placeholder="Notes about interior access"
          />
        </div>

        <div className="space-y-2">
          <Label>General Condition</Label>
          <Input {...register(`${prefix}.generalCondition`)} placeholder="Overall property condition" />
        </div>

        <div className="space-y-2">
          <Label>Primary Concerns</Label>
          <Textarea 
            {...register(`${prefix}.primaryConcerns`)}
            placeholder="List major concerns about the property"
          />
        </div>
      </CardContent>
    </Card>
  );
}