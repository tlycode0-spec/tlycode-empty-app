---
name: port-page
description: Rebuild an external web page (URL or screenshot) as a tlycode page — typed server data, React components, real images downloaded from the source site, optimized to WebP, and deployed. Trigger when the user asks to "přepis stránky", "port page", "clone homepage", "rebuild this site", or supplies a URL/screenshot to recreate.
---

# Port external page → tlycode

End-to-end workflow for recreating a real-world web page inside this tlycode template. The page is **server-rendered** (TSTL/Lua handler returns HTML) with **React on top** for the UI, and all data is passed as typed props — no client-side fetching.

## Inputs you need before starting

Ask only if missing — otherwise infer from what the user gave:

1. **Source** — URL (use `mcp__playwright__browser_navigate` + `browser_take_screenshot` + `browser_snapshot`) **or** a screenshot/Figma the user attaches.
2. **Module name** — slug like `home`, `pricing`, `about`. Used for folder + file names.
3. **Route path** — usually `/` for the landing page; otherwise `/slug`.
4. **Component name** — PascalCase, registered in `react-app/src/registry.ts`. Convention: `HomePage`, `PricingPage`.
5. **Page title + SEO description** — used by `getReactPageTemplate(title, ..., props, { seo: { description } })`.

If the user only says "rebuild etaktik.cz", default module=`home`, route=`/`, component=`HomePage`, title in target language.

## The pipeline (do these in order)

### 1. Capture the source

- URL → use Playwright MCP to navigate, full-page screenshot, and `browser_snapshot` for the DOM tree (text content, link targets, image URLs).
- Screenshot only → just Read it.
- Save the source screenshot in the project root as `<slug>-source.png` so later visual diffs are easy.

### 2. Decompose into blocks

