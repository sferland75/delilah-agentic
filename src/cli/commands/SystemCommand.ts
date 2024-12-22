import { Command } from 'commander';
import { BaseCommand } from './BaseCommand';
import { SystemCoordinator } from '../../core/coordinator/SystemCoordinator';
import { MonitoringService } from '../../core/monitoring/MonitoringService';
import chalk from 'chalk';

export class SystemCommand extends BaseCommand {
    protected static configure(): void {
        const system = this.program
            .command('system')
            .description('System management commands');

        // Status command
        system
            .command('status')
            .description('Show system status')
            .option('--json', 'Output in JSON format')
            .action(this.handleStatus.bind(this));

        // Configuration command
        system
            .command('config')
            .description('Manage system configuration')
            .option('--show', 'Show current configuration')
            .option('--set <key=value>', 'Set configuration value')
            .option('--reset', 'Reset to default configuration')
            .action(this.handleConfig.bind(this));

        // Control commands
        system
            .command('control')
            .description('System control operations')
            .option('--start', 'Start the system')
            .option('--stop', 'Stop the system')
            .option('--restart', 'Restart the system')
            .option('--maintenance', 'Enter/exit maintenance mode')
            .action(this.handleControl.bind(this));

        // Diagnostic commands
        system
            .command('diagnostic')
            .description('Run system diagnostics')
            .option('--level <level>', 'Diagnostic level (basic, full)', 'basic')
            .option('--component <name>', 'Target specific component')
            .option('--export <file>', 'Export results to file')
            .action(this.handleDiagnostic.bind(this));
    }

    private static async handleStatus(options: any): Promise<void> {
        const spinner = this.createSpinner('Getting system status...');

        try {
            const coordinator = new SystemCoordinator();
            const monitoring = new MonitoringService();

            spinner.start();

            // Collect system information
            const [systemState, health, metrics] = await Promise.all([
                coordinator.getSystemState(),
                monitoring.getHealth(),
                monitoring.getMetrics()
            ]);

            spinner.stop();

            if (options.json) {
                console.log(JSON.stringify({
                    state: systemState,
                    health,
                    metrics
                }, null, 2));
            } else {
                this.displaySystemStatus(systemState, health, metrics);
            }

            await coordinator.shutdown();
            await monitoring.shutdown();

        } catch (error) {
            spinner.stop();
            await this.handleError(error);
        }
    }

    private static async handleConfig(options: any): Promise<void> {
        const spinner = this.createSpinner('Managing configuration...');

        try {
            const coordinator = new SystemCoordinator();
            spinner.start();

            if (options.show) {
                const config = await coordinator.getConfig();
                spinner.stop();
                this.displayConfig(config);
            } else if (options.set) {
                const [key, value] = options.set.split('=');
                await coordinator.setConfig(key, value);
                spinner.stop();
                this.logSuccess(`Configuration updated: ${key}`);
            } else if (options.reset) {
                await coordinator.resetConfig();
                spinner.stop();
                this.logSuccess('Configuration reset to defaults');
            }

            await coordinator.shutdown();

        } catch (error) {
            spinner.stop();
            await this.handleError(error);
        }
    }

    private static async handleControl(options: any): Promise<void> {
        const spinner = this.createSpinner('Executing control operation...');

        try {
            const coordinator = new SystemCoordinator();
            spinner.start();

            if (options.start) {
                await coordinator.start();
                spinner.stop();
                this.logSuccess('System started');
            } else if (options.stop) {
                await coordinator.stop();
                spinner.stop();
                this.logSuccess('System stopped');
            } else if (options.restart) {
                await coordinator.restart();
                spinner.stop();
                this.logSuccess('System restarted');
            } else if (options.maintenance !== undefined) {
                await coordinator.setMaintenanceMode(options.maintenance);
                spinner.stop();
                this.logSuccess(`Maintenance mode ${options.maintenance ? 'enabled' : 'disabled'}`);
            }

        } catch (error) {
            spinner.stop();
            await this.handleError(error);
        }
    }

