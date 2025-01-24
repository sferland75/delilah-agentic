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
];

export const adlCategories = {
  bathing: {
    title: "Bathing & Hygiene",
    icon: Bath,
    items: [
      { id: "shower", title: "Bathing/Showering", icon: Bath },
      { id: "grooming", title: "Grooming", icon: User },
      { id: "oral_care", title: "Oral Care", icon: User },
      { id: "toileting", title: "Toileting", icon: Bath }
    ]
  },
  dressing: {
    title: "Dressing",
    icon: Shirt,
    items: [
      { id: "upper_body", title: "Upper Body Dressing", icon: Shirt },
      { id: "lower_body", title: "Lower Body Dressing", icon: Shirt },
      { id: "footwear", title: "Footwear Management", icon: Shirt }
    ]
  },
  feeding: {
    title: "Feeding",
    icon: Utensils,
    items: [
      { id: "eating", title: "Eating", icon: Utensils },
      { id: "setup", title: "Meal Setup", icon: Utensils },
      { id: "drinking", title: "Drinking", icon: Utensils }
    ]
  },
  transfers: {
    title: "Functional Mobility",
    icon: ArrowUpDown,
    items: [
      { id: "bed_transfer", title: "Bed Transfers", subtitle: "Moving in bed, getting in/out of bed", icon: Bed },
      { id: "toilet_transfer", title: "Toilet Transfers", icon: ArrowUpDown },
      { id: "shower_transfer", title: "Shower/Tub Transfers", icon: ArrowUpDown },
      { id: "position_changes", title: "Position Changes", subtitle: "Sit to stand, chair transfers", icon: ArrowUpDown }
    ]
  }
};

export const iadlCategories = {
  household: {
    title: "Household Management",
    icon: Home,
    items: [
      { id: "cleaning", title: "House Cleaning", icon: Home },
      { id: "laundry", title: "Laundry", icon: Shirt },
      { id: "meal_prep", title: "Meal Preparation", icon: Utensils },
      { id: "home_maintenance", title: "Home Maintenance", subtitle: "Basic repairs, yard work", icon: Home }
    ]
  },
  community: {
    title: "Community Integration",
    icon: Bus,
    items: [
      { id: "transportation", title: "Transportation", subtitle: "Driving, public transit use", icon: Bus },
      { id: "shopping", title: "Shopping", icon: ShoppingCart },
      { id: "money_management", title: "Financial Management", icon: CreditCard },
      { id: "communication", title: "Communication", subtitle: "Phone, mail, email", icon: Phone }
    ]
  }
};

export const healthCategories = {
  management: {
    title: "Health Management",
    icon: HeartPulse,
    items: [
      { id: "medications", title: "Medication Management", icon: Pill },
      { id: "appointments", title: "Medical Appointments", icon: Calendar },
      { id: "monitoring", title: "Health Monitoring", subtitle: "Vitals, symptoms, etc.", icon: Activity },
      { id: "exercise", title: "Exercise/Activity", icon: Activity }
    ]
  },
  routine: {
    title: "Health Routine",
    icon: Clock,
    items: [
      { id: "sleep", title: "Sleep Management", icon: Bed },
      { id: "stress", title: "Stress Management", icon: Activity },
      { id: "nutrition", title: "Nutrition Management", icon: Utensils }
    ]
  }
};

export const workCategories = {
  status: {
    title: "Work Status",
    icon: Briefcase,
    items: [
      { id: "current_status", title: "Current Work Status", icon: Briefcase },
      { id: "workplace_accommodations", title: "Workplace Accommodations", icon: Building },
      { id: "training_needs", title: "Training/Education Needs", icon: GraduationCap },
      { id: "barriers", title: "Return to Work Barriers", icon: ClipboardList }
    ]
  }
};