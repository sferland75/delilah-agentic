import { Command } from 'commander';
import { BaseCommand } from './BaseCommand';
import { MonitoringService } from '../../core/monitoring/MonitoringService';
import { SystemCoordinator } from '../../core/coordinator/SystemCoordinator';
import { DataProcessor } from '../../core/processing/DataProcessor';

export class MonitorCommand extends BaseCommand {
    protected static configure(): void {
        const monitor = this.program
            .command('monitor')
            .description('Monitor system status and performance');

        // Real-time monitoring
        monitor
            .command('watch')
            .description('Watch system metrics in real-time')
            .option('-i, --interval <seconds>', 'Update interval in seconds', '5')
            .option('--component <name>', 'Monitor specific component')
            .action(this.handleWatch.bind(this));

        // Health check
        monitor
            .command('health')
            .description('Check system health')
            .option('--component <name>', 'Check specific component')
            .action(this.handleHealthCheck.bind(this));

        // Metrics display
        monitor
            .command('metrics')
            .description('Display system metrics')
            .option('--from <time>', 'Start time for metrics')
            .option('--to <time>', 'End time for metrics')
            .option('--component <name>', 'Show metrics for specific component')
            .option('--format <format>', 'Output format (table, json)', 'table')
            .action(this.handleMetrics.bind(this));

        // Alert configuration
        monitor
            .command('alerts')
            .description('Manage system alerts')
            .option('--list', 'List configured alerts')
            .option('--add <config>', 'Add new alert configuration')
            .option('--remove <id>', 'Remove alert configuration')
            .option('--history', 'Show alert history')
            .action(this.handleAlerts.bind(this));
    }

    private static async handleWatch(options: any): Promise<void> {
        const interval = parseInt(options.interval) * 1000;
        const monitoring = await this.setupMonitoring();
        let lastUpdate = Date.now();

        console.clear();
        process.stdout.write('\x1B[?25l'); // Hide cursor

        const update = async () => {
            const metrics = await monitoring.getMetrics(
                options.component,
                lastUpdate
            );
            const health = await monitoring.getHealth(options.component);

            console.clear();
            this.displaySystemStatus(health, metrics);
            lastUpdate = Date.now();
        };

        // Initial update
        await update();

        // Setup interval
        const updateInterval = setInterval(update, interval);

        // Handle exit
        process.on('SIGINT', async () => {
            clearInterval(updateInterval);
            process.stdout.write('\x1B[?25h'); // Show cursor
            await monitoring.shutdown();
            process.exit(0);
        });
    }

    private static async handleHealthCheck(options: any): Promise<void> {
        const spinner = this.createSpinner('Checking system health...');
        const monitoring = await this.setupMonitoring();

        try {
            spinner.start();
            const health = await monitoring.getHealth(options.component);
            spinner.stop();

            this.displayHealthStatus(health);
            
            const hasIssues = health.some(h => h.status !== 'healthy');
            if (hasIssues) process.exit(1);

        } catch (error) {
            spinner.stop();
            await this.handleError(error);
        } finally {
            await monitoring.shutdown();
        }
    }

    private static async handleMetrics(options: any): Promise<void> {
        const spinner = this.createSpinner('Collecting metrics...');
        const monitoring = await this.setupMonitoring();

        try {
            spinner.start();

            const startTime = options.from ? new Date(options.from).getTime() : undefined;
            const endTime = options.to ? new Date(options.to).getTime() : undefined;

            const metrics = await monitoring.getMetrics(
                options.component,
                startTime,
                endTime
            );

            spinner.stop();

            if (options.format === 'json') {
                console.log(JSON.stringify(metrics, null, 2));
            } else {
                this.displayMetricsTable(metrics);
            }

        } catch (error) {
            spinner.stop();
            await this.handleError(error);
        } finally {
            await monitoring.shutdown();
        }
    }

    private static async handleAlerts(options: any): Promise<void> {
        const monitoring = await this.setupMonitoring();

        try {
            if (options.list) {
                const alerts = monitoring.getAlerts();
                this.displayAlertConfigurations(alerts);
            } else if (options.add) {
                const config = JSON.parse(options.add);
                monitoring.configureAlert(config);
                this.logSuccess('Alert configuration added');
            } else if (options.remove) {
                monitoring.removeAlert(options.remove);
                this.logSuccess('Alert configuration removed');
            } else if (options.history) {
                const history = await monitoring.getAlertHistory();
                this.displayAlertHistory(history);
            }
        } catch (error) {
            await this.handleError(error);
        } finally {
            await monitoring.shutdown();
        }
    }

    private static async setupMonitoring(): Promise<MonitoringService> {
        const coordinator = new SystemCoordinator();
        const processor = new DataProcessor(coordinator);

        const monitoring = new MonitoringService({
            enableMetrics: true,
            enableHealth: true,
            enableAlerts: true,
            metricsInterval: 1000,
            healthCheckInterval: 2000
        });

        // Register components
        monitoring.registerComponent('coordinator', async () => ({
            componentId: 'coordinator',
            status: coordinator.getStatus(),
            timestamp: Date.now()
        }));

        monitoring.registerComponent('processor', async () => ({
            componentId: 'processor',
            status: processor.getStatus(),
            timestamp: Date.now()
        }));

        return monitoring;
    }

    private static displaySystemStatus(health: any[], metrics: any[]): void {
        console.log(chalk.bold('\nSystem Status:'));
        
        // Display health status
        health.forEach(h => {
            const status = this.getStatusIndicator(h.status);
            console.log(`${status} ${h.componentId}: ${h.status}`);
            if (h.message) console.log(`   ${h.message}`);
        });

        // Display key metrics
        console.log('\n' + chalk.bold('Key Metrics:'));
        const keyMetrics = this.summarizeKeyMetrics(metrics);
        Object.entries(keyMetrics).forEach(([name, value]) => {
            console.log(`${name}: ${value}`);
        });
    }

    private static getStatusIndicator(status: string): string {
        switch (status) {
            case 'healthy': return chalk.green('⬤');
            case 'degraded': return chalk.yellow('⬤');
            case 'unhealthy': return chalk.red('⬤');
            default: return chalk.gray('⬤');
        }
    }

    private static summarizeKeyMetrics(metrics: any[]): Record<string, string> {
        // Implementation details for metric summarization
        return {};
    }

    private static displayHealthStatus(health: any[]): void {
        // Implementation details for health status display
    }

    private static displayMetricsTable(metrics: any[]): void {
        // Implementation details for metrics table display
    }

    private static displayAlertConfigurations(alerts: any[]): void {
        // Implementation details for alert configuration display
    }

    private static displayAlertHistory(history: any[]): void {
        // Implementation details for alert history display
    }
}