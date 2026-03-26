#!/bin/bash

# Non-interactive mode — skip all npm/npx prompts
export CI=true

echo "=== TypeForge Dev Environment Setup ==="

# Make other scripts executable
chmod +x .devcontainer/*.sh 2>/dev/null || true

# Configure Claude Code MCP servers in global config
echo "Configuring Claude Code MCP servers..."
node -e "
const fs = require('fs');
const os = require('os');
const configPath = os.homedir() + '/.claude.json';
const projectPath = '/workspaces/Test';
const mcpServers = {
  vibe_kanban: { command: 'npx', args: ['-y', 'vibe-kanban@latest', '--mcp'] },
  playwright: { command: 'npx', args: ['@playwright/mcp@latest', '--no-sandbox'] },
  ...(process.env.TYPEFORGE_MCP_API_TOKEN ? { typeforge: { type: 'http', url: 'https://typeforge.filipeus.cz/api/mcp', headers: { Authorization: 'Bearer ' + process.env.TYPEFORGE_MCP_API_TOKEN } } } : {})
};
let config = {};
try { config = JSON.parse(fs.readFileSync(configPath, 'utf8')); } catch {}
// Root-level mcpServers (visible in vibe-kanban UI)
config.mcpServers = Object.assign(config.mcpServers || {}, mcpServers);
// Per-project config (used by Claude Code CLI)
config.projects = config.projects || {};
config.projects[projectPath] = config.projects[projectPath] || {};
config.projects[projectPath].mcpServers = mcpServers;
config.projects[projectPath].allowedTools = [
  'Bash(*)', 'Edit', 'Write', 'Read', 'Glob', 'Grep',
  'WebFetch', 'WebSearch', 'Task', 'NotebookEdit',
  'mcp__vibe_kanban__*',
  'mcp__playwright__*',
  'mcp__claude_ai_Typeforge__*',
  'mcp__claude_ai_ra-firebase__*',
  'mcp__ide__*'
];
config.projects[projectPath].permissions = {
  allow: [
    'Bash(*)',
    'Edit',
    'Write',
    'Read',
    'Glob',
    'Grep',
    'WebFetch',
    'WebSearch',
    'mcp__playwright__*',
    'mcp__vibe_kanban__*',
    'mcp__claude_ai_Typeforge__*',
    'mcp__claude_ai_ra-firebase__*',
    'mcp__ide__*'
  ],
  deny: []
};
fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
" || echo "⚠ Claude Code MCP config failed"
echo "✓ Claude Code MCP servers configured!"

# Install project dependencies
echo "Installing Node.js dependencies..."
WORKSPACE_DIR="$(pwd)"

if [ -f "package.json" ]; then
  npm install
fi

if [ -d "server" ] && [ -f "server/package.json" ]; then
  cd server && npm install && cd "$WORKSPACE_DIR"
fi

if [ -d "react" ] && [ -f "react/package.json" ]; then
  cd react && npm install && cd "$WORKSPACE_DIR"
fi

# Start Docker Compose services (PostgreSQL)
if [ -f "docker-compose.yml" ] || [ -f "docker-compose.yaml" ] || [ -f "compose.yml" ] || [ -f "compose.yaml" ]; then
  echo "Starting database services..."
  docker compose up -d || true
fi

echo ""
echo "=== Setup complete ==="
