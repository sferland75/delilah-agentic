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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { type AssessmentFormData } from '@/lib/validation/assessment-schema';
import { HousekeepingAssessment } from './HousekeepingAssessment';
import { 
  FaUserAlt,
  FaWalking,
  FaWheelchair,
  FaHome,
  FaBroom,
  FaBath,
  FaShower, 
  FaUser,
  FaTshirt,
  FaUtensils,
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
  FaBus,
  FaCar,
  FaArrowsAlt,
  FaToilet,
  FaTeeth,
  FaChair
} from 'react-icons/fa';

// ... rest of your imports ...

const basicADLs = [
  {
    title: "Bathing",
    icon: FaBath,
    activities: [
      { name: "Shower/Bath", field: "shower", icon: FaShower }
    ]
  },
  {
    title: "Grooming",
    icon: FaCut,
    activities: [
      { name: "Hair Care", field: "hairCare", icon: FaCut },
      { name: "Oral Care", field: "oralCare", icon: FaTeeth },
      { name: "Facial Care", field: "facialCare", icon: FaUser }
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
    icon: FaToilet,
    activities: [
      { name: "Toileting", field: "toileting", icon: FaToilet }
    ]
  }
];

const transferADLs = [
  {
    title: "Transfers",
    icon: FaWalking,
    activities: [
      { name: "Bed", field: "bedTransfer", icon: FaBed },
      { name: "Toilet", field: "toiletTransfer", icon: FaToilet },
      { name: "Shower/Tub", field: "showerTransfer", icon: FaBath },
      { name: "Vehicle", field: "vehicleTransfer", icon: FaCar },
      { name: "Chair/Position Changes", field: "positionChanges", icon: FaChair }
    ]
  }
];

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

const independenceLevels = [
  { value: "independent", label: "Independent" },
  { value: "independent_with_mods", label: "Independent with devices and/or modification" },
  { value: "partially_able", label: "Partially able" },
  { value: "unable", label: "Unable" }
];

const ADLCategory = ({ category, prefix }) => {
  const { register, setValue, watch } = useFormContext();
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

export function ADLSection() {
  return (
    <div className="p-6">
      <Tabs defaultValue="basic" className="w-full">
        <div className="bg-slate-100/80 p-1 rounded-md mb-6">
          <TabsList className="grid w-full grid-cols-5 gap-1">
            <TabsTrigger 
              value="basic" 
              className="data-[state=active]:bg-[#2563EB] data-[state=active]:text-white text-slate-600 hover:bg-slate-200"
            >
              <div className="flex items-center gap-2">
                <FaUserAlt className="h-4 w-4" />
                <span>Basic ADLs</span>
              </div>
            </TabsTrigger>
            
            <TabsTrigger 
              value="transfers" 
              className="data-[state=active]:bg-[#2563EB] data-[state=active]:text-white text-slate-600 hover:bg-slate-200"
            >
              <div className="flex items-center gap-2">
                <FaWalking className="h-4 w-4" />
                <span>Transfers</span>
              </div>
            </TabsTrigger>
            
            <TabsTrigger 
              value="mobility" 
              className="data-[state=active]:bg-[#2563EB] data-[state=active]:text-white text-slate-600 hover:bg-slate-200"
            >
              <div className="flex items-center gap-2">
                <FaWheelchair className="h-4 w-4" />
                <span>Mobility</span>
              </div>
            </TabsTrigger>
            
            <TabsTrigger 
              value="iadl" 
              className="data-[state=active]:bg-[#2563EB] data-[state=active]:text-white text-slate-600 hover:bg-slate-200"
            >
              <div className="flex items-center gap-2">
                <FaHome className="h-4 w-4" />
                <span>IADLs</span>
              </div>
            </TabsTrigger>
            
            <TabsTrigger 
              value="housekeeping" 
              className="data-[state=active]:bg-[#2563EB] data-[state=active]:text-white text-slate-600 hover:bg-slate-200"
            >
              <div className="flex items-center gap-2">
                <FaBroom className="h-4 w-4" />
                <span>Housekeeping</span>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="basic">
          <div className="space-y-6 mt-6">
            {basicADLs.map((category, index) => (
              <ADLCategory 
                key={index} 
                category={category} 
                prefix="adl.basic" 
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transfers">
          <div className="space-y-6 mt-6">
            {transferADLs.map((category, index) => (
              <ADLCategory 
                key={index} 
                category={category} 
                prefix="adl.transfers" 
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mobility">
          <div className="space-y-6 mt-6">
            {mobilityADLs.map((category, index) => (
              <ADLCategory 
                key={index} 
                category={category} 
                prefix="adl.mobility" 
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="iadl">
          <div className="space-y-6 mt-6">
            {instrumentalADLs.map((category, index) => (
              <ADLCategory 
                key={index} 
                category={category} 
                prefix="adl.instrumental" 
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="housekeeping">
          <div className="mt-6">
            <HousekeepingAssessment />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};