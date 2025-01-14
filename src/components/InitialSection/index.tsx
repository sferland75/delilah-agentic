import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, User, Phone, Heart } from 'lucide-react';
import { type Assessment } from '@/lib/validation/assessment-schema';
import { BasicInformation } from './basic-information';
import { ContactInformation } from './contact-information';
import { EmergencyContact } from './emergency-contact';
import { DocumentationReview } from './documentation-review';

export function InitialSection() {
  const { control } = useFormContext<Assessment>();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Initial Information</h1>
      
      <BasicInformation control={control} />
      <ContactInformation control={control} />
      <EmergencyContact control={control} />
      <DocumentationReview control={control} />
    </div>
  );
}