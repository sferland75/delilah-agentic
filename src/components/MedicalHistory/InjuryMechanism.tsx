import React from 'react';
import { Control } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InjuryMechanismProps {
  control: Control<any>;
}

const VEHICLE_POSITIONS = [
  "Driver",
  "Front Passenger",
  "Left Rear Passenger",
  "Right Rear Passenger",
  "Middle Rear Passenger",
  "Other"
] as const;

const IMPACT_TYPES = [
  "Front",
  "Rear",
  "Driver Side",
  "Passenger Side",
  "Multiple Impacts",
  "Rollover",
  "Other"
] as const;

export function InjuryMechanism({ control }: InjuryMechanismProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-slate-800">Injury Mechanism</h3>
        <p className="text-sm text-slate-600 mb-4">Document details of the motor vehicle accident</p>
      </div>

      <div className="bg-white rounded-lg border shadow-sm p-4 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="medicalHistory.injury.date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Date of Incident</FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="medicalHistory.injury.time"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Time of Incident</FormLabel>
                <FormControl>
                  <Input type="time" {...field} className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="medicalHistory.injury.position"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Position in Vehicle</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {VEHICLE_POSITIONS.map((pos) => (
                      <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="medicalHistory.injury.impactType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Type of Impact</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select impact type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {IMPACT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="medicalHistory.injury.circumstance"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700">Circumstances of Accident</FormLabel>
              <FormDescription className="text-slate-600">
                Speed of vehicles, road conditions, weather conditions, etc.
              </FormDescription>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Describe the circumstances leading to the accident..."
                  className="min-h-[100px] bg-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="medicalHistory.injury.preparedForImpact"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700">Preparation for Impact</FormLabel>
              <FormDescription className="text-slate-600">
                Awareness of impending collision, bracing position, head position, etc.
              </FormDescription>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Describe preparation or awareness of impending impact..."
                  className="min-h-[100px] bg-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="medicalHistory.injury.immediateSymptoms"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700">Immediate Symptoms</FormLabel>
              <FormDescription className="text-slate-600">
                Symptoms noted at scene and immediately following accident
              </FormDescription>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Describe immediate symptoms following the accident..."
                  className="min-h-[100px] bg-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="medicalHistory.injury.immediateResponse"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700">Immediate Response & Care</FormLabel>
              <FormDescription className="text-slate-600">
                Emergency services response, treatment at scene, transport details
              </FormDescription>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Describe immediate medical response and care received..."
                  className="min-h-[100px] bg-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="medicalHistory.injury.vehicleDamage"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700">Vehicle Damage</FormLabel>
              <FormDescription className="text-slate-600">
                Extent and location of damage to vehicles involved
              </FormDescription>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Describe damage to vehicles involved..."
                  className="min-h-[100px] bg-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="medicalHistory.injury.subsequentCare"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700">Subsequent Care</FormLabel>
              <FormDescription className="text-slate-600">
                Follow-up care, investigations, and initial treatments
              </FormDescription>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Describe medical care received after the accident..."
                  className="min-h-[100px] bg-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}