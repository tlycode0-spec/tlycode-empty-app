---
name: sync-db
description: Synchronise the production Postgres database into the test database via scripts/sync-db.js. Looks up the connection URLs from tlycode environment configs (secrets) using mcp__tlycode__* tools, then streams pg_dump → psql. Trigger when the user asks to "sync prod to test", "překopírovat databázi", "obnovit testovací DB z produkce", etc.
---

# Sync DB (production → test)

Goal: replace the **test** Postgres database with a fresh copy of the **production** one. Direction is fixed — never the other way round.

## Pre-flight (do these before anything else)

1. **Confirm the direction in plain Czech** with the user — even if they triggered the skill explicitly. Wording: "Přepíšu testovací DB obsahem produkce — souhlasíš?" Wait for an explicit yes. The operation is destructive on test.

2. **Check tlycode MCP auth.** If `mcp__tlycode__*` tools are missing or return an auth error (`unauthenticated`, `401`, `403`, "session expired", "no project selected"), stop and tell the user (in Czech) to re-login via **Hosting projekty** in the menu — see `CLAUDE.md` → "tlycode MCP authentication". Do not improvise around missing auth.

3. **Verify `pg_dump` and `psql` are installed** with `which pg_dump psql`. If missing, tell the user to install the Postgres client (macOS: `brew install libpq && brew link --force libpq`) and stop.

## Resolving DB URLs

The script needs two full Postgres connection strings. Fetch them from tlycode in this order:

1. `mcp__tlycode__list_environments` — find the env IDs/names. Expect two envs roughly named `production` (or `prod`, `live`) and `test` (or `staging`, `dev`).

   - **If only one environment exists**, stop and tell the user (in Czech): "Projekt má jen jedno prostředí, není co s čím synchronizovat." Do **not** sync the env with itself, do **not** offer to create a second env, do **not** run the script. Just exit cleanly.
   - If naming is ambiguous (two envs but unclear which is prod and which is test), ask the user which is which before proceeding.

2. For each env, try in this order until one returns a usable URL:
   - `mcp__tlycode__list_configs` — look for a config/secret whose key contains `DATABASE_URL`, `DB_URL`, `POSTGRES_URL`, or `PG_URL`. The value is the connection string.
   - `mcp__tlycode__get_environment` — some envs expose the attached database directly.
   - `mcp__tlycode__get_database` (with the DB id from the env) — fall back to the database resource.

   The URL must look like `postgres://user:pass@host:port/dbname` (or `postgresql://...`). If the env returns it without credentials, that's a half-secret — surface this and stop.

3. If a URL is missing on either side, **do not invent or assemble one from parts**. Tell the user which env is missing the secret and stop.

## Sanity checks before running

- `SOURCE` host ≠ `TARGET` host. If they match, abort and ask — almost always a misconfiguration (or the same env on both sides — see step 1 above).
- The TARGET URL really points at the test environment. A quick heuristic: hostname or DB name should contain `test` / `staging` / `dev`. If it doesn't, **double-check with the user** before proceeding ("Cílová DB nevypadá jako test (`<host>`/`<dbname>`). Opravdu pokračovat?").
- Echo a redacted summary back to the user so they can spot a mistake:

  > Synchronizuji:
  > - **Z (produkce):** `host=…/db=…` (uživatel skrytý)
  > - **Do (test):** `host=…/db=…` (uživatel skrytý) — bude přepsáno

## Running the sync

Run the script with both URLs as positional args plus `--yes`. Pass URLs via env vars rather than the command line so they don't appear in shell history or process listings:

```bash
SRC="<production_url>" TGT="<test_url>" node scripts/sync-db.js "$SRC" "$TGT" --yes
```

(In the actual `Bash` tool call, set `SRC` and `TGT` inline; do not echo them.)

The script streams `pg_dump --clean --if-exists` directly into `psql --single-transaction --set ON_ERROR_STOP=1`. Expected runtime: seconds for small DBs, a few minutes for larger ones.

## Reporting back

Keep it short and Czech-friendly. After success:

> Hotovo. Testovací DB má teď obsah produkce. (Trvalo to ~Xs.)

After a failure, surface the script's last error line and the most likely cause:

- `psql: error: connection to server ... failed` → wrong URL or DB unreachable from your machine. Check VPN / IP allowlist on the hosting side.
- `pg_dump: error: server version mismatch` → install a newer `pg_dump` (must be ≥ source server version). On macOS: `brew upgrade libpq`.
- `permission denied for ...` → the credentials in the secret are read-only. Ask the user for a higher-privilege role on the source, or `superuser` on the target.

## Hard nos

- **Never sync test → production.** This skill is one-way only. If the user asks for the reverse, refuse and explain why (would clobber real data).
- **Never sync an environment with itself.** If only one env exists, exit (see "Resolving DB URLs" step 1).
- **Never log the connection URLs** unredacted. Use the redacted form `postgres://***@host:port/db` in any output.
- **Never paste the URLs into a chat message, file, or commit.** They're secrets — pass them through env vars and process args only.
- **Don't `--no-verify` or otherwise bypass the script's `--yes` guard** — the guard exists to prevent accidental wipes; if the user really wants to proceed, they say yes in step 1.
