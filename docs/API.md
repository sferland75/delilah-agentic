# Delilah Agentic System API Documentation

## Core Components API

### Analysis Agent

```typescript
class AnalysisAgent extends BaseAgent {
    constructor(
        coordinator: AgentCoordinator,
        learningDistributor: LearningDistributor,
        config: AnalysisAgentConfig
    );

    // Main analysis method
    public async analyze(data: any): Promise<AnalysisResult>;

    // Pattern management
    private async identifyRelevantPatterns(data: any): Promise<Pattern[]>;
    private async evaluatePatternMatch(pattern: Pattern, data: any): Promise<Confidence>;

    // Insight generation
    private async generateInsights(
        data: any,
        patterns: Pattern[],
        assessmentResults: any
    ): Promise<string[]>;
}
```

### Assessment Agent

```typescript
class SpecializedAssessment extends BaseAssessment {
    constructor(config: SpecializedAssessmentConfig);

    // Main assessment method
    public async assess(data: any): Promise<AssessmentResult>;

    // Rule processing
    private async applyDomainRules(data: any): Promise<ValidationResult>;
    private async evaluateRuleSet(data: any, ruleSet: RuleSet): Promise<ValidationResult>;
}
```

### Report Generator

```typescript
class ReportGenerator {
    constructor(
        coordinator: AgentCoordinator,
        config: ReportGeneratorConfig
    );

    // Report generation
    public async generateReport(
        data: any,
        template?: ReportTemplate,
        options?: ReportOptions
    ): Promise<Report>;

    // Template management
    public async loadTemplate(templateId: string): Promise<ReportTemplate>;
    public async listTemplates(): Promise<ReportTemplate[]>;
}
```

### System Coordinator

```typescript
class SystemCoordinator {
    constructor(config: SystemCoordinatorConfig);

    // Core methods
    public async processData(data: any): Promise<ProcessingResult>;
    public async getSystemState(): Promise<SystemState>;
    public async shutdown(): Promise<void>;

    // Configuration
    public async getConfig(): Promise<SystemConfig>;
    public async setConfig(key: string, value: any): Promise<void>;
    public async resetConfig(): Promise<void>;

    // Component lifecycle
    public async start(): Promise<void>;
    public async stop(): Promise<void>;
    public async restart(): Promise<void>;
}
```

## Monitoring API

### Monitoring Service

```typescript
class MonitoringService {
    constructor(config: MonitoringConfig);

    // Core monitoring
    public async getMetrics(
        componentId?: string,
        startTime?: number,
        endTime?: number
    ): Promise<MetricData[]>;

    public async getHealth(componentId?: string): Promise<HealthStatus[]>;

    // Alert management
    public configureAlert(config: AlertConfig): void;
    public getAlerts(componentId?: string): AlertConfig[];
    public removeAlert(alertId: string): void;

    // System overview
    public async getSystemOverview(): Promise<any>;
}
```

### Metrics Collector

```typescript
class MetricsCollector {
    constructor(config: MetricsCollectorConfig);

    // Core methods
    public async start(): Promise<void>;
    public stop(): void;
    public registerComponent(componentId: string, generator: MetricGenerator): void;

    // Query interface
    public async query(query: MetricsQuery): Promise<any>;
}
```

## Data Processing API

### Data Processor

```typescript
class DataProcessor {
    constructor(
        coordinator: SystemCoordinator,
        config: DataProcessorConfig
    );

    // Processing methods
    public async processData(
        data: any,
        format: DataFormat,
        context?: ProcessingContext
    ): Promise<any>;

    public async processBatch(
        dataItems: any[],
        format: DataFormat,
        context?: ProcessingContext
    ): Promise<any[]>;

    // Transformation management
    public async registerTransformation(
        name: string,
        transformation: DataTransformation
    ): Promise<void>;
}
```

## Event System

### Learning Distributor

```typescript
class LearningDistributor {
    constructor(config: LearningConfig);

    // Event handling
    public subscribe(eventType: string, handler: EventHandler): void;
    public async distribute(event: LearningEvent): Promise<void>;

    // Pattern management
    public async updatePattern(pattern: Pattern): Promise<void>;
    public getPatterns(): Pattern[];
}
```

## Type Definitions

Refer to [src/types/index.ts](../src/types/index.ts) for complete type definitions.

## Error Handling

All API methods may throw:
- `SystemError`: Base error class
- `ValidationError`: Input validation errors
- `ProcessingError`: Data processing errors

Error handling example:
```typescript
try {
    const result = await agent.analyze(data);
} catch (error) {
    if (error instanceof ValidationError) {
        // Handle validation errors
        console.error('Validation failed:', error.errors);
    } else if (error instanceof ProcessingError) {
        // Handle processing errors
        console.error('Processing failed:', error.message);
        if (error.retry) {
            // Implement retry logic
        }
    } else {
        // Handle other errors
        console.error('System error:', error);
    }
}
```

## Best Practices

1. Error Handling
   - Always catch and handle errors
   - Use specific error types
   - Implement retry logic where appropriate

2. Async Operations
   - Use async/await
   - Handle promise rejections
   - Implement timeouts

3. Resource Management
   - Close resources after use
   - Implement proper cleanup
   - Use try/finally blocks

4. Type Safety
   - Use TypeScript strict mode
   - Define proper interfaces
   - Validate input data

## Examples

### Basic Usage

```typescript
// Initialize system
const coordinator = new SystemCoordinator();
const processor = new DataProcessor(coordinator);

// Process data
const result = await processor.processData(data, 'json');

// Generate report
const generator = new ReportGenerator(coordinator);
const report = await generator.generateReport(result);

// Cleanup
await coordinator.shutdown();
```

### Advanced Usage

```typescript
// Configure monitoring
const monitoring = new MonitoringService({
    enableMetrics: true,
    enableHealth: true,
    metricsInterval: 5000
});

// Register component
monitoring.registerComponent('processor', async () => ({
    componentId: 'processor',
    status: 'healthy',
    timestamp: Date.now()
}));

// Configure alert
monitoring.configureAlert({
    id: 'high-latency',
    name: 'High Processing Latency',
    componentId: 'processor',
    rule: {
        type: 'threshold',
        condition: 'above',
        threshold: 1000
    },
    priority: 'high'
});

// Start monitoring
await monitoring.start();
```