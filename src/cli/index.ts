#!/usr/bin/env node

import { Command } from 'commander';
import { ProcessCommand } from './commands/ProcessCommand';
import { MonitorCommand } from './commands/MonitorCommand';
import { ReportCommand } from './commands/ReportCommand';
import { SystemCommand } from './commands/SystemCommand';
import { version } from '../../package.json';

const program = new Command();

// Setup main program
program
    .name('delilah')
    .description('Delilah Agentic System CLI')
    .version(version);

// Register commands
ProcessCommand.register(program);
MonitorCommand.register(program);
ReportCommand.register(program);
SystemCommand.register(program);

// Global error handling
process.on('unhandledRejection', (error: any) => {
    console.error('Unhandled error:', error?.message || error);
    process.exit(1);
});

// Parse and execute
program.parse(process.argv);
