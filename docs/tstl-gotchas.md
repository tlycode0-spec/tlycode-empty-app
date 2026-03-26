# TSTL / Lua Gotchas

Critical differences between TypeScript and the compiled Lua runtime. These rules must be followed to avoid hard-to-debug bugs.

## 1. Empty string is truthy in Lua

In JavaScript `""` is falsy, but in Lua `""` is **truthy**. The `||` fallback pattern silently fails:

```typescript
// BAD — will never call generateSlug() when slug is ""
const slug = data.slug || generateSlug(data.name);

// GOOD — explicit check
const slug = (data.slug !== '' && data.slug !== undefined) ? data.slug : generateSlug(data.name);
```

## 2. DECIMAL/NUMERIC columns return null

The Lua SQL driver cannot read PostgreSQL DECIMAL/NUMERIC columns — returns `null`. Always cast:

```typescript
// BAD
sqlQuery("SELECT * FROM products", []);

// GOOD
sqlQuery("SELECT *, price::float as price, old_price::float as old_price FROM products", []);
```

## 3. TIMESTAMP columns return non-string

TIMESTAMP values come as a non-string type that breaks string operations. Always cast:

```typescript
sqlQuery("SELECT *, created_at::text as created_at FROM orders", []);
```

## 4. Null/nil in arrays truncates parameters

Lua `nil` in arrays truncates them. This causes SQL bind parameter count mismatches. Use NULLIF pattern:

```typescript
// BAD — if categoryId is null, array gets truncated at that position
sqlQuery("INSERT INTO products (name, category_id, price) VALUES ($1, $2, $3)",
    [name, categoryId, price]);

// GOOD — pass 0, let SQL convert back
sqlQuery("INSERT INTO products (name, category_id, price) VALUES ($1, NULLIF($2, 0), $3)",
    [name, categoryId !== null ? categoryId : 0, price]);
```

## 5. charAt() works on bytes, not UTF-8 characters

`String.charAt()` operates on raw bytes. Multi-byte UTF-8 characters (Czech `á`, `č`, `ř`, `ž` = 2 bytes each) get split:

```typescript
// BAD — breaks multi-byte characters
for (let i = 0; i < str.length; i++) {
    const char = str.charAt(i); // splits "á" into two garbage bytes
}

// GOOD — use string-level operations
s = replaceAll(s, 'á', 'a');  // handles multi-byte correctly
s = replaceAll(s, 'č', 'c');
```

## 6. Unsupported JS string methods

TSTL doesn't support many JavaScript string methods. Use runtime globals:

| JS Method | Use Instead |
|-----------|-------------|
| `string.lastIndexOf()` | `stringSplit(text, '.')` then get last element |
| `string.includes()` | `stringContains(text, search)` |
| `string.startsWith()` | `stringStartsWith(text, prefix)` |
| `string.endsWith()` | `stringEndsWith(text, suffix)` |
| `string.split()` | `stringSplit(text, delimiter)` |
| `string.replace()` | `stringReplace(text, search, replacement)` |
| `string.trim()` | `trim(text)` |
| `string.toLowerCase()` | `toLower(text)` |
| `string.toUpperCase()` | `toUpper(text)` |

## 7. dateParse format tokens

Use `YYYY-MM-DD HH:mm:ss` tokens (NOT Go-style). For reliability, prefer manual substring parsing:

```typescript
function formatDate(dateStr: string): string {
    if (!dateStr || dateStr.length < 10) return '-';
    const d = Number(dateStr.substring(8, 10));
    const m = Number(dateStr.substring(5, 7));
    const year = dateStr.substring(0, 4);
    if (d > 0 && m > 0) return `${d}. ${m}. ${year}`;
    return '-';
}
```

## 8. CSS class consistency

Always use `btn-outline-tf` and `btn-primary-tf`. Never Bootstrap-style `btn-outline-secondary`.

## SQL SELECT Template

Always cast DECIMAL and TIMESTAMP columns:

```typescript
sqlQuery<T>(
    `SELECT *,
        price::float as price,
        old_price::float as old_price,
        created_at::text as created_at,
        updated_at::text as updated_at
     FROM table_name WHERE ...`,
    [params]
);
```
