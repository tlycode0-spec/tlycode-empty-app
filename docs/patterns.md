# Common Patterns

## Simple Page Handler

```typescript
export function renderHello(request: Request, response: Response): Response {
    response.content = getReactPageTemplate('Hello World', "HelloWorld", {});
    return response;
}
```

## Handler with Data

```typescript
export function renderItems(request: Request, response: Response): Response {
    const items = findAllItems();
    response.content = getReactPageTemplate('Items', "ItemList", {
        items: items.map(i => ({ id: String(i.id), name: i.name })),
    });
    return response;
}
```

## Handler with Form POST

```typescript
export function renderItemCreate(request: Request, response: Response): Response {
    if (request.method === "post") {
        const raw = getPayloudData<Record<string, string>>(request);
        try {
            const data = transformValidate(ItemForm, raw);
            insertItem(data.name);
            response.status = 302;
            response.headers["Location"] = "/items";
            return response;
        } catch (error) {
            if (error instanceof ValidationError) {
                response.content = getReactPageTemplate('New Item', "ItemForm", {
                    values: raw,
                    error: (error as ValidationError).message,
                });
                return response;
            }
        }
    }
    response.content = getReactPageTemplate('New Item', "ItemForm", { values: {} });
    return response;
}
```

## Repository Functions

```typescript
export function findAllItems(): DbItem[] {
    return sqlQuery<DbItem>(
        `SELECT *, price::float as price, created_at::text as created_at FROM items ORDER BY id DESC`,
        []
    );
}

export function findItemById(id: number): DbItem | null {
    const rows = sqlQuery<DbItem>(
        `SELECT *, price::float as price, created_at::text as created_at FROM items WHERE id = $1`,
        [id]
    );
    return rows.length > 0 ? rows[0] : null;
}

export function insertItem(name: string, price: number): void {
    sqlQuery("INSERT INTO items (name, price) VALUES ($1, $2)", [name, price]);
}
```

## React Page Component

```tsx
interface Props {
    message: string;
}

export function HelloWorldPage({ message }: Props) {
    return (
        <div>
            <h1>{message}</h1>
        </div>
    );
}
```

## Cached Data Fetch

```typescript
function getItems(): Item[] {
    const cached = appCacheGet("items");
    if (cached) return jsonDecode(cached);
    const items = findAllItems();
    appCacheSet("items", jsonEncode(items), 60000);
    return items;
}
```

## Session Patterns

### Login

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
    response.content = getReactPageTemplate('Login', "Login", {});
    return response;
}
```

### Protected Route

```typescript
export function renderProtected(request: Request, response: Response): Response {
    return withSessionRefresh<UserSession>(request, response, (req, res) => {
        const session = getSession<UserSession>(req);
        if (!session?.user) {
            res.status = 302;
            res.headers["Location"] = "/login";
            return res;
        }
        // Render page...
        return res;
    });
}
```
