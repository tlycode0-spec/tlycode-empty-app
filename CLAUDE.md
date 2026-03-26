# CLAUDE.md

Read and follow instructions from: `.docs/instructions.md`

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.


## Project Overview

TlyCode is a serverless web framework built on the TypeForge platform. It compiles TypeScript to Lua using TypeScript-to-Lua (TSTL). The compiled Lua bundle runs on a Lua JIT hosting runtime with built-in APIs for HTTP, database, file I/O, crypto, and more.

**Architecture: Hybrid React** — The server (TSTL/Lua) handles routing and data. UI rendering is done by React components. The server serializes data as JSON props and generates an HTML page that loads React from CDN + an embedded app bundle.

Currently the application serves a single Hello World page at `/`.


## Build & Development Commands

```bash
# TSTL (server-side)
npm install          # Install dependencies
npm run build        # Compile TypeScript to Lua (output: dist/bundle.lua)
npm run dev          # Watch mode — recompiles on file changes

# React app
cd react-app && npm install   # Install React dependencies
cd react-app && npm run build # Build React bundle (output: react-app/dist/)

# After React build — embed into TSTL bundle
node -e "
const fs = require('fs');
const dir = 'react-app/dist';
const files = fs.readdirSync(dir);
const jsFile = files.find(f => f.endsWith('.js'));
const cssFile = files.find(f => f.endsWith('.css'));
const js = fs.readFileSync(dir+'/'+jsFile,'utf8');
const css = cssFile ? fs.readFileSync(dir+'/'+cssFile,'utf8') : '';
const out = 'export const REACT_JS = \`'+js.replace(/\\\`/g,'\\\\'+'\`').replace(/\\\$/g,'\\\\$')+'\`;\\nexport const REACT_CSS = \`'+css.replace(/\\\`/g,'\\\\'+'\`').replace(/\\\$/g,'\\\\$')+'\`;\\n';
fs.writeFileSync('src/react-bundle-content.ts', out);
"
```

There is no test framework or linter configured.

### Full rebuild pipeline
```bash
cd react-app && npm run build && cd ..   # 1. Build React
# 2. Run embed script above               # 2. Embed into react-bundle-content.ts
npm run build                              # 3. TSTL compile to Lua
```


## Architecture

### How React Rendering Works

1. Route handler calls `getReactPageTemplate(title, componentName, props)` — generates full HTML page
2. HTML loads React 18 from CDN (unpkg) and the embedded JS bundle
3. `window.__REACT_RENDER__(componentName, props, containerId)` mounts the React component
4. React component receives all data as props — **no client-side data fetching**
5. Forms submit via HTTP POST (standard form submission, no SPA behavior)
6. Navigation is server-side — no client-side routing

Key file: `src/react.ts` — exports `getReactPageTemplate()` and `renderReactComponent()`

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
├── react.ts                       # React page template generator
├── react-bundle-content.ts        # Embedded React bundle (auto-generated, do not edit)
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
react-app/src/ → Vite build → dist/index-[hash].js → embedded in src/react-bundle-content.ts
```

The React bundle is built as an IIFE with external React/ReactDOM (loaded from CDN at runtime). Vite config at `react-app/vite.config.ts`.

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
- **Cloud Storage**: `storageUpload`, `storageUploadBytes`, `storageDownload`, `storageDelete`, `storageGetUrl`, `storageGetSignedUrl`, `storageList`, `storageExists`
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

8. **Rebuild React** and embed into TSTL bundle.


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
4. Rebuild: `cd react-app && npm run build`, then embed, then `npm run build`


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
