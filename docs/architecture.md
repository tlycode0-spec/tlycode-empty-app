# Architecture

## Hybrid React Model

The server (TSTL/Lua) handles routing and data. All UI rendering is done by React components. The server serializes data as JSON props and generates an HTML page that loads React from CDN + an embedded app bundle.

### Request Flow

```
Browser → HTTP Request → Lua Runtime → Route Handler
  → Handler calls getReactPageTemplate(title, componentName, props)
  → Returns full HTML page with:
      - React 18 from CDN (unpkg)
      - App JS bundle (embedded IIFE)
      - <script>window.__REACT_RENDER__(componentName, props, containerId)</script>
  → Browser loads React, mounts component with props
```

### Key Characteristics

- **No client-side routing** — every page navigation is a full HTTP request
- **No client-side data fetching** — all data arrives as serialized props
- **Forms submit via HTTP POST** — standard form submission, no SPA behavior
- **React is for rendering only** — business logic stays on the server

## Compilation Pipeline

```
src/                    → TSTL compiler → dist/bundle.lua → Lua JIT runtime (Cloud Run)
react-app/src/          → Vite build    → dist/index-[hash].js
dist/index-[hash].js    → embed script  → src/react-bundle-content.ts → included in TSTL build
```

### Build Steps

1. `cd react-app && npm run build` — Vite builds React app as IIFE with external React/ReactDOM
2. Embed script reads `react-app/dist/` output and writes `src/react-bundle-content.ts`
3. `npm run build` (or `npx tstl`) — compiles all TypeScript to `dist/bundle.lua`

## Project Structure

### Server-side (`src/`)

```
src/
├── main.ts                    # Entry point — config(), init(), main()
├── global.d.ts                # Runtime API declarations (@noSelf)
├── global.types.ts            # Global types (Request, Response, Config)
├── config.ts                  # App configuration
├── utils.ts                   # Shared utilities
├── validator.ts               # Decorator-based validation
├── template.ts                # HTML template wrapper
├── react.ts                   # getReactPageTemplate(), renderReactComponent()
├── react-build.ts             # Asset paths config
├── react-bundle-content.ts    # Auto-generated embedded React bundle
│
└── modules/
    ├── router.ts              # Route definitions
    ├── router.types.ts        # Route path union types
    ├── types.ts               # RouterPaths type
    └── app/
        ├── index.ts           # Barrel export for all modules
        └── hello/             # Hello World module
            ├── index.ts
            └── hello.handlers.ts
```

### Client-side (`react-app/src/`)

```
react-app/src/
├── main.tsx               # Entry point (window.__REACT_RENDER__)
├── registry.ts            # Component name → React component map
└── pages/
    └── public/
        └── HelloWorldPage.tsx  # Hello World page
```

## Domain Module Structure

Each module in `src/modules/app/[module]/`:

| File | Purpose | Required |
|------|---------|----------|
| `index.ts` | Barrel export (handlers only) | Yes |
| `[module].handlers.ts` | HTTP request handlers | Yes |
| `[module].repository.ts` | Database queries | When DB needed |
| `[module].validation.ts` | Form validation classes | When forms needed |
| `[module].types.ts` | Domain-specific types | When types needed |
| `[module].const.ts` | Constants | When constants needed |

## Entry Point (`src/main.ts`)

The Lua hosting runtime calls three exported functions:

- `config()` — returns app configuration
- `init()` — called once at startup
- `main(request: Request): Response` — HTTP request handler
