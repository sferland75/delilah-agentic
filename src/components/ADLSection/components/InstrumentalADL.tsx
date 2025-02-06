import React, { memo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Briefcase } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import useADLForm from '../../../hooks/useADLForm';
import { debugLog } from '../../../utils/debug-utils';

const activityFields = {
  household: ['cleaning', 'laundry', 'meal_prep', 'home_maintenance'],
  community: ['transportation', 'shopping', 'money_management', 'navigation']
};

const IADLField = memo(({ category, activities }: { category: string; activities: string[] }) => {
  const { control } = useFormContext();
  const { data } = useADLForm();
  const categoryData = data?.iadl?.[category] || {};

  return (
    <div className="space-y-6 border rounded-lg p-4">
      <h4 className="font-medium text-lg capitalize">{category.replace(/_/g, ' ')}</h4>
      
      {activities.map(activity => (
        <div key={activity} className="space-y-4 border-t pt-4 first:border-t-0 first:pt-0">
          <h5 className="font-medium capitalize">{activity.replace(/_/g, ' ')}</h5>
          
          <FormField
            control={control}
            name={`adl.iadl.${category}.${activity}.independence`}
            defaultValue={categoryData[activity]?.independence || ''}
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
            name={`adl.iadl.${category}.${activity}.frequency`}
            defaultValue={categoryData[activity]?.frequency || ''}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frequency</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`adl.iadl.${category}.${activity}.notes`}
            defaultValue={categoryData[activity]?.notes || ''}
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
      ))}
    </div>
  );
});

IADLField.displayName = 'IADLField';

const InstrumentalADL: React.FC = () => {
  const { data } = useADLForm();

  useEffect(() => {
    debugLog('InstrumentalADL', 'Component mounted with data:', data);
  }, [data]);

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="h-5 w-5 text-blue-600" />
          <h3 className="text-xl font-semibold">Instrumental ADLs</h3>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {Object.entries(activityFields).map(([category, activities]) => (
            <IADLField key={category} category={category} activities={activities} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(InstrumentalADL);