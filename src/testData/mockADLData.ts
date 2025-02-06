export const mockADLData = {
  basicADL: {
    feeding: {
      independence: "Modified Independent",
      assistance: "Setup/Cleanup only",
      equipment: ["Built-up utensils", "Non-slip mat"],
      notes: "Able to feed self with adaptive equipment. Some difficulty with cutting food."
    },
    dressing: {
      independence: "Modified Independent",
      assistance: "Minimal",
      equipment: ["Button hook", "Long-handled shoe horn"],
      notes: "Needs help with buttons and socks. Can manage most clothing independently."
    },
    bathing: {
      independence: "Modified Independent",
      assistance: "Standby",
      equipment: ["Shower chair", "Hand-held shower", "Grab bars"],
      notes: "Requires standby assistance for safety. Uses shower chair and grab bars."
    },
    toileting: {
      independence: "Modified Independent",
      assistance: "Minimal",
      equipment: ["Raised toilet seat", "Grab bars"],
      notes: "Uses raised toilet seat with grab bars. Occasionally needs help with clothing adjustment."
    },
    transferring: {
      independence: "Modified Independent",
      assistance: "Supervision",
      equipment: ["Transfer board", "Bed rail"],
      notes: "Supervision needed for safety during transfers. Uses bed rail for support."
    },
    mobility: {
      independence: "Modified Independent",
      assistance: "Standby",
      equipment: ["Walker", "Cane"],
      notes: "Uses walker for longer distances, cane in home. Requires standby assistance on stairs."
    }
  },
  instrumentalADL: {
    mealPrep: {
      independence: "Modified Independent",
      assistance: "Setup",
      equipment: ["Kitchen trolley", "Electric can opener"],
      notes: "Can prepare simple meals. Difficulty with heavy pots and prolonged standing."
    },
    housekeeping: {
      independence: "Modified Independent",
      assistance: "Moderate",
      equipment: ["Long-handled duster", "Grabber"],
      notes: "Can manage light housekeeping. Needs help with heavy cleaning and high reaches."
    },
    laundry: {
      independence: "Modified Independent",
      assistance: "Minimal",
      equipment: ["Rolling laundry cart"],
      notes: "Can do laundry but needs help carrying basket up/down stairs."
    },
    transportation: {
      independence: "Modified Independent",
      assistance: "Minimal",
      equipment: ["Car transfer handle", "Swivel seat cushion"],
      notes: "Can drive but avoids long distances. Uses adaptations for car transfers."
    },
    shopping: {
      independence: "Modified Independent",
      assistance: "Minimal",
      equipment: ["Shopping cart", "Grabber"],
      notes: "Can shop for essentials. Difficulty with heavy items and reaching high shelves."
    },
    medications: {
      independence: "Independent",
      assistance: "Setup only",
      equipment: ["Pill organizer", "Automatic reminders"],
      notes: "Manages medications independently with organizer. No errors reported."
    },
    finances: {
      independence: "Independent",
      assistance: "None",
      equipment: ["Online banking", "Bill pay services"],
      notes: "Manages finances independently. Uses online services to minimize paper handling."
    }
  },
  healthManagement: {
    appointments: {
      independence: "Modified Independent",
      assistance: "Scheduling only",
      equipment: ["Calendar app", "Reminder system"],
      notes: "Manages medical appointments with electronic reminders. Family helps with scheduling."
    },
    exerciseRoutine: {
      independence: "Modified Independent",
      assistance: "Setup/Supervision",
      equipment: ["Exercise bands", "Ankle weights"],
      notes: "Follows home exercise program. Needs supervision for new exercises."
    },
    painManagement: {
      independence: "Independent",
      assistance: "None",
      equipment: ["TENS unit", "Ice/heat packs"],
      notes: "Uses combination of medication and modalities effectively. Good understanding of pain management strategies."
    },
    symptomMonitoring: {
      independence: "Independent",
      assistance: "None",
      equipment: ["Blood pressure monitor", "Pain diary"],
      notes: "Tracks symptoms daily. Reports changes appropriately to healthcare team."
    }
  },
  workStatus: {
    currentWork: {
      status: "Modified duties",
      hours: "20 hours/week",
      restrictions: [
        "No lifting over 10 lbs",
        "No prolonged standing",
        "Regular position changes",
        "No overhead reaching"
      ],
      accommodations: [
        "Ergonomic workstation",
        "Flexible schedule",
        "Regular breaks",
        "Work from home option"
      ],
      notes: "Currently working modified duties with accommodations. Tolerating 4-hour shifts well."
    },
    barriers: [
      "Physical limitations with lifting and carrying",
      "Fatigue with full workday", 
      "Pain with prolonged sitting",
      "Limited ability to perform manual tasks"
    ],
    goals: [
      "Increase work hours to 30/week within 3 months",
      "Return to regular duties with modifications",
      "Maintain sustainable work-life balance"
    ]
  }
};

export default mockADLData;