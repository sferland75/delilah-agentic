import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const RATING_LEVELS = [
  { value: '0', label: 'No Impairment (0%)' },
  { value: '1', label: 'Minimal Impairment (1-14%)' },
  { value: '2', label: 'Mild Impairment (15-29%)' },
  { value: '3', label: 'Moderate Impairment (30-49%)' },
  { value: '4', label: 'Severe Impairment (50-70%)' },
  { value: '5', label: 'Critical Impairment (>70%)' }
];

const ASSESSMENT_AREAS = [
  {
    id: 'activities',
    title: 'Activities of Daily Living',
    description: 'Self-care, personal hygiene, communication, physical activity',
    factors: [
      'Self-care capabilities',
      'Personal hygiene management',
      'Communication abilities',
      'Physical activity tolerance'
    ]
  },
  {
    id: 'social',
    title: 'Social Functioning',
    description: 'Ability to interact and communicate effectively with others',
    factors: [
      'Social interaction skills',
      'Communication effectiveness',
      'Relationship maintenance',
      'Community participation'
    ]
  },
  {
    id: 'concentration',
    title: 'Concentration, Persistence and Pace',
    description: 'Ability to focus and complete tasks',
    factors: [
      'Attention span',
      'Task completion',
      'Work pace',
      'Mental stamina'
    ]
  },
  {
    id: 'adaptation',
    title: 'Adaptation to Work Settings',
    description: 'Ability to cope with workplace demands',
    factors: [
      'Stress management',
      'Workplace adaptation',
      'Schedule maintenance',
      'Work relationships'
    ]
  }
];

export function AMAGuidesSection() {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-[#2C3258]">AMA Guidelines Assessment</h2>
        <p className="text-sm text-slate-600">Evaluation based on AMA Guides to the Evaluation of Permanent Impairment</p>
      </div>

      <Card className="p-6">
        <Tabs defaultValue={ASSESSMENT_AREAS[0].id} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            {ASSESSMENT_AREAS.map((area) => (
              <TabsTrigger key={area.id} value={area.id}>
                {area.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {ASSESSMENT_AREAS.map((area) => (
            <TabsContent key={area.id} value={area.id} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">{area.title}</h3>
                  <p className="text-slate-600">{area.description}</p>
                </div>

                <FormField
                  control={control}
                  name={`amaGuides.${area.id}.impairmentRating`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Impairment Rating</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select rating" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {RATING_LEVELS.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <p className="font-medium">Assessment Factors</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {area.factors.map((factor, index) => (
                      <li key={index}>{factor}</li>
                    ))}
                  </ul>
                </div>

                <FormField
                  control={control}
                  name={`amaGuides.${area.id}.justification`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating Justification</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Document observations and rationale for rating..."
                          className="min-h-[100px]"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`amaGuides.${area.id}.recommendations`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recommendations</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Enter recommended interventions or accommodations..."
                          className="min-h-[100px]"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Card>
    </div>
  );
}