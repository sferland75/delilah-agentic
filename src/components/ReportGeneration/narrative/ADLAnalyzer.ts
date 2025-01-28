import { ADLStatus, ADLLevel } from '../agents/adl/ADLTypes';

interface ADLPattern {
    category: string;
    activities: string[];
    level: ADLLevel;
    modifications?: string[];
    impact?: string[];
}

interface TemporalPattern {
    period: 'morning' | 'afternoon' | 'evening' | 'night';
    activities: string[];
    limitations: string[];
}

interface ADLContext {
    patterns: ADLPattern[];
    temporal: TemporalPattern[];
    symptoms: {
        location: string;
        impact: string[];
    }[];
}

export class ADLAnalyzer {
    async analyzeADLPerformance(adl: any, symptoms: any[] = []): Promise<ADLContext> {
        try {
            const patterns = this.identifyADLPatterns(adl);
            const temporal = this.analyzeTemporalPatterns(adl);
            const symptomImpacts = this.analyzeSymptomImpacts(symptoms);

            return {
                patterns,
                temporal,
                symptoms: symptomImpacts
            };
        } catch (error) {
            console.warn('Error analyzing ADL performance:', error);
            return {
                patterns: [],
                temporal: [],
                symptoms: []
            };
        }
    }

    private identifyADLPatterns(adl: any): ADLPattern[] {
        if (!adl?.basic) return [];

        const patterns: ADLPattern[] = [];

        // Analyze basic ADLs
        for (const [category, activities] of Object.entries(adl.basic)) {
            if (typeof activities !== 'object') continue;

            const categoryActivities = Object.entries(activities as Record<string, ADLStatus>)
                .filter(([_, status]) => status?.independence);

            if (categoryActivities.length === 0) continue;

            const level = this.findCommonLevel(categoryActivities.map(([_, s]) => s.independence));
            const mods = this.extractModifications(categoryActivities.map(([_, s]) => s.notes).filter(Boolean));

            patterns.push({
                category,
                activities: categoryActivities.map(([name]) => name),
                level,
                modifications: mods
            });
        }

        return patterns;
    }

    private findCommonLevel(levels: ADLLevel[]): ADLLevel {
        const counts = levels.reduce((acc, level) => {
            acc[level] = (acc[level] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])[0][0] as ADLLevel;
    }

    private extractModifications(notes: string[]): string[] {
        const modKeywords = ['uses', 'with', 'requires', 'needs', 'using'];
        const equipmentTerms = ['grab bars', 'shower chair', 'long-handled', 'bed rail', 'walker', 'wheelchair'];
        const modifications = new Set<string>();

        for (const note of notes) {
            // Split note into phrases
            const phrases = note.split(/[.,;]/).map(p => p.trim());
            
            for (const phrase of phrases) {
                // Check for modification keywords
                if (modKeywords.some(kw => phrase.toLowerCase().includes(kw))) {
                    // Split compound modifications
                    const parts = phrase.split(' and ').map(p => p.trim());
                    parts.forEach(part => modifications.add(part));
                }

                // Check for specific equipment terms
                equipmentTerms.forEach(term => {
                    if (phrase.toLowerCase().includes(term)) {
                        // Include the whole phrase that contains the equipment
                        modifications.add(phrase);
                    }
                });
            }
        }

        return Array.from(modifications);
    }

    private analyzeTemporalPatterns(adl: any): TemporalPattern[] {
        if (!adl?.typicalDay?.current?.daily?.routines) return [];

        const { routines } = adl.typicalDay.current.daily;
        const patterns: TemporalPattern[] = [];

        for (const period of ['morning', 'afternoon', 'evening', 'night'] as const) {
            if (!routines[period]?.activities) continue;

            const allPhrases = routines[period].activities
                .split(/[,\n]/)
                .map(a => a.trim())
                .filter(Boolean);

            // Separate activities and limitations
            const activities: string[] = [];
            const limitations: string[] = [];

            for (const phrase of allPhrases) {
                if (this.hasLimitationKeywords(phrase)) {
                    const cleanLimitation = this.extractLimitation(phrase);
                    if (cleanLimitation) limitations.push(cleanLimitation);
                } else {
                    activities.push(phrase);
                }
            }

            if (activities.length > 0 || limitations.length > 0) {
                patterns.push({ period, activities, limitations });
            }
        }

        return patterns;
    }

    private extractLimitation(phrase: string): string {
        const limitationKeywords = ['difficulty', 'limited', 'unable', 'needs help'];
        for (const keyword of limitationKeywords) {
            if (phrase.toLowerCase().includes(keyword)) {
                // Extract from the keyword onwards
                const index = phrase.toLowerCase().indexOf(keyword);
                return phrase.slice(index);
            }
        }
        return phrase;
    }

    private hasLimitationKeywords(text: string): boolean {
        const limitKeywords = [
            'difficulty', 'unable', 'needs help', 
            'requires assistance', 'limited', 'with difficulty'
        ];
        return limitKeywords.some(kw => text.toLowerCase().includes(kw));
    }

    private analyzeSymptomImpacts(symptoms: any[]): Array<{location: string, impact: string[]}> {
        if (!Array.isArray(symptoms)) return [];

        return symptoms
            .filter(s => s?.location && (s?.impact || s?.aggravating))
            .map(s => ({
                location: s.location,
                impact: [
                    ...(this.parseImpacts(s.impact) || []),
                    ...(this.parseImpacts(s.aggravating) || [])
                ]
            }))
            .filter(s => s.impact.length > 0);
    }

    private parseImpacts(impact: string | string[] | undefined): string[] {
        if (!impact) return [];
        
        if (Array.isArray(impact)) {
            return impact.filter(Boolean);
        }

        return impact
            .split(/[,\n]/)
            .map(i => i.trim())
            .filter(Boolean);
    }
}