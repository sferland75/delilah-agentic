import { 
  Bath, 
  Shirt, 
  Utensils, 
  ArrowUpDown,
  User,
  Bed,
  Home,
  Phone,
  Bus,
  CreditCard,
  ShoppingCart,
  Pill,
  Calendar,
  Clock,
  ClipboardList,
  HeartPulse,
  Briefcase,
  Building,
  GraduationCap,
<<<<<<< HEAD
  Activity,
  Car,
  Map,
  Smartphone,
  Computer,
  Book,
  Coffee,
  Music,
  Users,
  Heart
} from 'lucide-react';

export const independenceLevels = [
  { 
    value: "independent", 
    label: "Independent (7) - Complete independence",
    description: "Performs tasks safely without assistance, aids, or modifications"
  },
  { 
    value: "modified_independent", 
    label: "Modified Independent (6) - Uses devices/adaptations",
    description: "Uses assistive devices or takes more time but completes tasks independently"
  },
  { 
    value: "supervision", 
    label: "Supervision (5) - Supervision/setup only",
    description: "Requires supervision, cueing, or setup assistance only"
  },
  { 
    value: "minimal_assistance", 
    label: "Minimal Assistance (4) - >75% independent",
    description: "Performs 75% or more of the task independently"
  },
  { 
    value: "moderate_assistance", 
    label: "Moderate Assistance (3) - 50-75% independent",
    description: "Performs 50-75% of the task independently"
  },
  { 
    value: "maximal_assistance", 
    label: "Maximal Assistance (2) - 25-49% independent",
    description: "Performs 25-49% of the task independently"
  },
  { 
    value: "total_assistance", 
    label: "Total Assistance (1) - <25% independent",
    description: "Performs less than 25% of the task independently"
  },
  { 
    value: "not_applicable", 
    label: "Activity Not Applicable",
    description: "Activity is not relevant to client's situation"
  }
=======
  Activity
} from 'lucide-react';

export const independenceLevels = [
  { value: "independent", label: "Independent (7) - Complete independence" },
  { value: "modified_independent", label: "Modified Independent (6) - Uses devices/adaptations" },
  { value: "supervision", label: "Supervision (5) - Supervision/setup only" },
  { value: "minimal_assistance", label: "Minimal Assistance (4) - >75% independent" },
  { value: "moderate_assistance", label: "Moderate Assistance (3) - 50-75% independent" },
  { value: "maximal_assistance", label: "Maximal Assistance (2) - 25-49% independent" },
  { value: "total_assistance", label: "Total Assistance (1) - <25% independent" },
  { value: "not_applicable", label: "Activity Not Applicable" }
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
];

