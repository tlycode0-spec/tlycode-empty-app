# CLAUDE.md

Read and follow instructions from: `.claude/instructions.md`

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.


## Project Overview

TypeForge is a serverless web framework that compiles TypeScript to Lua using TypeScript-to-Lua (TSTL). The compiled Lua bundle runs on a Lua JIT hosting runtime with built-in APIs for HTTP, database, file I/O, crypto, and more.

**Architecture: Hybrid React** — The server (TSTL/Lua) handles routing, authentication, database access, and validation. All UI rendering is done by React components. The server serializes data as JSON props and generates an HTML page that loads React from CDN + an embedded app bundle.


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

1. Route handler fetches data from database (via repository functions)
2. Handler calls `getReactPageTemplate(title, componentName, props)` — generates full HTML page
3. HTML loads React 18 from CDN (unpkg), app CSS, and the embedded JS bundle
4. `window.__REACT_RENDER__(componentName, props, containerId)` mounts the React component
5. React component receives all data as props — **no client-side data fetching**
6. Forms submit via HTTP POST (standard form submission, no SPA behavior)
7. Navigation is server-side — no client-side routing

Key file: `src/react.ts` — exports `getReactPageTemplate()` and `renderReactComponent()`

### Project Structure

```
src/                               # TSTL server-side code (compiles to Lua)
├── main.ts                        # Entry point — config(), init(), main()
├── global.d.ts                    # Runtime API declarations (@noSelf)
├── global.types.ts                # Global types (Request, Response, Config)
├── config.ts                      # App configuration (DB, Redis, sessions, migrations)
├── utils.ts                       # Shared utilities (sessions, CSRF, helpers)
├── validator.ts                   # Decorator-based validation
├── template.ts                    # HTML template wrapper + theme detection
├── react.ts                       # React page template generator
├── react-build.ts                 # React bundle asset paths
├── react-bundle-content.ts        # Embedded React bundle (auto-generated, do not edit)
├── shared-keys.ts                 # Shared constants for TSTL + React (status types, labels, variants)
├── migration-runner.ts            # Database migration runner
│
├── migrations/                    # Database migrations (001–019)
│   ├── index.ts
│   ├── 001_create_users.ts
│   └── ...019_create_cart_items.ts
│
└── modules/
    ├── router.ts                  # Route definitions
    ├── router.types.ts            # Route path union types
    ├── types.ts                   # RouterPaths type with prefix support
    └── app/                       # Domain modules
        ├── index.ts               # Barrel export for all modules
        ├── shared.ts              # Shared DB types, auth helpers, formatters
        ├── shared.const.ts        # Re-exports from shared-keys + server-only constants
        │
        ├── assets/                # Static asset serving (react bundle)
        ├── auth/                  # Authentication (login, register, logout)
        ├── dashboard/             # Admin dashboard & analytics
        ├── catalog/               # Products & categories management
        ├── orders/                # Order management
        ├── blog/                  # Blog posts management
        ├── media/                 # Media/file management
        ├── shop/                  # Public e-shop storefront
        └── cart/                  # Shopping cart & checkout

react-app/                         # React frontend (Vite build)
├── package.json
├── tsconfig.json
├── vite.config.ts                 # Vite config with @shared alias
└── src/
    ├── main.tsx                   # Entry point — exposes window.__REACT_RENDER__
    ├── registry.ts                # Maps 26 component names → React components
    ├── types.ts                   # TypeScript types (props, enums)
    ├── utils.ts                   # Utility functions (formatPrice, status helpers)
    │
    ├── context/
    │   └── ThemeContext.tsx        # Dark/light theme provider
    │
    ├── i18n/                      # Internationalization (Czech only)
    │   ├── index.ts               # useT() and getT() hooks
    │   └── cs/                    # Czech translations
    │       ├── index.ts           # Namespace exports
    │       ├── common.ts          # Common UI labels
    │       ├── shared.ts          # Shared status translations (imports @shared)
    │       ├── auth.ts            # Auth labels
    │       ├── catalog.ts         # Product/category labels
    │       ├── orders.ts          # Order labels
    │       ├── dashboard.ts       # Dashboard labels
    │       ├── blog.ts            # Blog labels
    │       ├── media.ts           # Media labels
    │       ├── shop.ts            # Shop labels
    │       └── cart.ts            # Cart/checkout labels
    │
    ├── components/                # Reusable React components
    │   ├── ui/                    # Button, Badge, Card, Icon, Avatar, ThemeToggle
    │   ├── form/                  # Input, Textarea, Select, FormGroup, SearchInput, Toggle
    │   ├── data/                  # AdminDataList, AdminForm, DataTable, FilterBar, Pagination, StatCard, ConfirmDialog
    │   ├── layout/                # AdminLayout, AdminSidebar, Navbar, Footer, PageWrapper
    │   ├── shop/                  # ProductCard, CategoryCard
    │   └── blocks/                # Hero
    │
    ├── pages/                     # Page components (registered in registry.ts)
    │   ├── admin/                 # 13 admin pages
    │   │   ├── DashboardPage.tsx
    │   │   ├── AnalyticsPage.tsx
    │   │   ├── ProductListPage.tsx
    │   │   ├── ProductFormPage.tsx
    │   │   ├── CategoryListPage.tsx
    │   │   ├── CategoryFormPage.tsx
    │   │   ├── OrderListPage.tsx
    │   │   ├── OrderDetailPage.tsx
    │   │   ├── OrderFormPage.tsx
    │   │   ├── BlogListPage.tsx
    │   │   ├── BlogFormPage.tsx
    │   │   ├── MediaPage.tsx
    │   │   └── CustomerListPage.tsx
    │   └── public/                # 13 public pages
    │       ├── LandingPage.tsx
    │       ├── LoginPage.tsx
    │       ├── RegisterPage.tsx
    │       ├── EshopPage.tsx
    │       ├── ProductPage.tsx
    │       ├── CategoryPage.tsx
    │       ├── CartPage.tsx
    │       ├── CheckoutShippingPage.tsx
    │       ├── CheckoutPaymentPage.tsx
    │       ├── CheckoutReviewPage.tsx
    │       ├── CheckoutConfirmationPage.tsx
    │       ├── BlogListPage.tsx
    │       └── ArticlePage.tsx
    │
    └── styles/
        └── admin.css              # App styles (dark theme)
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
| `[module].const.ts` | Constants (re-exports from shared-keys) | When constants needed |
| `[module].utils.ts` | Domain-specific utility functions | When utils needed |

**Example module (catalog/):**
```
catalog/
├── index.ts                   # export * from './catalog.handlers'
├── catalog.handlers.ts        # renderAdminProducts, renderAdminProductCreate, etc.
├── catalog.repository.ts      # findAllProducts, findProductById, insertProduct, etc.
├── catalog.validation.ts      # ProductForm, CategoryForm classes
└── catalog.const.ts           # Re-exports from shared-keys.ts
```

**Minimal module (cart/):**
```
cart/
├── index.ts
├── cart.handlers.ts
└── cart.repository.ts
```

### Shared Constants (`src/shared-keys.ts`)

Single source of truth for status types, labels, variants, and filter options used by both TSTL and React:

```typescript
// Status types
export type ProductStatus = 'active' | 'inactive' | 'soldout';
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
export type BlogStatus = 'published' | 'draft' | 'archived';
export type CategoryStatus = 'active' | 'hidden';

