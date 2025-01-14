import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { FormError } from "../ui/form-error";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GraduationCap, Award, BadgeCheck } from "lucide-react";

const professionalSections = {
  qualifications: {
    title: "Qualifications",
    description: `Document academic and professional qualifications that establish competency for assessment:
    - Degrees and diplomas
    - Professional certifications
    - Specialized training
    - Relevant coursework and education`,
    icon: GraduationCap,
    placeholder: "Enter qualification (e.g., Master of Occupational Therapy)"
  },
  experience: {
    title: "Professional Experience",
    description: `Detail relevant professional experience that supports assessment expertise:
    - Clinical practice history
    - Assessment experience
    - Specialized practice areas
    - Research and publications
    - Teaching or supervision experience`,
    icon: Award,
  },
  specializations: {
    title: "Areas of Specialization",
    description: `List specialized areas of practice and expertise:
    - Clinical specialties
    - Assessment types
    - Patient populations
    - Treatment approaches
    - Research interests`,
    icon: Award,
    placeholder: "Enter specialization (e.g., Functional Capacity Evaluation)"
  },
  registrations: {
    title: "Professional Registrations",
    description: `Document current professional registrations and licenses:
    - Regulatory body registrations
    - Professional licenses
    - Board certifications
    - Insurance provider numbers
    - Other relevant registrations`,
    icon: BadgeCheck
  }
};

export const ProfessionalInformation: React.FC = () => {
  const { control } = useFormContext();

  const {
    fields: qualificationFields,
    append: appendQualification,
    remove: removeQualification
  } = useFieldArray({
    control,
    name: "professionalInfo.qualifications"
  });

  const {
    fields: specializationFields,
    append: appendSpecialization,
    remove: removeSpecialization
  } = useFieldArray({
    control,
    name: "professionalInfo.specializations"
  });

  const {
    fields: registrationFields,
    append: appendRegistration,
    remove: removeRegistration
  } = useFieldArray({
    control,
    name: "professionalInfo.registrations"
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Information</CardTitle>
        <CardDescription>
          Document professional qualifications, experience, and registrations that establish competency
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <Alert>
            <AlertDescription>
              Professional information establishes your qualifications and competency to perform assessments.
              Include all relevant education, experience, and credentials that support your expertise.
            </AlertDescription>
          </Alert>

          {/* Qualifications Section */}
          <div className="space-y-6 p-4 border rounded-lg">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="h-5 w-5" />
                <h3 className="text-lg font-semibold">{professionalSections.qualifications.title}</h3>
              </div>
              <Alert>
                <AlertDescription className="whitespace-pre-line">
                  {professionalSections.qualifications.description}
                </AlertDescription>
              </Alert>
            </div>

            <div className="space-y-4">
              {qualificationFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <FormField
                    control={control}
                    name={`professionalInfo.qualifications.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input {...field} placeholder={professionalSections.qualifications.placeholder} />
                        </FormControl>
                        <FormError message={field.value?.message} />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeQualification(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendQualification("")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Qualification
              </Button>
            </div>
          </div>

          {/* Experience Section */}
          <div className="space-y-6 p-4 border rounded-lg">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5" />
                <h3 className="text-lg font-semibold">{professionalSections.experience.title}</h3>
              </div>
              <Alert>
                <AlertDescription className="whitespace-pre-line">
                  {professionalSections.experience.description}
                </AlertDescription>
              </Alert>
            </div>

            <FormField
              control={control}
              name="professionalInfo.experience"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea 
                      {...field}
                      placeholder="Detail your relevant professional experience"
                      className="min-h-[150px]"
                    />
                  </FormControl>
                  <FormError message={field.value?.message} />
                </FormItem>
              )}
            />
          </div>

          {/* Specializations Section */}
          <div className="space-y-6 p-4 border rounded-lg">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5" />
                <h3 className="text-lg font-semibold">{professionalSections.specializations.title}</h3>
              </div>
              <Alert>
                <AlertDescription className="whitespace-pre-line">
                  {professionalSections.specializations.description}
                </AlertDescription>
              </Alert>
            </div>

            <div className="space-y-4">
              {specializationFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <FormField
                    control={control}
                    name={`professionalInfo.specializations.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input {...field} placeholder={professionalSections.specializations.placeholder} />
                        </FormControl>
                        <FormError message={field.value?.message} />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSpecialization(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendSpecialization("")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Specialization
              </Button>
            </div>
          </div>

          {/* Registrations Section */}
          <div className="space-y-6 p-4 border rounded-lg">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BadgeCheck className="h-5 w-5" />
                <h3 className="text-lg font-semibold">{professionalSections.registrations.title}</h3>
              </div>
              <Alert>
                <AlertDescription className="whitespace-pre-line">
                  {professionalSections.registrations.description}
                </AlertDescription>
              </Alert>
            </div>

            <div className="space-y-6">
              {registrationFields.map((field, index) => (
                <Card key={field.id} className="p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">Registration {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRegistration(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={control}
                        name={`professionalInfo.registrations.${index}.type`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Registration Type</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., OT Board" />
                            </FormControl>
                            <FormError message={field.value?.message} />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={control}
                        name={`professionalInfo.registrations.${index}.number`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Registration Number</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Registration #" />
                            </FormControl>
                            <FormError message={field.value?.message} />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={control}
                        name={`professionalInfo.registrations.${index}.expiryDate`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiry Date</FormLabel>
                            <FormControl>
                              <Input {...field} type="date" />
                            </FormControl>
                            <FormError message={field.value?.message} />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </Card>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendRegistration({
                  type: "",
                  number: "",
                  expiryDate: ""
                })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Registration
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfessionalInformation;