import { Assessment } from '../../../types/report';

interface TimelineEvent {
    date?: Date;
    description: string;
    type: 'injury' | 'treatment' | 'milestone' | 'assessment';
    impact?: string[];
}

interface Timeline {
    initialEvent?: TimelineEvent;
    keyEvents: TimelineEvent[];
    progression: string;
    clinicalContext: string;
}

export class TemporalAnalyzer {
    async analyzeTimeline(assessment: Assessment): Promise<Timeline> {
        try {
            const timeline: Timeline = {
                keyEvents: [],
                progression: '',
                clinicalContext: ''
            };

            // Extract initial injury event
            if (assessment.medicalHistory?.injury) {
                timeline.initialEvent = this.parseInjuryEvent(assessment.medicalHistory.injury);
            }

            // Extract treatment history
            if (assessment.medicalHistory?.currentTreatment) {
                timeline.keyEvents.push(
                    ...this.parseTreatmentEvents(assessment.medicalHistory.currentTreatment)
                );
            }

            // Sort events chronologically
            timeline.keyEvents.sort((a, b) => {
                if (!a.date) return 1;
                if (!b.date) return -1;
                return a.date.getTime() - b.date.getTime();
            });

            // Analyze progression
            timeline.progression = this.analyzeProgression(timeline.keyEvents);

            // Build clinical context
            timeline.clinicalContext = this.buildClinicalContext(timeline);

            return timeline;
        } catch (error) {
            console.warn('Error analyzing timeline:', error);
            return {
                keyEvents: [],
                progression: '',
                clinicalContext: ''
            };
        }
    }

    async generateContext(assessment: Assessment, section: string): Promise<string> {
        try {
            const timeline = await this.analyzeTimeline(assessment);
            return this.formatTimelineContext(timeline, section);
        } catch (error) {
            console.warn('Error generating temporal context:', error);
            return '';
        }
    }

    private parseInjuryEvent(injury: any): TimelineEvent {
        return {
            date: injury.date ? new Date(injury.date) : undefined,
            description: injury.circumstance || 'Initial injury',
            type: 'injury',
            impact: this.parseImpacts(injury.immediateResponse)
        };
    }

    private parseTreatmentEvents(treatments: any[]): TimelineEvent[] {
        if (!Array.isArray(treatments)) return [];

        return treatments
            .filter(t => t?.name || t?.providerType)
            .map(t => ({
                date: t.startDate ? new Date(t.startDate) : undefined,
                description: this.formatTreatmentDescription(t),
                type: 'treatment',
                impact: this.parseImpacts(t.progress || t.focus)
            }))
            .filter(t => t.description); // Filter out events with empty descriptions
    }

    private formatTreatmentDescription(treatment: any): string {
        const parts = [];

        // Add provider type if available
        if (treatment.providerType) {
            parts.push(this.formatProviderType(treatment.providerType));
        }

        // Add provider name if available
        if (treatment.name) {
            parts.push(treatment.name);
        }

        // Add frequency if available
        if (treatment.frequency) {
            parts.push(`(${treatment.frequency})`);
        }

        // Add focus/purpose if available
        if (treatment.focus) {
            parts.push(`for ${treatment.focus}`);
        }

        return parts.join(' ');
    }

    private formatProviderType(type: string): string {
        const providerTypes: {[key: string]: string} = {
            'gp': 'Family Physician',
            'pt': 'Physiotherapist',
            'ot': 'Occupational Therapist',
            'chiro': 'Chiropractor',
            'massage': 'Massage Therapist',
            'psych': 'Psychologist'
        };

        return providerTypes[type.toLowerCase()] || type;
    }

    private analyzeProgression(events: TimelineEvent[]): string {
        if (events.length === 0) return '';

        // Group events by type
        const treatments = events.filter(e => e.type === 'treatment');
        const milestones = events.filter(e => e.type === 'milestone');

        // Analyze treatment progression
        const treatmentProgression = this.analyzeTreatmentProgression(treatments);

        // Analyze milestone progression
        const milestoneProgression = this.analyzeMilestoneProgression(milestones);

        // Combine progression narratives
        return [treatmentProgression, milestoneProgression]
            .filter(Boolean)
            .join('. ');
    }

    private analyzeTreatmentProgression(treatments: TimelineEvent[]): string {
        if (treatments.length === 0) return '';

        // Group treatments by date (if available)
        const chronological = treatments
            .filter(t => t.date)
            .sort((a, b) => (a.date as Date).getTime() - (b.date as Date).getTime());

        if (chronological.length === 0) {
            return this.summarizeCurrentTreatments(treatments);
        }

        return this.describeTreatmentTimeline(chronological);
    }

    private analyzeMilestoneProgression(milestones: TimelineEvent[]): string {
        if (milestones.length === 0) return '';

        // Sort milestones chronologically
        const chronological = milestones
            .filter(m => m.date)
            .sort((a, b) => (a.date as Date).getTime() - (b.date as Date).getTime());

        if (chronological.length === 0) {
            return this.summarizeMilestones(milestones);
        }

        return this.describeMilestoneTimeline(chronological);
    }

