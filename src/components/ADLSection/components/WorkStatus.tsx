import React, { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Briefcase } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import useADLForm from '../../../hooks/useADLForm';

const WorkStatus: React.FC = () => {
  const { control } = useFormContext();
  const { data } = useADLForm();

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="h-5 w-5 text-blue-600" />
          <h3 className="text-xl font-semibold">Work Status</h3>
        </div>

        <div className="space-y-6">
          <div className="border rounded-lg p-4 space-y-4">
            <h4 className="font-medium text-lg">Current Work</h4>
            
            <FormField
              control={control}
              name="adl.workStatus.currentWork.status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Status</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="adl.workStatus.currentWork.hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hours per Week</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="adl.workStatus.currentWork.notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="min-h-[100px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="border rounded-lg p-4 space-y-4">
            <h4 className="font-medium text-lg">Barriers and Goals</h4>
            
            <FormField
              control={control}
              name={`adl.workStatus.barriers`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Barriers</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field}
                      value={Array.isArray(field.value) ? field.value.join('\n') : field.value}
                      onChange={e => {
                        const value = e.target.value.split('\n').filter(line => line.trim());
                        field.onChange(value);
                      }}
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`adl.workStatus.goals`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Goals</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field}
                      value={Array.isArray(field.value) ? field.value.join('\n') : field.value}
                      onChange={e => {
                        const value = e.target.value.split('\n').filter(line => line.trim());
                        field.onChange(value);
                      }}
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(WorkStatus);