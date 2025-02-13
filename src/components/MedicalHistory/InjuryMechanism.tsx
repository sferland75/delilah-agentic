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
<<<<<<< HEAD
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { FaNotesMedical, FaRegCalendarAlt, FaFileMedicalAlt, FaClipboardList } from 'react-icons/fa';
=======
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801

interface InjuryMechanismProps {
  control: Control<any>;
}

<<<<<<< HEAD
=======
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

>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
export function InjuryMechanism({ control }: InjuryMechanismProps) {
  return (
    <div className="space-y-6">
      <div>
<<<<<<< HEAD
        <h3 className="text-lg font-medium text-slate-800">Injury Details</h3>
        <p className="text-sm text-slate-600 mb-4">Document information about the injury and its mechanism</p>
      </div>

      <div className="bg-white rounded-lg border shadow-sm p-4 space-y-6">
        <FormField
          control={control}
          name="medical.injury.circumstance"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2 mb-1.5">
                <FaNotesMedical className="h-4 w-4 text-blue-500" />
                <FormLabel className="text-slate-700">Circumstance of Injury</FormLabel>
              </div>
              <FormDescription className="text-slate-600">
                Describe how the injury occurred
=======
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
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
              </FormDescription>
              <FormControl>
                <Textarea
                  {...field}
<<<<<<< HEAD
                  className="min-h-[100px] bg-white"
                  placeholder="Describe the circumstances leading to the injury..."
=======
                  placeholder="Describe the circumstances leading to the accident..."
                  className="min-h-[100px] bg-white"
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
<<<<<<< HEAD
          name="medical.injury.date"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2 mb-1.5">
                <FaRegCalendarAlt className="h-4 w-4 text-blue-500" />
                <FormLabel className="text-slate-700">Date of Injury</FormLabel>
              </div>
              <FormDescription className="text-slate-600">
                When did the injury occur?
              </FormDescription>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  className="bg-white"
=======
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
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
<<<<<<< HEAD
          name="medical.injury.description"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2 mb-1.5">
                <FaFileMedicalAlt className="h-4 w-4 text-blue-500" />
                <FormLabel className="text-slate-700">Injury Description</FormLabel>
              </div>
              <FormDescription className="text-slate-600">
                Detailed description of the injury and initial impact
=======
          name="medicalHistory.injury.immediateSymptoms"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700">Immediate Symptoms</FormLabel>
              <FormDescription className="text-slate-600">
                Symptoms noted at scene and immediately following accident
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
              </FormDescription>
              <FormControl>
                <Textarea
                  {...field}
<<<<<<< HEAD
                  className="min-h-[100px] bg-white"
                  placeholder="Describe the nature and extent of the injury..."
=======
                  placeholder="Describe immediate symptoms following the accident..."
                  className="min-h-[100px] bg-white"
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
<<<<<<< HEAD
          name="medical.injury.notes"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2 mb-1.5">
                <FaClipboardList className="h-4 w-4 text-blue-500" />
                <FormLabel className="text-slate-700">Additional Notes</FormLabel>
              </div>
              <FormDescription className="text-slate-600">
                Any other relevant information about the injury
=======
          name="medicalHistory.injury.immediateResponse"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700">Immediate Response & Care</FormLabel>
              <FormDescription className="text-slate-600">
                Emergency services response, treatment at scene, transport details
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
              </FormDescription>
              <FormControl>
                <Textarea
                  {...field}
<<<<<<< HEAD
                  className="min-h-[100px] bg-white"
                  placeholder="Add any additional notes about the injury..."
=======
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
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
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