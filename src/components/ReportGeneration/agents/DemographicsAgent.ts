import { BaseAgent } from './core/BaseAgent';
import { Assessment, ProcessedData } from '../../../types/report';

interface Demographics {
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    gender?: string;
    occupation?: string;
    maritalStatus?: string;
    emergencyContact?: {
        name: string;
        relationship: string;
        phone: string;
    };
    residentialStatus?: {
        type: string;
        location: string;
        accessibility?: string[];
    };
}

export class DemographicsAgent extends BaseAgent {
    constructor(context: any) {
        super(context);
        this.name = 'Demographics';
        this.description = 'Client demographic information and context';
        this.orderNumber = 1.0;
        this.dataPath = ['demographics'];
    }

    async processData(data: Assessment): Promise<ProcessedData> {
        try {
            const demographics = data.demographics;
            if (!demographics || !demographics.firstName || !demographics.lastName) {
                return this.formatError('Required demographic data missing');
            }

            return this.formatSuccess({
                personal: {
                    firstName: demographics.firstName,
                    lastName: demographics.lastName,
                    dateOfBirth: demographics.dateOfBirth,
                    gender: demographics.gender,
                    occupation: demographics.occupation,
                    maritalStatus: demographics.maritalStatus
                },
                emergency: demographics.emergencyContact ? {
                    name: demographics.emergencyContact.name,
                    relationship: demographics.emergencyContact.relationship,
                    phone: demographics.emergencyContact.phone
                } : undefined,
                residential: demographics.residentialStatus ? {
                    type: demographics.residentialStatus.type,
                    location: demographics.residentialStatus.location,
                    accessibility: demographics.residentialStatus.accessibility
                } : undefined,
                calculatedAge: this.calculateAge(demographics.dateOfBirth)
            });
        } catch (error) {
            return this.formatError('Error processing demographic data');
        }
    }

    private calculateAge(dateOfBirth?: string): number | undefined {
        if (!dateOfBirth) return undefined;
        
        try {
            const birthDate = new Date(dateOfBirth);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            return age;
        } catch (error) {
            return undefined;
        }
    }

    protected formatBrief(data: ProcessedData): string {
        if (!data.valid || !data.data.personal) {
            return 'Demographic information not available';
        }

        const personal = data.data.personal;
        const sections: string[] = [];

        sections.push(`${personal.firstName} ${personal.lastName}`);
        
        if (data.data.calculatedAge) {
            sections.push(`${data.data.calculatedAge} years old`);
        }

        if (personal.gender) {
            sections.push(personal.gender);
        }

        if (personal.occupation) {
            sections.push(personal.occupation);
        }

        return sections.join(', ');
    }

    protected formatStandard(data: ProcessedData): string {
        if (!data.valid || !data.data.personal) {
            return 'Demographic information not available';
        }

        const sections: string[] = [];
        const { personal, emergency, residential } = data.data;

        // Personal Information
        sections.push('Personal Information:');
        sections.push(`Name: ${personal.firstName} ${personal.lastName}`);
        if (data.data.calculatedAge) {
            sections.push(`Age: ${data.data.calculatedAge} years`);
        }
        if (personal.gender) {
            sections.push(`Gender: ${personal.gender}`);
        }
        if (personal.occupation) {
            sections.push(`Occupation: ${personal.occupation}`);
        }
        if (personal.maritalStatus) {
            sections.push(`Marital Status: ${personal.maritalStatus}`);
        }

        // Emergency Contact
        if (emergency) {
            sections.push('\nEmergency Contact:');
            sections.push(`Name: ${emergency.name}`);
            sections.push(`Relationship: ${emergency.relationship}`);
            sections.push(`Phone: ${emergency.phone}`);
        }

        // Residential Information
        if (residential) {
            sections.push('\nResidential Information:');
            sections.push(`Type: ${residential.type}`);
            sections.push(`Location: ${residential.location}`);
            if (residential.accessibility?.length) {
                sections.push(`Accessibility: ${residential.accessibility.join(', ')}`);
            }
        }

        return sections.join('\n');
    }

    protected formatDetailed(data: ProcessedData): string {
        if (!data.valid || !data.data.personal) {
            return 'Demographic information not available';
        }

        const sections: string[] = [];
        const { personal, emergency, residential } = data.data;

        sections.push('DEMOGRAPHIC ASSESSMENT');
        sections.push('=====================\n');

        // Personal Information
        sections.push('PERSONAL INFORMATION');
        sections.push('-------------------');
        sections.push(`Full Name: ${personal.firstName} ${personal.lastName}`);
        if (personal.dateOfBirth) {
            sections.push(`Date of Birth: ${personal.dateOfBirth}`);
        }
        if (data.data.calculatedAge) {
            sections.push(`Age: ${data.data.calculatedAge} years`);
        }
        if (personal.gender) {
            sections.push(`Gender: ${personal.gender}`);
        }
        if (personal.occupation) {
            sections.push(`Occupation: ${personal.occupation}`);
        }
        if (personal.maritalStatus) {
            sections.push(`Marital Status: ${personal.maritalStatus}`);
        }
        sections.push('');

        // Emergency Contact
        if (emergency) {
            sections.push('EMERGENCY CONTACT');
            sections.push('----------------');
            sections.push(`Name: ${emergency.name}`);
            sections.push(`Relationship: ${emergency.relationship}`);
            sections.push(`Phone: ${emergency.phone}`);
            sections.push('');
        }

        // Residential Information
        if (residential) {
            sections.push('RESIDENTIAL INFORMATION');
            sections.push('----------------------');
            sections.push(`Type: ${residential.type}`);
            sections.push(`Location: ${residential.location}`);
            if (residential.accessibility?.length) {
                sections.push('Accessibility Features:');
                residential.accessibility.forEach(feature => {
                    sections.push(`- ${feature}`);
                });
            }
        }

        return sections.join('\n');
    }
}