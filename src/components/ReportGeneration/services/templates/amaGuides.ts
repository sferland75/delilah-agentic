import { AssessmentData } from '../../../../types/assessment';
import { ReportSection } from '../reportTemplateSystem';

export const amaGuidesSection: ReportSection = {
  id: 'amaGuides',
  title: 'AMA GUIDES ASSESSMENT',
  order: 7,
  generate: async (data: AssessmentData): Promise<string> => {
    const { amaGuides } = data.assessment;
    let content = '# AMA GUIDES ASSESSMENT\n\n';

    if (amaGuides?.narrative) {
      content += amaGuides.narrative;
    } else {
      content += 'No AMA Guides assessment completed';
    }

    return content;
  }
};
