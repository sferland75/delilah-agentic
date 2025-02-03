import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RoomsAssessment } from './rooms-assessment';

const propertyTypes = [
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'condo', label: 'Condominium' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'mobile', label: 'Mobile Home' },
  { value: 'other', label: 'Other' }
];

const propertyLevels = [
  { value: 'single', label: 'Single Level' },
  { value: 'split', label: 'Split Level' },
  { value: 'two', label: 'Two Story' },
  { value: 'three', label: 'Three or More Stories' }
];

export function PropertyOverview() {
  const { register, setValue, watch } = useFormContext();
  const propertyData = watch('environmental.propertyOverview');

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Property Overview</h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Property Type</Label>
              <Select 
                value={propertyData?.type}
                onValueChange={(value) => setValue('environmental.propertyOverview.type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Property Levels</Label>
              <Select 
                value={propertyData?.levels}
                onValueChange={(value) => setValue('environmental.propertyOverview.levels', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select number of levels" />
                </SelectTrigger>
                <SelectContent>
                  {propertyLevels.map(level => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Exterior Access</Label>
              <Input
                {...register('environmental.propertyOverview.exteriorAccess')}
                placeholder="Describe exterior access (steps, ramps, etc.)"
              />
            </div>

            <div className="space-y-2">
              <Label>Interior Access</Label>
              <Input
                {...register('environmental.propertyOverview.interiorAccess')}
                placeholder="Describe interior access and circulation"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>General Notes</Label>
            <Textarea
              {...register('environmental.propertyOverview.generalNotes')}
              placeholder="Additional notes about the property..."
              className="h-32"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <RoomsAssessment />
      </Card>
    </div>
  );
}