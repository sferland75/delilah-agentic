import React from 'react';
import { Control } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { useFieldArray } from 'react-hook-form';

interface LivingSituationProps {
  control: Control<any>;
}

export function LivingSituation({ control }: LivingSituationProps) {
  const { fields: householdMembers, append: appendMember, remove: removeMember } = 
    useFieldArray({
      control,
      name: "demographics.householdMembers"
    });

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Marital Status */}
          <FormField
            control={control}
            name="demographics.maritalStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marital Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select marital status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="commonLaw">Common Law</SelectItem>
                    <SelectItem value="separated">Separated</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Number of Children */}
          <FormField
            control={control}
            name="demographics.numberOfChildren"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Children</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0"
                    {...field}
                    onChange={e => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Children Details */}
        <FormField
          control={control}
          name="demographics.childrenDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Children Details</FormLabel>
              <FormControl>
                <Textarea 
                  {...field}
                  placeholder="Enter children's ages and living arrangements..."
                  className="min-h-[80px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Household Members */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <FormLabel>Others Living in the Home</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendMember({ 
                name: '', 
                relationship: '', 
                notes: '' 
              })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Household Member
            </Button>
          </div>

          {householdMembers.map((field, index) => (
            <div 
              key={field.id}
              className="grid grid-cols-2 gap-4 p-4 border rounded-lg relative"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => removeMember(index)}
              >
                <X className="h-4 w-4" />
              </Button>

              <FormField
                control={control}
                name={`demographics.householdMembers.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`demographics.householdMembers.${index}.relationship`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relationship</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Relationship to client" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`demographics.householdMembers.${index}.notes`}
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Any relevant details about this household member..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        {/* Living Arrangement Notes */}
        <FormField
          control={control}
          name="demographics.livingArrangementNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Living Arrangement Notes</FormLabel>
              <FormControl>
                <Textarea 
                  {...field}
                  placeholder="Additional notes about living situation, support system, or relevant family dynamics..."
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