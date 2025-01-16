import React, { useEffect } from 'react';
import { Control, Controller, useFormContext } from 'react-hook-form';
import { FileText, Phone, Heart } from 'lucide-react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DemographicsFormProps {
  control: Control<any>;
}

export function DemographicsForm({ control }: DemographicsFormProps) {
  const { formState, watch } = useFormContext();
  
  // Watch all demographics fields for debugging
  const watchedFields = watch(['demographics']);
  useEffect(() => {
    console.log('Demographics fields changed:', watchedFields);
  }, [watchedFields]);

  return (
    <div className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white rounded-lg border shadow-sm p-4 space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="h-4 w-4 text-blue-600" />
            <h3 className="font-medium text-slate-800">Basic Information</h3>
          </div>
          <p className="text-sm text-slate-600">Personal details and identification information</p>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <Controller
            name="demographics.firstName"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">First Name</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="First name" 
                    className="bg-white"
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Controller
            name="demographics.lastName"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Last Name</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Last name" 
                    className="bg-white"
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Controller
            name="demographics.dateOfBirth"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Date of Birth</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="date" 
                    className="bg-white"
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Controller
            name="demographics.gender"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Gender</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value || ''}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg border shadow-sm p-4 space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Phone className="h-4 w-4 text-blue-600" />
            <h3 className="font-medium text-slate-800">Contact Information</h3>
          </div>
          <p className="text-sm text-slate-600">Primary contact details and address</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Controller
            name="demographics.phone"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Phone Number</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="(000) 000-0000" 
                    className="bg-white"
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription className="text-slate-500">
                  Primary contact number
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Controller
            name="demographics.email"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Email</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Email address" 
                    type="email" 
                    className="bg-white"
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription className="text-slate-500">
                  Preferred email for correspondence
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Controller
            name="demographics.address"
            control={control}
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="text-slate-700">Address</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Street address" 
                    className="bg-white"
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription className="text-slate-500">
                  Current residential address
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-white rounded-lg border shadow-sm p-4 space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Heart className="h-4 w-4 text-blue-600" />
            <h3 className="font-medium text-slate-800">Emergency Contact</h3>
          </div>
          <p className="text-sm text-slate-600">Emergency contact information and relationship</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Controller
            name="demographics.emergencyContact.name"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Contact Name</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Emergency contact name" 
                    className="bg-white"
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription className="text-slate-500">
                  Full name of emergency contact
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Controller
            name="demographics.emergencyContact.phone"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Contact Phone</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Emergency contact phone" 
                    className="bg-white"
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription className="text-slate-500">
                  Best number to reach emergency contact
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Controller
            name="demographics.emergencyContact.relationship"
            control={control}
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="text-slate-700">Relationship</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Relationship to patient" 
                    className="bg-white"
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription className="text-slate-500">
                  Relationship to the individual being assessed
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}