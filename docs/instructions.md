Always do this:
After committing and pushing, deploy the project to the test environment (TlyCode MCP server, scripts/deploy.sh) and then test it in the browser using the Playwright MCP server. Project info (name, id) can be found in tlycode.json. Print the test environment URL at the end.

### Pre-deploy: React Build

The deploy script auto-detects `react-app/` (or `react/`) and **builds + uploads
the React bundle automatically** in the same atomic deploy — no manual embed step
is needed anymore.

If you want to skip rebuilding React (e.g. after a Lua-only change):

```bash
SKIP_BUILD=1 ./scripts/deploy.sh   # Skip both Lua and React build
NO_REACT=1 ./scripts/deploy.sh     # Skip React entirely
```

To rebuild React manually (without deploying):

```bash
cd react-app && npm run build && cd ..   # tsc + vite build + postbuild manifest
```

### Deployment

```bash
./scripts/deploy.sh              # Standard deploy: Lua bundle + React (when present) + git metadata
./scripts/deploy.sh --local      # Local deploy (no git metadata, single API call)
./scripts/deploy.sh --no-react   # Skip React even when react-app/ exists
./scripts/deploy.sh --no-rollout # Upload bundle without triggering Cloud Run rollout
./scripts/deploy.sh --react      # Frontend-only push (legacy /api/deploy/react endpoint)
```

Optional env vars: `HOSTING_API_URL` (default: `http://localhost:3005/hosting`),
`HOSTING_ENV` (default: `production`), `SKIP_BUILD=1`, `NO_REACT=1`,
`ASSETS_DIR=path` (upload static assets together), `ASSETS_PREFIX=path`,
`NO_ASSETS=1` to skip assets even when `ASSETS_DIR` is set.

### Atomic React Deploy (default)

`react-app/dist/` is uploaded as part of every deploy and stored under
`gs://{bucket}/{project}/{env}/deployments/{id}/react/`. The platform reads the
Vite manifest (`dist/.vite/manifest.json`) to pick the entry filename + first CSS
file, then injects them into Cloud Run as `REACT_BUNDLE_GCS_URL`,
`REACT_BUNDLE_CDN_URL` (when CDN configured), `REACT_BUNDLE_ENTRY`,
`REACT_BUNDLE_CSS`. The Lua code calls `frontendEntryUrl()` and `frontendCssUrl()`
to render the appropriate `<script>` and `<link>` tags.

The legacy `--react` flag still works but uploads to the **shared** path
`gs://{bucket}/{project}/{env}/react/` (not per-deploy versioned). Prefer the
default flow for new projects.

### Local Deploy (Test Environment)

If `/home/vscode/Test/deploy-local.sh` exists, copy it to the current directory and run it after committing changes. This deploys changes to the test environment.

```bash
cp /home/vscode/Test/deploy-local.sh . && ./deploy-local.sh
```

### Testing After Deploy

After each deploy, test the changes in the browser using the **Playwright MCP server** tools:

1. **Get the test environment URL** using the **TlyCode MCP server**:
   - `mcp__tlycode__list_projects` — list all projects
   - `mcp__tlycode__list_environments` (project_id) — list environments
   - `mcp__tlycode__get_environment` (project_id, environment_id) — get environment details including Cloud Run `service_url`

2. **Test the changes** using the **Playwright MCP server**:
   - `mcp__playwright__browser_navigate` — navigate to a URL
   - `mcp__playwright__browser_take_screenshot` — take a screenshot to visually verify
   - `mcp__playwright__browser_snapshot` — get the accessibility snapshot of the page
   - `mcp__playwright__browser_click` — click on elements
   - `mcp__playwright__browser_fill_form` — fill form fields
   - `mcp__playwright__browser_press_key` — press keyboard keys
   - `mcp__playwright__browser_wait_for` — wait for elements or conditions
   - `mcp__playwright__browser_console_messages` — check for JS errors
   - `mcp__playwright__browser_network_requests` — inspect network requests

   Example test flow:
   1. Navigate to the test URL
   2. Take a screenshot
   3. Verify the page content via snapshot
   4. Test interactive elements (forms, links)

3. **Check logs for errors** using the **TlyCode MCP server**:
   - `mcp__tlycode__get_cloudrun_logs` (project_id, environment_id, severity=ERROR, limit=50)

4. **Fix any errors** found in logs or during testing

5. **Repeat** the deploy-test-fix cycle until all errors are resolved

### TlyCode MCP Server (TypeForge)

Use the TlyCode MCP server tools (prefixed with `mcp__tlycode__`) for all platform operations:

**Commonly used tools:**
- `mcp__tlycode__list_projects` — list all projects
- `mcp__tlycode__list_environments` — list environments for a project
- `mcp__tlycode__get_environment` — get environment details (service URL, etc.)
- `mcp__tlycode__get_cloudrun_logs` — get Cloud Run logs
- `mcp__tlycode__run_sql_query` — run SQL queries against the database
- `mcp__tlycode__list_deployments` — list deployments

### Database Access

Use the TlyCode MCP server for direct database access (useful for debugging and data inspection):

- `mcp__tlycode__run_sql_query` (project_id, environment_id, query) — run SQL queries

### Cloud Storage (Assets)

Cloud Storage is used for uploading static assets (images, files) and getting their public URLs for use in code.

#### Four ways to upload assets

