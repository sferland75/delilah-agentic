import { Symptom } from '../../../types/report';

interface SymptomPattern {
    type: 'temporal' | 'severity' | 'location' | 'trigger';
    description: string;
    symptoms: string[];
    frequency?: string;
    impact?: string[];
}

interface SymptomRelationship {
    primary: string;
    related: string[];
    relationship: 'aggravates' | 'relieves' | 'concurrent';
    description: string;
}

interface AnalyzedSymptom {
    location: string;
    severity: string;
    frequency: string;
    pattern?: string;
    triggers?: string[];
    relief?: string[];
    impact?: string[];
    relatedSymptoms?: string[];
}

export class SymptomAnalyzer {
    async analyzeSymptoms(symptoms: any[], enableContextual: boolean = false): Promise<AnalyzedSymptom[]> {
        if (!Array.isArray(symptoms) || symptoms.length === 0) {
            return [];
        }

        try {
            // First pass: Basic analysis and validation
            const validSymptoms = symptoms
                .filter(s => this.isValidSymptom(s))
                .map(s => this.analyzeSymptom(s));

            // Second pass: Pattern recognition (if enabled)
            if (enableContextual) {
                const patterns = this.identifyPatterns(validSymptoms);
                const relationships = this.identifyRelationships(validSymptoms);
                
                // Enrich symptom analysis with patterns and relationships
                return this.enrichSymptomAnalysis(validSymptoms, patterns, relationships);
            }

            return validSymptoms;
        } catch (error) {
            console.warn('Error analyzing symptoms:', error);
            return [];
        }
    }

    private isValidSymptom(symptom: any): boolean {
        return (
            symptom &&
            typeof symptom === 'object' &&
            typeof symptom.location === 'string' &&
            typeof symptom.severity === 'string'
        );
    }

    private analyzeSymptom(symptom: any): AnalyzedSymptom {
        const analyzed: AnalyzedSymptom = {
            location: symptom.location,
            severity: this.normalizeSeverity(symptom.severity),
            frequency: this.normalizeFrequency(symptom.frequency || 'not specified'),
        };

        // Extract triggers
        if (symptom.aggravating) {
            analyzed.triggers = this.extractFactors(symptom.aggravating);
        }

        // Extract relief methods
        if (symptom.relieving) {
            analyzed.relief = this.extractFactors(symptom.relieving);
        }

        // Extract impact
        if (symptom.impact) {
            analyzed.impact = Array.isArray(symptom.impact) 
                ? symptom.impact 
                : [symptom.impact];
        }

        return analyzed;
    }

    private identifyPatterns(symptoms: AnalyzedSymptom[]): SymptomPattern[] {
        const patterns: SymptomPattern[] = [];

        // Location-based patterns
        const locationGroups = this.groupBy(symptoms, 'location');
        for (const [location, group] of Object.entries(locationGroups)) {
            if (group.length > 1) {
                patterns.push({
                    type: 'location',
                    description: `Multiple symptoms in ${location}`,
                    symptoms: group.map(s => s.location),
                    impact: this.mergeImpacts(group)
                });
            }
        }

        // Severity patterns
        const severityGroups = this.groupBy(symptoms, 'severity');
        for (const [severity, group] of Object.entries(severityGroups)) {
            if (group.length > 1) {
                patterns.push({
                    type: 'severity',
                    description: `Multiple ${severity.toLowerCase()} symptoms`,
                    symptoms: group.map(s => s.location),
                    frequency: this.findCommonFrequency(group)
                });
            }
        }

        // Trigger patterns
        const commonTriggers = this.findCommonTriggers(symptoms);
        for (const trigger of commonTriggers) {
            const affectedSymptoms = symptoms.filter(s => 
                s.triggers?.includes(trigger)
            );

            if (affectedSymptoms.length > 1) {
                patterns.push({
                    type: 'trigger',
                    description: `Multiple symptoms triggered by ${trigger}`,
                    symptoms: affectedSymptoms.map(s => s.location)
                });
            }
        }

        return patterns;
    }

    private identifyRelationships(symptoms: AnalyzedSymptom[]): SymptomRelationship[] {
        const relationships: SymptomRelationship[] = [];

        // Analyze each symptom pair
        for (let i = 0; i < symptoms.length; i++) {
            for (let j = i + 1; j < symptoms.length; j++) {
                const relationship = this.analyzeSymptomRelationship(
                    symptoms[i],
                    symptoms[j]
                );

                if (relationship) {
                    relationships.push(relationship);
                }
            }
        }

        return relationships;
    }

