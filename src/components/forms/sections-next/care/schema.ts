import { z } from "zod";

export const CareActivitySchema = z.object({
  minutes: z.number().min(0),
  timesPerWeek: z.number().min(0),
  totalMinutes: z.number().min(0),
});

export const Level1Schema = z.object({
  dress: z.object({
    upperBody: CareActivitySchema,
    lowerBody: CareActivitySchema,
  }),
  undress: z.object({
    upperBody: CareActivitySchema,
    lowerBody: CareActivitySchema,
  }),
  prosthetics: z.object({
    appliesLimbAndSock: CareActivitySchema,
    exchangesDevices: CareActivitySchema,
    maintenance: CareActivitySchema,
  }),
  orthotics: z.object({
    assists: CareActivitySchema,
  }),
  grooming: z.object({
    face: CareActivitySchema,
    hands: CareActivitySchema,
    shaving: CareActivitySchema,
    cosmetics: CareActivitySchema,
    hair: z.object({
      brushing: CareActivitySchema,
      washing: CareActivitySchema,
      styling: CareActivitySchema,
    }),
    fingernails: CareActivitySchema,
    toenails: CareActivitySchema,
  }),
  feeding: z.object({
    preparation: CareActivitySchema,
    assistance: CareActivitySchema,
  }),
  mobility: z.object({
    sitting: CareActivitySchema,
    walking: CareActivitySchema,
    transfers: CareActivitySchema,
  }),
  laundering: z.object({
    incontinence: CareActivitySchema,
    orthotics: CareActivitySchema,
  }),
});

export const Level2Schema = z.object({
  hygiene: z.object({
    bathroom: z.object({
      cleaning: CareActivitySchema,
    }),
    bedroom: z.object({
      cleaning: CareActivitySchema,
      comfort: CareActivitySchema,
    }),
    clothing: z.object({
      preparation: CareActivitySchema,
      sorting: CareActivitySchema,
    }),
  }),
  basicSupervisory: z.object({
    tracheostomy: CareActivitySchema,
    transfers: CareActivitySchema,
    wheelchair: CareActivitySchema,
    behavioural: CareActivitySchema,
  }),
  coordination: z.object({
    scheduling: CareActivitySchema,
  }),
});

export const Level3Schema = z.object({
  genitourinary: z.object({
    catheterization: CareActivitySchema,
    drainage: CareActivitySchema,
    cleaning: CareActivitySchema,
    disposable: CareActivitySchema,
    menstrual: CareActivitySchema,
    residuals: CareActivitySchema,
  }),
  bowel: z.object({
    enemas: CareActivitySchema,
    colostomy: CareActivitySchema,
    drainage: CareActivitySchema,
    disposable: CareActivitySchema,
    cleaning: CareActivitySchema,
  }),
  tracheostomy: z.object({
    cannulae: CareActivitySchema,
    tapes: CareActivitySchema,
    suctioning: CareActivitySchema,
    equipment: CareActivitySchema,
  }),
  ventilator: z.object({
    volume: CareActivitySchema,
    humidification: CareActivitySchema,
    tubing: CareActivitySchema,
    cleaning: CareActivitySchema,
    settings: CareActivitySchema,
    reattachment: CareActivitySchema,
  }),
  exercise: z.object({
    stretching: CareActivitySchema,
    walking: CareActivitySchema,
  }),
  skinCare: z.object({
    wounds: CareActivitySchema,
    dressings: CareActivitySchema,
    creams: CareActivitySchema,
    monitoring: CareActivitySchema,
    turning: CareActivitySchema,
  }),
  medication: z.object({
    oral: z.object({
      administration: CareActivitySchema,
      monitoring: CareActivitySchema,
      supply: CareActivitySchema,
    }),
    injections: z.object({
      administration: CareActivitySchema,
      monitoring: CareActivitySchema,
      supply: CareActivitySchema,
    }),
    inhalation: z.object({
      administration: CareActivitySchema,
      supply: CareActivitySchema,
      equipment: CareActivitySchema,
    }),
  }),
  bathing: z.object({
    shower: z.object({
      transfers: CareActivitySchema,
      bathing: CareActivitySchema,
      skinCare: CareActivitySchema,
    }),
    bed: z.object({
      preparation: CareActivitySchema,
      bathing: CareActivitySchema,
      skinCare: CareActivitySchema,
      equipment: CareActivitySchema,
    }),
    oral: z.object({
      brushing: CareActivitySchema,
      cleaning: CareActivitySchema,
      dentures: CareActivitySchema,
    }),
  }),
  therapy: z.object({
    tens: z.object({
      preparation: CareActivitySchema,
      administration: CareActivitySchema,
    }),
    dcs: z.object({
      monitoring: CareActivitySchema,
      maintenance: CareActivitySchema,
    }),
  }),
  maintenance: z.object({
    supplies: CareActivitySchema,
    equipment: CareActivitySchema,
  }),
  skilledSupervisory: z.object({
    behaviour: CareActivitySchema,
  }),
});

export const CareRequirementsSchema = z.object({
  level1: Level1Schema,
  level2: Level2Schema,
  level3: Level3Schema,
  summary: z.object({
    level1: z.object({
      totalMinutes: z.number(),
      weeklyHours: z.number(),
      monthlyHours: z.number(),
      monthlyCost: z.number(),
    }),
    level2: z.object({
      totalMinutes: z.number(),
      weeklyHours: z.number(),
      monthlyHours: z.number(),
      monthlyCost: z.number(),
    }),
    level3: z.object({
      totalMinutes: z.number(),
      weeklyHours: z.number(),
      monthlyHours: z.number(),
      monthlyCost: z.number(),
    }),
    totalMonthlyCost: z.number(),
  }),
});

export type CareRequirements = z.infer<typeof CareRequirementsSchema>;