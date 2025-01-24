import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription
} from '@/components/ui/form';
import { Textarea } from "@/components/ui/textarea";
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { BERG_ITEMS, DEFAULT_BERG_ASSESSMENT } from './berg-items';

export function BergBalanceTest() {
  const { control, setValue, getValues, watch } = useFormContext();

  // Initialize with default values if not set
  React.useEffect(() => {
    const currentBergValues = getValues('functionalAssessment.bergBalance');
    if (!currentBergValues) {
      setValue('functionalAssessment.bergBalance', DEFAULT_BERG_ASSESSMENT);
    }
  }, [getValues, setValue]);

  // Watch berg balance values
  const bergValues = watch('functionalAssessment.bergBalance') || DEFAULT_BERG_ASSESSMENT;

  const renderBergItem = (item) => {
    return (
      <div key={item.id} className="p-4 border rounded-lg space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
          <p className="text-sm text-slate-500 mt-1">{item.instruction}</p>
        </div>

        <div className="space-y-4">
          <FormField
            control={control}
            name={`functionalAssessment.bergBalance.items.${item.id}.score`}
            defaultValue={4}
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel>Score</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => {
                      field.onChange(parseInt(value));
                      // Recalculate total score
                      const currentValues = getValues('functionalAssessment.bergBalance.items');
                      const newTotal = Object.values(currentValues).reduce(
                        (sum, item) => sum + (item?.score || 0), 
                        0
                      );
                      setValue('functionalAssessment.bergBalance.totalScore', newTotal);
                    }}
                    value={field.value?.toString() || "4"}
                    className="space-y-2"
                  >
                    {item.scores.map((score) => (
                      <div key={score.value} className="flex items-start space-x-2">
                        <RadioGroupItem 
                          value={score.value.toString()} 
                          id={`${item.id}-${score.value}`}
                        />
                        <Label 
                          htmlFor={`${item.id}-${score.value}`}
                          className="text-sm leading-relaxed"
                        >
                          {score.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`functionalAssessment.bergBalance.items.${item.id}.notes`}
            defaultValue="No identified limitations."
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field}
                    placeholder="Enter observations..."
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    );
  };

  // Show total score from form values
  const totalScore = bergValues?.totalScore || 56;

  return (
    <Card className="border-2 border-slate-200 shadow-sm">
      <CardHeader className="bg-slate-50 border-b border-slate-200">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Berg Balance Test</CardTitle>
            <CardDescription>
              The Berg Balance Scale (BBS) is a widely used clinical test of a person's static and dynamic balance abilities. 
              Maximum score is 56 points. Testing typically takes 15-20 minutes.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Assessment Guide
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {BERG_ITEMS.map(renderBergItem)}
        </div>

        <div className="mt-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="text-lg font-semibold">Total Score</div>
            <div className="text-2xl font-bold">{totalScore}</div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              totalScore >= 41 
                ? 'bg-green-100 text-green-800'
                : totalScore >= 21
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {totalScore >= 41 ? 'Low' : totalScore >= 21 ? 'Medium' : 'High'} Fall Risk
            </div>
          </div>
          
          <FormField
            control={control}
            name="functionalAssessment.bergBalance.generalNotes"
            defaultValue="No identified limitations."
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assessment Notes</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="Enter overall assessment observations and findings..."
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormDescription>
                  Document any additional observations, compensatory strategies, or safety concerns
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}