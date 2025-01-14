import { useFormContext } from 'react-hook-form';
import { Card, CardContent } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from 'lucide-react';
import { nanoid } from 'nanoid';
import { environmentalConfigs } from './config';
import type { AssessmentForm } from '@/types/form';
import type { OutdoorSpaceConfig } from '@/types/environmental';

const createEmptySpace = (): OutdoorSpaceConfig => ({
  id: nanoid(),
  type: environmentalConfigs.outdoorSpaceTypes[0],
  accessibility: 'no_barriers',
  safety: 'no_concerns',
  modifications: []
});

interface SpaceComponentProps {
  index: number;
  onRemove: () => void;
}

const SpaceComponent = ({ index, onRemove }: SpaceComponentProps) => {
  const { control } = useFormContext<AssessmentForm>();
  const basePath = `environmentalAssessment.outdoor.${index}` as const;

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <FormField
          control={control}
          name={`${basePath}.type`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select space type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {environmentalConfigs.outdoorSpaceTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`${basePath}.accessibility`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Accessibility</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select accessibility level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {environmentalConfigs.accessibilityLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`${basePath}.safety`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Safety</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select safety level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {environmentalConfigs.safetyLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`${basePath}.modifications`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Required Modifications</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value?.join('\n') || ''}
                  onChange={(e) => field.onChange(e.target.value.split('\n').filter(Boolean))}
                  placeholder="Enter required modifications (one per line)"
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="button"
          variant="destructive"
          onClick={onRemove}
          className="w-full"
        >
          Remove Space
        </Button>
      </CardContent>
    </Card>
  );
};

export function OutdoorSpaces() {
  const { watch, setValue } = useFormContext<AssessmentForm>();
  const spaces = watch('environmentalAssessment.outdoor') || [];

  const addSpace = () => {
    setValue(
      'environmentalAssessment.outdoor',
      [...spaces, createEmptySpace()],
      { shouldValidate: true }
    );
  };

  const removeSpace = (index: number) => {
    setValue(
      'environmentalAssessment.outdoor',
      spaces.filter((_, i) => i !== index),
      { shouldValidate: true }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Outdoor Spaces</h3>
        <Button onClick={addSpace} size="sm" type="button">
          <Plus className="w-4 h-4 mr-2" />
          Add Space
        </Button>
      </div>

      {spaces.map((space, index) => (
        <SpaceComponent
          key={space.id || index}
          index={index}
          onRemove={() => removeSpace(index)}
        />
      ))}

      {spaces.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          No outdoor spaces added. Click the button above to add one.
        </p>
      )}
    </div>
  );
}