    private buildClinicalContext(timeline: Timeline): string {
        const parts = [];

        // Add initial event context
        if (timeline.initialEvent) {
            parts.push(this.formatInitialEvent(timeline.initialEvent));
        }

        // Add treatment context
        const treatments = timeline.keyEvents.filter(e => e.type === 'treatment');
        if (treatments.length > 0) {
            parts.push(this.formatTreatmentContext(treatments));
        }

        // Add progression context
        if (timeline.progression) {
            parts.push(timeline.progression);
        }

        return parts.join(' ');
    }

    private formatTimelineContext(timeline: Timeline, section: string): string {
        switch (section.toLowerCase()) {
            case 'overview':
                return this.formatOverviewContext(timeline);
            case 'symptoms':
                return this.formatSymptomContext(timeline);
            case 'functional':
                return this.formatFunctionalContext(timeline);
            default:
                return timeline.clinicalContext;
        }
    }

    private formatOverviewContext(timeline: Timeline): string {
        const parts = [];

        if (timeline.initialEvent) {
            parts.push(`Initially ${timeline.initialEvent.description}`);
        }

        if (timeline.progression) {
            parts.push(`subsequently ${timeline.progression}`);
        }

        return parts.join(', ');
    }

    private formatSymptomContext(timeline: Timeline): string {
        const parts = [];

        // Focus on symptom-related events
        const symptomEvents = timeline.keyEvents.filter(e => 
            e.impact?.some(i => i.toLowerCase().includes('symptom') || 
                i.toLowerCase().includes('pain'))
        );

        if (symptomEvents.length > 0) {
            parts.push(this.describeSymptomProgression(symptomEvents));
        }

        return parts.join(' ');
    }

    private formatFunctionalContext(timeline: Timeline): string {
        const parts = [];

        // Focus on function-related events
        const functionalEvents = timeline.keyEvents.filter(e =>
            e.impact?.some(i => i.toLowerCase().includes('function') || 
                i.toLowerCase().includes('activity'))
        );

        if (functionalEvents.length > 0) {
            parts.push(this.describeFunctionalProgression(functionalEvents));
        }

        return parts.join(' ');
    }

    // Utility methods
    private parseImpacts(text: string | undefined): string[] {
        if (!text) return [];

        return text
            .split(/[.,;]/)
            .map(part => part.trim())
            .filter(Boolean);
    }

    private summarizeCurrentTreatments(treatments: TimelineEvent[]): string {
        if (treatments.length === 0) return '';

        const providers = treatments.map(t => t.description);
        return `Currently receiving treatment from ${providers.join(' and ')}`;
    }

    private describeTreatmentTimeline(treatments: TimelineEvent[]): string {
        const current = treatments[treatments.length - 1];
        const previous = treatments.slice(0, -1);

        const parts = [];

        if (previous.length > 0) {
            parts.push(`Previously received ${previous.map(t => t.description).join(' and ')}`);
        }

        if (current) {
            parts.push(`Currently receiving ${current.description}`);
        }

        return parts.join(', ');
    }

    private summarizeMilestones(milestones: TimelineEvent[]): string {
        if (milestones.length === 0) return '';

        return `Key milestones include ${milestones.map(m => m.description).join(', ')}`;
    }

    private describeMilestoneTimeline(milestones: TimelineEvent[]): string {
        return milestones
            .map((m, i) => {
                const date = m.date ? this.formatDate(m.date) : '';
                return `${i === 0 ? 'Initially' : date} ${m.description}`;
            })
            .join(', followed by ');
    }

    private formatInitialEvent(event: TimelineEvent): string {
        const date = event.date ? ` on ${this.formatDate(event.date)}` : '';
        return `Initial injury occurred${date} due to ${event.description}`;
    }

    private formatTreatmentContext(treatments: TimelineEvent[]): string {
        const current = treatments[treatments.length - 1];
        return `Currently managed by ${current.description}`;
    }

    private describeSymptomProgression(events: TimelineEvent[]): string {
        const parts = [];

        // Group events by timeframe
        const initial = events[0];
        const recent = events[events.length - 1];

        if (initial) {
            parts.push(`Initially experienced ${this.extractSymptomImpacts(initial)}`);
        }

        if (recent && recent !== initial) {
            parts.push(`currently reporting ${this.extractSymptomImpacts(recent)}`);
        }

        return parts.join(', ');
    }

    private describeFunctionalProgression(events: TimelineEvent[]): string {
        const parts = [];

        // Group events by timeframe
        const initial = events[0];
        const recent = events[events.length - 1];

        if (initial) {
            parts.push(`Initially ${this.extractFunctionalImpacts(initial)}`);
        }

        if (recent && recent !== initial) {
            parts.push(`currently ${this.extractFunctionalImpacts(recent)}`);
        }

        return parts.join(', ');
    }

    private extractSymptomImpacts(event: TimelineEvent): string {
        return event.impact
            ?.filter(i => i.toLowerCase().includes('symptom') || i.toLowerCase().includes('pain'))
            .join(' and ') || 'symptoms';
    }

    private extractFunctionalImpacts(event: TimelineEvent): string {
        return event.impact
            ?.filter(i => i.toLowerCase().includes('function') || i.toLowerCase().includes('activity'))
            .join(' and ') || 'functional impacts';
    }

    private formatDate(date: Date): string {
        return date.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
        });
    }
}