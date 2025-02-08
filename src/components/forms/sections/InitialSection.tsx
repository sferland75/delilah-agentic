import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAssessmentForm } from '@/context/FormProvider';
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Import from Phosphor Icons
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

// Import from React Icons
import { 
  FaUserCircle, 
  FaAddressCard,
  FaBirthdayCake
} from 'react-icons/fa';

export const InitialSection = () => {
  const { formData, updateForm } = useAssessmentForm();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateForm({
      initial: {
        ...formData.initial,
        personal: {
          ...formData.initial?.personal,
          [name]: value
        }
      }
    });
  };

  const personal = formData.initial?.personal || {};

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
                name="firstName"
                value={personal.firstName || ''}
                onChange={handleChange}
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
                name="lastName"
                value={personal.lastName || ''}
                onChange={handleChange}
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
                name="dateOfBirth"
                type="date"
                value={personal.dateOfBirth || ''}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone size={18} className="text-blue-600" />
                Phone
              </Label>
              <Input
                id="phone"
                name="phone"
                value={personal.phone || ''}
                onChange={handleChange}
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
                name="email"
                type="email"
                value={personal.email || ''}
                onChange={handleChange}
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
                name="streetAddress"
                value={personal.streetAddress || ''}
                onChange={handleChange}
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
                name="city"
                value={personal.city || ''}
                onChange={handleChange}
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
                name="postalCode"
                value={personal.postalCode || ''}
                onChange={handleChange}
                placeholder="Postal Code"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};