import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { 
  IdentificationCard,
  User,
  Calendar,
  Phone,
  Envelope,
  MapPin,
  Buildings,
  House
} from "@phosphor-icons/react";
import { 
  FaUserCircle, 
  FaAddressCard,
  FaBirthdayCake
} from 'react-icons/fa';

export const InitialSection = () => {
  const { register, watch } = useFormContext();
  const personal = watch('initial.personal') || {};

  return (
    <div className="space-y-6">
      {/* Personal Information Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-6">
            <IdentificationCard size={24} className="text-blue-600" weight="duotone" />
            <h3 className="text-lg font-semibold">Personal Information</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="flex items-center gap-2">
                <User size={18} className="text-blue-600" />
                First Name
              </Label>
              <Input
                id="firstName"
                {...register('initial.personal.firstName')}
                placeholder="First Name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="flex items-center gap-2">
                <FaUserCircle size={16} className="text-blue-600" />
                Last Name
              </Label>
              <Input
                id="lastName"
                {...register('initial.personal.lastName')}
                placeholder="Last Name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="flex items-center gap-2">
                <FaBirthdayCake size={16} className="text-blue-600" />
                Date of Birth
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...register('initial.personal.dateOfBirth')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone size={18} className="text-blue-600" />
                Phone
              </Label>
              <Input
                id="phone"
                {...register('initial.personal.phone')}
                placeholder="Phone Number"
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Envelope size={18} className="text-blue-600" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                {...register('initial.personal.email')}
                placeholder="Email Address"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-6">
            <MapPin size={24} className="text-blue-600" weight="duotone" />
            <h3 className="text-lg font-semibold">Address Information</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="streetAddress" className="flex items-center gap-2">
                <House size={18} className="text-blue-600" />
                Street Address
              </Label>
              <Input
                id="streetAddress"
                {...register('initial.personal.streetAddress')}
                placeholder="Street Address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city" className="flex items-center gap-2">
                <Buildings size={18} className="text-blue-600" />
                City
              </Label>
              <Input
                id="city"
                {...register('initial.personal.city')}
                placeholder="City"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode" className="flex items-center gap-2">
                <FaAddressCard size={16} className="text-blue-600" />
                Postal Code
              </Label>
              <Input
                id="postalCode"
                {...register('initial.personal.postalCode')}
                placeholder="Postal Code"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};