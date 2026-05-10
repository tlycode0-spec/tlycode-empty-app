#!/bin/bash
#
# Cloud Storage assets wrapper — single-file CLI for AI agents and humans.
#
# Operates under {project}/{env}/files/<path> via the hosting API.
#
# Usage:
#   ./scripts/assets.sh upload <local_path> [<remote_path>]
#       Upload one file. Remote path defaults to basename of local path.
#       Examples:
#         ./scripts/assets.sh upload ./logo.png              # → files/logo.png
#         ./scripts/assets.sh upload ./logo.png images/logo.png
#
#   ./scripts/assets.sh upload-dir <local_dir> [<remote_prefix>]
#       Upload entire directory (recursive). Remote prefix is optional.
#       Example:  ./scripts/assets.sh upload-dir ./assets images
#
#   ./scripts/assets.sh list [<prefix>]
#       List files under files/ or files/<prefix>/.
#
#   ./scripts/assets.sh delete <remote_path>
#       Delete a file. Path is relative to files/.
#
#   ./scripts/assets.sh url <remote_path>
#       Print the public URL (CDN if configured, else GCS) of a remote file.
#
# Required env vars:
#   HOSTING_API_SECRET — project API secret
#
# Optional env vars:
#   HOSTING_API_URL    — hosting base URL (default: http://localhost:3005/hosting)
#   HOSTING_ENV        — environment name (default: production)
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

HOSTING_API_URL="${HOSTING_API_URL:-http://localhost:3005/hosting}"
HOSTING_ENV="${HOSTING_ENV:-production}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

