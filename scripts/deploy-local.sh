#!/bin/bash
set -e

# Local-only deploy: bypasses the duplicate-commit gate by posting to
# /api/deploy/local instead of /api/deploy. Same payload (bundle + react files)
# but no commit_sha is sent and the server doesn't dedupe.
#
# Required: HOSTING_API_SECRET
# Optional: HOSTING_ENV (default: test), HOSTING_API_URL, SKIP_BUILD=1, NO_REACT=1, ROLLOUT=false

HOSTING_API_URL="${HOSTING_API_URL:-http://localhost:3005/hosting}"
HOSTING_ENV="${HOSTING_ENV:-test}"
ROLLOUT="${ROLLOUT:-true}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

error() { echo -e "${RED}[ERROR]${NC} $1"; }
ok() { echo -e "${GREEN}[OK]${NC} $1"; }
info() { echo -e "${BLUE}[INFO]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }

if [ -z "$HOSTING_API_SECRET" ]; then
    error "HOSTING_API_SECRET is required"
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

if [ -d "$PROJECT_ROOT/server" ]; then
    BUILD_DIR="$PROJECT_ROOT/server"
else
    BUILD_DIR="$PROJECT_ROOT"
fi
DIST_DIR="$BUILD_DIR/dist"

if [ "$SKIP_BUILD" != "1" ]; then
    info "Building TSTL..."
    cd "$BUILD_DIR"
    [ ! -d "node_modules" ] && npm install
    npm run build
    cd "$PROJECT_ROOT"
fi

REACT_DIR=""
REACT_DIST=""
REACT_ENTRY=""
REACT_CSS=""

if [ "$NO_REACT" != "1" ]; then
    if [ -f "$PROJECT_ROOT/react/package.json" ]; then
        REACT_DIR="$PROJECT_ROOT/react"
    elif [ -f "$PROJECT_ROOT/react-app/package.json" ]; then
        REACT_DIR="$PROJECT_ROOT/react-app"
    fi
fi

if [ -n "$REACT_DIR" ]; then
    if [ "$SKIP_BUILD" != "1" ]; then
        info "Building React ($REACT_DIR)..."
        cd "$REACT_DIR"
        [ ! -d "node_modules" ] && npm install
        npm run build
        cd "$PROJECT_ROOT"
    fi

    REACT_MANIFEST=""
    if [ -f "$REACT_DIR/dist/.vite/manifest.json" ]; then
        REACT_MANIFEST="$REACT_DIR/dist/.vite/manifest.json"
    elif [ -f "$REACT_DIR/dist/manifest.json" ]; then
        REACT_MANIFEST="$REACT_DIR/dist/manifest.json"
    fi

    if [ -n "$REACT_MANIFEST" ]; then
        REACT_PARSED=$(python3 -c "
import json,sys
with open('$REACT_MANIFEST') as f:
    m = json.load(f)
for k,v in m.items():
    if v.get('isEntry'):
        css = v.get('css') or []
        print(v['file'])
        print(css[0] if css else '')
        sys.exit(0)
sys.exit(1)
" 2>/dev/null) || REACT_PARSED=""
        if [ -n "$REACT_PARSED" ]; then
            REACT_ENTRY=$(echo "$REACT_PARSED" | sed -n '1p')
            REACT_CSS=$(echo "$REACT_PARSED" | sed -n '2p')
            REACT_DIST="$REACT_DIR/dist"
            ok "React: entry=$REACT_ENTRY css=${REACT_CSS:-none}"
        else
            warn "React build present but entry not detected — skipping React deploy"
        fi
    else
        warn "React build present but manifest.json missing — skipping React deploy"
    fi
fi

BUNDLE="$DIST_DIR/bundle.lua"
BUNDLE_MAP="$DIST_DIR/bundle.lua.map"

if [ ! -f "$BUNDLE" ]; then
    error "bundle.lua not found at $BUNDLE"
    exit 1
fi

CURL_ARGS=(-s -X POST "${HOSTING_API_URL}/api/deploy/local" \
    -F "api_secret=${HOSTING_API_SECRET}" \
    -F "environment=${HOSTING_ENV}" \
    -F "rollout=${ROLLOUT}" \
    -F "bundle_lua=@${BUNDLE}")

[ -f "$BUNDLE_MAP" ] && CURL_ARGS+=(-F "bundle_map=@${BUNDLE_MAP}")

if [ -n "$REACT_DIST" ]; then
    REACT_FILE_COUNT=$(find "$REACT_DIST" -type f | wc -l | tr -d ' ')
    info "Including React bundle ($REACT_FILE_COUNT files, entry: $REACT_ENTRY)"
    CURL_ARGS+=(-F "react_entry=${REACT_ENTRY}")
    [ -n "$REACT_CSS" ] && CURL_ARGS+=(-F "react_css=${REACT_CSS}")
    while IFS= read -r -d '' f; do
        rel="${f#$REACT_DIST/}"
        CURL_ARGS+=(-F "react_files=@${f};filename=${rel}")
    done < <(find "$REACT_DIST" -type f -print0)
fi

info "Deploying to ${HOSTING_ENV} via /api/deploy/local (no commit gate)..."
TMP=$(mktemp)
HTTP_CODE=$(curl -w '%{http_code}' -o "$TMP" "${CURL_ARGS[@]}")
RESPONSE=$(cat "$TMP")
rm -f "$TMP"

if [ "$HTTP_CODE" -ge 400 ] 2>/dev/null; then
    ERR_MSG=$(echo "$RESPONSE" | grep -o '"error":"[^"]*"' | head -1 | cut -d'"' -f4)
    if [ -n "$ERR_MSG" ]; then
        error "HTTP $HTTP_CODE: $ERR_MSG"
    else
        error "HTTP $HTTP_CODE: $RESPONSE"
    fi
    exit 1
fi

DEPLOYMENT_ID=$(echo "$RESPONSE" | grep -o '"deployment_id":[0-9]*' | cut -d':' -f2)
STATUS=$(echo "$RESPONSE" | grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ "$STATUS" = "success" ] || [ "$STATUS" = "uploaded" ]; then
    ok "Deploy completed (id=${DEPLOYMENT_ID:-unknown}, status=$STATUS, env=$HOSTING_ENV)"
else
    warn "Deploy returned status='$STATUS' (id=${DEPLOYMENT_ID:-unknown})"
    echo "$RESPONSE"
fi
