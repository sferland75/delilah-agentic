import React, { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Heart } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import useADLForm from '../../../hooks/useADLForm';

const activities = [
  'appointments',
  'exerciseRoutine',
  'painManagement',
  'symptomMonitoring'
];

const HealthField = memo(({ activity }: { activity: string }) => {
  const { control } = useFormContext();
  
  return (
    <div className="space-y-4 border rounded-lg p-4">
      <h4 className="font-medium text-lg capitalize">
        {activity.replace(/([A-Z])/g, ' $1').trim()}
      </h4>
      
      <FormField
        control={control}
        name={`adl.healthManagement.${activity}.independence`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Independence Level</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`adl.healthManagement.${activity}.assistance`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Assistance Required</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`adl.healthManagement.${activity}.notes`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Notes</FormLabel>
            <FormControl>
              <Textarea {...field} className="min-h-[100px]" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
});

HealthField.displayName = 'HealthField';

const HealthManagement: React.FC = () => {
  const { data } = useADLForm();

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="h-5 w-5 text-blue-600" />
          <h3 className="text-xl font-semibold">Health Management</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activities.map(activity => (
            <HealthField key={activity} activity={activity} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(HealthManagement);