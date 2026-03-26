Always do this:
After committing and pushing, deploy the project to the test environment (TlyCode MCP server, scripts/deploy.sh) and then test it in the browser using the Playwright MCP server. Project info (name, id) can be found in tlycode.json. Print the test environment URL at the end.

### Pre-deploy: React Build

If React components were changed, rebuild the React bundle before deploying:

```bash
cd react-app && npm run build && cd ..   # Build React app
# Then embed the bundle into TSTL source (see CLAUDE.md for embed script)
npm run build                             # TSTL compile
```

The deploy script runs `npm run build` (TSTL) automatically, but does NOT rebuild React. Always rebuild React manually if `.tsx` files changed.

### Deployment

```bash
./scripts/deploy.sh              # Standard deploy (Lua bundle, includes git metadata)
./scripts/deploy.sh --local      # Local deploy (no git metadata)
./scripts/deploy.sh --react      # Deploy React dist folder to Cloud Storage
./scripts/deploy.sh --react --react-dir=path  # Custom React dist directory
```

Optional env vars: `HOSTING_API_URL` (default: `http://localhost:3005/hosting`), `HOSTING_ENV` (default: `production`), `SKIP_BUILD=1` to skip build step.

### React Assets Deploy

Deploy React dist folder (`react-app/dist/`) to Cloud Storage. The endpoint returns `base_url` — the public URL where assets are accessible. Backend uses this URL to serve the React SPA.

```bash
./scripts/deploy.sh --react                       # Build + deploy React assets
SKIP_BUILD=1 ./scripts/deploy.sh --react          # Deploy without rebuilding
./scripts/deploy.sh --react --react-dir=custom/dist  # Custom dist path
```

Files are uploaded to `gs://{bucket}/{project}/{env}/react/` and accessible at `https://storage.googleapis.com/{bucket}/{project}/{env}/react/`.

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
