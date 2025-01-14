import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

const TRANSFER_TYPES = [
  {
    id: 'bed_mobility',
    label: 'Bed Mobility',
    description: 'Rolling, repositioning, and moving in bed',
    activities: [
      { id: 'supine_to_sit', name: 'Supine to Sitting' },
      { id: 'rolling', name: 'Rolling' },
      { id: 'repositioning', name: 'Repositioning' }
    ]
  },
  {
    id: 'bed_transfers',
    label: 'Bed Transfers',
    description: 'Moving in and out of bed',
    activities: [
      { id: 'sit_to_stand', name: 'Sit to Stand' },
      { id: 'stand_to_sit', name: 'Stand to Sit' }
    ]
  },
  {
    id: 'toilet_transfers',
    label: 'Toilet Transfers',
    description: 'Transfers to and from toilet',
    activities: [
      { id: 'approach', name: 'Toilet Approach' },
      { id: 'lowering', name: 'Lowering to Toilet' },
      { id: 'rising', name: 'Rising from Toilet' }
    ]
  },
  {
    id: 'shower_transfers',
    label: 'Shower/Bath Transfers',
    description: 'Transfers in and out of shower/bath',
    activities: [
      { id: 'shower_entry', name: 'Shower Entry' },
      { id: 'shower_exit', name: 'Shower Exit' },
      { id: 'bath_entry', name: 'Bath Entry/Exit' }
    ]
  },
  {
    id: 'car_transfers',
    label: 'Car Transfers',
    description: 'Getting in and out of vehicles',
    activities: [
      { id: 'car_entry', name: 'Car Entry' },
      { id: 'car_exit', name: 'Car Exit' }
    ]
  }
] as const;

const INDEPENDENCE_LEVELS = [
  { value: "independent", label: "Independent", description: "No assistance required" },
  { value: "supervision", label: "Supervision", description: "Requires supervision for safety" },
  { value: "minimal_assist", label: "Minimal Assistance", description: "Requires minimal physical assistance" },
  { value: "moderate_assist", label: "Moderate Assistance", description: "Requires moderate physical assistance" },
  { value: "maximal_assist", label: "Maximal Assistance", description: "Requires significant physical assistance" },
  { value: "dependent", label: "Dependent", description: "Requires full assistance" }
] as const;

export function TransfersAssessment() {
  const { control } = useFormContext();

  return (
    <div>
      <h3 className="text-lg font-medium text-slate-800">Mobility & Transfers Assessment</h3>
      <div className="text-sm text-slate-600 mb-4">Evaluate transfer abilities and safety</div>
      
      <Alert className="mb-4 bg-blue-50 border-blue-200">
        <AlertDescription className="text-slate-700">
          Document independence level, technique, and safety considerations for each transfer type.
        </AlertDescription>
      </Alert>

      <div className="space-y-8">
        {TRANSFER_TYPES.map((transferType) => (
          <div 
            key={transferType.id}
            className="bg-white rounded-lg border shadow-sm p-4 space-y-6"
          >
            <div>
              <h3 className="text-lg font-medium text-slate-800">{transferType.label}</h3>
              <p className="text-sm text-slate-600">{transferType.description}</p>
            </div>

            <div className="space-y-6">
              {transferType.activities.map((activity) => (
                <div 
                  key={activity.id}
                  className="border rounded-lg p-4 space-y-4"
                >
                  <h4 className="font-medium text-slate-800">{activity.name}</h4>
                  
                  <FormField
                    control={control}
                    name={`functionalAssessment.transfers.${transferType.id}.${activity.id}.level`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700">Independence Level</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select independence level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {INDEPENDENCE_LEVELS.map((level) => (
                              <SelectItem
                                key={level.value}
                                value={level.value}
                                className="flex flex-col items-start py-2"
                              >
                                <div className="font-medium">{level.label}</div>
                                <div className="text-xs text-slate-600">{level.description}</div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`functionalAssessment.transfers.${transferType.id}.${activity.id}.notes`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700">Observations & Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter any observations, limitations, or assistance requirements..."
                            className="min-h-[100px] bg-white"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}