// Attendant Care Assessment Types
export interface AttendantCareTask {
    category: string;
    task: string;
    frequency: string;
    timePerOccurrence: string;
    totalTimePerWeek: string;
    rationale: string;
}

export interface AttendantCareCategory {
    name: string;
    tasks: AttendantCareTask[];
    totalHoursPerWeek: number;
}

// AMA Guide Assessment Types
export interface AMAAssessment {
    bodyPart: string;
    impairmentType: string;
    romFindings: string;
    tablePage: string;
    impairmentValue: string;
    rationale: string;
}

// Housekeeping Assessment Types
export interface HousekeepingTask {
    task: string;
    frequency: string;
    preAccidentStatus: string;
    currentStatus: string;
    assistance: string;
    recommendations: string;
}

export interface HousekeepingCategory {
    category: string;
    tasks: HousekeepingTask[];
}

// Common Types
export interface TimeRange {
    startTime: string;
    endTime: string;
}

export interface DailySchedule {
    timeRange: TimeRange;
    activity: string;
    assistanceRequired: string;
    comments: string;
}
