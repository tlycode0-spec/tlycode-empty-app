# TlyCode

TlyCode is a serverless web framework built on the TypeForge platform. It compiles TypeScript to Lua using TypeScript-to-Lua (TSTL). UI rendering is handled by React components embedded in server-generated HTML pages.

This repository serves as the **template for new TlyCode projects**.

**Template repository:** `git@github.com:tlycode0-spec/tlycode-empty-app.git`

Currently the application serves a single Hello World page at `/`.

## Features

- **TypeScript → Lua compilation** — Write TypeScript, deploy as Lua
- **Hybrid React architecture** — Server generates HTML with React components
- **Type-safe routing** — Union types for compile-time path validation
- **Decorator-based validation** — Input data validation and transformation
- **Built-in Runtime API** — File I/O, HTTP client, PostgreSQL, Redis, email, PDF, images
- **Dark/Light theme** — Theme toggle support

## Quick Start

### Installation

```bash
npm install
cd react-app && npm install
```

### Development

```bash
npm run dev    # Watch mode — auto-recompiles on changes
npm run build  # One-time TSTL compilation
```

### Full rebuild (React + TSTL)

```bash
cd react-app && npm run build && cd ..   # 1. Build React
# 2. Run embed script (see CLAUDE.md)    # 2. Embed into react-bundle-content.ts
npm run build                             # 3. TSTL compile to Lua
```

### Deployment

```bash
HOSTING_API_SECRET=<secret> ./scripts/deploy.sh
```

### Static assets (images, fonts, videos, …)

Assets are stored under `{project}/{env}/files/` in Cloud Storage and referenced
via the Lua `getAssetUrl(path)` helper (uses CDN when configured, otherwise GCS).

There are four ways to upload local files:

1. **`scripts/assets.sh`** — single-file CLI (recommended for ad-hoc uploads):
   ```bash
   HOSTING_API_SECRET=<secret> HOSTING_ENV=test ./scripts/assets.sh upload ./logo.png
   ./scripts/assets.sh upload ./hero.jpg images/hero.jpg
   ./scripts/assets.sh list images
   ./scripts/assets.sh url images/logo.png
   ./scripts/assets.sh delete images/old.png
   ```

2. **CLI — bundled with deploy** (uploads `assets/` together with the Lua bundle):
   ```bash
   HOSTING_API_SECRET=<secret> ./scripts/deploy.sh --assets-dir=assets
   ```
   Or via env vars in CI:
   ```bash
   ASSETS_DIR=assets ./scripts/deploy.sh
   ```

3. **CLI — assets only** (no Lua/React rebuild):
   ```bash
   HOSTING_API_SECRET=<secret> ./scripts/deploy.sh --assets-only --assets-dir=assets
   ./scripts/deploy.sh --assets-only --assets-dir=assets --assets-prefix=images
   ```

4. **Web UI** — open the environment detail page and click the folder icon next
   to the Cloud Storage card to browse, upload (drag & drop), and delete files.

In Lua/TS code:

```typescript
const url = getAssetUrl("logo.png");          // → CDN or GCS public URL
const heroUrl = getAssetUrl("images/hero.jpg");
```

Path safety: uploads are confined to `files/` — you cannot write into
`deployments/`, `config/`, `react/`, or overwrite `latest.json`.

## Project Structure

```
src/                               # TSTL server-side code (compiles to Lua)
├── main.ts                        # Entry point — config(), init(), main()
├── global.d.ts                    # Runtime API declarations (@noSelf)
├── global.types.ts                # Global types (Request, Response, Config)
├── config.ts                      # App configuration
├── utils.ts                       # Utility functions
├── validator.ts                   # Validation system
├── template.ts                    # HTML template
├── react.ts                       # React page template generator
├── react-bundle-content.ts        # Embedded React bundle (auto-generated)
│
└── modules/
    ├── router.ts                  # Route definitions
    ├── router.types.ts            # Route path types
    ├── types.ts                   # RouterPaths type
    └── app/
        ├── index.ts               # Barrel export
        └── hello/                 # Hello World module
            ├── index.ts
            └── hello.handlers.ts

react-app/                         # React frontend (Vite build)
└── src/
    ├── main.tsx                   # Entry point — window.__REACT_RENDER__
    ├── registry.ts                # Component mapping
    ├── context/                   # ThemeContext, LanguageContext
    ├── pages/public/
    │   └── HelloWorldPage.tsx     # Hello World page
    └── styles/
        └── admin.css              # Styles
```

## Examples

### Route handler (React page)

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

### Database query

```typescript
const items = sqlQuery<Item>(
    "SELECT *, price::float as price, created_at::text as created_at FROM items WHERE active = $1",
    [true]
);
```

### Validation

```typescript
class ItemForm {
    @Required()
    @MinLength(3)
    name: string = '';
}

const validated = transformValidate(ItemForm, formData);
```

## Documentation

Detailed documentation is available in the [docs](./docs/) directory:

- [Architecture](./docs/architecture.md) — Project structure and compilation pipeline
- [Routing](./docs/routing.md) — Type-safe routing system
- [React Integration](./docs/react.md) — React component rendering
- [Runtime API](./docs/runtime-api.md) — Complete runtime function reference
- [TSTL Gotchas](./docs/tstl-gotchas.md) — Critical Lua/JS differences
- [Validation](./docs/validation.md) — Decorator-based validation system
- [Patterns](./docs/patterns.md) — Best practices and examples

## Key Conventions

1. **`@noSelf` annotation** — Required on all exported functions called by the runtime
2. **Route handlers** — Accept `(request, response)` and return `response`
3. **React rendering** — Handlers call `getReactPageTemplate()` with component name and props
4. **New routes** — Add type to `router.types.ts`, create handler in module, register in `router.ts`
5. **Global types** — `Request`, `Response`, `Config` are available without imports

## License

Proprietary