// Labels, variants, filter options for each status type
export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = { ... };
export const PRODUCT_STATUS_VARIANTS: Record<ProductStatus, 'success' | 'warning' | 'danger'> = { ... };
export const PRODUCT_STATUS_FILTER_OPTIONS: { value: ProductStatus; label: string }[] = [ ... ];
// Same pattern for Order, Blog, Category statuses

// Icon defaults
export const DEFAULT_PRODUCT_ICON = 'box';
export const DEFAULT_CATEGORY_ICON = 'tag';
export const DEFAULT_READ_TIME = 5;
```

**TSTL side** imports directly: `import { PRODUCT_STATUS_LABELS } from "../../shared-keys";`
**React side** imports via alias: `import { PRODUCT_STATUS_LABELS } from '@shared';`
The alias is configured in `react-app/vite.config.ts` and `react-app/tsconfig.json`.

**Important:** Variant types must use narrow unions (e.g. `'success' | 'warning' | 'danger'`), not `string`, because `shared.ts` helper functions return narrow types.

### React i18n System

Custom i18n with zero dependencies. Czech translations only (no language switching).

```typescript
// react-app/src/i18n/index.ts
import * as cs from './cs';
type Namespace = keyof typeof cs;
export function useT<N extends Namespace>(namespace: N) { return cs[namespace]; }
export function getT<N extends Namespace>(namespace: N) { return cs[namespace]; }
```

**Usage in React components:**
```tsx
const t = useT('catalog');
<h1>{t.headings.products}</h1>
<Badge>{t.statuses[product.status]}</Badge>
```

**Namespace files** in `react-app/src/i18n/cs/`: common, shared, auth, catalog, orders, blog, media, shop, cart, dashboard.

### Compilation Pipeline

```
src/ → TSTL compiler → dist/bundle.lua → Lua JIT runtime (Cloud Run)
react-app/src/ → Vite build → dist/index-[hash].js → embedded in src/react-bundle-content.ts
```

The React bundle is built as an IIFE with external React/ReactDOM (loaded from CDN at runtime). Vite config at `react-app/vite.config.ts`.

### Request/Response Model

The hosting runtime calls three exported functions from `main.ts`:
- `config()` — returns app configuration (caching, DB connections, upload limits, migrations)
- `init()` — (optional) called once at startup, runs database migrations if enabled
- `main(request: Request): Response` — HTTP request handler entry point

Every route handler receives `(request: Request, response: Response)` and returns a modified `Response`. The `Request` and `Response` interfaces are defined in `src/global.types.ts`.

### Routing

`src/modules/router.ts` returns an array of `{ path, route, type }` objects. Route paths are type-safe via union types defined in `src/modules/router.types.ts`. The `RouterPaths` type in `src/modules/types.ts` combines web and API paths with prefix support.

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
class LoginForm {
    @Transform((v) => v?.trim())
    @Required()
    @MinLength(3)
    username: string = '';

    @Required()
    @MinLength(6)
    password: string = '';
}

// Usage in handler
const validated = transformValidate(LoginForm, formData);
```

