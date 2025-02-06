import { z } from 'zod';

// Level 1 - Routine Personal Care
const level1Schema = z.object({
  dress: z.object({
    upperBody: z.object({
      minutes: z.number(),
      timesPerWeek: z.number(),
      justification: z.string().optional(),
    }),
    lowerBody: z.object({
      minutes: z.number(),
      timesPerWeek: z.number(),
      justification: z.string().optional(),
    })
  }),
  undress: z.object({
    upperBody: z.object({
      minutes: z.number(),
      timesPerWeek: z.number(),
      justification: z.string().optional(),
    }),
    lowerBody: z.object({
      minutes: z.number(),
      timesPerWeek: z.number(),
      justification: z.string().optional(),
    })
  }),
  prosthetics: z.object({
    apply: z.object({
      minutes: z.number(),
      timesPerWeek: z.number(),
      justification: z.string().optional(),
    }),
    maintenance: z.object({
      minutes: z.number(),
      timesPerWeek: z.number(),
      justification: z.string().optional(),
    })
  }),
  orthotics: z.object({
    minutes: z.number(),
    timesPerWeek: z.number(),
    justification: z.string().optional(),
  }),
  grooming: z.object({
    face: z.object({
      minutes: z.number(),
      timesPerWeek: z.number(),
      justification: z.string().optional(),
    }),
    hands: z.object({
      minutes: z.number(),
      timesPerWeek: z.number(),
      justification: z.string().optional(),
    }),
    shaving: z.object({
      minutes: z.number(),
      timesPerWeek: z.number(),
      justification: z.string().optional(),
    }),
    hair: z.object({
      minutes: z.number(),
      timesPerWeek: z.number(),
      justification: z.string().optional(),
    }),
    nails: z.object({
      minutes: z.number(),
      timesPerWeek: z.number(),
      justification: z.string().optional(),
    })
  }),
  feeding: z.object({
    preparation: z.object({
      minutes: z.number(),
      timesPerWeek: z.number(),
      justification: z.string().optional(),
    }),
    assistance: z.object({
      minutes: z.number(),
      timesPerWeek: z.number(),
      justification: z.string().optional(),
    })
  }),
  mobility: z.object({
    transfers: z.object({
      minutes: z.number(),
      timesPerWeek: z.number(),
      justification: z.string().optional(),
    }),
    walking: z.object({
      minutes: z.number(),
      timesPerWeek: z.number(),
      justification: z.string().optional(),
    })
  }),
  extraLaundering: z.object({
    incontinence: z.object({
      minutes: z.number(),
      timesPerWeek: z.number(),
      justification: z.string().optional(),
    }),
    orthotics: z.object({
      minutes: z.number(),
      timesPerWeek: z.number(),
      justification: z.string().optional(),
    })
  })
});

// Level 2 - Basic Supervisory Functions
const level2Schema = z.object({
  hygiene: z.object({
    bathroom: z.object({
      minutes: z.number(),
      timesPerWeek: z.number(),
      justification: z.string().optional(),
    }),
    bedroom: z.object({
      minutes: z.number(),
      timesPerWeek: z.number(),
      justification: z.string().optional(),
    }),
    clothingCare: z.object({
      minutes: z.number(),
      timesPerWeek: z.number(),
      justification: z.string().optional(),
    })
  }),
  basicSupervisory: z.object({
    tracheostomyTubing: z.object({
      minutes: z.number(),
      timesPerWeek: z.number(),
      justification: z.string().optional(),
    }),
    transfers: z.object({
      minutes: z.number(),
      timesPerWeek: z.number(),
      justification: z.string().optional(),
    }),
    emergencyResponse: z.object({
      minutes: z.number(),
      timesPerWeek: z.number(),
      justification: z.string().optional(),
    })
  }),
  coordination: z.object({
    minutes: z.number(),
    timesPerWeek: z.number(),
    justification: z.string().optional(),
  })
});

// Level 3 - Complex Health/Care Functions
const level3Schema = z.object({
  genitourinary: z.object({
    catheterization: z.object({
      minutes: z.number(),
      timesPerWeek: z.number(),
      justification: z.string().optional(),
    }),
    drainage: z.object({
      minutes: z.number(),
      timesPerWeek: z.number(),
      justification: z.string().optional(),
    }),
    incontinence: z.object({
      minutes: z.number(),
      timesPerWeek: z.number(),
      justification: z.string().optional(),
    }),
    menstrual: z.object({
      minutes: z.number(),
      timesPerWeek: z.number(),
      justification: z.string().optional(),
    })
  }),
  bowelCare: z.object({
    routineCare: z.object({
      minutes: z.number(),
      timesPerWeek: z.number(),
      justification: z.string().optional(),
    }),
    ostomy: z.object({
      minutes: z.number(),
      timesPerWeek: z.number(),
      justification: z.string().optional(),
    }),
    incontinence: z.object({
      minutes: z.number(),
      timesPerWeek: z.number(),
      justification: z.string().optional(),
    })
  }),
  // ... continuing with all Form 1 Level 3 categories
});

export const attendantCareSchema = z.object({
  level1: level1Schema,
  level2: level2Schema,
  level3: level3Schema,
  
  calculations: z.object({
    level1Total: z.number(),
    level2Total: z.number(),
    level3Total: z.number(),
    monthlyBenefit: z.number()
  }),

  assessorNotes: z.string().optional(),
  approvalStatus: z.enum(['pending', 'approved', 'partiallyApproved', 'notApproved']).optional(),
  insurerNotes: z.string().optional()
});

export type AttendantCareData = z.infer<typeof attendantCareSchema>;
