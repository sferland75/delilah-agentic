import { AssessmentData } from '../../../../types/assessment';
import { generateBasicADLSection } from './adl/basicADL';
import { ReportSection } from '../reportTemplateSystem';

export const adlSection: ReportSection = {
  id: 'adl',
  title: 'ACTIVITIES OF DAILY LIVING',
  order: 5,
  generate: async (data: AssessmentData): Promise<string> => {
    return generateBasicADLSection(data.assessment.adl);
  }
};