export const adlCategories = {
  bathing: {
    title: "Bathing & Hygiene",
    icon: Bath,
    items: [
<<<<<<< HEAD
      { 
        id: "shower", 
        title: "Bathing/Showering", 
        icon: Bath,
        requiresAssistiveDevices: true,
        requiresFrequency: true,
        requiresTimeTaken: true,
        subtitle: "Including tub or shower use"
      },
      { 
        id: "grooming", 
        title: "Grooming", 
        subtitle: "Hair care, shaving, makeup",
        icon: User,
        requiresAssistiveDevices: true,
        requiresFrequency: true
      },
      { 
        id: "oral_care", 
        title: "Oral Care",
        subtitle: "Brushing teeth, oral hygiene", 
        icon: User,
        requiresFrequency: true
      },
      { 
        id: "toileting", 
        title: "Toileting", 
        icon: Bath,
        requiresAssistiveDevices: true,
        subtitle: "Using the bathroom"
      }
=======
      { id: "shower", title: "Bathing/Showering", icon: Bath },
      { id: "grooming", title: "Grooming", icon: User },
      { id: "oral_care", title: "Oral Care", icon: User },
      { id: "toileting", title: "Toileting", icon: Bath }
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
    ]
  },
  dressing: {
    title: "Dressing",
    icon: Shirt,
    items: [
<<<<<<< HEAD
      { 
        id: "upper_body", 
        title: "Upper Body Dressing", 
        icon: Shirt,
        requiresAssistiveDevices: true,
        requiresTimeTaken: true,
        subtitle: "Shirts, jackets, etc."
      },
      { 
        id: "lower_body", 
        title: "Lower Body Dressing", 
        icon: Shirt,
        requiresAssistiveDevices: true,
        requiresTimeTaken: true,
        subtitle: "Pants, skirts, shoes"
      },
      { 
        id: "footwear", 
        title: "Footwear Management", 
        icon: Shirt,
        requiresAssistiveDevices: true,
        subtitle: "Shoes, socks, orthotics"
      }
=======
      { id: "upper_body", title: "Upper Body Dressing", icon: Shirt },
      { id: "lower_body", title: "Lower Body Dressing", icon: Shirt },
      { id: "footwear", title: "Footwear Management", icon: Shirt }
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
    ]
  },
  feeding: {
    title: "Feeding",
    icon: Utensils,
    items: [
<<<<<<< HEAD
      { 
        id: "eating", 
        title: "Eating", 
        icon: Utensils,
        requiresAssistiveDevices: true,
        requiresFrequency: true,
        subtitle: "Using utensils, cups"
      },
      { 
        id: "setup", 
        title: "Meal Setup", 
        icon: Utensils,
        requiresAssistiveDevices: true,
        requiresTimeTaken: true,
        subtitle: "Food preparation, plating"
      },
      { 
        id: "drinking", 
        title: "Drinking", 
        icon: Utensils,
        requiresAssistiveDevices: true,
        subtitle: "Managing liquids safely"
      }
=======
      { id: "eating", title: "Eating", icon: Utensils },
      { id: "setup", title: "Meal Setup", icon: Utensils },
      { id: "drinking", title: "Drinking", icon: Utensils }
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
    ]
  },
  transfers: {
    title: "Functional Mobility",
    icon: ArrowUpDown,
    items: [
<<<<<<< HEAD
      { 
        id: "bed_transfer", 
        title: "Bed Transfers", 
        subtitle: "Moving in/out of bed", 
        icon: Bed,
        requiresAssistiveDevices: true,
        requiresTimeTaken: true
      },
      { 
        id: "toilet_transfer", 
        title: "Toilet Transfers", 
        icon: ArrowUpDown,
        requiresAssistiveDevices: true,
        requiresTimeTaken: true
      },
      { 
        id: "shower_transfer", 
        title: "Shower/Tub Transfers", 
        icon: Bath,
        requiresAssistiveDevices: true,
        requiresTimeTaken: true,
        subtitle: "Getting in/out of shower or tub"
      },
      { 
        id: "vehicle_transfer", 
        title: "Vehicle Transfers", 
        icon: Car,
        requiresAssistiveDevices: true,
        requiresTimeTaken: true,
        subtitle: "Getting in/out of vehicles"
      },
      { 
        id: "position_changes", 
        title: "Position Changes", 
        subtitle: "Sit to stand, chair transfers", 
        icon: ArrowUpDown,
        requiresAssistiveDevices: true,
        requiresTimeTaken: true
      }
=======
      { id: "bed_transfer", title: "Bed Transfers", subtitle: "Moving in bed, getting in/out of bed", icon: Bed },
      { id: "toilet_transfer", title: "Toilet Transfers", icon: ArrowUpDown },
      { id: "shower_transfer", title: "Shower/Tub Transfers", icon: ArrowUpDown },
      { id: "position_changes", title: "Position Changes", subtitle: "Sit to stand, chair transfers", icon: ArrowUpDown }
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
    ]
  }
};

export const iadlCategories = {
  household: {
    title: "Household Management",
    icon: Home,
    items: [
<<<<<<< HEAD
      { 
        id: "cleaning", 
        title: "House Cleaning",
        subtitle: "Regular cleaning tasks", 
        icon: Home,
        requiresFrequency: true,
        requiresTimeTaken: true,
        requiresAssistiveDevices: true
      },
      { 
        id: "laundry", 
        title: "Laundry", 
        icon: Shirt,
        requiresFrequency: true,
        requiresTimeTaken: true,
        requiresAssistiveDevices: true
      },
      { 
        id: "meal_prep", 
        title: "Meal Preparation", 
        icon: Utensils,
        requiresFrequency: true,
        requiresTimeTaken: true,
        requiresAssistiveDevices: true
      },
      { 
        id: "home_maintenance", 
        title: "Home Maintenance", 
        subtitle: "Basic repairs, yard work", 
        icon: Home,
        requiresFrequency: true,
        requiresAssistiveDevices: true
      }
=======
      { id: "cleaning", title: "House Cleaning", icon: Home },
      { id: "laundry", title: "Laundry", icon: Shirt },
      { id: "meal_prep", title: "Meal Preparation", icon: Utensils },
      { id: "home_maintenance", title: "Home Maintenance", subtitle: "Basic repairs, yard work", icon: Home }
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
    ]
  },
  community: {
    title: "Community Integration",
    icon: Bus,
    items: [
<<<<<<< HEAD
      { 
        id: "transportation", 
        title: "Transportation", 
        subtitle: "Driving, public transit use", 
        icon: Car,
        requiresFrequency: true,
        requiresAssistiveDevices: true
      },
      { 
        id: "shopping", 
        title: "Shopping", 
        icon: ShoppingCart,
        requiresFrequency: true,
        requiresAssistiveDevices: true,
        requiresTimeTaken: true
      },
      { 
        id: "money_management", 
        title: "Financial Management", 
        icon: CreditCard,
        requiresFrequency: true,
        requiresAssistiveDevices: true
      },
      { 
        id: "navigation", 
        title: "Community Navigation", 
        subtitle: "Finding locations, following directions", 
        icon: Map,
        requiresAssistiveDevices: true
      }
    ]
  },
  communication: {
    title: "Communication & Technology",
    icon: Smartphone,
    items: [
      {
        id: "phone",
        title: "Phone Use",
        subtitle: "Making calls, texting",
        icon: Phone,
        requiresAssistiveDevices: true,
        requiresFrequency: true
      },
      {
        id: "computer",
        title: "Computer/Device Use",
        subtitle: "Email, internet, basic functions",
        icon: Computer,
        requiresAssistiveDevices: true,
        requiresFrequency: true
      },
      {
        id: "written",
        title: "Written Communication",
        subtitle: "Writing, typing, form completion",
        icon: Book,
        requiresAssistiveDevices: true,
        requiresFrequency: true
      }
    ]
  },
  leisure: {
    title: "Leisure & Social Activities",
    icon: Heart,
    items: [
      {
        id: "hobbies",
        title: "Hobbies & Interests",
        subtitle: "Reading, crafts, games",
        icon: Heart,
        requiresFrequency: true,
        requiresAssistiveDevices: true
      },
      {
        id: "social",
        title: "Social Participation",
        subtitle: "Visiting friends/family, social events",
        icon: Users,
        requiresFrequency: true
      },
      {
        id: "recreation",
        title: "Physical Recreation",
        subtitle: "Exercise, sports, outdoor activities",
        icon: Activity,
        requiresFrequency: true,
        requiresAssistiveDevices: true,
        requiresTimeTaken: true
      }
=======
      { id: "transportation", title: "Transportation", subtitle: "Driving, public transit use", icon: Bus },
      { id: "shopping", title: "Shopping", icon: ShoppingCart },
      { id: "money_management", title: "Financial Management", icon: CreditCard },
      { id: "communication", title: "Communication", subtitle: "Phone, mail, email", icon: Phone }
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
    ]
  }
};

