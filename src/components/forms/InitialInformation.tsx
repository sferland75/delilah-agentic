import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Phone, Heart } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export const InitialInformation: React.FC = () => {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-[#2C3258]">Initial Information</h2>
        <p className="text-sm text-slate-600">Comprehensive collection of personal and contact details</p>
      </div>

      {/* Main Content */}
      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Description */}
          <Alert>
            <AlertDescription>
              Document all relevant personal information and contact details. Consider accessibility needs and communication preferences.
            </AlertDescription>
          </Alert>

          {/* Basic Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-600" />
              <h3 className="font-medium text-[#2C3258]">Basic Information</h3>
            </div>
            <p className="text-sm text-slate-600">Personal details and information</p>
            
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={control}
                name="initialInfo.firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={control}
                name="initialInfo.lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="initialInfo.dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="initialInfo.gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
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
          <div className="space-y-4 pt-6">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-slate-600" />
              <h3 className="font-medium text-[#2C3258]">Contact Information</h3>
            </div>
            <p className="text-sm text-slate-600">How to reach the patient</p>

            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={control}
                name="initialInfo.phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="(000) 000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="initialInfo.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email address" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="initialInfo.address"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Street address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-4 pt-6">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-slate-600" />
              <h3 className="font-medium text-[#2C3258]">Emergency Contact</h3>
            </div>
            <p className="text-sm text-slate-600">Who to contact in case of emergency</p>

            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={control}
                name="initialInfo.emergencyContactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Emergency contact name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="initialInfo.emergencyContactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Emergency contact phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="initialInfo.emergencyContactRelationship"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Relationship</FormLabel>
                    <FormControl>
                      <Input placeholder="Relationship to patient" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Documentation Reviewed */}
          <div className="space-y-4 pt-6">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-600" />
              <h3 className="font-medium text-[#2C3258]">Documentation Reviewed</h3>
            </div>
            <p className="text-sm text-slate-600">Documents reviewed for this assessment</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InitialInformation;