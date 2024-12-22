# Delilah Agentic System Deployment Guide

## Overview
This guide covers the deployment process for the Delilah Agentic System, including both development and production environments.

## Prerequisites
- Node.js 18 or higher
- Docker and Docker Compose
- Git
- Access to the project repository

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/sferland75/delilah-agentic.git
cd delilah-agentic
```

2. Install dependencies:
```bash
npm install
```

3. Set up development environment:
```bash
cp config/deployment/development.env .env
```

4. Start the development server:
```bash
npm run dev
```

## Production Deployment

### Docker Deployment

1. Build and start the containers:
```bash
cd config/deployment
docker-compose up -d
```

2. Verify the deployment:
```bash
docker-compose ps
```

3. Monitor the logs:
```bash
docker-compose logs -f app
```

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Set up environment:
```bash
cp config/deployment/production.env .env
```

3. Start the application:
```bash
node dist/index.js
```

## Monitoring Setup

### Prometheus
Prometheus is configured to scrape metrics from the application:

1. Access Prometheus UI:
   - URL: http://localhost:9090
   - Default credentials in production should be configured

2. Verify metrics collection:
   - Navigate to Status -> Targets
   - Check that the application endpoint is UP

### Grafana
Grafana is set up to visualize metrics:

1. Access Grafana UI:
   - URL: http://localhost:3000
   - Default credentials: admin/admin

2. Import dashboards:
   - Navigate to Dashboards -> Import
   - Use the provided dashboard JSONs from config/grafana/dashboards/

## Health Checks

The system provides several health check endpoints:

- `/health` - Overall system health
- `/health/metrics` - Metrics system health
- `/health/optimizer` - Adaptive optimization system health

## Scaling Considerations

### Horizontal Scaling
- The application is stateless and can be scaled horizontally
- Use a load balancer when running multiple instances
- Configure sticky sessions for WebSocket connections

### Vertical Scaling
- Monitor memory usage and CPU utilization
- Adjust container resources in docker-compose.yml as needed

## Backup and Recovery

### Data Backup
Critical data is stored in the following locations:

1. Metrics data:
   - Location: /app/data/metrics
   - Backup frequency: Daily

2. System state:
   - Location: /app/data/state
   - Backup frequency: Hourly

### Recovery Procedure

1. Stop the application:
```bash
docker-compose down
```

2. Restore data from backups:
```bash
cp -r /backup/data/* /app/data/
```

3. Restart the application:
```bash
docker-compose up -d
```

## Troubleshooting

### Common Issues

1. WebSocket Connection Failures
   - Check network connectivity
   - Verify proxy configurations
   - Ensure correct WebSocket endpoint configuration

2. High Memory Usage
   - Check metric retention settings
   - Verify memory limits in Docker configuration
   - Monitor garbage collection patterns

3. Alert System Issues
   - Verify notification service configuration
   - Check alert thresholds
   - Monitor notification queue size

### Debug Mode

To enable debug mode:

1. Set environment variables:
```bash
LOG_LEVEL=debug
DEBUG=true
```

2. Restart the application

3. Check debug logs:
```bash
tail -f logs/debug.log
```

## Maintenance

### Regular Maintenance Tasks

1. Log Rotation
   - Logs are automatically rotated daily
   - Retain logs for 30 days in production

2. Metric Cleanup
   - Old metrics are automatically purged based on retention settings
   - Adjust MONITORING_RETENTION_DAYS as needed

3. System Updates
   - Regular dependency updates
   - Security patches
   - Performance optimizations

### Monitoring Thresholds

Adjust alert thresholds in production:

1. Response Time:
   - Warning: > 500ms
   - Critical: > 1000ms

2. Error Rate:
   - Warning: > 5%
   - Critical: > 10%

3. CPU Usage:
   - Warning: > 80%
   - Critical: > 95%

## Support

For additional support:
- File issues on GitHub
- Contact the development team
- Review system documentation

## Version History

- v1.0.0 - Initial release
  - Base monitoring system
  - Adaptive optimization
  - Real-time updates

## License
Refer to LICENSE file in the repository