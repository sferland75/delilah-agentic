import { BaseAgent } from '../core/BaseAgent';
import { LearningDistributor } from '../core/learning/LearningDistributor';
import { AgentCoordinator } from '../core/coordinator/AgentCoordinator';
import { Pattern, AnalysisResult, Confidence } from '../types';

export interface AnalysisAgentConfig {
    confidenceThreshold?: number;
}

export class AnalysisAgent extends BaseAgent {
    private learningDistributor: LearningDistributor;
    private coordinator: AgentCoordinator;
    private patternCache: Map<string, Pattern>;
    private confidenceThreshold: number;

    constructor(
        coordinator: AgentCoordinator,
        learningDistributor: LearningDistributor,
        config: AnalysisAgentConfig
    ) {
        super('analysis');
        this.coordinator = coordinator;
        this.learningDistributor = learningDistributor;
        this.patternCache = new Map();
        this.confidenceThreshold = config.confidenceThreshold ?? 0.75;
        
        this.initializePatternLearning();
    }

    private async initializePatternLearning(): Promise<void> {
        this.learningDistributor.subscribe('pattern-update', (pattern: Pattern) => {
            this.updatePattern(pattern);
        });

        this.coordinator.register(this, ['assessment-result', 'pattern-request', 'behavioral-analysis']);
    }

    private updatePattern(pattern: Pattern): void {
        this.patternCache.set(pattern.id, {
            ...pattern,
            lastUpdated: Date.now()
        });
    }

    private async synthesizeInsight(
        pattern: Pattern,
        data: any,
        assessmentResults: any
    ): Promise<string | null> {
        if (!pattern || !data || !assessmentResults) {
            return null;
        }

        try {
            const insightComponents = [];

            const matchScore = await this.calculatePatternMatchScore(pattern, data);
            if (matchScore > this.confidenceThreshold) {
                insightComponents.push(`Strong pattern match (${(matchScore * 100).toFixed(1)}% confidence)`);
            }

            if (assessmentResults.findings) {
                const correlatedFindings = this.correlateWithAssessment(
                    pattern,
                    assessmentResults.findings
                );
                if (correlatedFindings.length > 0) {
                    insightComponents.push(
                        `Correlated findings: ${correlatedFindings.join(', ')}`
                    );
                }
            }

            if (pattern.temporalConstraints && data.timestamp) {
                const temporalInsight = this.analyzeTemporalAspects(
                    pattern.temporalConstraints,
                    data.timestamp
                );
                if (temporalInsight) {
                    insightComponents.push(temporalInsight);
                }
            }

            if (pattern.behavioral && data.behavior) {
                const behavioralInsight = await this.analyzeBehavioralImplications(
                    pattern.behavioral,
                    data.behavior
                );
                if (behavioralInsight) {
                    insightComponents.push(behavioralInsight);
                }
            }

            if (insightComponents.length > 0) {
                return this.formatInsight(pattern.type, insightComponents);
            }

            return null;
        } catch (error) {
            console.error('Error synthesizing insight:', error);
            return null;
        }
    }

    private correlateWithAssessment(
        pattern: Pattern,
        findings: string[]
    ): string[] {
        return findings.filter(finding =>
            pattern.correlations?.some(correlation =>
                finding.toLowerCase().includes(correlation.toLowerCase())
            )
        );
    }

    private analyzeTemporalAspects(
        constraints: TemporalConstraints,
        timestamp: number
    ): string | null {
        const age = Date.now() - timestamp;
        
        if (age <= constraints.highRelevance) {
            return 'Pattern shows high temporal relevance (recent activity)';
        } else if (age <= constraints.mediumRelevance) {
            return 'Pattern shows moderate temporal relevance';
        } else if (age <= constraints.lowRelevance) {
            return 'Pattern shows historical relevance';
        }
        
        return null;
    }

    private async analyzeBehavioralImplications(
        behavioral: BehavioralPattern[],
        behavior: any
    ): Promise<string | null> {
        const analysis = await this.coordinator.request('behavioral-analysis', {
            patterns: behavioral,
            behavior: behavior
        });

        if (analysis.implications?.length > 0) {
            return `Behavioral implications: ${analysis.implications.join('; ')}`;
        }

        return null;
    }

    private formatInsight(patternType: string, components: string[]): string {
        return `[${patternType.toUpperCase()}] ${components.join(' | ')}`;
    }
}