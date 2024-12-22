import { EventEmitter } from 'events';
import { AdaptiveOptimizer } from '../agent/adaptive';

interface LearningPattern {
  id: string;
  source: string;
  type: 'observation' | 'analysis' | 'correlation' | 'outcome';
  pattern: any;
  confidence: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface ValidationResult {
  isValid: boolean;
  score: number;
  conflicts: string[];
}

export class LearningDistributor {
  private patterns: Map<string, LearningPattern>;
  private optimizer: AdaptiveOptimizer;
  private eventEmitter: EventEmitter;
  private validationThreshold: number;

  constructor(optimizer: AdaptiveOptimizer, validationThreshold = 0.7) {
    this.patterns = new Map();
    this.optimizer = optimizer;
    this.eventEmitter = new EventEmitter();
    this.validationThreshold = validationThreshold;
  }

  // Add new learning pattern
  public async addPattern(pattern: LearningPattern): Promise<boolean> {
    // Validate pattern
    const validation = await this.validatePattern(pattern);
    if (!validation.isValid) {
      this.eventEmitter.emit('patternRejected', {
        pattern,
        reason: validation.conflicts
      });
      return false;
    }

    // Store pattern
    this.patterns.set(pattern.id, pattern);

    // Update optimizer
    this.optimizer.updateMetrics([{
      id: `pattern_${pattern.id}`,
      value: validation.score,
      weight: this.getPatternWeight(pattern),
      timestamp: pattern.timestamp
    }]);

    // Notify subscribers
    this.eventEmitter.emit('newPattern', pattern);

    return true;
  }

  // Validate new pattern against existing knowledge
  private async validatePattern(pattern: LearningPattern): Promise<ValidationResult> {
    const conflicts: string[] = [];
    let totalScore = 0;
    let comparisons = 0;

    // Compare with existing patterns
    for (const [id, existingPattern] of this.patterns) {
      if (existingPattern.type === pattern.type) {
        const score = await this.comparePatterns(pattern, existingPattern);
        totalScore += score;
        comparisons++;

        if (score < this.validationThreshold) {
          conflicts.push(id);
        }
      }
    }

    const averageScore = comparisons > 0 ? totalScore / comparisons : 1;

    return {
      isValid: conflicts.length === 0,
      score: averageScore,
      conflicts
    };
  }

  // Compare two patterns for similarity/conflicts
  private async comparePatterns(
    pattern1: LearningPattern,
    pattern2: LearningPattern
  ): Promise<number> {
    // Base confidence comparison
    const confidenceScore = Math.min(pattern1.confidence, pattern2.confidence);

    // Pattern-type specific comparison
    let similarityScore = 0;
    switch (pattern1.type) {
      case 'observation':
        similarityScore = this.compareObservations(pattern1.pattern, pattern2.pattern);
        break;
      case 'analysis':
        similarityScore = this.compareAnalysis(pattern1.pattern, pattern2.pattern);
        break;
      case 'correlation':
        similarityScore = this.compareCorrelations(pattern1.pattern, pattern2.pattern);
        break;
      case 'outcome':
        similarityScore = this.compareOutcomes(pattern1.pattern, pattern2.pattern);
        break;
    }

    return (confidenceScore + similarityScore) / 2;
  }

  // Pattern comparison methods
  private compareObservations(obs1: any, obs2: any): number {
    // Compare observation details
    const keys = ['category', 'environment', 'condition'];
    let matches = 0;
    
    keys.forEach(key => {
      if (obs1[key] === obs2[key]) matches++;
    });

    return matches / keys.length;
  }

  private compareAnalysis(analysis1: any, analysis2: any): number {
    // Compare analysis results
    const factors1 = new Set(analysis1.factors || []);
    const factors2 = new Set(analysis2.factors || []);
    
    const intersection = new Set([...factors1].filter(x => factors2.has(x)));
    const union = new Set([...factors1, ...factors2]);

    return intersection.size / union.size;
  }

  private compareCorrelations(corr1: any, corr2: any): number {
    // Compare correlation strengths
    const diff = Math.abs(corr1.strength - corr2.strength);
    return 1 - (diff / Math.max(corr1.strength, corr2.strength));
  }

  private compareOutcomes(outcome1: any, outcome2: any): number {
    // Compare outcome similarities
    const categories = ['safety', 'mobility', 'independence', 'comfort'];
    let totalDiff = 0;

    categories.forEach(category => {
      const diff = Math.abs(
        (outcome1.scores?.[category] || 0) - 
        (outcome2.scores?.[category] || 0)
      );
      totalDiff += diff;
    });

    return 1 - (totalDiff / (categories.length * 100));
  }

  // Get pattern weight based on type and age
  private getPatternWeight(pattern: LearningPattern): number {
    const age = Date.now() - pattern.timestamp;
    const ageWeight = Math.max(0.5, 1 - (age / (30 * 24 * 60 * 60 * 1000))); // Decay over 30 days

    const typeWeights = {
      observation: 1.0,
      analysis: 1.2,
      correlation: 1.5,
      outcome: 2.0
    };

    return typeWeights[pattern.type] * ageWeight * pattern.confidence;
  }

  // Get related patterns
  public getRelatedPatterns(pattern: LearningPattern): LearningPattern[] {
    const related: LearningPattern[] = [];

    this.patterns.forEach(existingPattern => {
      if (existingPattern.id !== pattern.id) {
        const similarity = this.comparePatterns(pattern, existingPattern);
        if (similarity > this.validationThreshold) {
          related.push(existingPattern);
        }
      }
    });

    return related.sort((a, b) => b.confidence - a.confidence);
  }

  // Subscribe to learning events
  public subscribe(
    event: 'newPattern' | 'patternRejected' | 'patternUpdated',
    callback: (data: any) => void
  ): void {
    this.eventEmitter.on(event, callback);
  }

  // Get learning system status
  public getStatus(): object {
    return {
      totalPatterns: this.patterns.size,
      patternsByType: Array.from(this.patterns.values()).reduce((acc, pattern) => {
        acc[pattern.type] = (acc[pattern.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      averageConfidence: Array.from(this.patterns.values())
        .reduce((sum, p) => sum + p.confidence, 0) / this.patterns.size,
      validationThreshold: this.validationThreshold
    };
  }
}