err()  { echo -e "${RED}[ERROR]${NC} $1" >&2; }
ok()   { echo -e "${GREEN}[OK]${NC} $1"; }
info() { echo -e "${BLUE}[INFO]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }

require_secret() {
    if [ -z "$HOSTING_API_SECRET" ]; then
        err "HOSTING_API_SECRET is required"
        exit 1
    fi
}

# api_call <var-prefix> <curl-args...>
# Sets API_RESPONSE and API_HTTP_CODE. Returns 0 on 2xx, 1 otherwise.
api_call() {
    local tmpfile
    tmpfile=$(mktemp)
    local curl_exit=0
    API_HTTP_CODE=$(curl -sS -w '%{http_code}' -o "$tmpfile" "$@") || curl_exit=$?
    API_RESPONSE=$(cat "$tmpfile")
    rm -f "$tmpfile"

    if [ "$curl_exit" -ne 0 ]; then
        err "Connection failed (curl exit $curl_exit) for: $*"
        return 1
    fi
    if [ "$API_HTTP_CODE" -ge 400 ] 2>/dev/null; then
        local msg
        msg=$(echo "$API_RESPONSE" | grep -o '"error":"[^"]*"' | head -1 | cut -d'"' -f4)
        if [ -n "$msg" ]; then
            err "HTTP $API_HTTP_CODE: $msg"
        else
            err "HTTP $API_HTTP_CODE: $API_RESPONSE"
        fi
        return 1
    fi
    return 0
}

cmd_upload() {
    local local_path="$1"
    local remote_path="$2"

    if [ -z "$local_path" ]; then
        err "Usage: assets.sh upload <local_path> [<remote_path>]"
        exit 1
    fi
    if [ ! -f "$local_path" ]; then
        err "File not found: $local_path"
        exit 1
    fi

    if [ -z "$remote_path" ]; then
        remote_path=$(basename "$local_path")
    fi
    # Strip leading /
    remote_path="${remote_path#/}"

    info "Uploading $local_path → files/$remote_path"

    # The HTTP endpoint takes (prefix, files[]). Split remote_path into dir+basename.
    local prefix=""
    local filename="$remote_path"
    if [[ "$remote_path" == */* ]]; then
        prefix="${remote_path%/*}"
        filename="${remote_path##*/}"
    fi

    local CURL_ARGS=(-X POST "${HOSTING_API_URL}/api/storage/upload" \
        -F "api_secret=${HOSTING_API_SECRET}" \
        -F "environment=${HOSTING_ENV}" \
        -F "files=@${local_path};filename=${filename}")

    if [ -n "$prefix" ]; then
        CURL_ARGS+=(-F "prefix=${prefix}")
    fi

    if ! api_call "${CURL_ARGS[@]}"; then
        exit 1
    fi

    local url
    url=$(echo "$API_RESPONSE" | grep -o '"url":"[^"]*"' | head -1 | cut -d'"' -f4)
    local cdn
    cdn=$(echo "$API_RESPONSE" | grep -o '"cdn_url":"[^"]*"' | head -1 | cut -d'"' -f4)

    ok "Uploaded files/$remote_path"
    if [ -n "$cdn" ]; then
        echo "  CDN: $cdn"
    fi
    echo "  GCS: $url"
}

cmd_upload_dir() {
    local dir="$1"
    local prefix="$2"

    if [ -z "$dir" ]; then
        err "Usage: assets.sh upload-dir <local_dir> [<remote_prefix>]"
        exit 1
    fi
    if [ ! -d "$dir" ]; then
        err "Directory not found: $dir"
        exit 1
    fi

    # Strip trailing slash + leading ./ from dir
    dir="${dir%/}"
    prefix="${prefix#/}"
    prefix="${prefix%/}"

    info "Uploading directory $dir (prefix: ${prefix:-<root>})"

    local count=0
    local failed=0
    while IFS= read -r -d '' file; do
        local rel="${file#$dir/}"
        local remote
        if [ -n "$prefix" ]; then
            remote="$prefix/$rel"
        else
            remote="$rel"
        fi
        if cmd_upload "$file" "$remote"; then
            count=$((count + 1))
        else
            failed=$((failed + 1))
        fi
    done < <(find "$dir" -type f -print0)

    if [ "$failed" -gt 0 ]; then
        err "Uploaded $count file(s), $failed failed"
        exit 1
    fi
    ok "Uploaded $count file(s) from $dir"
}

cmd_list() {
    local prefix="$1"

    local url="${HOSTING_API_URL}/api/storage/list?api_secret=${HOSTING_API_SECRET}&environment=${HOSTING_ENV}"
    if [ -n "$prefix" ]; then
        url="${url}&prefix=${prefix}"
    fi

    if ! api_call -X GET "$url"; then
        exit 1
    fi

    # Pretty-print via python; fall back to raw JSON
    if command -v python3 >/dev/null 2>&1; then
        echo "$API_RESPONSE" | python3 -c '
import json, sys
data = json.load(sys.stdin)
files = data.get("files", [])
if not files:
    print("(no files)")
else:
    print(f"{\"Path\":<50} {\"Size\":>10}  Type")
    print("-" * 80)
    for f in files:
        size = f.get("size", 0)
        if size < 1024:
            s = f"{size} B"
        elif size < 1024*1024:
            s = f"{size/1024:.1f} KB"
        else:
            s = f"{size/1024/1024:.2f} MB"
        print(f"{f[\"path\"]:<50} {s:>10}  {f.get(\"content_type\",\"-\")}")
    print()
    print(f"Total: {len(files)} file(s)")
    if data.get("cdn_url"):
        print(f"Base URL (CDN): {data[\"cdn_url\"]}")
    print(f"Base URL (GCS): {data.get(\"base_url\",\"-\")}")
'
    else
        echo "$API_RESPONSE"
    fi
}

cmd_delete() {
    local remote_path="$1"

    if [ -z "$remote_path" ]; then
        err "Usage: assets.sh delete <remote_path>"
        exit 1
    fi
    remote_path="${remote_path#/}"

    info "Deleting files/$remote_path"

    # Build JSON body
    local body
    body=$(printf '{"api_secret":"%s","environment":"%s","paths":["%s"]}' \
        "$HOSTING_API_SECRET" "$HOSTING_ENV" "$remote_path")

    if ! api_call -X POST "${HOSTING_API_URL}/api/storage/delete" \
        -H "Content-Type: application/json" \
        -d "$body"; then
        exit 1
    fi

    local deleted
    deleted=$(echo "$API_RESPONSE" | grep -o '"deleted":[0-9]*' | cut -d':' -f2)
    if [ "$deleted" = "1" ]; then
        ok "Deleted files/$remote_path"
    else
        warn "Server reported $deleted deleted (file may not exist)"
    fi
}

cmd_url() {
    local remote_path="$1"
    if [ -z "$remote_path" ]; then
        err "Usage: assets.sh url <remote_path>"
        exit 1
    fi
    remote_path="${remote_path#/}"

    if ! api_call -X GET "${HOSTING_API_URL}/api/storage/list?api_secret=${HOSTING_API_SECRET}&environment=${HOSTING_ENV}"; then
        exit 1
    fi

    local base_gcs
    base_gcs=$(echo "$API_RESPONSE" | grep -o '"base_url":"[^"]*"' | head -1 | cut -d'"' -f4)
    local base_cdn
    base_cdn=$(echo "$API_RESPONSE" | grep -o '"cdn_url":"[^"]*"' | head -1 | cut -d'"' -f4)

    if [ -n "$base_cdn" ]; then
        echo "$base_cdn/$remote_path"
    elif [ -n "$base_gcs" ]; then
        echo "$base_gcs/$remote_path"
    else
        err "Could not determine base URL for environment $HOSTING_ENV"
        exit 1
    fi
}

usage() {
    # Print the leading comment block (lines starting with `#`), stripping the prefix.
    awk '
        NR==1 { next }                          # skip shebang
        /^# / { sub(/^# /, ""); print; next }
        /^#$/ { print ""; next }
        { exit }
    ' "$0"
}

main() {
    local cmd="${1:-}"
    shift || true

    case "$cmd" in
        upload)      require_secret; cmd_upload "$@" ;;
        upload-dir)  require_secret; cmd_upload_dir "$@" ;;
        list)        require_secret; cmd_list "$@" ;;
        delete|rm)   require_secret; cmd_delete "$@" ;;
        url)         require_secret; cmd_url "$@" ;;
        ""|-h|--help|help)
            usage
            ;;
        *)
            err "Unknown command: $cmd"
            echo ""
            usage
            exit 1
            ;;
    esac
}

main "$@"
