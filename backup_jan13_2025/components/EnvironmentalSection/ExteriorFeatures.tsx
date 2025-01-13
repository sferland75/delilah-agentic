import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import { useFieldArray } from 'react-hook-form';
import { AccessibilityLevels } from '@/lib/validation/assessment-schema';

interface ExteriorFeaturesProps {
  control: Control<any>;
}

const EXTERIOR_FEATURES = [
  { id: 'driveway', label: 'Driveway' },
  { id: 'walkways', label: 'Walkways' },
  { id: 'steps', label: 'Exterior Steps' },
  { id: 'ramps', label: 'Ramps' },
  { id: 'railings', label: 'Handrails' },
  { id: 'lighting', label: 'Exterior Lighting' },
  { id: 'yard', label: 'Yard Access' }
];

export function ExteriorFeatures({ control }: ExteriorFeaturesProps) {
  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        {EXTERIOR_FEATURES.map((feature) => (
          <div key={feature.id} className="space-y-4">
            <h3 className="font-medium">{feature.label}</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name={`environmental.exterior.${feature.id}.accessibility`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Accessibility Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(AccessibilityLevels).map(([key, value]) => (
                          <SelectItem key={key} value={key}>{value}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`environmental.exterior.${feature.id}.condition`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter condition..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={control}
              name={`environmental.exterior.${feature.id}.notes`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Additional notes..."
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`environmental.exterior.${feature.id}.recommendations`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recommendations</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Recommended modifications or improvements..."
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}