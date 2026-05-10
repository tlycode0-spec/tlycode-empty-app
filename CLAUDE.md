# Project guidance for AI agents

Read and follow instructions from: `docs/instructions.md` and `README.md`

This file is the shared source of truth for AI coding assistants in this repo —
**Claude Code** (`CLAUDE.md`), **Gemini Code Assist** (`GEMINI.md`) and **OpenAI
Codex** (`AGENTS.md`) all read identical content via symlinks pointing at this
file. Edit this file; never edit the symlinks.


## How to talk to the user (read this before answering)

The user is **not a programmer or developer**. Their computer skills are
intermediate — they can install software, navigate files, copy-paste a
command into a terminal, follow step-by-step instructions, and read error
messages, but they don't read source code or debug stack traces. Treat this
as a hard constraint, not a preference:

- **Reply in Czech.** Match the user's language; this user writes in Czech.
- **Lead with what they should do, not what you did.** "Klikni na X, pak Y"
  beats "Refaktoroval jsem foo.ts a přidal validaci do bar.ts". When you
  must mention code, name the file in plain language ("v souboru s nastavením")
  rather than path-in-monospace, unless the path itself is what they need
  to act on.
- **No source-code dumps in chat unless asked.** A single short snippet to
  illustrate is fine; pasting full files or diffs is not. Summarise changes
  as "co se změní pro tebe" outcomes ("homepage teď má hamburger menu na
  mobilu"), not as a list of touched files.
- **Avoid jargon without a one-line gloss.** "Cloud Run env var" → "nastavení
  v hostingu, které čte aplikace za běhu". "Symlink" → "zástupce, co míří na
  původní soubor". When the term is unavoidable, define it once on first use.
- **Confirm before risky actions.** Anything that pushes to production,
  deletes data, or rewrites git history needs an explicit go-ahead in plain
  language ("nasadit teď na produkci?"), not a buried mention in a long reply.
- **Tell, don't show, when verifying.** Instead of pasting curl output, say
  "ověřil jsem živou stránku, obrázky se načítají správně". Show raw output
  only when something is broken and the user needs to see the symptom.
- **Decisions in two or three sentences.** When recommending an approach,
  say what to do, why, and the one main tradeoff. Skip exhaustive
  alternatives unless asked.
- **Errors → cause + fix, no traceback.** "Build selhal protože chybí Node
  20+. Zkus `node -v` a pokud máš starší, nainstaluj přes nvm." Not a
  Rust-style stack trace.

Mental model to keep: the user is the person who pays for outcomes, not the
person who reviews PRs.


## Git workflow (do this before any work)

Always start a session by syncing the local `main` with the remote, then
work on top of that. The user often makes small edits between sessions —
typo fixes, content tweaks, env_configs adjustments — and you must not
overwrite those.

1. **Pull first**, before reading or editing files:

   ```bash
   git checkout main && git pull --ff-only origin main
   ```

   If `--ff-only` refuses (i.e. the local `main` has commits the remote
   doesn't), stop and surface the divergence to the user in plain language
   ("máš lokálně commity, co nejsou na GitHubu, mám je pushnout nebo zahodit?").
   Never silently merge or rebase.

2. **Commit + push** after the change is done and tested. Stick to small,
   meaningful commits — one logical change per commit, message on the
   "why" not the "what".

   ```bash
   git add <specific files>           # never `git add -A` blindly
   git commit -m "<message>"
   git push origin main
   ```

   **Push is the deploy.** GitHub Actions runs `scripts/deploy.sh` on every
   push to `main`, and on this project that is the only path that actually
   updates the live URL. Do not run `deploy-local.sh` — it succeeds at the
   API level but does not flip live traffic. See "Deploy pipeline" below.

3. **Branches:** this repo uses `main` for everything. Don't create a
   feature branch unless the user explicitly asks.


## tlycode MCP authentication

Many actions in this repo (deploys, hosting config, env vars, storage,
domains, Cloud Run logs, …) go through the `mcp__tlycode__*` MCP tools.
These tools only work when the user has an active session with the
tlycode hosting console.

**If the tlycode MCP isn't authenticated** — i.e. the `mcp__tlycode__*`
tools aren't listed as available, or a call returns an auth/permission
error like `unauthenticated`, `401`, `403`, "session expired", "no project
selected", etc. — **stop and tell the user to re-login**, in Czech and in
plain language:

> Nejsi přihlášený do hostingu (tlycode MCP). Otevři v menu **Hosting
> projekty**, vyber tam projekt a přihlas se znovu. Pak mi dej vědět a
> já to zkusím znovu.

Do not try to work around the missing auth (no manual `curl`s to the
hosting API, no asking the user for tokens). Just surface the message
above and wait.

TlyCode is a serverless web framework built on the TypeForge platform. It compiles TypeScript to Lua using TypeScript-to-Lua (TSTL). The compiled Lua bundle runs on a Lua JIT hosting runtime with built-in APIs for HTTP, database, file I/O, crypto, and more.

**Architecture: Hybrid React** — The server (TSTL/Lua) handles routing and data. UI rendering is done by React components. The server serializes data as JSON props and generates an HTML page that includes the React bundle via `frontendEntryUrl()` (the platform injects bundle URLs as Cloud Run env vars during deploy).

This repository is the **template for new TlyCode projects** (`git@github.com:tlycode0-spec/tlycode-empty-app.git`).

Currently the application serves a single Hello World page at `/`.


## Build & Development Commands

```bash
# TSTL (server-side)
npm install          # Install dependencies
npm run build        # Compile TypeScript to Lua (output: dist/bundle.lua)
npm run dev          # Watch mode — recompiles on file changes

# React app
cd react-app && npm install     # Install React dependencies
cd react-app && npm run build   # tsc + vite build + postbuild manifest generator
                                # Output: react-app/dist/index-[hash].js + .vite/manifest.json
```

The React bundle is **uploaded directly to Cloud Storage by the deploy script** —
no longer embedded into the Lua bundle. The platform injects the bundle URLs into
Cloud Run as `REACT_BUNDLE_GCS_URL` / `REACT_BUNDLE_CDN_URL` / `REACT_BUNDLE_ENTRY`
/ `REACT_BUNDLE_CSS` env vars; Lua reads them via `frontendEntryUrl()` and
`frontendCssUrl()` from `getReactPageTemplate()`.

There is no test framework or linter configured.

### Deploy pipeline — agents must commit + push, never deploy locally

**Agents (Claude / Gemini / Codex) must always deploy by committing and
pushing to `main`.** GitHub Actions runs `scripts/deploy.sh` and is the only
mechanism that actually swaps the live bundle on this project. Anything else
("local" deploy, manual API calls, etc.) **does not propagate to the live
URL** here — the platform stores the upload but does not flip live traffic
to it. Agents have wasted iterations debugging why a "successful" local
deploy didn't show up in the browser; the answer is always: it never went
live, push instead.

Standard agent workflow for any change that needs to be visible:

```bash
# 1. Make and verify the change locally (npm run build to type-check is fine)
npm run build                              # TSTL — verify it compiles
cd react-app && npm run build && cd ..     # React — verify it compiles

# 2. Commit and push. CI does the actual deploy.
git add <files>
git commit -m "..."
git push origin main

# 3. Wait for CI, then verify on the live URL.
gh run list --limit 1                      # confirm Deploy completed = success
curl -s https://ctemespolujinak.cz/...     # confirm the change is live
```

**Do not run `scripts/deploy-local.sh`.** It posts to `/api/deploy/local`
which on this project succeeds at the API level but the new bundle does not
become the one Cloud Run serves. The script is left in the repo for platform
debugging by the project owner; agents should treat it as off-limits.

**Do not run `scripts/deploy.sh` from your machine** unless the user
explicitly asks. CI runs it on every push, and it has a duplicate-commit
gate that will reject the same HEAD twice — pushing a new commit (even an
empty one with `--allow-empty`) is the right way to retrigger.

If the user wants a "redeploy without code changes," use:

```bash
git commit --allow-empty -m "chore: retrigger CI"
git push origin main
```

CI uses `HOSTING_ENV=test` (set in `.github/workflows/deploy.yml`); on this
project the test environment **is** the live URL `ctemespolujinak.cz`, there
is no separate production env. Do not try to override `HOSTING_ENV` from
your machine.


## Architecture

### How React Rendering Works

1. Route handler calls `getReactPageTemplate(title, componentName, props)` — generates full HTML page
2. Lua `frontendEntryUrl()` returns the JS bundle URL (CDN if configured, else GCS); `frontendCssUrl()` returns the CSS URL
3. HTML includes `<script src="{bundle}">` and `<link rel="stylesheet" href="{css}">`
4. `window.__REACT_RENDER__(componentName, props, containerId)` mounts the React component
5. React component receives all data as props — **no client-side data fetching**
6. Forms submit via HTTP POST (standard form submission, no SPA behavior)
7. Navigation is server-side — no client-side routing

Key files:
- `src/react.ts` — exports `getReactPageTemplate()` and `renderReactComponent()` (uses `frontendEntryUrl()`/`frontendCssUrl()` runtime globals)
- `src/global.d.ts` — declares `frontendUrl()`, `frontendEntry()`, `frontendEntryUrl()`, `frontendCss()`, `frontendCssUrl()` from the platform

### Project Structure

```
src/                               # TSTL server-side code (compiles to Lua)
├── main.ts                        # Entry point — config(), init(), main()
├── global.d.ts                    # Runtime API declarations (@noSelf)
├── global.types.ts                # Global types (Request, Response, Config)
├── config.ts                      # App configuration (DB, Redis, sessions)
├── utils.ts                       # Shared utilities (sessions, CSRF, helpers)
├── validator.ts                   # Decorator-based validation
├── template.ts                    # HTML template wrapper + theme detection
├── react.ts                       # React page template generator (uses frontendEntryUrl/frontendCssUrl)
│
└── modules/
    ├── router.ts                  # Route definitions
    ├── router.types.ts            # Route path union types
    ├── types.ts                   # RouterPaths type with prefix support
    └── app/                       # Domain modules
        ├── index.ts               # Barrel export for all modules
        └── hello/                 # Hello World module
            ├── index.ts
            └── hello.handlers.ts

react-app/                         # React frontend (Vite build)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── main.tsx                   # Entry point — exposes window.__REACT_RENDER__
    ├── registry.ts                # Maps component names → React components
    ├── context/
    │   ├── ThemeContext.tsx        # Dark/light theme provider
    │   └── LanguageContext.tsx     # Language provider
    ├── pages/
    │   └── public/
    │       └── HelloWorldPage.tsx  # Hello World page
    └── styles/
        └── admin.css              # App styles
```

### Domain Module Structure

Each domain module in `src/modules/app/[module]/` follows this convention:

| File | Purpose | Required |
|------|---------|----------|
| `index.ts` | Barrel export — only re-exports handlers | Yes |
| `[module].handlers.ts` | HTTP request handlers (route functions) | Yes |
| `[module].repository.ts` | Database queries (all `sqlQuery` calls) | When DB needed |
| `[module].validation.ts` | Validation classes with decorators | When forms needed |
| `[module].types.ts` | Domain-specific TypeScript types | When types needed |
| `[module].const.ts` | Constants | When constants needed |

### Compilation Pipeline

```
src/ → TSTL compiler → dist/bundle.lua → Lua JIT runtime (Cloud Run)
react-app/src/ → Vite (lib + iife) → react-app/dist/index-[hash].js + .vite/manifest.json
                                   → uploaded by scripts/deploy.sh to GCS files/per-deployment/react/
                                   → Cloud Run env vars REACT_BUNDLE_*_URL / _ENTRY / _CSS
                                   → Lua frontendEntryUrl() / frontendCssUrl()
```

The React bundle is built as an IIFE with React bundled in (one self-contained file).
A small `react-app/postbuild.js` writes `dist/.vite/manifest.json` after Vite build,
which the deploy script reads to know the entry filename + CSS filename.

### Request/Response Model

The hosting runtime calls three exported functions from `main.ts`:
- `config()` — returns app configuration (caching, DB connections, upload limits)
- `init()` — (optional) called once at startup
- `main(request: Request): Response` — HTTP request handler entry point

Every route handler receives `(request: Request, response: Response)` and returns a modified `Response`. The `Request` and `Response` interfaces are defined in `src/global.types.ts`.

### Routing

`src/modules/router.ts` returns an array of `{ path, route, type }` objects. Route paths are type-safe via union types defined in `src/modules/router.types.ts`.

Current routes:

| Path | Handler | Description |
|------|---------|-------------|
| `/` | `renderHello` | Hello World page |

**Adding a new route:**
1. Add path to union type in `router.types.ts`
2. Create handler function in the appropriate module's `.handlers.ts`
3. Register route in `router.ts`

### Runtime Globals

`src/global.d.ts` declares all functions provided by the Lua hosting runtime. These are globally available (no imports needed) and cover:

- **File I/O**: `fileRead`, `fileWrite`, `fileDelete`, `fileCopy`, `fileMove`, `dirList`
- **Cloud Storage** (in Lua at runtime): `storageUpload`, `storageUploadBytes`, `storageDownload`, `storageDelete`, `storageGetUrl`, `storageGetSignedUrl`, `storageList`, `storageExists`
- **Asset management from CLI/agent**: `./scripts/assets.sh {upload|upload-dir|list|delete|url}` — wrapper around the hosting `/api/storage/*` endpoints. `upload-dir` is standalone (loops `find` + per-file POST); does **not** depend on `deploy.sh --assets-only` / `--assets-dir`, which the current `deploy.sh` does not implement. Typical use: `HOSTING_ENV=test ./scripts/assets.sh upload-dir assets/images images`. See README.md for examples.
- **Frontend bundle**: `frontendUrl(provider?)`, `frontendEntry()`, `frontendEntryUrl(provider?)`, `frontendCss()`, `frontendCssUrl(provider?)` — `provider` is optional `"cdn"` or `"gcs"`; default prefers CDN when configured
- **HTTP Client**: `httpGet`, `httpPost`, `httpRequest`
- **Database**: `sqlQuery<T>(query, params)`
- **Cache**: `appCacheGet`, `appCacheSet`, `appCacheRemove`, `clearMicroCache`
- **JSON**: `jsonEncode`, `jsonDecode`
- **URL**: `urlEncode`, `urlDecode`, `parseUrl`, `parseUrlQuery`, `buildUrlQuery`
- **Crypto**: `hashPassword`, `verifyPassword`, `sha256`, `md5`, `hmacSha256`, `base64Encode`, `base64Decode`, `base64UrlEncode`, `base64UrlDecode`, `randomBytes`
- **JWT**: `jwtSign`, `jwtVerify`, `jwtDecode`
- **Date/Time**: `now`, `nowMillis`, `dateFormat`, `dateParse`, `dateAdd`, `dateDiff`, `dateToISO`, `dateFromISO`
- **Logging**: `logInfo`, `logWarn`, `logError`, `logDebug`
- **String**: `trim`, `toLower`, `toUpper`, `slugify`, `stringSplit`, `stringContains`, `stringStartsWith`, `stringEndsWith`, `stringReplace`, `stringPad`
- **Regex**: `regexTest`, `regexMatch`, `regexMatchAll`, `regexReplace`
- **Math**: `round`, `ceil`, `floor`, `abs`, `mathMin`, `mathMax`, `clamp`, `formatNumber`, `formatCurrency`
- **Redis**: Full Redis support (strings, hashes, lists, sets, sorted sets, pub/sub)
- **Email**: `sendEmail`
- **Images**: `imageResize`, `imageThumbnail`, `imageInfo`
- **PDF**: `generatePdf`
- **Config**: `getConfig(key?)`, `uniqueKey()`

All global declarations use `@noSelf` annotation — required by TSTL to generate correct Lua function calls.

### Validation System

`src/validator.ts` provides decorator-based validation using experimental decorators:

```typescript
class ItemForm {
    @Transform((v) => v?.trim())
    @Required()
    @MinLength(3)
    name: string = '';
}

// Usage in handler
const validated = transformValidate(ItemForm, formData);
```

Available decorators: `@Required()`, `@MinLength(n)`, `@MaxLength(n)`, `@Range(min, max)`, `@Custom(fn)`, `@Transform(fn)`, `@Type(typeFn)`.

### Configuration

`src/config.ts` returns the `Config` object controlling: MicroCache (in-memory TTL cache), PostgreSQL connection, Redis connection, **session settings**, upload temp directory, and max upload file size.

### Asset uploads (`scripts/assets.sh`)

Static files (images, fonts, downloads) live on Cloud Storage under `{project}/{env}/files/<path>` and are reachable from the app via `getAssetUrl(path)` from `src/utils.ts`. Use `scripts/assets.sh` to push them — it's a thin wrapper around the hosting `/api/storage/*` endpoints and is independent of `deploy.sh` (i.e. you do **not** need to re-deploy the Lua bundle just to refresh an image).

**Required env**: `HOSTING_API_SECRET`. **Optional**: `HOSTING_ENV` (default `production`), `HOSTING_API_URL` (default `http://localhost:3005/hosting`).

```bash
# Single file. Remote path defaults to basename — pass an explicit one to keep folder structure.
HOSTING_ENV=test ./scripts/assets.sh upload assets/images/logo.png images/logo.png

# Whole directory, recursive. Preserves the tree under <prefix>/.
HOSTING_ENV=test ./scripts/assets.sh upload-dir assets/images images

# Inspect / clean up
HOSTING_ENV=test ./scripts/assets.sh list images/products
HOSTING_ENV=test ./scripts/assets.sh url  images/logo.png
HOSTING_ENV=test ./scripts/assets.sh delete images/old.png
```

**The remote path must equal the string passed to `getAssetUrl()`.** `getAssetUrl("images/products/foo.png")` → `<cdn>/<project>/<env>/files/images/products/foo.png`, so the upload's `<remote_path>` (or the combined `<prefix>/<filename>` from `upload-dir`) must be `images/products/foo.png`. No leading slash.

**Conventions for this repo**:
- Local source of truth lives under `assets/images/`; mirror that tree on the remote with `upload-dir assets/images images`.
- Default to `HOSTING_ENV=test` while iterating — only target `production` after the user explicitly confirms.

**Failure modes worth knowing**:
- `curl exit 56` / "Recv failure: Operation timed out" — transient network blip on larger PNGs. Retry just the failed file with `assets.sh upload`, not the whole batch.
- HTTP 403/401 — wrong or missing `HOSTING_API_SECRET`.
- Image 404s after upload — almost always env mismatch (uploaded to `test`, app deployed to `production`) or path mismatch (leading slash, wrong casing). Compare the URL the browser requests against the path you uploaded.


## Key Conventions

- **`@noSelf` annotation**: Required on all exported functions that the Lua runtime calls directly.

- **Route handlers** use `getReactPageTemplate()`:
  ```typescript
  export function renderHello(request: Request, response: Response): Response {
      response.content = getReactPageTemplate('Hello World', "HelloWorld", {});
      return response;
  }
  ```

- **Index exports** — each module's `index.ts` only exports handlers:
  ```typescript
  export * from './hello.handlers';
  ```

- **Global types** (`Request`, `Response`, `Config`, etc.) are in `src/global.types.ts` — available project-wide.


## Common Patterns

### Simple page handler
```typescript
export function renderHello(request: Request, response: Response): Response {
    response.content = getReactPageTemplate('Hello World', "HelloWorld", {});
    return response;
}
```

### Handler with data
```typescript
export function renderItems(request: Request, response: Response): Response {
    const items = findAllItems();
    response.content = getReactPageTemplate('Items', "ItemList", {
        items: items.map(i => ({ id: String(i.id), name: i.name })),
    });
    return response;
}
```

### Repository functions
```typescript
export function findAllItems(): DbItem[] {
    return sqlQuery<DbItem>(
        `SELECT *, price::float as price, created_at::text as created_at FROM items ORDER BY id DESC`,
        []
    );
}
```

### Cached data fetch
```typescript
function getItems(): Item[] {
    const cached = appCacheGet("items");
    if (cached) return jsonDecode(cached);
    const items = findAllItems();
    appCacheSet("items", jsonEncode(items), 60000);
    return items;
}
```


## Adding a New Module

To add a new domain module (e.g., `invoices`):

1. **Create the module directory** `src/modules/app/invoices/`

2. **Create files**:
   ```
   invoices/
   ├── index.ts                    # export * from './invoices.handlers'
   ├── invoices.handlers.ts        # Route handlers (use getReactPageTemplate)
   ├── invoices.repository.ts      # SQL queries (if needed)
   └── invoices.validation.ts      # Form validation classes (if needed)
   ```

3. **Add route paths** to `src/modules/router.types.ts`.

4. **Register routes** in `src/modules/router.ts`.

5. **Export module** from `src/modules/app/index.ts`.

6. **Create React page components** in `react-app/src/pages/`.

7. **Register components** in `react-app/src/registry.ts`.

8. **Commit + push** (`git push origin main`). CI deploys via
   `scripts/deploy.sh` automatically. See "Deploy pipeline" above — never
   use `deploy-local.sh`, it does not propagate to the live URL on this
   project.


## Adding a New React Component

1. Create the component in `react-app/src/pages/`
2. Register it in `react-app/src/registry.ts`:
   ```typescript
   import { NewPage } from './pages/public/NewPage';
   export const registry = { ..., NewPage };
   ```
3. In the TSTL handler, render with:
   ```typescript
   response.content = getReactPageTemplate('Title', "NewPage", { ...props });
   ```
4. Commit + push to `main`. CI builds both bundles and deploys.
   Never run `deploy-local.sh` — see "Deploy pipeline" above.


## TSTL Limitations

TypeScript-to-Lua (TSTL) doesn't support all JavaScript/TypeScript methods. Use runtime globals instead:

| Unsupported JS Method | Use Instead |
|-----------------------|-------------|
| `string.lastIndexOf()` | `stringSplit(text, '.')` then get last element |
| `string.includes()` | `stringContains(text, search)` |
| `string.startsWith()` | `stringStartsWith(text, prefix)` |
| `string.endsWith()` | `stringEndsWith(text, suffix)` |
| `string.split()` | `stringSplit(text, delimiter)` |
| `string.replace()` | `stringReplace(text, search, replacement)` |
| `string.trim()` | `trim(text)` |
| `string.toLowerCase()` | `toLower(text)` |
| `string.toUpperCase()` | `toUpper(text)` |


## TSTL / Lua Gotchas (IMPORTANT)

These are critical differences between TypeScript and the compiled Lua runtime.

### 1. Empty string is truthy in Lua

In JavaScript `""` is falsy, but in Lua `""` is **truthy**:

```typescript
// BAD — will never call generateSlug() when slug is ""
const slug = data.slug || generateSlug(data.name);

// GOOD — explicit check
const slug = (data.slug !== '' && data.slug !== undefined) ? data.slug : generateSlug(data.name);
```

### 2. DECIMAL/NUMERIC columns return null in Lua

Always cast to `::float` in SELECT queries:

```typescript
// BAD — price will be null
sqlQuery("SELECT * FROM products", []);

// GOOD
sqlQuery("SELECT *, price::float as price FROM products", []);
```

### 3. TIMESTAMP columns return non-string in Lua

Always cast to `::text`:

```typescript
sqlQuery("SELECT *, created_at::text as created_at FROM orders", []);
```

### 4. Null/nil in arrays truncates parameters

Never pass null as a SQL parameter. Use NULLIF:

```typescript
// BAD — if categoryId is null, array gets truncated
sqlQuery("INSERT INTO products (name, category_id, price) VALUES ($1, $2, $3)",
    [name, categoryId, price]);

// GOOD
sqlQuery("INSERT INTO products (name, category_id, price) VALUES ($1, NULLIF($2, 0), $3)",
    [name, categoryId !== null ? categoryId : 0, price]);
```

### 5. charAt() works on bytes, not UTF-8 characters

Multi-byte UTF-8 characters (Czech `á`, `č`, `ř`, `ž`) are 2 bytes. Use `replaceAll` for substitutions.

### 6. dateParse format tokens

Use `YYYY-MM-DD HH:mm:ss` format. For reliability prefer manual substring parsing.

### Summary: SQL SELECT template

```typescript
sqlQuery<T>(
    `SELECT *,
        price::float as price,           -- for every DECIMAL column
        created_at::text as created_at   -- for every TIMESTAMP column
     FROM table_name WHERE ...`,
    [params]
);
```

.