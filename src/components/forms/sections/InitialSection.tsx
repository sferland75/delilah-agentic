import React from 'react';
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  FaUser,
  FaMapMarkerAlt,
  FaBuilding,
  FaBalanceScale,
  FaIdCard
} from 'react-icons/fa';

export function InitialSection() {
  const { register, watch } = useFormContext();

  return (
    <div className="p-6">
      <Tabs defaultValue="personal" className="w-full">
        <div className="bg-slate-100/80 p-1 rounded-md mb-6">
          <TabsList className="grid w-full grid-cols-3 gap-1">
            <TabsTrigger 
              value="personal" 
              className="data-[state=active]:bg-[#2563EB] data-[state=active]:text-white text-slate-600 hover:bg-slate-200"
            >
              <div className="flex items-center gap-2">
                <FaUser className="h-4 w-4" />
                <span>Personal Info</span>
              </div>
            </TabsTrigger>

            <TabsTrigger 
              value="insurer" 
              className="data-[state=active]:bg-[#2563EB] data-[state=active]:text-white text-slate-600 hover:bg-slate-200"
            >
              <div className="flex items-center gap-2">
                <FaBuilding className="h-4 w-4" />
                <span>Insurer Info</span>
              </div>
            </TabsTrigger>

            <TabsTrigger 
              value="legal" 
              className="data-[state=active]:bg-[#2563EB] data-[state=active]:text-white text-slate-600 hover:bg-slate-200"
            >
              <div className="flex items-center gap-2">
                <FaBalanceScale className="h-4 w-4" />
                <span>Legal Rep</span>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="personal">
          <div className="space-y-6 mt-6">
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <FaIdCard className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-medium">Personal Information</h3>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input
                      {...register('initial.personal.firstName')}
                      placeholder="First Name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input
                      {...register('initial.personal.lastName')}
                      placeholder="Last Name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Input
                      type="date"
                      {...register('initial.personal.dateOfBirth')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      {...register('initial.personal.phone')}
                      placeholder="Phone Number"
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      {...register('initial.personal.email')}
                      placeholder="Email Address"
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <FaMapMarkerAlt className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-medium">Address Information</h3>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 space-y-2">
                    <Label>Street Address</Label>
                    <Input
                      {...register('initial.personal.streetAddress')}
                      placeholder="Street Address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input
                      {...register('initial.personal.city')}
                      placeholder="City"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Postal Code</Label>
                    <Input
                      {...register('initial.personal.postalCode')}
                      placeholder="Postal Code"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="insurer">
          <div className="space-y-6 mt-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FaBuilding className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-medium">Insurance Details</h3>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Insurance Company</Label>
                  <Input
                    {...register('initial.insurance.company')}
                    placeholder="Insurance Company Name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Claim Number</Label>
                  <Input
                    {...register('initial.insurance.claimNumber')}
                    placeholder="Claim Number"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Adjuster Name</Label>
                  <Input
                    {...register('initial.insurance.adjusterName')}
                    placeholder="Adjuster Name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Adjuster Phone</Label>
                  <Input
                    {...register('initial.insurance.adjusterPhone')}
                    placeholder="Adjuster Phone Number"
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <Label>Adjuster Email</Label>
                  <Input
                    type="email"
                    {...register('initial.insurance.adjusterEmail')}
                    placeholder="Adjuster Email Address"
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <Label>Additional Notes</Label>
                  <Textarea
                    {...register('initial.insurance.notes')}
                    placeholder="Additional notes about insurance details..."
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="legal">
          <div className="space-y-6 mt-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FaBalanceScale className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-medium">Legal Representative</h3>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Law Firm</Label>
                  <Input
                    {...register('initial.legal.firmName')}
                    placeholder="Law Firm Name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Lawyer Name</Label>
                  <Input
                    {...register('initial.legal.lawyerName')}
                    placeholder="Lawyer Name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    {...register('initial.legal.phone')}
                    placeholder="Phone Number"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Extension</Label>
                  <Input
                    {...register('initial.legal.extension')}
                    placeholder="Extension"
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    {...register('initial.legal.email')}
                    placeholder="Email Address"
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <Label>File Number</Label>
                  <Input
                    {...register('initial.legal.fileNumber')}
                    placeholder="File Number"
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <Label>Additional Notes</Label>
                  <Textarea
                    {...register('initial.legal.notes')}
                    placeholder="Additional notes about legal representation..."
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}