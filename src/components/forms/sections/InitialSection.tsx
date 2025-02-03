import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormContext } from '@/context/FormContext';

export const InitialSection = () => {
  const { formData, updateFormData } = useFormContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData({
      ...formData,
      personal: {
        ...formData.personal,
        [name]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.personal?.firstName || ''}
            onChange={handleChange}
            placeholder="First Name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.personal?.lastName || ''}
            onChange={handleChange}
            placeholder="Last Name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={formData.personal?.dateOfBirth || ''}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.personal?.phone || ''}
            onChange={handleChange}
            placeholder="Phone Number"
          />
        </div>

        <div className="space-y-2 col-span-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.personal?.email || ''}
            onChange={handleChange}
            placeholder="Email Address"
          />
        </div>
      </div>
    </div>
  );
};