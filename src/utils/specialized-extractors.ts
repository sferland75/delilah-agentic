import { BaseExtractor } from './base-extractor';
import { DataSanitizer } from './data-sanitizer';

export interface AttendantCareEntry {
  task: string;
  frequency: string;
  timeRequired: string;
  notes?: string;
}

export interface AttendantCareCategory {
  name: string;
  tasks: AttendantCareEntry[];
  totalHoursPerWeek: number;
}

export interface AMAAssessment {
  bodyPart: string;
  impairmentValue: string;
  findings: string[];
}

export interface DailyScheduleEntry {
  timeRange: {
    startTime: string;
    endTime: string;
  };
  activity: string;
  assistanceRequired?: string;
}

export class SpecializedExtractors extends BaseExtractor {
  public static extractAttendantCare(content: string): AttendantCareCategory[] {
    const extractor = new SpecializedExtractors(content);
    return extractor.parseAttendantCare();
  }

  public static extractAMAAssessment(content: string): AMAAssessment[] {
    const extractor = new SpecializedExtractors(content);
    return extractor.parseAMAAssessment();
  }

  public static extractHousekeeping(content: string): DailyScheduleEntry[] {
    const extractor = new SpecializedExtractors(content);
    return extractor.parseHousekeeping();
  }

  public static extractDailySchedule(content: string): DailyScheduleEntry[] {
    const extractor = new SpecializedExtractors(content);
    return extractor.parseDailySchedule();
  }

  private parseAttendantCare(): AttendantCareCategory[] {
    const section = this.findSection('Attendant Care Assessment');
    const categories = ['Personal Care', 'Housekeeping'];

    return categories.map(category => {
      const categorySection = this.findSection(category);
      const table = this.extractTable(categorySection, category);

      const tasks = table.rows.map(row => ({
        task: DataSanitizer.cleanText(row['Task']),
        frequency: DataSanitizer.cleanText(row['Frequency']),
        timeRequired: DataSanitizer.cleanText(row['Time Required']),
        notes: row['Notes'] ? DataSanitizer.cleanText(row['Notes']) : undefined
      }));

      const totalHoursPerWeek = tasks.reduce((total, task) => {
        const time = parseFloat(task.timeRequired) || 0;
        return total + time;
      }, 0);

      return {
        name: category,
        tasks,
        totalHoursPerWeek
      };
    });
  }

  private parseAMAAssessment(): AMAAssessment[] {
    const section = this.findSection('AMA Guide Assessment');
    const table = this.extractTable(section, 'Impairment Ratings');

    return table.rows.map(row => ({
      bodyPart: DataSanitizer.cleanText(row['Body Part']),
      impairmentValue: DataSanitizer.cleanText(row['Impairment Value']),
      findings: (row['Findings'] || '').split(';')
        .map(finding => DataSanitizer.cleanText(finding))
        .filter(finding => finding.length > 0)
    }));
  }

  private parseHousekeeping(): DailyScheduleEntry[] {
    const section = this.findSection('Housekeeping Assessment');
    const table = this.extractTable(section, 'Daily Tasks');

    return table.rows.map(row => ({
      timeRange: {
        startTime: DataSanitizer.cleanText(row['Start Time']),
        endTime: DataSanitizer.cleanText(row['End Time'])
      },
      activity: DataSanitizer.cleanText(row['Task']),
      assistanceRequired: row['Assistance Required'] ? 
        DataSanitizer.cleanText(row['Assistance Required']) : 
        undefined
    }));
  }

  private parseDailySchedule(): DailyScheduleEntry[] {
    const section = this.findSection('Daily Schedule');
    const table = this.extractTable(section, 'Schedule');

    return table.rows.map(row => {
      const times = DataSanitizer.cleanText(row['Time']).split('-');
      return {
        timeRange: {
          startTime: times[0]?.trim() || '',
          endTime: times[1]?.trim() || ''
        },
        activity: DataSanitizer.cleanText(row['Activity']),
        assistanceRequired: row['Assistance Required'] ? 
          DataSanitizer.cleanText(row['Assistance Required']) : 
          undefined
      };
    });
  }
}