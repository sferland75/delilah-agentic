export interface TableRow {
    [key: string]: string | number;
}

export interface TableData {
    headers: string[];
    rows: TableRow[];
}

export interface AttendantCareTask {
    task: string;
    frequency: string;
    timeRequired: string;
    notes?: string;
}

export interface HousekeepingTask {
    task: string;
    preAccident: string;
    current: string;
    timeAllotted?: string;
}

export interface ValidationError {
    code: string;
    message: string;
    field?: string;
}