Identify the visual sections (top bar, main nav, sidebar, hero, product list, articles, footer, …). Each becomes:
- An entry on `HomePageProps` (the page's prop interface)
- A React component file in `react-app/src/components/<group>/`

Group convention: `layout/` for chrome (Header/Footer/Sidebar/Nav), `home/` (or `<module>/`) for page-specific blocks, `common/` for cross-cutting UI (Cookie banner, Newsletter).

### 3. Define types — `src/modules/app/<module>/<module>.types.ts`

Write **one interface per block** plus a top-level `<Module>PageProps`. Use string literal unions for design tokens (`color: 'orange' | 'blue' | …`) — this makes the React component switch trivially.

### 4. Define data — `src/modules/app/<module>/<module>.data.ts`

Export `get<Module>Data(): <Module>PageProps`. **Every image goes through `getAssetUrl("…")`** — never hard-code a CDN URL. The path you pass is the storage key (e.g. `images/products/foo.webp`), and it must match what you upload via `assets.sh`.

```typescript
import { getAssetUrl } from "../../../utils";
import { HomePageProps } from "./home.types";

export function getHomeData(): HomePageProps {
    return { /* …typed props… */ };
}
```

Keep the data file declarative and the types strict — it's the single source of truth for the page.

### 5. Handler — `src/modules/app/<module>/<module>.handlers.ts`

```typescript
import { getReactPageTemplate } from "../../../react";
import { get<Module>Data } from "./<module>.data";

export function render<Module>(request: Request, response: Response): Response {
    response.content = getReactPageTemplate(
        "<page title>",
        "<ComponentName>",
        get<Module>Data() as unknown as Record<string, any>,
        { seo: { description: "<seo description>" } }
    );
    return response;
}
```

The `as unknown as Record<string, any>` cast is the pattern in this repo — keep it.

### 6. Register the route

Touch all four:
- `src/modules/app/<module>/index.ts` — `export * from './<module>.handlers';`
- `src/modules/app/index.ts` — re-export the new module
- `src/modules/router.types.ts` — add the path to the union
- `src/modules/router.ts` — push `{ path, route, type }`

### 7. Build the React side

For each block create a small focused component (`HeroGrid.tsx`, `ProductCarousel.tsx`, …) using **MUI** (`@mui/material`) — it's already wired and matches the existing style.

**Loading hints on every `<img>`** (do this from the start, not as an afterthought):

- Above-the-fold (hero, header logo): `loading="eager"` + `decoding="async"` + `fetchPriority="high"` on the largest hero image.
- Below-the-fold (everything in product cards, icons, secondary photos): `loading="lazy"` + `decoding="async"`.
- For absolute-positioned background-style images, use `<Box component="img">` (still a real `<img>`) so the loading hints apply — don't use CSS `background-image`, you lose lazy loading and the alt text.

```tsx
// Hero — eager + high priority
<Box component="img" src={data.bgImage} alt={data.bgImageAlt}
     loading="eager" decoding="async" fetchPriority="high" sx={…} />

// Below the fold — lazy
<Box component="img" src={p.image} alt={p.imageAlt}
     loading="lazy" decoding="async" sx={…} />
```

**Defensive props on new sections.** If you add a new block (e.g. `AboutSection`) and the deployed Lua bundle is briefly out of sync with the new React bundle (rolls out faster), accessing `data.heading` on `undefined` crashes the whole page. Make the prop optional and bail early:

```tsx
export function AboutSection({ data }: { data?: AboutData }) {
  if (!data) return null;
  …
}
```

This costs one line and turns a hard outage into a missing section during the rollout window.

Put the page composer at `react-app/src/pages/public/<ComponentName>.tsx` and import the block components. Then register in `react-app/src/registry.ts`:

```typescript
import { <ComponentName> } from './pages/public/<ComponentName>';
export const registry = { ..., <ComponentName> };
```

### 8. Download the real images from the source site

**No placeholders.** Pull the actual assets from the source so the rebuild looks like the real thing on first deploy.

8a. **Collect image URLs.** Use `browser_snapshot` from step 1 — it has every `<img src>`, plus inline backgrounds. If something is set via CSS `background-image`, run `browser_evaluate` to dig it out:

```js
() => Array.from(document.querySelectorAll('*'))
  .map(el => getComputedStyle(el).backgroundImage)
  .filter(s => s && s !== 'none')
```

Logos, sprites, and SVG icons in the DOM also count — grab them all. Deduplicate by URL.

8b. **Map remote URL → local path.** Decide the storage key for each. Mirror the source's structure where it makes sense, but plan to **save as `.webp`** (you'll convert in step 9):

| Source URL example | Local path (downloaded) | After step 9 (`getAssetUrl()` arg) |
|---|---|---|
| `https://site.cz/img/logo.svg` | `assets/images/logo.svg` | `images/logo.svg` (SVG stays SVG) |
| `https://site.cz/products/123.jpg` | `assets/images/products/123.jpg` | `images/products/123.webp` |
| `https://cdn.site.cz/hero/main.png` | `assets/images/hero/main.png` | `images/hero/main.webp` |

Strip query strings (`?v=123`) from filenames — they break the upload.

8c. **Download in parallel.** Use `curl` with parallel `Bash` calls (one tool message, multiple Bash blocks). Make sure the target directory exists first:

```bash
mkdir -p assets/images/products
curl -sSL -o assets/images/products/foo.png 'https://source.cz/products/foo.png'
```

For lots of images, batch into one Bash call with `&` + `wait`, or call `curl --parallel` with a list. Set a reasonable timeout (`--max-time 30`) so a hung URL doesn't stall the whole pipeline.

8d. **Verify each download succeeded.** A common failure is a 200 response with HTML content (a soft 404 page, or hotlink protection) — the file exists locally but isn't an image:

```bash
file assets/images/products/foo.png   # should say "PNG image data" / "JPEG image data" / "SVG"
```

If something came back as HTML, check whether the source site needs a `Referer` header (`curl -H "Referer: https://source.cz/"`) or `User-Agent`. Hotlink protection is the usual culprit.

