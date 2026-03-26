# TypeForge

TypeForge je serverless web framework, který kompiluje TypeScript do Lua pomocí TypeScript-to-Lua (TSTL). Kompilovaný Lua bundle běží na Lua JIT hosting runtime s vestavěnými API pro HTTP, databázi, soubory, kryptografii a další.

## Funkce

- **TypeScript → Lua kompilace** - Pište TypeScript, nasaďte jako Lua
- **Typově bezpečný routing** - Union typy pro compile-time validaci cest
- **Komponentový systém** - Funkcionální HTML komponenty
- **Decorator-based validace** - Validace a transformace vstupních dat
- **Vestavěné Runtime API** - File I/O, HTTP klient, PostgreSQL, Redis, e-mail, PDF, obrázky
- **Session management** - JWT-based sessions s auto-refresh
- **Automatické migrace** - Databázové migrace při startu aplikace
- **Dark/Light theme** - Vestavěná podpora přepínání témat

## Rychlý start

### Instalace

```bash
npm install
```

### Vývoj

```bash
npm run dev    # Watch mode - automatická rekompilace při změnách
npm run build  # Jednorázová kompilace
```

### Deployment

```bash
HOSTING_API_SECRET=<secret> ./scripts/deploy.sh
```

## Struktura projektu

```
src/
├── main.ts              # Vstupní bod aplikace
├── global.d.ts          # Runtime API deklarace
├── global.types.ts      # Globální typy (Request, Response)
├── config.ts            # Konfigurace aplikace
├── validator.ts         # Validační systém
├── template.ts          # HTML šablona
├── components/          # UI komponenty
│   ├── ui/              # Button, Card, Form, Badge...
│   ├── data/            # DataTable, Pagination, FilterBar...
│   ├── layout/          # AdminLayout, Navbar, Footer...
│   └── shop/            # ProductCard, CategoryCard...
└── modules/
    ├── router.ts        # Definice rout
    ├── router.types.ts  # Typy cest
    └── app/
        └── app.controller.ts  # Route handlery
```

## Příklady

### Route handler

```typescript
export function renderPage(request: Request, response: Response): Response {
    const query = parseUrlQuery<{ id?: string }>(request.query);

    response.content = getHtmlTemplate("Název stránky", `
        <div class="container">
            <h1>Stránka</h1>
            <p>ID: ${query.id || 'není'}</p>
        </div>
    `);

    return response;
}
```

### Komponenta

```typescript
function ProductCard(props: ProductCardProps): string {
    const { title, price, href } = props;

    return `
        <a href="${href}" class="product-card">
            <h3>${escapeHtml(title)}</h3>
            <span class="price">${price}</span>
        </a>
    `;
}
```

### Validace

```typescript
class LoginForm {
    @Required()
    @MinLength(3)
    username: string = '';

    @Required()
    @MinLength(6)
    password: string = '';
}

// V handleru
const validated = transformValidate(LoginForm, formData);
```

### Databázový dotaz

```typescript
const users = sqlQuery<User>(
    "SELECT * FROM users WHERE active = $1",
    [true]
);
```

### Databázové migrace

Migrace se definují v `config.ts` a spouštějí automaticky při startu:

```typescript
// config.ts
export function getAppConfig(): Config {
    return {
        postgresql: { enable: true, url: getConfig("DATABASE_URL") ?? "" },
        migrations: [
            { version: 1, name: "create_users", up: "CREATE TABLE users (id SERIAL PRIMARY KEY, email VARCHAR(255) NOT NULL)" },
            { version: 2, name: "add_name", up: "ALTER TABLE users ADD COLUMN name VARCHAR(255)" },
        ],
        // ...
    }
}
```

Migrace se trackují v tabulce `_migrations` a každá se spustí pouze jednou.

### Session management

```typescript
import { getSession, setSession, clearSession } from "./utils";

// Login - vytvoří JWT token v cookie
response = setSession({ user: { id: user.id, token: uniqueKey() } }, response);

// Čtení session
const session = getSession<{ user: User }>(request);
if (!session?.user) {
    // Nepřihlášen
}

// Logout - smaže cookie
response = clearSession(response);
```

## Dokumentace

Podrobná dokumentace je dostupná ve složce [Docs](./Docs/):

- [Architektura](./Docs/architecture.md) - Struktura projektu a kompilační pipeline
- [Routing](./Docs/routing.md) - Typově bezpečný routovací systém
- [Komponenty](./Docs/components.md) - UI komponentový systém
- [Validace](./Docs/validation.md) - Decorator-based validační systém
- [Runtime API](./Docs/runtime-api.md) - Reference všech runtime funkcí
- [Návrhové vzory](./Docs/patterns.md) - Best practices a příklady

## Klíčové konvence

1. **`@noSelf` anotace** - Povinná na všech exportovaných funkcích volaných z runtime
2. **Route handlery** - Vždy přijímají `(request, response)` a vracejí `response`
3. **Nové routy** - Přidat typ do `router.types.ts`, handler do controlleru, registrovat v `router.ts`
4. **Globální typy** - `Request`, `Response`, `Config` jsou dostupné bez importu

## Licence

Proprietární
