import { z } from 'zod';

const hourEntrySchema = z.object({
    weekdayHours: z.number().min(0).max(24).optional(),
    weekendHours: z.number().min(0).max(24).optional(),
    totalHours: z.number().min(0).optional(),
    comments: z.string().optional()
});

export const level3Schema = z.object({
    attendantCare: z.object({
        level3: z.object({
            // Genitourinary Tracts
            genitourinary: z.object({
                catheterizations: hourEntrySchema,
                drainageSystems: hourEntrySchema,
                cleaning: hourEntrySchema,
                disposableBriefs: hourEntrySchema,
                menstrualCare: hourEntrySchema,
                residuals: hourEntrySchema
            }),
            // Add schemas for other sections...
            total: z.number().min(0).optional()
        })
    })
});

export type Level3FormData = z.infer<typeof level3Schema>;
