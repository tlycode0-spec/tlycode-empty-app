# TlyCode

TlyCode je serverless webová aplikace postavená na platformě TypeForge. Kompiluje TypeScript do Lua pomocí TypeScript-to-Lua (TSTL). UI rendering zajišťují React komponenty embedded v HTML stránkách generovaných serverem.

Aktuálně aplikace obsahuje jednu Hello World stránku na `/`.

## Funkce

- **TypeScript → Lua kompilace** — Pište TypeScript, nasaďte jako Lua
- **Hybrid React architektura** — Server generuje HTML s React komponentami
- **Typově bezpečný routing** — Union typy pro compile-time validaci cest
- **Decorator-based validace** — Validace a transformace vstupních dat
- **Vestavěné Runtime API** — File I/O, HTTP klient, PostgreSQL, Redis, e-mail, PDF, obrázky
- **Dark/Light theme** — Podpora přepínání témat

## Rychlý start

### Instalace

```bash
npm install
cd react-app && npm install
```

### Vývoj

```bash
npm run dev    # Watch mode — automatická rekompilace při změnách
npm run build  # Jednorázová kompilace TSTL
```

### Full rebuild (React + TSTL)

```bash
cd react-app && npm run build && cd ..   # 1. Build React
# 2. Run embed script (viz CLAUDE.md)    # 2. Embed do react-bundle-content.ts
npm run build                             # 3. TSTL kompilace do Lua
```

### Deployment

```bash
HOSTING_API_SECRET=<secret> ./scripts/deploy.sh
```

## Struktura projektu

```
src/                               # TSTL server-side kód (kompiluje se do Lua)
├── main.ts                        # Vstupní bod — config(), init(), main()
├── global.d.ts                    # Runtime API deklarace (@noSelf)
├── global.types.ts                # Globální typy (Request, Response, Config)
├── config.ts                      # Konfigurace aplikace
├── utils.ts                       # Utility funkce
├── validator.ts                   # Validační systém
├── template.ts                    # HTML šablona
├── react.ts                       # React page template generátor
├── react-bundle-content.ts        # Embedded React bundle (auto-generated)
│
└── modules/
    ├── router.ts                  # Definice rout
    ├── router.types.ts            # Typy cest
    ├── types.ts                   # RouterPaths typ
    └── app/
        ├── index.ts               # Barrel export
        └── hello/                 # Hello World modul
            ├── index.ts
            └── hello.handlers.ts

react-app/                         # React frontend (Vite build)
└── src/
    ├── main.tsx                   # Entry point — window.__REACT_RENDER__
    ├── registry.ts                # Mapování komponent
    ├── context/                   # ThemeContext, LanguageContext
    ├── pages/public/
    │   └── HelloWorldPage.tsx     # Hello World stránka
    └── styles/
        └── admin.css              # Styly
```

## Příklady

### Route handler (React stránka)

```typescript
export function renderHello(request: Request, response: Response): Response {
    response.content = getReactPageTemplate('Hello World', "HelloWorld", {});
    return response;
}
```

### Handler s daty

```typescript
export function renderItems(request: Request, response: Response): Response {
    const items = findAllItems();
    response.content = getReactPageTemplate('Items', "ItemList", {
        items: items.map(i => ({ id: String(i.id), name: i.name })),
    });
    return response;
}
```

### Databázový dotaz

```typescript
const items = sqlQuery<Item>(
    "SELECT *, price::float as price, created_at::text as created_at FROM items WHERE active = $1",
    [true]
);
```

### Validace

```typescript
class ItemForm {
    @Required()
    @MinLength(3)
    name: string = '';
}

const validated = transformValidate(ItemForm, formData);
```

## Dokumentace

Podrobná dokumentace je ve složce [docs](./docs/):

- [Architektura](./docs/architecture.md) — Struktura projektu a kompilační pipeline
- [Routing](./docs/routing.md) — Typově bezpečný routovací systém
- [React integrace](./docs/react.md) — Rendering React komponent
- [Runtime API](./docs/runtime-api.md) — Reference všech runtime funkcí
- [TSTL Gotchas](./docs/tstl-gotchas.md) — Kritické rozdíly Lua/JS
- [Validace](./docs/validation.md) — Decorator-based validační systém
- [Návrhové vzory](./docs/patterns.md) — Best practices a příklady

## Klíčové konvence

1. **`@noSelf` anotace** — Povinná na všech exportovaných funkcích volaných z runtime
2. **Route handlery** — Přijímají `(request, response)` a vracejí `response`
3. **React rendering** — Handlery volají `getReactPageTemplate()` s názvem komponenty a props
4. **Nové routy** — Přidat typ do `router.types.ts`, handler do modulu, registrovat v `router.ts`
5. **Globální typy** — `Request`, `Response`, `Config` jsou dostupné bez importu

## Licence

Proprietární