Available decorators: `@Required()`, `@MinLength(n)`, `@MaxLength(n)`, `@Range(min, max)`, `@Custom(fn)`, `@Transform(fn)`, `@Type(typeFn)`.

### Configuration

`src/config.ts` returns the `Config` object controlling: MicroCache (in-memory TTL cache), PostgreSQL connection, Redis connection, **session settings**, upload temp directory, max upload file size, and **database migrations**.

### Database Migrations

`src/migrations/` contains numbered migration files (001–019). Migrations run automatically at application startup via the `init()` hook.

**How it works:**
1. Migrations tracked in `_migrations` table (created automatically)
2. Each migration has version, name, and SQL statement
3. Run in order by version number; already-applied are skipped
4. **Thread-safe:** `init()` runs only once at startup

**IMPORTANT - After adding new migrations:**
- Migrations run only on Cloud Run cold start
- **Verify:** `node typeforge-mcp.js run_sql_query project_id=5 environment_id=7 query="SELECT * FROM _migrations"`
- **Manual run if needed:** Execute SQL via `typeforge-mcp.js run_sql_query`, then insert migration record

### Session Management (JWT-based)

Sessions use **signed JWT tokens stored in cookies** — no server-side storage.

**Key functions** (from `src/utils.ts`):
- `getSession<T>(request)` — Get session data from request cookie
- `setSession<T>(data, response)` — Create JWT token and set cookie
- `clearSession(response)` — Delete session cookie
- `refreshSessionIfNeeded<T>(request, response)` — Auto-refresh if expiring soon
- `withSessionRefresh<T>(request, response, handler)` — Middleware wrapper

**Important:** `setSession` signature is `(data, response)` — returns the modified response.


## Key Conventions

- **`@noSelf` annotation**: Required on all exported functions that the Lua runtime calls directly.

- **Route handlers** use `getReactPageTemplate()`:
  ```typescript
  export function renderAdminProducts(request: Request, response: Response): Response {
      const auth = requireAdmin(request, response);
      if (!auth) return response;

      const products = findAllProducts();

      response.content = getReactPageTemplate('Produkty', "AdminProductList", {
          products: products.map(p => ({ id: String(p.id), name: p.name, price: String(p.price), status: p.status })),
          statusFilter: '',
      });
      return response;
  }
  ```

