/**
 * retrieve.js — CLI Command Module for Password Retrieval
 * Team Member 1: CLI Command Integration
 * 
 * Responsibilities:
 *  - Define and register the "retrieve" command via Commander.js
 *  - Route the command to the appropriate handler
 *  - Provide help text and handle invalid usage
 */

'use strict';

const { Command } = require('commander');
const readline      = require('readline');
const chalk         = require('chalk');

// ─── Simulated DB (replace with real passwordService in production) ───────────
const mockDB = [
  { source: 'github',   username: 'subhashree',  password: 'gh@Secret123' },
  { source: 'gmail',    username: 'subhashree@gmail.com', password: 'Gm@Pass456' },
  { source: 'linkedin', username: 'subhashree01', password: 'Li@Pass789' },
];

/**
 * Simulates passwordService.getPasswordBySource().
 * In the full project this comes from services/passwordService.js (Member 3).
 *
 * @param {string} source
 * @returns {object|null}
 */
function getPasswordBySource(source) {
  return mockDB.find(
    (entry) => entry.source.toLowerCase() === source.trim().toLowerCase()
  ) || null;
}

/**
 * Simulates displayCredentials() from utils/displayCredentials.js (Member 4).
 * Masks the password by default.
 *
 * @param {object} record
 * @param {boolean} showPassword
 */
function displayCredentials(record, showPassword = false) {
  console.log('\n' + chalk.green('✔ Credentials Found:'));
  console.log(chalk.cyan('  Source   :'), chalk.white(record.source));
  console.log(chalk.cyan('  Username :'), chalk.white(record.username));
  console.log(
    chalk.cyan('  Password :'),
    showPassword
      ? chalk.yellow(record.password)
      : chalk.yellow('*'.repeat(record.password.length))
  );
  console.log();
}

/**
 * Prompt the user for a source name using readline (core Node.js — no external deps).
 * In the full project, Member 2 handles this in utils/promptSource.js.
 *
 * @returns {Promise<string>}
 */
function promptSource() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input : process.stdin,
      output: process.stdout,
    });
    rl.question(chalk.blueBright('  Enter source name: '), (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// ─── Build the retrieve command ───────────────────────────────────────────────

/**
 * Creates and returns a configured Commander Command object
 * for the "retrieve" sub-command.
 *
 * @returns {Command}
 */
function buildRetrieveCommand() {
  const retrieve = new Command('retrieve');

  retrieve
    .description('Retrieve stored credentials by entering a source name')
    .option('-s, --source <name>', 'Source name to look up (skip interactive prompt)')
    .option('--show-password',     'Display the actual password instead of masking it')
    .addHelpText(
      'after',
      `
Examples:
  $ node app.js retrieve                   # interactive mode
  $ node app.js retrieve -s github         # direct lookup
  $ node app.js retrieve -s github --show-password
`
    )
    .action(async (options) => {
      console.log(chalk.bold.magenta('\n🔐 Password Manager — Retrieve Credentials\n'));

      let source = options.source;

      // ── Input phase (Member 2 integration point) ─────────────────────────
      if (!source) {
        source = await promptSource();
      }

      // ── Validate input ────────────────────────────────────────────────────
      if (!source || source.length === 0) {
        console.error(chalk.red('\n  ✖ Error: Source name cannot be empty.\n'));
        process.exitCode = 1;
        return;
      }

      // ── Query phase (Member 3 integration point) ──────────────────────────
      let record;
      try {
        record = getPasswordBySource(source);
      } catch (err) {
        console.error(
          chalk.red('\n  ✖ Database error:'),
          err.message || 'Unknown error'
        );
        process.exitCode = 1;
        return;
      }

      // ── Display phase (Member 4 integration point) ────────────────────────
      if (record) {
        displayCredentials(record, options.showPassword || false);
      } else {
        console.log(
          chalk.yellow(`\n  ⚠  No credentials found for source: "${source}"\n`)
        );
      }
    });

  return retrieve;
}

module.exports = { buildRetrieveCommand };