    private static async handleDiagnostic(options: any): Promise<void> {
        const spinner = this.createSpinner('Running diagnostics...');

        try {
            const coordinator = new SystemCoordinator();
            spinner.start();

            const results = await coordinator.runDiagnostics({
                level: options.level,
                component: options.component
            });

            spinner.stop();

            if (options.export) {
                await this.exportDiagnostics(options.export, results);
                this.logSuccess(`Diagnostic results exported to ${options.export}`);
            } else {
                this.displayDiagnostics(results);
            }

            await coordinator.shutdown();

        } catch (error) {
            spinner.stop();
            await this.handleError(error);
        }
    }

    private static displaySystemStatus(
        state: any,
        health: any[],
        metrics: any[]
    ): void {
        console.log(chalk.bold('\nSystem Status:'));
        console.log(`Status: ${this.getStatusIndicator(state.status)} ${state.status}`);
        console.log(`Active Processes: ${state.activeProcesses.size}`);
        console.log(`Last Error: ${state.errors.length > 0 ? 
            state.errors[state.errors.length - 1].message : 'None'}`);

        console.log(chalk.bold('\nComponent Health:'));
        health.forEach(h => {
            console.log(`${this.getStatusIndicator(h.status)} ${h.componentId}: ${h.status}`);
            if (h.message) console.log(`   ${h.message}`);
        });

        console.log(chalk.bold('\nKey Metrics:'));
        this.displayKeyMetrics(metrics);
    }

    private static displayConfig(config: any): void {
        console.log(chalk.bold('\nSystem Configuration:'));
        Object.entries(config).forEach(([key, value]) => {
            console.log(`${chalk.cyan(key)}: ${value}`);
        });
    }

    private static displayDiagnostics(results: any): void {
        console.log(chalk.bold('\nDiagnostic Results:'));
        
        results.forEach((result: any) => {
            console.log(`\n${chalk.cyan(result.component)}:`);
            console.log(`Status: ${this.getStatusIndicator(result.status)} ${result.status}`);
            
            if (result.details) {
                Object.entries(result.details).forEach(([key, value]) => {
                    console.log(`${key}: ${value}`);
                });
            }

            if (result.issues?.length > 0) {
                console.log(chalk.yellow('\nIssues:'));
                result.issues.forEach((issue: string) => {
                    console.log(`  - ${issue}`);
                });
            }
        });
    }

    private static async exportDiagnostics(file: string, results: any): Promise<void> {
        const content = JSON.stringify(results, null, 2);
        await writeFile(file, content);
    }

    private static displayKeyMetrics(metrics: any[]): void {
        const summary = this.summarizeMetrics(metrics);
        Object.entries(summary).forEach(([key, value]) => {
            console.log(`${key}: ${value}`);
        });
    }

    private static summarizeMetrics(metrics: any[]): Record<string, string> {
        const summary: Record<string, string> = {};
        
        // Group metrics by name
        const grouped = metrics.reduce((acc: any, metric) => {
            if (!acc[metric.name]) acc[metric.name] = [];
            acc[metric.name].push(metric.value);
            return acc;
        }, {});

        // Calculate averages and format values
        Object.entries(grouped).forEach(([name, values]: [string, any[]]) => {
            const avg = values.reduce((a, b) => a + b, 0) / values.length;
            summary[name] = this.formatMetricValue(name, avg);
        });

        return summary;
    }

    private static formatMetricValue(name: string, value: number): string {
        if (name.includes('time')) {
            return this.formatDuration(value);
        } else if (name.includes('size') || name.includes('memory')) {
            return this.formatBytes(value);
        } else if (name.includes('percent') || name.includes('ratio')) {
            return `${(value * 100).toFixed(1)}%`;
        } else {
            return this.formatNumber(value);
        }
    }

    private static getStatusIndicator(status: string): string {
        switch (status.toLowerCase()) {
            case 'running':
            case 'healthy':
            case 'ok':
                return chalk.green('⬤');
            case 'warning':
            case 'degraded':
                return chalk.yellow('⬤');
            case 'error':
            case 'failed':
            case 'unhealthy':
                return chalk.red('⬤');
            default:
                return chalk.gray('⬤');
        }
    }
}