import React from 'react';
import { Control, useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText } from 'lucide-react';
import { type Assessment } from '@/lib/validation/assessment-schema';

interface BasicInformationProps {
  control: Control<Assessment>;
}

export function BasicInformation({ control }: BasicInformationProps) {
  const { register, formState: { errors } } = useFormContext<Assessment>();

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
              {...register("basicInfo.firstName")}
              placeholder="First name"
            />
            {errors.basicInfo?.firstName && (
              <p className="text-sm text-destructive">{errors.basicInfo.firstName.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              {...register("basicInfo.lastName")}
              placeholder="Last name"
            />
            {errors.basicInfo?.lastName && (
              <p className="text-sm text-destructive">{errors.basicInfo.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              {...register("basicInfo.dateOfBirth")}
            />
            {errors.basicInfo?.dateOfBirth && (
              <p className="text-sm text-destructive">{errors.basicInfo.dateOfBirth.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Input
              id="gender"
              {...register("basicInfo.gender")}
              placeholder="Gender"
            />
            {errors.basicInfo?.gender && (
              <p className="text-sm text-destructive">{errors.basicInfo.gender.message}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}