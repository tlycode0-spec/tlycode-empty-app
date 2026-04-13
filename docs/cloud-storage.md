# Cloud Storage — Upload Guide

## Overview

Static assets (images, fonts, documents) are stored in Google Cloud Storage and served via CDN. Each environment has its own bucket.

**Bucket naming:** `tf-{project_id}-{environment_id}-{project_name}`
**CDN URL pattern:** `https://cdn-{project_name}.{domain}/{path}`

## Uploading Assets (MCP Tools)

### Step-by-step

1. **Get project and environment IDs** from `tlycode.json` or via MCP:
   ```
   mcp__tlycode__list_projects()
   mcp__tlycode__get_project(project_id)
   ```

2. **Base64-encode the file:**
   ```bash
   base64 -w 0 path/to/file.png > /tmp/file-b64.txt
   ```

3. **Upload via MCP:**
   ```
   mcp__tlycode__storage_upload_file(
     project_id,
     environment_id,
     path="images/file.png",
     content_base64="<base64 string>",
     content_type="image/png"
   )
   ```

4. **Verify upload:**
   ```
   mcp__tlycode__storage_list_files(project_id, environment_id, prefix="images/")
   ```

5. **Get CDN URL** — use `mcp__tlycode__get_cdn_status(project_id, environment_id)` to find the CDN base URL, then append the file path:
   ```
   https://cdn-{project_name}.{domain}/images/file.png
   ```

### Common content types

| Extension | Content Type |
|-----------|-------------|
| `.png` | `image/png` |
| `.jpg/.jpeg` | `image/jpeg` |
| `.svg` | `image/svg+xml` |
| `.webp` | `image/webp` |
| `.gif` | `image/gif` |
| `.pdf` | `application/pdf` |
| `.woff2` | `font/woff2` |
| `.json` | `application/json` |

### File organization

Use a clear folder structure in the bucket:

```
images/          — static images (logos, icons, product photos)
uploads/         — user-uploaded files
documents/       — PDFs and other docs
fonts/           — custom web fonts
```

## Cloudflare CDN — Image Resizing

CDN běží přes Cloudflare Workers, což umožňuje škálovat a transformovat obrázky on-the-fly pomocí [Cloudflare Image Resizing](https://developers.cloudflare.com/images/transform-images/). Transformace se zadávají jako parametry v URL cestě `/cdn-cgi/image/`.

### Formát URL

```
https://cdn-{project}.{domain}/cdn-cgi/image/{options}/{image_path}
```

### Dostupné parametry

| Parametr | Popis | Příklad |
|----------|-------|---------|
| `width` | Šířka v pixelech | `width=300` |
| `height` | Výška v pixelech | `height=200` |
| `fit` | Režim ořezu: `scale-down`, `contain`, `cover`, `crop`, `pad` | `fit=cover` |
| `quality` | Kvalita 1–100 (default 85) | `quality=80` |
| `format` | Formát: `auto`, `webp`, `avif`, `json` | `format=auto` |
| `sharpen` | Doostření 0–10 | `sharpen=1` |
| `blur` | Rozmazání 1–250 | `blur=20` |
| `gravity` | Pozice ořezu: `auto`, `center`, `top`, `bottom`, `left`, `right` | `gravity=auto` |
| `background` | Barva pozadí (hex) | `background=%23ffffff` |
| `dpr` | Device pixel ratio 1–4 | `dpr=2` |

Parametry se oddělují čárkou.

### Příklady

```
# Thumbnail 150x150, oříznutý na střed
https://cdn-landing-page.filipeus.cz/cdn-cgi/image/width=150,height=150,fit=cover/images/product-book.png

# Zmenšit na šířku 400px, automatický formát (webp/avif dle prohlížeče)
https://cdn-landing-page.filipeus.cz/cdn-cgi/image/width=400,format=auto/images/product-book.png

# Kvalita 60%, šířka 800px, doostření
https://cdn-landing-page.filipeus.cz/cdn-cgi/image/width=800,quality=60,sharpen=1,format=auto/images/product-book.png

# Rozmazaný placeholder (LQIP)
https://cdn-landing-page.filipeus.cz/cdn-cgi/image/width=20,blur=10,quality=30/images/product-book.png
```

### Použití v React komponentách

```tsx
export function ProductImage({ src }: { src: string }) {
    return (
        <img
            src={`https://cdn-landing-page.filipeus.cz/cdn-cgi/image/width=300,format=auto/${src}`}
            alt="Product"
        />
    );
}
```

### Responsive images se `srcSet`

```tsx
export function ResponsiveImage({ path, alt }: { path: string; alt: string }) {
    const cdn = "https://cdn-landing-page.filipeus.cz";
    return (
        <img
            src={`${cdn}/cdn-cgi/image/width=400,format=auto/${path}`}
            srcSet={[
                `${cdn}/cdn-cgi/image/width=400,format=auto/${path} 400w`,
                `${cdn}/cdn-cgi/image/width=800,format=auto/${path} 800w`,
                `${cdn}/cdn-cgi/image/width=1200,format=auto/${path} 1200w`,
            ].join(', ')}
            sizes="(max-width: 600px) 400px, (max-width: 1000px) 800px, 1200px"
            alt={alt}
        />
    );
}
```

### Tipy

- **`format=auto`** — vždy používej, Cloudflare automaticky zvolí nejlepší formát (webp/avif) dle prohlížeče
- **`fit=cover`** — ideální pro thumbnaily a avatary (ořízne na přesný rozměr)
- **`fit=scale-down`** — zmenší, ale nezvětšuje (default)
- Transformované obrázky se cachují na Cloudflare edge — první request je pomalejší, další jsou z cache
- Originální obrázek zůstává v GCS beze změny

## Using Assets in React Components

Reference uploaded assets directly via CDN URL:

```tsx
export function MyPage() {
    return (
        <img
            src="https://cdn-{project}.{domain}/images/photo.png"
            alt="Description"
        />
    );
}
```

**Do not** import images as local assets (`import img from './assets/img.png'`) — this embeds them in the JS bundle, increasing bundle size. Use CDN URLs instead.

## Using Assets in TSTL Server Code

### Via CDN URL (recommended for React props)

```typescript
const config = getConfig();
const baseUrl = config.CDN_URL || config.STORAGE_URL;
const imageUrl = `${baseUrl}/images/photo.png`;

