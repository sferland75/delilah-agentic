import React, { memo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Activity } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import useADLForm from '../../../hooks/useADLForm';
import { debugLog } from '../../../utils/debug-utils';

const activityFields = {
  bathing: ['shower', 'grooming', 'oral_care', 'toileting'],
  dressing: ['upper_body', 'lower_body', 'footwear'],
  transfers: ['bed_transfer', 'toilet_transfer', 'shower_transfer', 'position_changes'],
  feeding: ['eating', 'setup'],
  toileting: ['independence', 'notes']
};

const ADLField = memo(({ activity }: { activity: string }) => {
  const { control } = useFormContext();
  const { data } = useADLForm();
  const activityData = data?.basic?.[activity] || {};
  
  return (
    <div className="space-y-4 border rounded-lg p-4">
      <h4 className="font-medium text-lg capitalize">{activity.replace(/_/g, ' ')}</h4>
      
      {activityFields[activity]?.map(field => (
        <div key={field} className="space-y-4">
          <h5 className="font-medium capitalize">{field.replace(/_/g, ' ')}</h5>
          
          <FormField
            control={control}
            name={`adl.basic.${activity}.${field}.independence`}
            defaultValue={activityData[field]?.independence || ''}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>Independence Level</FormLabel>
                <FormControl>
                  <Input {...formField} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`adl.basic.${activity}.${field}.notes`}
            defaultValue={activityData[field]?.notes || ''}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea {...formField} className="min-h-[100px]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}
    </div>
  );
});

ADLField.displayName = 'ADLField';

const BasicADL: React.FC = () => {
  const { data } = useADLForm();

  useEffect(() => {
    debugLog('BasicADL', 'Component mounted with data:', data);
  }, [data]);

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-5 w-5 text-blue-600" />
          <h3 className="text-xl font-semibold">Basic ADLs</h3>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {Object.keys(activityFields).map(activity => (
            <ADLField key={activity} activity={activity} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(BasicADL);