import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { BERG_TASKS } from './berg-tasks';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface BergBalanceFields {
  tasks: Record<number, {
    score: number;
    notes: string;
  }>;
  totalScore: number;
  notes: string;
}

const defaultValues: BergBalanceFields = {
  tasks: {},
  totalScore: 0,
  notes: ''
};

export function BergBalanceTest() {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          The Berg Balance Scale (BBS) is a widely used clinical test of a person's static and dynamic balance abilities.
          Maximum score is 56 points. Testing typically takes 15-20 minutes.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        {BERG_TASKS.map((task) => (
          <Card key={task.id}>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{task.title}</h3>
                  <p className="text-sm text-muted-foreground">{task.instructions}</p>
                </div>

                <div className="grid gap-4">
                  <FormField
                    control={control}
                    name={`functionalAssessment.bergBalance.tasks.${task.id}.score`}
                    defaultValue={0}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Score</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            value={field.value?.toString() || "0"}
                            className="flex flex-col space-y-1"
                          >
                            {task.scoring.map(({ score, description }) => (
                              <FormItem key={score} className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value={score.toString()} />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {score} - {description}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`functionalAssessment.bergBalance.tasks.${task.id}.notes`}
                    defaultValue=""
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Enter observations..." />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardContent className="space-y-4">
            <FormField
              control={control}
              name="functionalAssessment.bergBalance.totalScore"
              defaultValue={0}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Score</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      type="number"
                      min={0}
                      max={56}
                      readOnly
                    />
                  </FormControl>
                  <FormDescription>
                    Total score out of 56 points. 41-56 = low fall risk, 21-40 = medium fall risk, 0-20 = high fall risk
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="functionalAssessment.bergBalance.notes"
              defaultValue=""
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}