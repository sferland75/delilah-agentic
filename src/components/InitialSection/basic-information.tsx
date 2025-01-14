import React from 'react';
import { Control, useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText } from 'lucide-react';
import { type Assessment } from '@/lib/validation/assessment-schema';

interface BasicInformationProps {
  control: Control<Assessment>;
}

export function BasicInformation({ control }: BasicInformationProps) {
  const { register, formState: { errors }, watch } = useFormContext<Assessment>();

  // Watch values for debugging
  const firstName = watch('demographics.firstName');
  const lastName = watch('demographics.lastName');
  console.log('Form values:', { firstName, lastName });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <CardTitle>Basic Information</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Personal details and information
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              {...register("demographics.firstName")}
              defaultValue={firstName}
              placeholder="First name"
            />
            {errors.demographics?.firstName && (
              <p className="text-sm text-destructive">{errors.demographics.firstName.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              {...register("demographics.lastName")}
              defaultValue={lastName}
              placeholder="Last name"
            />
            {errors.demographics?.lastName && (
              <p className="text-sm text-destructive">{errors.demographics.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              {...register("demographics.dateOfBirth")}
            />
            {errors.demographics?.dateOfBirth && (
              <p className="text-sm text-destructive">{errors.demographics.dateOfBirth.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select onValueChange={(value) => {
              const event = { target: { name: "demographics.gender", value } };
              register("demographics.gender").onChange(event);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="preferNotToSay">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
            {errors.demographics?.gender && (
              <p className="text-sm text-destructive">{errors.demographics.gender.message}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}