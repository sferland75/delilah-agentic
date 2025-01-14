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
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useFieldArray } from 'react-hook-form';

interface DocumentationFormProps {
  control: Control<any>;
}

export function DocumentationForm({ control }: DocumentationFormProps) {
  const { fields: medicalFields, append: appendMedical, remove: removeMedical } = 
    useFieldArray({
      control,
      name: "documentation.medicalDocumentation"
    });

  const { fields: legalFields, append: appendLegal, remove: removeLegal } = 
    useFieldArray({
      control,
      name: "documentation.legalDocumentation"
    });

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Medical Documentation</h3>
          
          {medicalFields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
              <FormField
                control={control}
                name={`documentation.medicalDocumentation.${index}.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`documentation.medicalDocumentation.${index}.date`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`documentation.medicalDocumentation.${index}.notes`}
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeMedical(index)}
                className="col-span-2"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove Document
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => appendMedical({ 
              title: '', 
              date: '', 
              type: 'medical', 
              notes: '' 
            })}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Medical Document
          </Button>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Legal Documentation</h3>
          
          {legalFields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
              <FormField
                control={control}
                name={`documentation.legalDocumentation.${index}.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`documentation.legalDocumentation.${index}.date`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`documentation.legalDocumentation.${index}.notes`}
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeLegal(index)}
                className="col-span-2"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove Document
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => appendLegal({ 
              title: '', 
              date: '', 
              type: 'legal', 
              notes: '' 
            })}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Legal Document
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}