- **Repository functions** follow the pattern:
  ```typescript
  export function findAllProducts(): DbProduct[] {
      return sqlQuery<DbProduct>(
          `SELECT *, price::float as price, created_at::text as created_at FROM products ORDER BY id DESC`,
          []
      );
  }
  ```

- **Validation classes** follow the pattern:
  ```typescript
  export class ProductForm {
      @Transform((v: string) => v?.trim())
      @Required()
      @MinLength(2)
      name: string = '';
      status: string = 'active';
  }
  ```

- **Constants** re-export from shared-keys:
  ```typescript
  // catalog.const.ts
  export { PRODUCT_STATUS_FILTER_OPTIONS, CATEGORY_STATUS_FILTER_OPTIONS, DEFAULT_PRODUCT_ICON, DEFAULT_CATEGORY_ICON } from "../../../shared-keys";
  ```

- **Index exports** — each module's `index.ts` only exports handlers:
  ```typescript
  export * from './catalog.handlers';
  ```

- **Import order in handlers:**
  ```typescript
  import { getReactPageTemplate } from "../../../react";
  import { getPayloudData } from "../../../utils";
  import { transformValidate, ValidationError } from "../../../validator";
  import { DbProduct, requireAdmin, formatPrice } from "../shared";
  import { ProductForm } from "./catalog.validation";
  import { PRODUCT_STATUS_FILTER_OPTIONS } from "./catalog.const";
  import { findAllProducts, insertProduct } from "./catalog.repository";
  ```

- **Global types** (`Request`, `Response`, `Config`, etc.) are in `src/global.types.ts` — available project-wide.

- **Shared types and helpers** (`DbUser`, `DbProduct`, `requireAdmin`, `formatPrice`, `generateSlug`, etc.) are in `src/modules/app/shared.ts`.

- **CSRF protection**: Use `link()` helper with `type: "action"` for forms, validate with `checkCsrfToken()`.

- **React components** use `useT()` for translations:
  ```tsx
  const t = useT('catalog');
  return <AdminDataList columns={[{ key: 'name', label: t.columns.name }]} ... />;
  ```

## Common Patterns

### Handler — List page (renders React)
```typescript
export function renderAdminProducts(request: Request, response: Response): Response {
    const auth = requireAdmin(request, response);
    if (!auth) return response;

    const products = findAllProductsWithCategory();
    const categories = findActiveCategories();
    const statusFilter = parseUrlQuery(request.query)?.status ?? '';

    response.content = getReactPageTemplate('Produkty — Administrace', "AdminProductList", {
        products: products.map(p => ({
            id: String(p.id), name: p.name, price: String(p.price), status: p.status,
            category_name: p.category_name ?? '-',
        })),
        categories: categories.map(c => ({ value: String(c.id), label: c.name })),
        statusFilter,
    });
    return response;
}
```

### Handler — Create/Edit with form POST
```typescript
export function renderAdminProductCreate(request: Request, response: Response): Response {
    const auth = requireAdmin(request, response);
    if (!auth) return response;

    const categories = findActiveCategories();

    if (request.method === "post") {
        const raw = getPayloudData<Record<string, string>>(request);
        try {
            const data = transformValidate(ProductForm, raw);
            insertProduct(data.name, data.slug, Number(data.price));
            response.status = 302;
            response.headers["Location"] = "/admin/products";
            return response;
        } catch (error) {
            if (error instanceof ValidationError) {
                response.content = getReactPageTemplate('Nový produkt', "AdminProductForm", {
                    categories: categories.map(c => ({ value: String(c.id), label: c.name })),
                    values: raw,
                    error: (error as ValidationError).message,
                    isEdit: false,
                });
                return response;
            }
        }
    }

    response.content = getReactPageTemplate('Nový produkt', "AdminProductForm", {
        categories: categories.map(c => ({ value: String(c.id), label: c.name })),
        values: { status: 'active', icon: DEFAULT_PRODUCT_ICON },
        isEdit: false,
    });
    return response;
}
```

