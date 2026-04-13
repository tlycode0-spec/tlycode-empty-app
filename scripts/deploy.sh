#!/bin/bash
set -e

# Required: HOSTING_API_SECRET, HOSTING_API_URL
# Optional: HOSTING_ENV (default: production), SKIP_BUILD

HOSTING_API_URL="${HOSTING_API_URL:-http://localhost:3005/hosting}"
HOSTING_ENV="${HOSTING_ENV:-production}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

error() { echo -e "${RED}[ERROR]${NC} $1"; }
ok() { echo -e "${GREEN}[OK]${NC} $1"; }
info() { echo -e "${BLUE}[INFO]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }

api_call() {
    local tmpfile
    tmpfile=$(mktemp)
    local curl_exit=0
    API_HTTP_CODE=$(curl -w '%{http_code}' -o "$tmpfile" "$@") || curl_exit=$?
    API_RESPONSE=$(cat "$tmpfile")
    rm -f "$tmpfile"

    if [ "$curl_exit" -ne 0 ]; then
        error "Connection failed (curl exit code: $curl_exit)"
        return 1
    fi

    if [ "$API_HTTP_CODE" -ge 400 ] 2>/dev/null; then
        local error_msg
        error_msg=$(echo "$API_RESPONSE" | grep -o '"error":"[^"]*"' | head -1 | cut -d'"' -f4)
        if [ -n "$error_msg" ]; then
            error "HTTP $API_HTTP_CODE: $error_msg"
        else
            error "HTTP $API_HTTP_CODE: $API_RESPONSE"
        fi
        return 1
    fi
    return 0
}

mark_failed() {
    if [ -n "$DEPLOYMENT_ID" ]; then
        curl -s -X POST "${HOSTING_API_URL}/api/deploy/${DEPLOYMENT_ID}/fail" \
            -H "X-API-Secret: ${HOSTING_API_SECRET}" \
            -H "Content-Type: application/json" \
            -d "{\"error_message\": \"$1\"}" > /dev/null
    fi
}

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
    info "Building..."

    # Build React app + embed bundle if react-app exists
    if [ -d "$PROJECT_ROOT/react-app" ]; then
        info "Building React app..."
        cd "$PROJECT_ROOT/react-app"
        [ ! -d "node_modules" ] && npm install
        npm run build
        cd "$PROJECT_ROOT"
        node scripts/embed-react.js
    fi

    cd "$BUILD_DIR"
    [ ! -d "node_modules" ] && npm install
    npm run build
    cd "$PROJECT_ROOT"
fi

COMMIT_SHA=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
COMMIT_MESSAGE=$(git log -1 --pretty=%B 2>/dev/null | head -1 || echo "")
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
TRIGGERED_BY="${GITHUB_ACTOR:-${USER:-local}}"

COMMIT_MESSAGE_JSON=$(echo "$COMMIT_MESSAGE" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read().strip()))' 2>/dev/null || echo "\"${COMMIT_MESSAGE}\"")

if ! api_call -s -X POST "${HOSTING_API_URL}/api/deploy" \
    -H "Content-Type: application/json" \
    -d "{
        \"api_secret\": \"${HOSTING_API_SECRET}\",
        \"environment\": \"${HOSTING_ENV}\",
        \"commit_sha\": \"${COMMIT_SHA}\",
        \"commit_message\": ${COMMIT_MESSAGE_JSON},
        \"branch\": \"${BRANCH}\",
        \"triggered_by\": \"${TRIGGERED_BY}\"
    }"; then
    error "Failed to start deployment"
    exit 1
fi

DEPLOYMENT_ID=$(echo "$API_RESPONSE" | grep -o '"deployment_id":[0-9]*' | cut -d':' -f2)

if [ -z "$DEPLOYMENT_ID" ]; then
    error "Failed to get deployment ID from response: $API_RESPONSE"
    exit 1
fi

ok "Deployment started: $DEPLOYMENT_ID"

BUNDLE="$DIST_DIR/bundle.lua"
BUNDLE_MAP="$DIST_DIR/bundle.lua.map"

if [ ! -f "$BUNDLE" ]; then
    error "bundle.lua not found"
    mark_failed "bundle.lua not found"
    exit 1
fi

CURL_ARGS=(-s -X POST "${HOSTING_API_URL}/api/deploy/${DEPLOYMENT_ID}/upload" \
    -H "X-API-Secret: ${HOSTING_API_SECRET}" \
    -F "bundle_lua=@${BUNDLE}")

[ -f "$BUNDLE_MAP" ] && CURL_ARGS+=(-F "bundle_map=@${BUNDLE_MAP}")

if ! api_call "${CURL_ARGS[@]}"; then
    error "Failed to upload bundle"
    mark_failed "Bundle upload failed"
    exit 1
fi

if ! api_call -s -X GET "${HOSTING_API_URL}/api/deploy/${DEPLOYMENT_ID}/status" \
    -H "X-API-Secret: ${HOSTING_API_SECRET}"; then
    error "Failed to check deployment status"
    exit 1
fi

STATUS=$(echo "$API_RESPONSE" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)

if [ "$STATUS" = "success" ]; then
    ok "Deploy completed successfully (ID: $DEPLOYMENT_ID)"
elif [ "$STATUS" = "failed" ]; then
    ERROR_MSG=$(echo "$API_RESPONSE" | grep -o '"error_message":"[^"]*"' | cut -d'"' -f4)
    error "Deployment failed: $ERROR_MSG"
    exit 1
else
    warn "Deployment status: $STATUS (ID: $DEPLOYMENT_ID)"
fi
