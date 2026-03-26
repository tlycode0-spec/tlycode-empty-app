# React Integration

## How It Works

1. Route handler calls `getReactPageTemplate(title, componentName, props)`
2. Generated HTML loads React 18 from CDN (unpkg) and the embedded JS bundle
3. `window.__REACT_RENDER__(componentName, props, containerId)` mounts the component
4. React receives all data as props — no client-side data fetching
5. Navigation is server-side — no client-side routing

## Key Files

| File | Purpose |
|------|---------|
| `src/react.ts` | `getReactPageTemplate()`, `renderReactComponent()` |
| `src/react-build.ts` | Asset paths (bundle URL, CSS URL) |
| `src/react-bundle-content.ts` | Embedded React bundle (auto-generated) |
| `react-app/src/main.tsx` | Entry point, `window.__REACT_RENDER__` |
| `react-app/src/registry.ts` | Component name → React component map |

## Component Registry

`react-app/src/registry.ts` maps string names to React components:

```typescript
export const registry: Record<string, ComponentType<any>> = {
  HelloWorld: HelloWorldPage,
};
```

## Adding a New React Component

1. Create page in `react-app/src/pages/` (e.g. `public/MyPage.tsx`)
2. Add to registry in `react-app/src/registry.ts`
3. Use in handler: `getReactPageTemplate('Title', "MyPage", { ...props })`
4. Rebuild: `cd react-app && npm run build` → embed script → `npm run build`

## Vite Build Configuration

`react-app/vite.config.ts`:

- **Format**: IIFE (not ESM) — loaded via `<script>` tag
- **External**: `react`, `react-dom` — loaded from CDN at runtime
- **CSS**: Single file output (`cssCodeSplit: false`)
