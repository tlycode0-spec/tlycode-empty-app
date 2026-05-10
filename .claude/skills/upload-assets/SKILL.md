---
name: upload-assets
description: Upload one or more local files to the tlycode hosting storage via scripts/assets.sh. Trigger when the user gives a list of file paths and asks to upload, push, or sync them to the CDN/storage. Handles single files, multiple files, directories, and resolves the right remote path so getAssetUrl() will find them.
---

# Upload assets

Wraps `scripts/assets.sh` to push local files to `{project}/{env}/files/<remote_path>`. The remote path is what `getAssetUrl("<remote_path>")` resolves against — they must match exactly.

## Inputs

The user's message is the input. Parse it for:

1. **File paths** — one or more local paths (absolute or relative to repo root). Globs like `assets/images/products/*.png` are fine — expand them with `Glob` first.
2. **Environment** — default `test`. If the user says "production" / "prod" / "live", use `production`. Otherwise stay on `test`.
3. **Remote prefix / path** — optional. If the user says "upload these to `images/products/`", use that prefix. Otherwise infer from the local path (see "Inferring remote path" below).

If the user gives a directory rather than files, switch to `upload-dir` mode (see below).

## Inferring remote path

When the user doesn't specify a remote path, derive it so `getAssetUrl()` calls in `home.data.ts` keep working:

- Path under `assets/` → strip the `assets/` prefix. `assets/images/products/foo.png` → remote `images/products/foo.png`.
- Path anywhere else → use the basename. `~/Downloads/logo.svg` → remote `logo.svg` (warn the user this is probably not what they want, ask for a prefix).

The rule of thumb: **the remote path must be exactly the string passed to `getAssetUrl(...)` in the code.** If unsure, grep `home.data.ts` for the basename to see what path the code expects.

## Pre-flight

Before running any uploads:

1. Confirm `HOSTING_API_SECRET` is in the environment. If missing, fail fast with a clear message — do not try to invent it.
2. Verify each local file exists with `Glob` or `Read`. Report missing files up-front, don't let `assets.sh` fail one-by-one.
3. State the plan: "Uploading N files to env=`<env>` with prefix `<prefix>`" — one line per file is fine if N ≤ 10, otherwise summarize.

## Single / few files

Loop through paths, one `Bash` call per file. Run them **in parallel** (multiple Bash tool calls in one message) when there are no dependencies — uploads are independent.

```bash
HOSTING_ENV=<env> ./scripts/assets.sh upload <local_path> <remote_path>
```

The script prints CDN + GCS URLs on success. Capture and surface the CDN URL — that's what the user will care about.

## Many files / whole directory

If the user gives a directory or > ~10 files in one tree, prefer `upload-dir`:

```bash
HOSTING_ENV=<env> ./scripts/assets.sh upload-dir <local_dir> <remote_prefix>
```

Example for the standard layout:

```bash
HOSTING_ENV=test ./scripts/assets.sh upload-dir assets/images images
```

`upload-dir` walks the directory recursively and preserves structure under `<remote_prefix>/`.

## Handling failures

- **`curl exit 56` / "Recv failure: Operation timed out"** — transient network issue, common on larger PNGs. **Retry just that file** (single `upload` call). Don't restart the whole batch.
- **HTTP 4xx with an error message** — surface the message to the user. Likely a bad path, missing secret, or wrong environment.
- **Local file not found** — your fault for not pre-flighting. Check the path and try again.

After a batch, if any file failed, list exactly which ones and the suggested retry command. Don't silently continue.

## After upload — verify only if asked

The user usually trusts the script's `[OK]` output. Only verify (e.g. `assets.sh list <prefix>` or `curl -I <cdn_url>`) when the user explicitly asks or when an upload looked suspicious.

## Output format

Keep the report short:

```
Uploaded 5/5 files to test:
  images/products/foo.png   → https://cdn-…/foo.png
  images/products/bar.png   → https://cdn-…/bar.png
  …
```

For a single file, one line is enough. Don't reprint everything `assets.sh` already echoed unless the user asks for the GCS URL too.

## Gotchas

- **Leading slash in remote path** — `assets.sh upload` strips it, but the convention in this repo is no leading slash. Pass `images/foo.png`, not `/images/foo.png`.
- **Wrong env mismatch** — if you upload to `test` but the deployed app is on `production`, the image will 404. Check the user's intent if it's not obvious.
- **Spaces / unicode in filenames** — quote the path. Bash splits on whitespace by default.
- **Don't upload `.DS_Store`, `.gitignore`, build artifacts.** If using `upload-dir`, glance at the directory first; if it has junk, switch to listing the real files and uploading individually.
- **Don't assume `production` without explicit confirmation.** Production uploads are user-visible and harder to reverse — default to `test` and ask if they want production.