response.content = getReactPageTemplate('Page', "MyPage", { imageUrl });
```

### Via runtime storage functions

```typescript
// Get public URL
const url = storageGetUrl("images/photo.png");

// Get temporary signed URL (for private files)
const downloadUrl = storageGetSignedUrl("documents/report.pdf", 3600);

// Upload at runtime
storageUpload("uploads/file.txt", content, "text/plain");

// Check existence
if (storageExists("images/photo.png")) { ... }
```

## React Bundle Upload

React bundle se automaticky nahrává do Cloud Storage při prvním requestu. Celý proces:

### Jak to funguje

1. `react-app/` se buildne přes Vite → `react-app/dist/index-[hash].js`
2. `node scripts/embed-react.js` udělá dvě věci:
   - Vygeneruje `src/react-bundle-content.ts` (gitignored) — obsahuje JS a CSS jako template literal
   - Zapíše MD5 hash JS obsahu do `src/react.ts` jako `const bundleHash = "<hash>"`
3. `npm run build` (TSTL) zkompiluje vše do `dist/bundle.lua`
4. Při prvním HTTP requestu `react.ts` nahraje bundle do GCS jako `react-assets/react-bundle-<hash>.js`
5. React se načítá z CDN URL: `https://cdn-{project}.{domain}/react-assets/react-bundle-<hash>.js`

### Soubory

| Soubor | Verzovaný | Popis |
|--------|-----------|-------|
| `scripts/embed-react.js` | ano | Embed skript — generuje bundle content + zapisuje hash |
| `src/react.ts` | ano | Obsahuje `bundleHash` konstantu (přepisuje embed skript) |
| `src/react-bundle-content.ts` | ne (gitignored) | Celý React JS/CSS bundle jako string |

### Build pipeline

```bash
cd react-app && npm run build && cd ..   # 1. Build React
node scripts/embed-react.js              # 2. Embed + hash
npm run build                            # 3. TSTL compile
```

Embed skript používá regex `const bundleHash = ".*?"` pro nahrazení — funguje opakovaně (nahradí jak placeholder, tak předchozí hash).

## MCP Tool Reference

| Tool | Purpose |
|------|---------|
| `storage_upload_file` | Upload file (base64-encoded) |
| `storage_download_file` | Download file (returns base64) |
| `storage_list_files` | List files, supports prefix filter |
| `storage_delete_file` | Delete a file |
| `get_storage` | Get bucket details |
| `list_all_storage` | List all buckets across environments |
| `get_cdn_status` | Get CDN URL for environment |
