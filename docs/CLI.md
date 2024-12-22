# Delilah Agentic System CLI

Comprehensive documentation for the Delilah CLI interface.

## Global Options

```bash
delilah [command] [options]

Options:
  -V, --version    Output version information
  -h, --help       Display help for command
```

## Commands

### Process
Handle data processing operations.

```bash
# Process single file
delilah process file <file> [options]
  -f, --format <format>    File format (json, csv, text) [default: json]
  -o, --output <file>      Output file for results
  --no-report              Skip report generation
  --confidence <threshold> Confidence threshold [default: 0.75]

# Process batch of files
delilah process batch <directory> [options]
  -f, --format <format>     File format [default: json]
  -o, --output-dir <dir>    Output directory for results
  --pattern <pattern>       File name pattern
  --parallel <count>        Number of parallel processes [default: 4]
  --confidence <threshold>  Confidence threshold [default: 0.75]

# Process from stdin
delilah process stream [options]
  -f, --format <format>     Data format [default: json]
  --confidence <threshold>  Confidence threshold [default: 0.75]
```

### Monitor
System monitoring and health checks.

```bash
# Watch system metrics
delilah monitor watch [options]
  -i, --interval <seconds>  Update interval [default: 5]
  --component <name>        Monitor specific component

# Check system health
delilah monitor health [options]
  --component <name>        Check specific component

# Display metrics
delilah monitor metrics [options]
  --from <time>            Start time for metrics
  --to <time>              End time for metrics
  --component <name>       Show metrics for specific component
  --format <format>        Output format (table, json) [default: table]

# Manage alerts
delilah monitor alerts [options]
  --list                   List configured alerts
  --add <config>           Add new alert configuration
  --remove <id>            Remove alert configuration
  --history                Show alert history
```

### Report
Report generation and management.

```bash
# Generate report
delilah report generate <source> [options]
  -t, --template <name>    Report template to use
  -o, --output <file>      Output file for report
  --format <format>        Output format (pdf, html, md) [default: pdf]
  --include-metrics        Include system metrics

# List templates
delilah report templates [options]
  --show-details           Show template details

# List reports
delilah report list [options]
  --from <date>           Start date for listing
  --to <date>             End date for listing
  --source <source>       Filter by source
```

### System
System management commands.

```bash
# Show system status
delilah system status [options]
  --json                  Output in JSON format

# Manage configuration
delilah system config [options]
  --show                  Show current configuration
  --set <key=value>       Set configuration value
  --reset                 Reset to default configuration

# System control
delilah system control [options]
  --start                 Start the system
  --stop                  Stop the system
  --restart               Restart the system
  --maintenance           Enter/exit maintenance mode

# Run diagnostics
delilah system diagnostic [options]
  --level <level>         Diagnostic level (basic, full) [default: basic]
  --component <name>      Target specific component
  --export <file>         Export results to file
```

## Examples

### Basic Usage

```bash
# Process a JSON file
delilah process file data.json -o results.json

# Watch system metrics
delilah monitor watch -i 10

# Generate a report
delilah report generate data.json -t analysis -o report.pdf

# Check system status
delilah system status
```

### Advanced Usage

```bash
# Process multiple files in parallel
delilah process batch ./data --pattern "*.json" --parallel 8

# Monitor specific component with custom interval
delilah monitor watch --component analysis-agent -i 2

# Generate detailed HTML report with metrics
delilah report generate analysis-data -t detailed --format html --include-metrics

# Run full system diagnostics
delilah system diagnostic --level full --export diagnosis.json
```

## Environment Variables

- `DELILAH_CONFIG_PATH`: Path to configuration file
- `DELILAH_LOG_LEVEL`: Logging level (debug, info, warn, error)
- `DELILAH_METRICS_INTERVAL`: Default metrics collection interval
- `DELILAH_MAX_PARALLEL`: Maximum parallel processing limit

## Tips

1. Use `--help` with any command for detailed usage information
2. Monitor commands support live updates with `-i` option
3. Most commands support JSON output for scripting
4. Use environment variables for consistent configuration

## Error Handling

Exit codes:
- 0: Success
- 1: General error
- 2: Configuration error
- 3: Input error
- 4: System error

Error messages include:
- Error code
- Detailed message
- Suggested resolution
- Debug information (if available)