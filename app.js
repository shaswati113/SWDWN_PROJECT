#!/usr/bin/env node
/**
 * app.js — Password Manager CLI Entry Point
 * Registers all sub-commands and routes user input.
 *
 * Usage:
 *   node app.js --help
 *   node app.js retrieve
 *   node app.js retrieve -s github
 *   node app.js retrieve -s github --show-password
 */

'use strict';

const { Command } = require('commander');
const chalk        = require('chalk');
const { buildRetrieveCommand } = require('./cli/commands/retrieve');

// ─── Root program ─────────────────────────────────────────────────────────────
const program = new Command();

program
  .name('passmanager')
  .version('1.0.0', '-v, --version', 'Display current version')
  .description(
    chalk.bold('Password Manager CLI') +
    ' — securely store and retrieve credentials'
  )
  .addHelpText(
    'after',
    `
Available Commands:
  retrieve    Retrieve stored credentials for a given source

Run "node app.js <command> --help" for command-specific help.
`
  );

// ─── Register sub-commands ────────────────────────────────────────────────────
program.addCommand(buildRetrieveCommand());

// ─── Unknown command handler ──────────────────────────────────────────────────
program.on('command:*', (operands) => {
  console.error(
    chalk.red(`\n  ✖ Unknown command: "${operands[0]}"`)
  );
  console.log(chalk.yellow('  Run "node app.js --help" to see available commands.\n'));
  process.exitCode = 1;
});

// ─── Show help if no arguments provided ──────────────────────────────────────
if (process.argv.length <= 2) {
  program.help();
}

// ─── Parse ────────────────────────────────────────────────────────────────────
program.parseAsync(process.argv).catch((err) => {
  console.error(chalk.red('\n  Unexpected error:'), err.message);
  process.exit(1);
});