8e. **Watch for extension/content mismatch.** Source sites sometimes serve PNG bytes from a `.jpg` URL. `file <path>` will tell you. Either rename to match the real format, or just let step 9's `cwebp` strip the issue (it reads any input format).

### 9. Optimize the images (WebP + resize)

This is the difference between a 7 MB page and a 700 KB page — **always do it**. Source sites routinely serve hero images as 2 MB PNGs and use a 850 KB PNG as a 40 px header logo.

9a. **Backup originals OUTSIDE the upload tree.** `assets.sh upload-dir` recurses into every subdirectory (including hidden ones), so a backup folder under `assets/images/` will get re-uploaded as junk. Keep originals at the repo root and gitignore them:

```bash
mkdir -p .image-originals
cp assets/images/<group>/*.{png,jpg,jpeg} .image-originals/ 2>/dev/null
echo ".image-originals/" >> .gitignore
```

9b. **Convert + resize with `cwebp`.** Install on macOS via `brew install webp`, or `apt install webp` on Linux. Pick a target width per image based on **actual display size** (header logo at 40 px doesn't need a 1024 px source):

```bash
# Hero / large content image: max 1200–1400 px wide, q≈80
cwebp -q 80 -resize 1400 0 .image-originals/hero.png -o assets/images/home/hero.webp

# Product card image: ~1080 px, q≈80
cwebp -q 80 -resize 1080 0 .image-originals/book.jpg -o assets/images/home/book.webp

# Small icon / avatar / logo: 256 px, q≈85–90 (`-resize 256 0` keeps aspect)
cwebp -q 90 -resize 256 0 .image-originals/logo.png -o assets/images/home/logo.webp
```

`-resize W 0` resizes to width W and keeps aspect ratio. `-q 80` is a sensible default for photos; bump to 85–90 for graphics with text or sharp edges.

9c. **Drop the originals from `assets/images/`** so only `.webp` (and any `.svg`) ship to the CDN:

```bash
rm assets/images/<group>/*.png assets/images/<group>/*.jpg
```

9d. **Update `data.ts` to reference `.webp`.** A bulk `sed` is fine if you mapped 1:1:

```bash
sed -i '' \
  -e 's|images/<group>/foo.png|images/<group>/foo.webp|g' \
  -e 's|images/<group>/bar.jpg|images/<group>/bar.webp|g' \
  src/modules/app/<module>/<module>.data.ts
```

9e. **Sanity check** — every `getAssetUrl(...)` must point at a file on disk:

```bash
grep -oE 'getAssetUrl\("[^"]+"\)' src/modules/app/<module>/<module>.data.ts \
  | sed -E 's/getAssetUrl\("([^"]+)"\)/assets\/\1/' \
  | xargs -I{} test -f {} || echo "MISSING: {}"
```

9f. **Cloudflare Image Resizing is rarely enabled** on tlycode CDN zones. Don't waste time crafting `/cdn-cgi/image/format=auto,width=N/...` URLs unless you've confirmed the zone has it (a quick `curl -I` on a `/cdn-cgi/image/...` test URL → if you get 404, it's off). Stick with `cwebp` pre-processing.

If a file is genuinely unobtainable (404 on the source, requires login), only then fall back to a branded SVG via `node scripts/gen-placeholders.mjs` — and tell the user which slot is faked.

### 10. Upload the assets

The remote storage layout must mirror the local `assets/images/` tree because `getAssetUrl("images/foo.webp")` resolves to `<cdn>/<project>/<env>/files/images/foo.webp`.

```bash
HOSTING_ENV=test ./scripts/assets.sh upload-dir assets/images images
```

If a single file fails (curl 56 / timeout), retry just that one:

```bash
HOSTING_ENV=test ./scripts/assets.sh upload assets/images/products/foo.webp images/products/foo.webp
```

### 11. Build + deploy

```bash
cd react-app && npm run build && cd ..   # vite + postbuild manifest
npm run build                             # TSTL → dist/bundle.lua
./scripts/deploy.sh                       # uploads bundle + react/dist atomically
```

If the deploy script reports `Commit X is already deployed. Push a new commit to deploy.`, make a commit first (deploy is gated on a fresh commit, not a fresh push). If `./scripts/deploy.sh` reports success but the live HTML still serves stale data (image paths or missing props), push to `origin/main` — the GitHub Actions `deploy.yml` workflow runs the same script and tends to apply cleanly when local deploy gets stuck mid-rollout.

### 12. Verify in a browser

Use Playwright MCP — `browser_navigate` to the deployed URL, `browser_take_screenshot` (full page), then compare against the source screenshot from step 1. Save as `<slug>-rebuild.png`. Look for: broken images (network 404), wrong colors, missing sections, layout shift.

Big WebP images can take a second to decode — if the screenshot looks empty in image slots, `browser_wait_for` for ~3–5 s and re-screenshot before assuming a bug.

If anything's off, fix and redeploy — don't claim done until the visual matches.

## Gotchas (learned the hard way in this repo)

- **TSTL `||` doesn't fall back on empty strings.** `data.slug || generateSlug(...)` keeps the `""`. Use explicit `!== ''` checks.
- **`getAssetUrl` paths have no leading slash** — `getAssetUrl("images/x.webp")`, not `/images/x.webp`. The leading slash will break the CDN URL.
- **Asset path = upload path = `getAssetUrl()` arg.** All three must match exactly, including casing AND extension. After step 9 the extension flips from `.jpg`/`.png` → `.webp`; the data file, the local file on disk, and the uploaded remote key all have to flip together.
- **Strip `?query=string` from downloaded filenames** — they end up in the local path and break the upload script.
- **Soft 404s on download** — `curl` returns 200 but the body is HTML. Always `file <path>` after download to confirm it's actually an image.
- **Hotlink protection** — some sites block `curl` without a `Referer` or `User-Agent` header. Mimic the browser if downloads come back as 0-byte or HTML.
- **`upload-dir` recurses into hidden subdirectories** — never put `.orig/` or backup folders under `assets/images/`. Keep them at the repo root (e.g. `.image-originals/`) and gitignore.
- **Don't ship oversized originals.** A 2 MB hero PNG and a 850 KB header-logo PNG are unforced perf errors. Step 9 is mandatory, not optional — the WebP+resize pass typically shaves 80–95 % off image weight.
- **Don't ship `placehold.co` URLs** and don't leave broken images. Real download first, branded SVG via `gen-placeholders.mjs` only as a last-resort fallback for assets you genuinely couldn't get.
- **Stale-bundle window during deploy.** A new React bundle can roll out a few seconds before the new Lua bundle. If a new section's React component dereferences `data.<newField>.…` and `data.<newField>` is `undefined`, the whole page TypeErrors. Always `if (!data) return null;` on new section components — see step 7.

## File checklist for a new page

```
src/modules/app/<module>/
  index.ts
  <module>.handlers.ts
  <module>.data.ts
  <module>.types.ts

src/modules/
  router.ts                          # ← add route
  router.types.ts                    # ← add path to union
src/modules/app/index.ts             # ← re-export module

react-app/src/
  pages/public/<ComponentName>.tsx
  components/<group>/*.tsx           # one per block, with loading hints on <img>
  registry.ts                        # ← register component

assets/images/...                    # ← optimized .webp (step 9 output)
.image-originals/                    # ← gitignored backup of pre-WebP downloads
scripts/gen-placeholders.mjs         # ← fallback only, for assets that genuinely can't be fetched
```

## When NOT to use this skill

- Tweaking an existing page's copy/layout — just edit `<module>.data.ts` or the React component directly.
- Adding a backend-only endpoint (no UI) — follow the standard module pattern in `CLAUDE.md`, no React work needed.
