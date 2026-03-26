# Routing

## Route Definitions

Routes are defined in `src/modules/router.ts` as an array of `{ path, route, type }` objects.

### Current Routes

| Path | Handler | Type |
|------|---------|------|
| `/` | `renderHello` | render |

## Type-Safe Paths

Route paths are type-safe via union types in `src/modules/router.types.ts`:

```typescript
export type WebRouterPaths = "/";
export type ApiRouterPaths = never;
```

The `RouterPaths` type in `src/modules/types.ts` combines web and API paths.

## Adding a New Route

1. Add the path to the union type in `router.types.ts`
2. Create a handler function in the appropriate module's `.handlers.ts`
3. Register the route in `router.ts`

## Handler Signature

Every route handler receives `(request: Request, response: Response)` and returns `Response`:

```typescript
export function renderHello(request: Request, response: Response): Response {
    response.content = getReactPageTemplate('Hello World', "HelloWorld", {});
    return response;
}
```

## Request/Response Model

The Lua hosting runtime calls three exported functions from `main.ts`:

- `config()` — returns app configuration
- `init()` — called once at startup
- `main(request: Request): Response` — HTTP entry point

The `Request` and `Response` interfaces are defined in `src/global.types.ts`.
