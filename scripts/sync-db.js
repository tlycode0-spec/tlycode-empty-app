#!/usr/bin/env node
/*
 * scripts/sync-db.js
 *
 * Synchronises a Postgres database FROM <SOURCE_URL> INTO <TARGET_URL>.
 * Streams `pg_dump` directly into `psql` so no dump file hits disk.
 *
 * Usage:
 *   node scripts/sync-db.js <SOURCE_URL> <TARGET_URL> [--yes]
 *
 * Flags:
 *   --yes     Skip the safety guard. Required for non-interactive use; the
 *             script refuses to run without it because the target schema is
 *             dropped and replaced.
 *
 * Requires `pg_dump` and `psql` on PATH.
 */

const { spawn } = require('node:child_process');

const USAGE = `Usage: node scripts/sync-db.js <SOURCE_URL> <TARGET_URL> [--yes]

Copies SOURCE_URL into TARGET_URL. Target schema is wiped and replaced.

  --yes    Required to actually run (safety guard).`;

function fail(msg, code = 2) {
    console.error(msg);
    process.exit(code);
}

const args = process.argv.slice(2);
const yes = args.includes('--yes');
const positional = args.filter((a) => !a.startsWith('--'));

if (positional.length !== 2) fail(USAGE);
const [source, target] = positional;
if (source === target) fail('SOURCE and TARGET must be different.');
if (!yes) fail(`${USAGE}\n\nRefusing to run without --yes (destructive on target).`);

const redact = (u) => u.replace(/:\/\/[^@/]*@/, '://***@');
console.error(`SOURCE: ${redact(source)}`);
console.error(`TARGET: ${redact(target)}  (will be wiped and replaced)`);
console.error('Streaming pg_dump → psql ...');
console.error('');

const dump = spawn(
    'pg_dump',
    [
        '--no-owner',
        '--no-acl',
        '--clean',
        '--if-exists',
        '--quote-all-identifiers',
        source,
    ],
    { stdio: ['ignore', 'pipe', 'inherit'] }
);

const restore = spawn(
    'psql',
    [
        '--quiet',
        '--single-transaction',
        '--set', 'ON_ERROR_STOP=1',
        target,
    ],
    { stdio: ['pipe', 'inherit', 'inherit'] }
);

dump.stdout.pipe(restore.stdin);

let dumpCode;
let restoreCode;
function check() {
    if (dumpCode === undefined || restoreCode === undefined) return;
    if (dumpCode !== 0 || restoreCode !== 0) {
        console.error(`\nSync failed (pg_dump=${dumpCode}, psql=${restoreCode}).`);
        process.exit(1);
    }
    console.error('\nSync complete.');
}

dump.on('exit', (code) => { dumpCode = code; check(); });
restore.on('exit', (code) => { restoreCode = code; check(); });
dump.on('error', (err) => fail(`Failed to spawn pg_dump: ${err.message}. Is the postgres client installed and on PATH?`, 1));
restore.on('error', (err) => fail(`Failed to spawn psql: ${err.message}. Is the postgres client installed and on PATH?`, 1));