1. **`scripts/assets.sh`** — RECOMMENDED for ad-hoc / agent-driven uploads:
   ```bash
   HOSTING_API_SECRET=<secret> HOSTING_ENV=test ./scripts/assets.sh upload ./logo.png
   ./scripts/assets.sh upload ./hero.jpg images/hero.jpg
   ./scripts/assets.sh upload-dir ./assets images
   ./scripts/assets.sh list                   # all files
   ./scripts/assets.sh list images            # filter prefix
   ./scripts/assets.sh url images/logo.png    # print public/CDN URL
   ./scripts/assets.sh delete images/old.png
   ```
   This is a thin wrapper around the hosting `/api/storage/*` endpoints. AI agents
   should prefer it for single-file operations because the output is human-readable
   and exit codes are reliable.

2. **CLI bundled with deploy** — for `git`/CI workflow:
   ```bash
   HOSTING_API_SECRET=<secret> ./scripts/deploy.sh --assets-dir=assets
   # Or env vars: ASSETS_DIR=assets ./scripts/deploy.sh
   ```
3. **CLI assets-only** — bulk sync without rebuilding Lua/React:
   ```bash
   ./scripts/deploy.sh --assets-only --assets-dir=assets
   ./scripts/deploy.sh --assets-only --assets-dir=assets --assets-prefix=images
   ```
4. **Web UI** — open the env detail page in hosting and click the folder icon
   next to the Cloud Storage card; drag & drop files, browse, delete.

All four methods upload under `{project}/{env}/files/{prefix}/{filename}`,
which is the convention used by `getAssetUrl()` and `storageUpload()` in Lua.

#### MCP Tools for Cloud Storage Management

Use these tools (prefixed with `mcp__tlycode__`) to manage storage from the development environment:

- `mcp__tlycode__get_storage` (project_id, environment_id) — get bucket details for an environment
- `mcp__tlycode__list_all_storage` (project_id) — list all storage buckets across environments
- `mcp__tlycode__storage_upload_asset` (project_id, environment_id, path, content_base64, content_type?)
   — **PREFERRED** for user assets: auto-prefixes `{project}/{env}/files/`, auto-detects MIME
- `mcp__tlycode__storage_upload_file` (project_id, environment_id, path, content_base64, content_type?)
   — full-path upload anywhere in the bucket (admin/debug)
- `mcp__tlycode__storage_download_file` (project_id, environment_id, path) — download a file (returns base64)
- `mcp__tlycode__storage_list_files` (project_id, environment_id, prefix?, max_results?) — list files in bucket, supports prefix filter and pagination
- `mcp__tlycode__storage_delete_file` (project_id, environment_id, path) — delete a file
- `mcp__tlycode__detach_storage` (project_id, environment_id) — detach bucket from environment (does not delete cloud resource)
- `mcp__tlycode__delete_cloud_storage` (bucket_name, confirm) — permanently delete a bucket and all its objects

#### Uploading Assets via MCP

To upload an asset (e.g., an image) via the asset-aware tool:

1. Base64-encode the file content
2. Upload with relative path (auto-prefixed under `files/`):
   ```
   mcp__tlycode__storage_upload_asset(project_id, environment_id, path="images/logo.png", content_base64="...")
   ```
3. The response includes `public_url` and `cdn_url` (when CDN is configured).

#### Runtime Storage Functions (in TSTL/Lua code)

These global functions are available in server-side code for working with Cloud Storage at runtime:

```typescript
// Upload a file (string content)
storageUpload(path: string, content: string, contentType?: string): string;

// Upload binary data
storageUploadBytes(path: string, bytes: number[], contentType?: string): string;

// Download a file
storageDownload(path: string): string;

// Delete a file
storageDelete(path: string): boolean;

// Get public URL for a file
storageGetUrl(path: string): string;

// Get a signed (time-limited) URL
storageGetSignedUrl(path: string, expiresInSeconds?: number): string;

// List files by prefix
storageList(prefix?: string): string[];

// Check if a file exists
storageExists(path: string): boolean;
```

#### Asset URL Resolution

For assets uploaded under `files/`, use `getAssetUrl(path)` from `src/utils.ts` —
it composes the URL from `CDN_URL`/`STORAGE_URL` env_configs:

```typescript
const logoUrl = getAssetUrl("logo.png");          // → CDN or GCS
const heroUrl = getAssetUrl("images/hero.jpg");
```

For the **React bundle URL** (managed by the platform per-deploy, NOT under
`files/`), use `frontendEntryUrl()` / `frontendCssUrl()`:

```typescript
const bundle = frontendEntryUrl();        // e.g. https://cdn.example.com/.../deployments/42/react/index-Abc.js
const css = frontendCssUrl();             // e.g. https://cdn.example.com/.../deployments/42/react/style.css
const bundleGcs = frontendEntryUrl("gcs"); // force direct GCS URL
```

`frontendEntryUrl()`/`frontendCssUrl()` return `null` when no React deployment exists.

#### Common Patterns

**Upload user file and get its public URL:**
```typescript
export function handleUpload(request: Request, response: Response): Response {
    const file = request.files[0];
    const path = `uploads/${uniqueKey()}_${file.filename}`;
    storageUpload(path, file.content, file.contentType);
    const config = getConfig();
    const baseUrl = config.CDN_URL || config.STORAGE_URL;
    const url = `${baseUrl}/${path}`;
    // Save url to database, use in templates, etc.
    return response;
}
```

**Get public URL for an asset in a template:**
```typescript
const logoUrl = getAssetUrl("images/logo.png");
response.content = getReactPageTemplate('Home', "HomePage", { logoUrl });
```

**Get a temporary signed URL (e.g., for private files):**
```typescript
const downloadUrl = storageGetSignedUrl("documents/report.pdf", 3600); // 1 hour
```
