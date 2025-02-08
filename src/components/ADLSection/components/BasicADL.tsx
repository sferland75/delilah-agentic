import React, { memo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { FaShower, FaPersonBooth, FaWalking, FaUtensils, FaRestroom } from 'react-icons/fa';
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

const activityIcons = {
  bathing: FaShower,
  dressing: FaPersonBooth,
  transfers: FaWalking,
  feeding: FaUtensils,
  toileting: FaRestroom
};

const ADLField = memo(({ activity }: { activity: string }) => {
  const { control } = useFormContext();
  const { data } = useADLForm();
  const activityData = data?.basic?.[activity] || {};
  const Icon = activityIcons[activity];
  
  return (
    <div className="space-y-4 border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon className="h-4 w-4 text-blue-600" />}
        <h4 className="font-medium text-sm capitalize">{activity.replace(/_/g, ' ')}</h4>
      </div>
      
      {activityFields[activity]?.map(field => (
        <div key={field} className="space-y-4">
          <h5 className="font-medium text-xs text-muted-foreground capitalize">{field.replace(/_/g, ' ')}</h5>
          
          <FormField
            control={control}
            name={`adl.basic.${activity}.${field}.independence`}
            defaultValue={activityData[field]?.independence || ''}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className="text-xs text-muted-foreground">Independence Level</FormLabel>
                <FormControl>
                  <Input {...formField} className="text-sm" />
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
                <FormLabel className="text-xs text-muted-foreground">Notes</FormLabel>
                <FormControl>
                  <Textarea {...formField} className="text-sm min-h-[100px] resize-none" />
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {Object.keys(activityFields).map(activity => (
          <ADLField key={activity} activity={activity} />
        ))}
      </div>
    </div>
  );
};

export default memo(BasicADL);