import { AssessmentData } from '../../types';

export interface DemographicData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  fileNumber?: string;
  dateOfAccident?: string;
  interpreter?: string;
  language?: string;
  assessmentInfo: {
    situational: {
      location: string;
      date: string;
    };
    inHome: {
      location: string;
      date: string;
    };
  };
}

export const extractDemographicData = (data: AssessmentData): DemographicData => {
  const { demographics } = data.assessment;
  return {
    firstName: demographics.firstName,
    lastName: demographics.lastName,
    dateOfBirth: demographics.dateOfBirth,
    fileNumber: data.metadata?.fileNumber,
    dateOfAccident: data.metadata?.dateOfAccident,
    interpreter: demographics.interpreter,
    language: demographics.language,
    assessmentInfo: {
      situational: {
        location: data.metadata?.situationalLocation,
        date: data.metadata?.situationalDate
      },
      inHome: {
        location: data.metadata?.inHomeLocation,
        date: data.metadata?.inHomeDate
      }
    }
  };
};

export const formatDemographicSection = (data: DemographicData): string => {
  return `OCCUPATIONAL THERAPY EVALUATION

Name: ${data.firstName} ${data.lastName}
File: ${data.fileNumber || '[File Number]'}
Date of Accident: ${data.dateOfAccident || '[Date of Accident]'} 
Date of Birth: ${data.dateOfBirth}
${data.interpreter ? `Interpreter: ${data.interpreter}` : ''}
${data.language ? `Language: ${data.language}` : ''}

Situational Evaluation
Assessment Location: ${data.assessmentInfo.situational.location}
Assessment Date: ${data.assessmentInfo.situational.date}

In-Home Evaluation
Assessment Location: ${data.assessmentInfo.inHome.location}
Assessment Date: ${data.assessmentInfo.inHome.date}`;
};