                pattern,
                behavior: data.behavior
            });

            return analysis.matchScore ?? 0;
        });

        const scores = await Promise.all(matchPromises);
        return scores.reduce((sum, score) => sum + score, 0) / behavioral.length;
    }

    private matchContext(pattern: Pattern, data: any): number {
        const contextualFactors = [
            this.calculatePatternRelevance(pattern, data),
            this.assessDataCompleteness(data)
        ];

        return contextualFactors.reduce((sum, factor) => sum + factor, 0) / contextualFactors.length;
    }

    private compareFeatureValue(feature: PatternFeature, value: any): boolean {
        if (value === undefined) {
            return false;
        }

        switch (feature.type) {
            case 'exact':
                return feature.value === value;
            case 'range':
                return value >= feature.min && value <= feature.max;
            case 'threshold':
                return feature.operator === '>' ? value > feature.threshold :
                       feature.operator === '<' ? value < feature.threshold :
                       feature.operator === '>=' ? value >= feature.threshold :
                       feature.operator === '<=' ? value <= feature.threshold :
                       false;
            default:
                return false;
        }
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