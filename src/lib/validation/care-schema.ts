import { z } from "zod";

export const careLevelSchema = z.object({
  hoursPerDay: z.number().min(0).max(24).optional(),
  daysPerWeek: z.number().min(0).max(7).optional(),
  specificTasks: z.string().optional(),
  morningCare: z.boolean().optional(),
  eveningCare: z.boolean().optional(),
  overnightCare: z.boolean().optional(),
  supervisonLevel: z.enum(["minimal", "moderate", "maximum"]).optional(),
  independenceLevel: z.enum(["minimal", "moderate", "maximum"]).optional(),
  safetyRisks: z.string().optional(),
  environmentalRisks: z.string().optional(),
  medicalProcedures: z.string().optional(),
  specializedEquipment: z.string().optional(),
  trainingNeeds: z.string().optional(),
  vitalMonitoring: z.string().optional(),
  woundCare: z.string().optional(),
  painManagement: z.string().optional(),
  nursingCare: z.string().optional(),
  therapyCoordination: z.string().optional(),
  specialistCare: z.string().optional(),
  routineCost: z.number().min(0).optional(),
  basicCost: z.number().min(0).optional(),
  complexCost: z.number().min(0).optional(),
  weeklyTotal: z.number().min(0).optional(),
  monthlyTotal: z.number().min(0).optional(),
  annualTotal: z.number().min(0).optional(),
});

export const careSchema = z.object({
  routine: z.object({
    dailyAssistance: careLevelSchema,
    timeRequirements: careLevelSchema,
    personalCare: careLevelSchema,
  }),
  basic: z.object({
    oversight: careLevelSchema,
    safety: careLevelSchema,
    monitoring: careLevelSchema,
  }),
  complex: z.object({
    specializedCare: careLevelSchema,
    medicalMonitoring: careLevelSchema,
    professionalCare: careLevelSchema,
  }),
  costs: z.object({
    hourlyBreakdown: careLevelSchema,
    projections: careLevelSchema,
  }),
});