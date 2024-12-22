import { LearningDistributor } from './LearningDistributor';
import { Pattern, LearningEvent, PatternUpdate } from '../../types';

export interface PatternLearnerConfig {
    minConfidence?: number;
    patternThreshold?: number;
    learningRate?: number;
    maxPatterns?: number;
}

export class PatternLearner {
    private patterns: Map<string, Pattern>;
    private observations: Map<string, number>;
    private distributor: LearningDistributor;
    private config: Required<PatternLearnerConfig>;

    constructor(
        distributor: LearningDistributor,
        config: PatternLearnerConfig = {}
    ) {
        this.distributor = distributor;
        this.patterns = new Map();
        this.observations = new Map();
        
        this.config = {
            minConfidence: config.minConfidence ?? 0.6,
            patternThreshold: config.patternThreshold ?? 3,
            learningRate: config.learningRate ?? 0.1,
            maxPatterns: config.maxPatterns ?? 1000
        };

        this.initializeEventHandlers();
    }

    private initializeEventHandlers(): void {
        this.distributor.subscribe('analysis-complete', this.handleAnalysisEvent.bind(this));
        this.distributor.subscribe('assessment-complete', this.handleAssessmentEvent.bind(this));
        this.distributor.subscribe('pattern-match', this.handlePatternMatch.bind(this));
    }

    private async handleAnalysisEvent(event: LearningEvent): Promise<void> {
        if (!event.data?.patterns) return;

        for (const pattern of event.data.patterns) {
            await this.processPattern(pattern, event);
        }

        // Clean up old patterns if needed
        if (this.patterns.size > this.config.maxPatterns) {
            this.prunePatterns();
        }
    }

    private async handleAssessmentEvent(event: LearningEvent): Promise<void> {
        if (!event.data?.findings) return;

        // Extract potential patterns from assessment findings
        const patterns = this.extractPatternsFromFindings(event.data.findings);
        
        for (const pattern of patterns) {
            await this.processPattern(pattern, event);
        }
    }

    private async handlePatternMatch(event: LearningEvent): Promise<void> {
        if (!event.data?.patternId || !event.data?.success) return;

        const pattern = this.patterns.get(event.data.patternId);
        if (!pattern) return;

        // Update pattern confidence based on match success
        const confidenceUpdate = event.data.success ? 0.1 : -0.05;
        pattern.confidence = Math.min(1, Math.max(0,
            pattern.confidence + (confidenceUpdate * this.config.learningRate)
        ));

        // Notify about pattern update
        await this.distributePatternUpdate(pattern);
    }

    private async processPattern(pattern: Pattern, event: LearningEvent): Promise<void> {
        const existingPattern = this.patterns.get(pattern.id);

        if (existingPattern) {
            // Update existing pattern
            this.updateExistingPattern(existingPattern, pattern, event);
        } else {
            // Track new pattern observation
            const observations = (this.observations.get(pattern.id) ?? 0) + 1;
            this.observations.set(pattern.id, observations);

            // Create new pattern if threshold reached
            if (observations >= this.config.patternThreshold) {
                await this.createNewPattern(pattern, event);
            }
        }
    }

    private async updateExistingPattern(
        existing: Pattern,
        update: Pattern,
        event: LearningEvent
    ): Promise<void> {
        // Update pattern attributes
        existing.lastUpdated = Date.now();
        existing.confidence = this.calculateUpdatedConfidence(existing, update);

        // Merge or update features
        if (update.features) {
            existing.features = this.mergeFeatures(existing.features ?? [], update.features);
        }

        // Update correlations
        if (update.correlations) {
            existing.correlations = Array.from(new Set([
                ...(existing.correlations ?? []),
                ...update.correlations
            ]));
        }

        // Distribute update
        await this.distributePatternUpdate(existing);
    }

    private async createNewPattern(pattern: Pattern, event: LearningEvent): Promise<void> {
        const newPattern = {
            ...pattern,
            confidence: Math.max(pattern.confidence ?? 0.6, this.config.minConfidence),
            lastUpdated: Date.now(),
            source: event.source
        };

        this.patterns.set(pattern.id, newPattern);
        await this.distributePatternUpdate(newPattern, true);
    }

    private calculateUpdatedConfidence(existing: Pattern, update: Pattern): number {
        const currentConfidence = existing.confidence ?? 0;
        const updateConfidence = update.confidence ?? 0;
        
        return Math.min(1, Math.max(0,
            currentConfidence + (
                (updateConfidence - currentConfidence) * this.config.learningRate
            )
        ));
    }

    private mergeFeatures(existing: any[], update: any[]): any[] {
        const merged = new Map();
        
        // Add existing features
        existing.forEach(feature => {
            merged.set(feature.name, feature);
        });

        // Merge or add new features
        update.forEach(feature => {
            const existingFeature = merged.get(feature.name);
            if (existingFeature) {
                // Update existing feature values
                if (feature.value !== undefined) {
                    existingFeature.value = feature.value;
                }
                if (feature.confidence !== undefined) {
                    existingFeature.confidence = Math.max(
                        existingFeature.confidence ?? 0,
                        feature.confidence
                    );
                }
            } else {
                merged.set(feature.name, feature);
            }
        });

        return Array.from(merged.values());
    }

    private async distributePatternUpdate(pattern: Pattern, isNew = false): Promise<void> {
        const update: PatternUpdate = {
            pattern,
            isNew,
            timestamp: Date.now()
        };

        await this.distributor.distribute({
            type: 'pattern-update',
            data: update,
            source: 'pattern-learner'
        });
    }

    private prunePatterns(): void {
        // Sort patterns by confidence and last updated
        const sortedPatterns = Array.from(this.patterns.entries())
            .sort(([, a], [, b]) => {
                const scoreA = (a.confidence ?? 0) * (1 / Math.sqrt(Date.now() - a.lastUpdated));
                const scoreB = (b.confidence ?? 0) * (1 / Math.sqrt(Date.now() - b.lastUpdated));
                return scoreB - scoreA;
            });

        // Keep only the top patterns
        this.patterns = new Map(sortedPatterns.slice(0, this.config.maxPatterns));
    }

    private extractPatternsFromFindings(findings: string[]): Pattern[] {
        const patterns: Pattern[] = [];
        const keywordRegex = /\b(error|warning|critical|important|pattern|observed)\b/i;

        findings.forEach(finding => {
            if (keywordRegex.test(finding)) {
                patterns.push({
                    id: `finding-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    type: 'assessment-derived',
                    confidence: 0.6,
                    content: finding,
                    lastUpdated: Date.now()
                });
            }
        });

        return patterns;
    }

    public getPatternStats(): {
        totalPatterns: number,
        averageConfidence: number,
        recentUpdates: number
    } {
        const patterns = Array.from(this.patterns.values());
        const recentThreshold = Date.now() - (24 * 60 * 60 * 1000); // 24 hours

        return {
            totalPatterns: patterns.length,
            averageConfidence: patterns.reduce((acc, p) => acc + (p.confidence ?? 0), 0) / patterns.length,
            recentUpdates: patterns.filter(p => p.lastUpdated > recentThreshold).length
        };
    }
}