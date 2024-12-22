import { EventEmitter } from 'events';
import { AlertConfig, AlertRule, AlertState, MetricData, HealthStatus } from '../../types';

export class AlertManager extends EventEmitter {
    private alerts: Map<string, AlertConfig>;
    private alertStates: Map<string, AlertState>;

    constructor() {
        super();
        this.alerts = new Map();
        this.alertStates = new Map();
    }

    public addAlert(config: AlertConfig): void {
        this.validateAlertConfig(config);
        this.alerts.set(config.id, config);
        this.alertStates.set(config.id, {
            id: config.id,
            active: false,
            lastTriggered: null,
            lastResolved: null,
            occurrences: 0
        });
    }

    public removeAlert(alertId: string): void {
        this.alerts.delete(alertId);
        this.alertStates.delete(alertId);
    }

    public getAlerts(componentId?: string): AlertConfig[] {
        const alerts = Array.from(this.alerts.values());
        if (componentId) {
            return alerts.filter(alert => alert.componentId === componentId);
        }
        return alerts;
    }

    public getAlertState(alertId: string): AlertState | undefined {
        return this.alertStates.get(alertId);
    }

    public checkMetric(metric: MetricData): void {
        this.alerts.forEach((alert, alertId) => {
            if (alert.componentId === metric.componentId && 
                this.matchesMetricRule(metric, alert.rule)) {
                this.triggerAlert(alertId, {
                    type: 'metric',
                    data: metric
                });
            } else {
                this.resolveAlert(alertId);
            }
        });
    }

    public checkHealth(health: HealthStatus): void {
        this.alerts.forEach((alert, alertId) => {
            if (alert.componentId === health.componentId &&
                this.matchesHealthRule(health, alert.rule)) {
                this.triggerAlert(alertId, {
                    type: 'health',
                    data: health
                });
            } else {
                this.resolveAlert(alertId);
            }
        });
    }

    private validateAlertConfig(config: AlertConfig): void {
        if (!config.id || !config.componentId || !config.rule) {
            throw new Error('Invalid alert configuration');
        }

        if (!this.isValidRule(config.rule)) {
            throw new Error('Invalid alert rule');
        }
    }

    private isValidRule(rule: AlertRule): boolean {
        if (!rule.type || !rule.condition) {
            return false;
        }

        switch (rule.type) {
            case 'threshold':
                return typeof rule.threshold === 'number';
            case 'health':
                return typeof rule.status === 'string';
            case 'pattern':
                return rule.pattern instanceof RegExp;
            default:
                return false;
        }
    }

    private matchesMetricRule(metric: MetricData, rule: AlertRule): boolean {
        if (rule.type !== 'threshold') return false;

        switch (rule.condition) {
            case 'above':
                return metric.value > rule.threshold;
            case 'below':
                return metric.value < rule.threshold;
            case 'equals':
                return metric.value === rule.threshold;
            default:
                return false;
        }
    }

    private matchesHealthRule(health: HealthStatus, rule: AlertRule): boolean {
        if (rule.type !== 'health') return false;

        switch (rule.condition) {
            case 'equals':
                return health.status === rule.status;
            case 'not':
                return health.status !== rule.status;
            default:
                return false;
        }
    }

    private triggerAlert(alertId: string, trigger: any): void {
        const alert = this.alerts.get(alertId);
        const state = this.alertStates.get(alertId);

        if (!alert || !state) return;

        const now = Date.now();
        state.occurrences++;

        // Check if alert is already active
        if (!state.active) {
            state.active = true;
            state.lastTriggered = now;

            // Emit alert event
            this.emit('alert', {
                id: alertId,
                config: alert,
                state: state,
                trigger: trigger,
                timestamp: now
            });
        }
    }

    private resolveAlert(alertId: string): void {
        const state = this.alertStates.get(alertId);
        if (!state || !state.active) return;

        state.active = false;
        state.lastResolved = Date.now();

        // Emit resolution event
        this.emit('resolution', {
            id: alertId,
            state: state,
            timestamp: state.lastResolved
        });
    }

    public getAllAlertStates(): Map<string, AlertState> {
        return new Map(this.alertStates);
    }

    public getActiveAlerts(): AlertConfig[] {
        return Array.from(this.alerts.values())
            .filter(alert => this.alertStates.get(alert.id)?.active);
    }
}