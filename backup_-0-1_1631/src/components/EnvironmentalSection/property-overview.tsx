import { useFormContext } from 'react-hook-form';
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { environmentalConfigs } from './environmental-config';
import type { Assessment } from '@/lib/validation/assessment-schema';

export function PropertyOverview() {
  const { control } = useFormContext<Assessment>();

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <FormField
          control={control}
          name="environmental.propertyOverview.type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {environmentalConfigs?.propertyTypes?.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  )) ?? []}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="environmental.propertyOverview.groundType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ground Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ground type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {environmentalConfigs?.groundTypes?.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  )) ?? []}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="environmental.propertyOverview.groundCondition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ground Condition</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ground condition" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {environmentalConfigs?.groundConditions?.map((condition) => (
                    <SelectItem key={condition} value={condition}>
                      {condition}
                    </SelectItem>
                  )) ?? []}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="environmental.propertyOverview.accessType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Access Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select access type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {environmentalConfigs?.accessTypes?.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  )) ?? []}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="environmental.propertyOverview.generalNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>General Notes</FormLabel>
              <FormControl>
                <Textarea 
                  {...field}
                  placeholder="Enter any general notes about the property"
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}