### Repository functions
```typescript
export function findAllProducts(): DbProduct[] {
    return sqlQuery<DbProduct>(
        `SELECT *, price::float as price, created_at::text as created_at FROM products ORDER BY id DESC`,
        []
    );
}

export function findProductById(id: number): DbProduct | null {
    const rows = sqlQuery<DbProduct>(
        `SELECT *, price::float as price, created_at::text as created_at FROM products WHERE id = $1`,
        [id]
    );
    return rows.length > 0 ? rows[0] : null;
}

export function insertProduct(name: string, slug: string, price: number): void {
    sqlQuery("INSERT INTO products (name, slug, price) VALUES ($1, $2, $3)", [name, slug, price]);
}
```

### React page component
```tsx
// react-app/src/pages/admin/ProductListPage.tsx
import { useT } from '../../i18n';
import { AdminLayout } from '../../components/layout';
import { AdminDataList } from '../../components/data';
import { Badge } from '../../components/ui';
import { getProductStatusLabel, getProductStatusVariant, formatPrice, PRODUCT_STATUS_FILTER_OPTIONS } from '../../utils';

interface Props {
    products: Array<{ id: string; name: string; price: string; status: string }>;
    statusFilter: string;
}

export default function ProductListPage({ products, statusFilter }: Props) {
    const t = useT('catalog');
    return (
        <AdminLayout activePath="/admin/products">
            <AdminDataList
                columns={[
                    { key: 'name', label: t.columns.name },
                    { key: 'price', label: t.columns.price, render: (v) => formatPrice(Number(v)) },
                    { key: 'status', label: t.columns.status, render: (v) => <Badge variant={getProductStatusVariant(v)}>{getProductStatusLabel(v)}</Badge> },
                ]}
                rows={products}
                actions={[
                    { icon: 'pencil', href: (row) => `/admin/products/edit/${row.id}`, title: t.actions.edit },
                ]}
                filters={PRODUCT_STATUS_FILTER_OPTIONS}
                addButton={{ label: t.actions.addProduct, href: '/admin/products/create' }}
            />
        </AdminLayout>
    );
}
```

### Cached data fetch
```typescript
function getProducts(): Product[] {
    const cached = appCacheGet("products");
    if (cached) return jsonDecode(cached);
    const products = findAllProducts();
    appCacheSet("products", jsonEncode(products), 60000);
    return products;
}
```

### Login handler
```typescript
export function handleLogin(request: Request, response: Response): Response {
    if (request.method === "post") {
        const data = getPayloudData<LoginForm>(request);
        const user = authenticateUser(data.username, data.password);
        if (user) {
            response = setSession({ user: { id: user.id, token: uniqueKey() } }, response);
            response.status = 302;
            response.headers["Location"] = "/dashboard";
            return response;
        }
    }
    response.content = getReactPageTemplate('Přihlášení', "Login", {});
    return response;
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
   ├── invoices.repository.ts      # SQL queries
   ├── invoices.validation.ts      # Form validation classes
   └── invoices.const.ts           # Re-exports from shared-keys
   ```

3. **Add types** to `src/modules/app/shared.ts` or create `invoices.types.ts`.

4. **Add status constants** to `src/shared-keys.ts` if the module has its own statuses.

5. **Create migration** in `src/migrations/` and register in `config.ts`.

6. **Add route paths** to `src/modules/router.types.ts`.

7. **Register routes** in `src/modules/router.ts`.

8. **Export module** from `src/modules/app/index.ts`.

9. **Create React page components** in `react-app/src/pages/admin/` (or `public/`).

10. **Register components** in `react-app/src/registry.ts`.

11. **Add i18n translations** in `react-app/src/i18n/cs/`.

12. **Rebuild React** and embed into TSTL bundle.


## Adding a New React Component

1. Create the component in `react-app/src/pages/admin/` or `react-app/src/pages/public/`
2. Register it in `react-app/src/registry.ts`:
   ```typescript
   import NewPage from './pages/admin/NewPage';
   export const registry = { ..., NewPage };
   ```
3. Use `useT('namespace')` for all user-visible text
4. Add translations to `react-app/src/i18n/cs/`
5. In the TSTL handler, render with:
   ```typescript
   response.content = getReactPageTemplate('Title', "NewPage", { ...props });
   ```
6. Rebuild: `cd react-app && npm run build`, then embed, then `npx tstl`


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

### 7. CSS class consistency

Always use `btn-outline-tf` and `btn-primary-tf`. Never Bootstrap-style `btn-outline-secondary`.

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