export const healthCategories = {
  management: {
    title: "Health Management",
    icon: HeartPulse,
    items: [
<<<<<<< HEAD
      { 
        id: "medications", 
        title: "Medication Management",
        subtitle: "Taking medications correctly and on schedule", 
        icon: Pill,
        requiresFrequency: true,
        requiresAssistiveDevices: true
      },
      { 
        id: "appointments", 
        title: "Medical Appointments",
        subtitle: "Scheduling and attending appointments", 
        icon: Calendar,
        requiresFrequency: true
      },
      { 
        id: "monitoring", 
        title: "Health Monitoring",
        subtitle: "Vitals, symptoms, etc.", 
        icon: Activity,
        requiresFrequency: true,
        requiresAssistiveDevices: true
      },
      { 
        id: "exercise", 
        title: "Exercise/Activity",
        subtitle: "Prescribed exercises, physical activity", 
        icon: Activity,
        requiresFrequency: true,
        requiresTimeTaken: true
      }
=======
      { id: "medications", title: "Medication Management", icon: Pill },
      { id: "appointments", title: "Medical Appointments", icon: Calendar },
      { id: "monitoring", title: "Health Monitoring", subtitle: "Vitals, symptoms, etc.", icon: Activity },
      { id: "exercise", title: "Exercise/Activity", icon: Activity }
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
    ]
  },
  routine: {
    title: "Health Routine",
    icon: Clock,
    items: [
<<<<<<< HEAD
      { 
        id: "sleep", 
        title: "Sleep Management",
        subtitle: "Sleep schedule, quality, and routines", 
        icon: Bed,
        requiresAssistiveDevices: true
      },
      { 
        id: "stress", 
        title: "Stress Management",
        subtitle: "Coping strategies, relaxation techniques", 
        icon: Activity,
        requiresFrequency: true
      },
      { 
        id: "nutrition", 
        title: "Nutrition Management",
        subtitle: "Diet planning, following restrictions", 
        icon: Utensils,
        requiresFrequency: true
      }
=======
      { id: "sleep", title: "Sleep Management", icon: Bed },
      { id: "stress", title: "Stress Management", icon: Activity },
      { id: "nutrition", title: "Nutrition Management", icon: Utensils }
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
    ]
  }
};

export const workCategories = {
  status: {
    title: "Work Status",
    icon: Briefcase,
    items: [
<<<<<<< HEAD
      { 
        id: "current_status", 
        title: "Current Work Status",
        subtitle: "Employment situation, work capacity", 
        icon: Briefcase
      },
      { 
        id: "workplace_accommodations", 
        title: "Workplace Accommodations",
        subtitle: "Required modifications and equipment", 
        icon: Building,
        requiresAssistiveDevices: true
      },
      { 
        id: "training_needs", 
        title: "Training/Education Needs",
        subtitle: "Required skills development", 
        icon: GraduationCap
      },
      { 
        id: "barriers", 
        title: "Return to Work Barriers",
        subtitle: "Physical/cognitive limitations, environmental factors", 
        icon: ClipboardList
      }
=======
      { id: "current_status", title: "Current Work Status", icon: Briefcase },
      { id: "workplace_accommodations", title: "Workplace Accommodations", icon: Building },
      { id: "training_needs", title: "Training/Education Needs", icon: GraduationCap },
      { id: "barriers", title: "Return to Work Barriers", icon: ClipboardList }
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
    ]
  }
};