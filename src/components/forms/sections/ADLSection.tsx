import React from 'react';
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type AssessmentFormData } from '@/lib/validation/assessment-schema';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { 
  FaBath,
  FaShower, 
  FaUser,
  FaTshirt,
  FaUtensils,
  FaHome,
  FaBuilding,
  FaWallet,
  FaPhone,
  FaBed,
  FaShoppingCart,
  FaPills,
  FaEnvelope,
  FaMedkit,
  FaCut,
  FaHandsWash,
  FaWalking,
  FaUserAlt,
  FaBus,
  FaWheelchair
} from 'react-icons/fa';

const independenceLevels = [
  { value: "independent", label: "Independent" },
  { value: "independent_with_mods", label: "Independent with devices and/or modification" },
  { value: "partially_able", label: "Partially able" },
  { value: "unable", label: "Unable" }
];

// Basic ADLs
const basicADLs = [
  {
    title: "Bathing",
    icon: FaBath,
    activities: [
      { name: "Shower", field: "shower", icon: FaShower }
    ]
  },
  {
    title: "Grooming",
    icon: FaCut,
    activities: [
      { name: "Hair Care", field: "hairCare", icon: FaCut },
      { name: "Oral Care", field: "oralCare", icon: FaUser }
    ]
  },
  {
    title: "Dressing",
    icon: FaTshirt,
    activities: [
      { name: "Upper Body", field: "upperBody", icon: FaTshirt },
      { name: "Lower Body", field: "lowerBody", icon: FaTshirt }
    ]
  },
  {
    title: "Toileting",
    icon: FaUser,
    activities: [
      { name: "Toileting", field: "toileting", icon: FaUser }
    ]
  }
];

// Transfers
const transferADLs = [
  {
    title: "Transfers",
    icon: FaWalking,
    activities: [
      { name: "Bed", field: "bedTransfer", icon: FaBed },
      { name: "Toilet", field: "toiletTransfer", icon: FaUser },
      { name: "Shower", field: "showerTransfer", icon: FaShower }
    ]
  }
];

// Mobility
const mobilityADLs = [
  {
    title: "Mobility",
    icon: FaWheelchair,
    activities: [
      { name: "Indoor", field: "indoorMobility", icon: FaWheelchair },
      { name: "Outdoor", field: "outdoorMobility", icon: FaWalking },
      { name: "Stairs", field: "stairs", icon: FaWalking }
    ]
  }
];

// Instrumental ADLs
const instrumentalADLs = [
  {
    title: "Meal Preparation",
    icon: FaUtensils,
    activities: [
      { name: "Light Meals", field: "lightMeals", icon: FaUtensils },
      { name: "Main Meals", field: "mainMeals", icon: FaUtensils }
    ]
  },
  {
    title: "Home Management",
    icon: FaHome,
    activities: [
      { name: "Light Housekeeping", field: "lightHousekeeping", icon: FaHome },
      { name: "Laundry", field: "laundry", icon: FaHome },
      { name: "Heavy Housework", field: "heavyHousework", icon: FaHome }
    ]
  },
  {
    title: "Community Access",
    icon: FaBuilding,
    activities: [
      { name: "Shopping", field: "shopping", icon: FaShoppingCart },
      { name: "Transportation", field: "transportation", icon: FaBus }
    ]
  },
  {
    title: "Medication Management",
    icon: FaMedkit,
    activities: [
      { name: "Medication Organization", field: "medicationOrg", icon: FaPills },
      { name: "Medication Administration", field: "medicationAdmin", icon: FaMedkit }
    ]
  },
  {
    title: "Financial Management",
    icon: FaWallet,
    activities: [
      { name: "Bill Paying", field: "billPaying", icon: FaWallet },
      { name: "Banking", field: "banking", icon: FaWallet }
    ]
  },
  {
    title: "Communication",
    icon: FaPhone,
    activities: [
      { name: "Phone/Device Use", field: "phoneUse", icon: FaPhone },
      { name: "Mail/Email Management", field: "mailManagement", icon: FaEnvelope }
    ]
  }
];

const ADLCategory = ({ category, prefix }) => {
  const { register, setValue, watch } = useFormContext<AssessmentFormData>();
  const Icon = category.icon;
  const fieldPrefix = `${prefix}.${category.title.toLowerCase()}`;
  
  return (
    <div className="space-y-4">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-blue-600" />
          <Label className="font-medium">{category.title}</Label>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label>Independence Level</Label>
          <Select
            onValueChange={(value) => {
              setValue(`${fieldPrefix}.independenceLevel`, value, {
                shouldValidate: true,
                shouldDirty: true
              });
            }}
            defaultValue={watch(`${fieldPrefix}.independenceLevel`) || ""}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select independence level" />
            </SelectTrigger>
            <SelectContent>
              {independenceLevels.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Notes</Label>
          <Textarea
            {...register(`${fieldPrefix}.notes`)}
            placeholder={`Notes about ${category.title.toLowerCase()}`}
            className="mt-1"
          />
        </div>

        {category.activities.map((activity, actIndex) => {
          const ActivityIcon = activity.icon || category.icon;
          return (
            <div key={actIndex} className="space-y-2 pt-4">
              <div className="flex items-center gap-2">
                <ActivityIcon className="h-4 w-4 text-blue-600" />
                <Label>{activity.name}</Label>
              </div>
              <Select
                onValueChange={(value) => {
                  setValue(`${fieldPrefix}.${activity.field}.level`, value, {
                    shouldValidate: true,
                    shouldDirty: true
                  });
                }}
                defaultValue={watch(`${fieldPrefix}.${activity.field}.level`) || ""}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select independence level" />
                </SelectTrigger>
                <SelectContent>
                  {independenceLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                {...register(`${fieldPrefix}.${activity.field}.notes`)}
                placeholder="Additional notes"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const ADLSection = () => {
  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="basic" className="flex items-center gap-2">
          <FaUserAlt className="h-4 w-4" />
          Basic ADLs
        </TabsTrigger>
        <TabsTrigger value="transfers" className="flex items-center gap-2">
          <FaWalking className="h-4 w-4" />
          Transfers
        </TabsTrigger>
        <TabsTrigger value="mobility" className="flex items-center gap-2">
          <FaWheelchair className="h-4 w-4" />
          Mobility
        </TabsTrigger>
        <TabsTrigger value="iadl" className="flex items-center gap-2">
          <FaHome className="h-4 w-4" />
          IADLs
        </TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-6 mt-4">
        {basicADLs.map((category, index) => (
          <ADLCategory 
            key={index} 
            category={category} 
            prefix="adl.basic" 
          />
        ))}
      </TabsContent>

      <TabsContent value="transfers" className="space-y-6 mt-4">
        {transferADLs.map((category, index) => (
          <ADLCategory 
            key={index} 
            category={category} 
            prefix="adl.transfers" 
          />
        ))}
      </TabsContent>

      <TabsContent value="mobility" className="space-y-6 mt-4">
        {mobilityADLs.map((category, index) => (
          <ADLCategory 
            key={index} 
            category={category} 
            prefix="adl.mobility" 
          />
        ))}
      </TabsContent>

      <TabsContent value="iadl" className="space-y-6 mt-4">
        {instrumentalADLs.map((category, index) => (
          <ADLCategory 
            key={index} 
            category={category} 
            prefix="adl.instrumental" 
          />
        ))}
      </TabsContent>
    </Tabs>
  );
};