    private analyzeSymptomRelationship(s1: AnalyzedSymptom, s2: AnalyzedSymptom): SymptomRelationship | null {
        // Check for trigger relationships
        if (s1.triggers?.some(t => t.toLowerCase().includes(s2.location.toLowerCase()))) {
            return {
                primary: s1.location,
                related: [s2.location],
                relationship: 'aggravates',
                description: `${s2.location} aggravates ${s1.location}`
            };
        }

        // Check for relief relationships
        if (s1.relief?.some(r => r.toLowerCase().includes(s2.location.toLowerCase()))) {
            return {
                primary: s1.location,
                related: [s2.location],
                relationship: 'relieves',
                description: `${s2.location} improvement relieves ${s1.location}`
            };
        }

        // Check for concurrent patterns
        if (s1.frequency === s2.frequency && s1.triggers?.some(t => 
            s2.triggers?.includes(t)
        )) {
            return {
                primary: s1.location,
                related: [s2.location],
                relationship: 'concurrent',
                description: `${s1.location} and ${s2.location} occur together`
            };
        }

        return null;
    }

    private enrichSymptomAnalysis(
        symptoms: AnalyzedSymptom[],
        patterns: SymptomPattern[],
        relationships: SymptomRelationship[]
    ): AnalyzedSymptom[] {
        return symptoms.map(symptom => {
            const enriched = { ...symptom };

            // Add pattern information
            const relatedPatterns = patterns.filter(p =>
                p.symptoms.includes(symptom.location)
            );
            if (relatedPatterns.length > 0) {
                enriched.pattern = relatedPatterns
                    .map(p => p.description)
                    .join('; ');
            }

            // Add relationship information
            const relatedSymptoms = relationships
                .filter(r => r.primary === symptom.location)
                .map(r => r.related)
                .flat();
            if (relatedSymptoms.length > 0) {
                enriched.relatedSymptoms = relatedSymptoms;
            }

            return enriched;
        });
    }

    // Utility methods
    private normalizeSeverity(severity: string): string {
        const normalized = severity.toLowerCase().trim();
        const severityLevels = [
            'none', 'mild', 'moderate', 'severe', 'very severe'
        ];
        return severityLevels.find(level => 
            normalized.includes(level)
        ) || normalized;
    }

    private normalizeFrequency(frequency: string): string {
        const normalized = frequency.toLowerCase().trim();
        const frequencyLevels = [
            'never', 'rarely', 'sometimes', 'often', 
            'most of the time', 'constantly'
        ];
        return frequencyLevels.find(level => 
            normalized.includes(level)
        ) || normalized;
    }

    private extractFactors(factors: string | string[]): string[] {
        if (Array.isArray(factors)) {
            return factors.filter(Boolean);
        }
        
        if (typeof factors !== 'string') {
            return [];
        }

        // Split on common delimiters and clean up
        return factors
            .split(/[,;.]/)
            .map(f => f.trim())
            .filter(Boolean);
    }

    private groupBy<T>(items: T[], key: keyof T): { [key: string]: T[] } {
        return items.reduce((groups, item) => {
            const value = String(item[key]);
            return {
                ...groups,
                [value]: [...(groups[value] || []), item]
            };
        }, {} as { [key: string]: T[] });
    }

    private findCommonFrequency(symptoms: AnalyzedSymptom[]): string {
        const frequencies = symptoms.map(s => s.frequency);
        return this.findMostCommon(frequencies);
    }

    private findCommonTriggers(symptoms: AnalyzedSymptom[]): string[] {
        const allTriggers = symptoms
            .map(s => s.triggers || [])
            .flat();

        return [...new Set(allTriggers)];
    }

    private findMostCommon(items: string[]): string {
        const counts = items.reduce((acc, item) => ({
            ...acc,
            [item]: (acc[item] || 0) + 1
        }), {} as { [key: string]: number });

        return Object.entries(counts)
            .sort(([,a], [,b]) => b - a)[0][0];
    }

    private mergeImpacts(symptoms: AnalyzedSymptom[]): string[] {
        return [...new Set(
            symptoms
                .map(s => s.impact || [])
                .flat()
        )];
    }
}