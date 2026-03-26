# Validation

## Overview

`src/validator.ts` provides decorator-based validation using experimental TypeScript decorators. Validation runs on the server side (TSTL/Lua) when processing form POST data.

## Usage

```typescript
import { transformValidate, ValidationError } from "../../../validator";

// In handler
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
            // Re-render form with error message
            response.content = getReactPageTemplate('Nový produkt', "AdminProductForm", {
                values: raw,
                error: (error as ValidationError).message,
                isEdit: false,
            });
            return response;
        }
    }
}
```

## Defining Validation Classes

```typescript
// catalog.validation.ts
export class ProductForm {
    @Transform((v: string) => v?.trim())
    @Required()
    @MinLength(2)
    name: string = '';

    @Transform((v: string) => v?.trim())
    slug: string = '';

    @Required()
    price: string = '0';

    status: string = 'active';
}
```

## Available Decorators

| Decorator | Description |
|-----------|-------------|
| `@Required()` | Field must not be empty |
| `@MinLength(n)` | Minimum string length |
| `@MaxLength(n)` | Maximum string length |
| `@Range(min, max)` | Numeric range |
| `@Custom(fn)` | Custom validation function |
| `@Transform(fn)` | Transform value before validation |
| `@Type(typeFn)` | Nested object validation |

## Error Handling

`transformValidate()` throws `ValidationError` with a human-readable `.message`. The handler catches it and re-renders the React form component with the error message and previously submitted values.
