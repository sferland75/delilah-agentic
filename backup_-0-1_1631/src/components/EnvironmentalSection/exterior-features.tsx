import { useFormContext } from 'react-hook-form';
import { Card, CardContent } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from 'lucide-react';
import { nanoid } from 'nanoid';
import { environmentalConfigs } from './config';
import { 
  type AssessmentFormData, 
  type ExteriorFeature,
  AssessmentLevels,
  AccessibilityLevels
} from '@/lib/validation/assessment-schema';

interface FeatureComponentProps {
  index: number;
  featureId: string;
  onRemove: (id: string) => void;
}

const defaultAccessibilityLevel = AccessibilityLevels.Fully_Accessible;
const defaultSafetyLevel = AssessmentLevels.No_Concerns;

const FeatureComponent = ({ index, featureId, onRemove }: FeatureComponentProps) => {
  const { control } = useFormContext<AssessmentFormData>();
  
  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <FormField
          control={control}
          name={`environmental.exterior.${index}.type`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value || environmentalConfigs.exterior.components[0]}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select feature type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {environmentalConfigs.exterior.components.map((type) => (
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
          name={`environmental.exterior.${index}.accessibility`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Accessibility</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value || defaultAccessibilityLevel}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select accessibility level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(AccessibilityLevels).map((level) => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`environmental.exterior.${index}.safety`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Safety</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value || defaultSafetyLevel}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select safety level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(AssessmentLevels).map((level) => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`environmental.exterior.${index}.recommendations`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recommendations</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  value={field.value?.join('\n') || ''}
                  onChange={(e) => field.onChange(e.target.value.split('\n'))}
                  placeholder="Enter recommendations (one per line)" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`environmental.exterior.${index}.hazards`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hazards</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  value={field.value?.join('\n') || ''}
                  onChange={(e) => field.onChange(e.target.value.split('\n'))}
                  placeholder="Enter hazards (one per line)"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="button"
          variant="destructive" 
          onClick={() => onRemove(featureId)}
          className="w-full"
        >
          Remove Feature
        </Button>
      </CardContent>
    </Card>
  );
};

export function ExteriorFeatures() {
  const { watch, setValue } = useFormContext<AssessmentFormData>();
  const features = watch('environmental.exterior') || [];

  const addFeature = () => {
    const newFeature: ExteriorFeature = {
      id: nanoid(),
      name: '',
      type: environmentalConfigs.exterior.components[0],
      accessibility: defaultAccessibilityLevel,
      safety: defaultSafetyLevel,
      recommendations: [],
      hazards: []
    };

    setValue('environmental.exterior', [...features, newFeature], {
      shouldValidate: true
    });
  };

  const removeFeature = (featureId: string) => {
    setValue(
      'environmental.exterior', 
      features.filter(feature => feature.id !== featureId),
      { shouldValidate: true }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Exterior Features</h3>
        <Button onClick={addFeature} size="sm" type="button">
          <Plus className="w-4 h-4 mr-2" />
          Add Feature
        </Button>
      </div>

      {features.map((feature, index) => (
        <FeatureComponent
          key={feature.id}
          index={index}
          featureId={feature.id}
          onRemove={removeFeature}
        />
      ))}

      {features.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          No exterior features added. Click the button above to add one.
        </p>
      )}
    </div>
  );
}