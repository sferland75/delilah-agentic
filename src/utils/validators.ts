import { z } from 'zod';

export const timeRangeSchema = z.object({
  startTime: z.string()
    .regex(/^\d{1,2}:\d{2}$/, 'Invalid time format. Expected HH:MM'),
  endTime: z.string()
    .regex(/^\d{1,2}:\d{2}$/, 'Invalid time format. Expected HH:MM')
}).refine(data => {
  const [startHour, startMinute] = data.startTime.split(':').map(Number);
  const [endHour, endMinute] = data.endTime.split(':').map(Number);
  const start = startHour * 60 + startMinute;
  const end = endHour * 60 + endMinute;
  return end > start;
}, {
  message: 'End time must be after start time'
});

export const attendantCareTaskSchema = z.object({
  task: z.string().min(1, 'Task is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  timeRequired: z.string()
    .regex(/^\d+(\.\d+)?$/, 'Time required must be a number')
    .transform(Number)
    .refine(n => n > 0, 'Time required must be greater than 0'),
  notes: z.string().optional()
});

export const amaAssessmentSchema = z.object({
  bodyPart: z.string().min(1, 'Body part is required'),
  impairmentValue: z.string()
    .regex(/^\d+%\s*WPI$/, 'Invalid impairment value format. Expected: X% WPI'),
  findings: z.array(z.string().min(1, 'Finding cannot be empty'))
    .min(1, 'At least one finding is required')
});

export const dailyScheduleEntrySchema = z.object({
  timeRange: timeRangeSchema,
  activity: z.string().min(1, 'Activity is required'),
  assistanceRequired: z.string().optional()
});

export const functionalStatusSchema = z.object({
  mobility: z.string().min(1, 'Mobility status is required'),
  balance: z.string().min(1, 'Balance assessment is required'),
  coordination: z.string().min(1, 'Coordination assessment is required'),
  strength: z.string().min(1, 'Strength assessment is required')
});

export const environmentalAssessmentSchema = z.object({
  type: z.string().min(1, 'Property type is required'),
  layout: z.string().min(1, 'Layout description is required'),
  accessibility: z.string().min(1, 'Accessibility assessment is required'),
  modifications: z.array(z.object({
    area: z.string().min(1, 'Area is required'),
    modification: z.string().min(1, 'Modification description is required'),
    priority: z.enum(['High', 'Medium', 'Low'], {
      required_error: 'Priority must be High, Medium, or Low'
    }),
    cost: z.string().optional()
  }))
});

export const currencySchema = z.string()
  .regex(/^\$\d+(\.\d{2})?$/, 'Invalid currency format. Expected: $X.XX')
  .transform(str => Number(str.replace(/[$,]/g, '')))
  .refine(n => n >= 0, 'Amount must be non-negative');

export const durationSchema = z.string()
  .regex(/^\d+(\.\d+)?\s*(minutes?|hours?|mins?|hrs?)$/i, 'Invalid duration format')
  .transform(str => {
    const [, value, unit] = str.match(/^(\d+(?:\.\d+)?)\s*(minutes?|hours?|mins?|hrs?)$/i) || [];
    const numValue = parseFloat(value);
    const isHours = /^h/i.test(unit);
    return isHours ? numValue * 60 : numValue;
  })
  .refine(n => n > 0, 'Duration must be greater than 0');

export const dateSchema = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Expected: YYYY-MM-DD')
  .refine(date => !isNaN(Date.parse(date)), 'Invalid date');

export const timeSchema = z.string()
  .regex(/^\d{1,2}:\d{2}$/, 'Invalid time format. Expected: HH:MM')
  .refine(time => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60;
  }, 'Invalid time values');